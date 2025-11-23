# Hướng dẫn Test Lambda Function

File này chứa các test events để test Lambda function `f07-order-handler`.

## 📋 Các Test Events

File `lambda_test_events.json` chứa các test events sau:

### 1. `test-success-full`
**Mục đích**: Test với đầy đủ thông tin
- ✅ Có tất cả các trường
- ✅ Kiểm tra xử lý đầy đủ dữ liệu
- **Kỳ vọng**: Status 200, order được tạo thành công

### 2. `test-success-minimal`
**Mục đích**: Test với thông tin tối thiểu (chỉ required fields)
- ✅ Chỉ có: shippingAddress, recipientPhone, recipientName
- ✅ Kiểm tra xử lý optional fields
- **Kỳ vọng**: Status 200, order được tạo với default values

### 3. `test-missing-required-fields`
**Mục đích**: Test validation - thiếu required fields
- ❌ Thiếu: shippingAddress, recipientPhone, recipientName
- **Kỳ vọng**: Status 400, error message về missing fields

### 4. `test-options-cors`
**Mục đích**: Test CORS preflight request
- ✅ OPTIONS method
- **Kỳ vọng**: Status 200, CORS headers được trả về

### 5. `test-invalid-json`
**Mục đích**: Test xử lý invalid JSON
- ❌ JSON syntax không hợp lệ
- **Kỳ vọng**: Status 400, error về invalid JSON

### 6. `test-body-as-object`
**Mục đích**: Test với body là object (không phải string)
- ✅ Body là object thay vì JSON string
- **Kỳ vọng**: Status 200, xử lý được cả 2 format

### 7. `test-occasion-other`
**Mục đích**: Test trường hợp chọn "Khác" cho dịp
- ✅ occasion = "Khác" với occasionOther
- **Kỳ vọng**: Status 200, lưu cả occasion và occasionOther

### 8. `test-flower-type-other`
**Mục đích**: Test trường hợp chọn "Khác" cho loại hoa
- ✅ flowerType chứa "Khác" với flowerTypeOther
- **Kỳ vọng**: Status 200, lưu cả flowerType array và flowerTypeOther

---

## 🚀 Cách sử dụng trong AWS Lambda Console

### Bước 1: Import test events

1. Vào **AWS Lambda Console**
2. Chọn function `f07-order-handler`
3. Click vào dropdown **Test** (bên cạnh nút "Test")
4. Chọn **Configure test events**
5. Click **Create new test event**
6. Chọn **JSON** template
7. Copy nội dung từ `lambda_test_events.json` cho từng test event
8. Đặt tên cho test event (ví dụ: `test-success-full`)
9. Click **Create**

### Bước 2: Chạy test

1. Chọn test event từ dropdown
2. Click **Test**
3. Xem kết quả trong **Execution results**

---

## 📝 Cách sử dụng với AWS CLI

### Test từ command line:

```bash
# Test với event từ file
aws lambda invoke \
  --function-name f07-order-handler \
  --payload file://lambda_test_events.json \
  --cli-binary-format raw-in-base64-out \
  response.json

# Xem kết quả
cat response.json
```

### Test với event cụ thể:

```bash
# Tạo file test event riêng
echo '{
  "httpMethod": "POST",
  "body": "{\"shippingAddress\":\"123 Test St\",\"recipientPhone\":\"0901234567\",\"recipientName\":\"Test\"}"
}' > test-event.json

# Invoke Lambda
aws lambda invoke \
  --function-name f07-order-handler \
  --payload file://test-event.json \
  --cli-binary-format raw-in-base64-out \
  response.json
```

---

## ✅ Checklist Test

Trước khi deploy, đảm bảo đã test:

- [ ] ✅ POST request với đầy đủ thông tin → Status 200
- [ ] ✅ POST request với thông tin tối thiểu → Status 200
- [ ] ✅ POST request thiếu required fields → Status 400
- [ ] ✅ OPTIONS request → Status 200 với CORS headers
- [ ] ✅ Invalid JSON → Status 400
- [ ] ✅ Body là object → Status 200
- [ ] ✅ Kiểm tra item được tạo trong DynamoDB
- [ ] ✅ Kiểm tra CloudWatch Logs không có errors

---

## 🔍 Kiểm tra kết quả

### 1. Kiểm tra Response

Response thành công sẽ có dạng:
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  "body": "{\"message\":\"Order created successfully\",\"orderId\":\"...\",\"createdAt\":\"...\"}"
}
```

### 2. Kiểm tra DynamoDB

1. Vào **DynamoDB Console**
2. Chọn table `f07-orders`
3. Click **Explore table items**
4. Tìm item với `id` từ response
5. Kiểm tra tất cả fields đã được lưu đúng

### 3. Kiểm tra CloudWatch Logs

1. Vào **CloudWatch Console**
2. Chọn **Log groups** → `/aws/lambda/f07-order-handler`
3. Xem logs để kiểm tra errors hoặc warnings

---

## 🐛 Troubleshooting

### Lambda timeout
- Kiểm tra DynamoDB table có tồn tại không
- Kiểm tra IAM permissions
- Tăng timeout trong Lambda configuration

### Permission denied
- Kiểm tra Lambda execution role có quyền DynamoDB
- Xem SETUP_GUIDE.md phần IAM permissions

### Table not found
- Kiểm tra environment variable `TABLE_NAME`
- Đảm bảo table đã được tạo trong cùng region

---

## 📞 Next Steps

Sau khi test thành công:
1. Deploy Lambda function
2. Tạo API Gateway endpoint
3. Test từ frontend
4. Monitor CloudWatch Logs trong production

