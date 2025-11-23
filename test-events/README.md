# Test Events cho Lambda Function

Thư mục này chứa các test events riêng lẻ để dễ import vào AWS Lambda Console.

## 📁 Các file test events

1. **test-success-full.json** - Test với đầy đủ thông tin
2. **test-success-minimal.json** - Test với thông tin tối thiểu (chỉ required fields)
3. **test-missing-fields.json** - Test validation (thiếu required fields)
4. **test-options-cors.json** - Test CORS preflight request

## 🚀 Cách sử dụng

### Trong AWS Lambda Console:

1. Vào Lambda function `f07-order-handler`
2. Click **Test** dropdown → **Configure test events**
3. Click **Create new test event**
4. Chọn **JSON** template
5. Copy nội dung từ file test event bạn muốn
6. Đặt tên cho test event
7. Click **Create**
8. Chọn test event và click **Test**

### Với AWS CLI:

```bash
# Test với file cụ thể
aws lambda invoke \
  --function-name f07-order-handler \
  --payload file://test-events/test-success-full.json \
  --cli-binary-format raw-in-base64-out \
  response.json

# Xem kết quả
cat response.json | jq
```

## ✅ Kỳ vọng kết quả

- **test-success-full.json**: Status 200, order được tạo với đầy đủ thông tin
- **test-success-minimal.json**: Status 200, order được tạo với default values
- **test-missing-fields.json**: Status 400, error về missing required fields
- **test-options-cors.json**: Status 200, CORS headers được trả về

