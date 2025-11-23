# Cấu hình API Gateway

## API Endpoint

API Gateway URL của bạn:
```
https://5vk7ifeqyd.execute-api.ap-southeast-2.amazonaws.com/prod
```

## Cấu hình Frontend

### Option 1: Sử dụng file .env (Khuyến nghị)

Tạo file `.env` trong thư mục root của project:

```env
VITE_API_URL=https://5vk7ifeqyd.execute-api.ap-southeast-2.amazonaws.com/prod/
```

**Lưu ý**: 
- File `.env` đã được thêm vào `.gitignore` nên sẽ không bị commit
- Sau khi tạo/sửa file `.env`, cần **restart dev server** (`npm run dev`)
- Trong Vite, sử dụng `import.meta.env.VITE_API_URL` (không phải `process.env`)

### Option 2: Sử dụng default value

Code đã được cập nhật với API URL mặc định. Nếu không có file `.env`, sẽ sử dụng:
```
https://5vk7ifeqyd.execute-api.ap-southeast-2.amazonaws.com/prod/orders
```

## Kiểm tra API Gateway Resource Path

Đảm bảo trong API Gateway bạn đã tạo resource `/orders` với POST method.

Nếu resource path khác (ví dụ: `/order` hoặc `/api/orders`), cập nhật URL trong:
- File `.env` (nếu dùng)
- Hoặc file `src/components/FormOrder.jsx` (dòng 72)

## Test API

### Test từ command line:

```bash
curl -X POST https://5vk7ifeqyd.execute-api.ap-southeast-2.amazonaws.com/prod/orders \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": "123 Test Street",
    "recipientPhone": "0901234567",
    "recipientName": "Test User"
  }'
```

### Test từ Frontend:

1. Chạy dev server: `npm run dev`
2. Mở browser: `http://localhost:5173`
3. Điền form và submit
4. Kiểm tra kết quả

## Troubleshooting

### CORS Error
- Đảm bảo đã enable CORS trong API Gateway
- Kiểm tra Lambda function trả về đúng CORS headers

### 403 Forbidden
- Kiểm tra API Gateway có được deploy chưa
- Kiểm tra resource path có đúng không

### 500 Internal Server Error
- Kiểm tra CloudWatch Logs của Lambda function
- Kiểm tra DynamoDB table đã được tạo
- Kiểm tra Lambda execution role có quyền DynamoDB

