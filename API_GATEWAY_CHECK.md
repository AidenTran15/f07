# Kiểm tra API Gateway Configuration

## Vấn đề: API trả về "Hello from Lambda!"

Điều này có nghĩa là API Gateway endpoint đang trỏ đến Lambda function khác (có thể là test function) thay vì `f07-get-orders`.

## 🔧 Cách Fix

### Bước 1: Kiểm tra API Gateway Configuration

1. Vào **API Gateway Console**
2. Chọn API của bạn
3. Kiểm tra resource và method:
   - Resource: `/` (root) hoặc `/orders`
   - Method: **GET**

### Bước 2: Kiểm tra Lambda Integration

1. Chọn **GET** method
2. Click vào **Integration Request**
3. Kiểm tra:
   - **Integration type**: Phải là `Lambda Function`
   - **Lambda Function**: Phải là `f07-get-orders` (hoặc tên function bạn đã tạo)
   - **Lambda Region**: Phải đúng region

### Bước 3: Nếu Lambda Function sai

1. Click **Edit** trong Integration Request
2. Chọn đúng Lambda function: `f07-get-orders`
3. Click **Save**
4. **QUAN TRỌNG**: Click **Actions** → **Deploy API** → chọn stage `prod` → **Deploy**

### Bước 4: Kiểm tra Lambda Function

1. Vào **Lambda Console**
2. Tìm function `f07-get-orders`
3. Đảm bảo:
   - Code đã được upload (từ `lambda_get_orders.py`)
   - Environment variable `TABLE_NAME = f07-orders` đã được set
   - IAM role có quyền DynamoDB (Scan, Query, GetItem)

### Bước 5: Test Lambda Function trực tiếp

1. Vào Lambda Console → `f07-get-orders`
2. Click **Test**
3. Tạo test event:
```json
{
  "httpMethod": "GET"
}
```
4. Click **Test**
5. Kiểm tra response phải có format:
```json
{
  "statusCode": 200,
  "body": "{\"orders\": [...], \"total\": 2, \"count\": 2}"
}
```

## 🐛 Troubleshooting

### Nếu không thấy Lambda function `f07-get-orders`

1. Tạo Lambda function mới (xem `ADMIN_SETUP.md`)
2. Upload code từ `lambda_get_orders.py`
3. Cấu hình environment variables và IAM permissions
4. Connect với API Gateway

### Nếu Lambda function test thành công nhưng API Gateway vẫn trả về "Hello from Lambda!"

1. Kiểm tra lại Integration trong API Gateway
2. Đảm bảo đã **Deploy API** sau khi thay đổi
3. Clear browser cache và test lại

### Nếu vẫn không được

1. Kiểm tra CloudWatch Logs của Lambda function
2. Kiểm tra API Gateway Logs
3. Test API bằng curl:
```bash
curl https://a2es4ycii4.execute-api.ap-southeast-2.amazonaws.com/prod
```

## ✅ Checklist

- [ ] Lambda function `f07-get-orders` đã được tạo
- [ ] Code đã được upload vào Lambda function
- [ ] Environment variable `TABLE_NAME` đã được set
- [ ] IAM permissions đã được cấu hình
- [ ] API Gateway GET method đã connect với đúng Lambda function
- [ ] API đã được deploy sau khi thay đổi
- [ ] Lambda function test thành công

