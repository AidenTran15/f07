# Fix CORS Error

Lỗi CORS xảy ra khi API Gateway chưa được cấu hình CORS đúng cách. Dưới đây là cách fix:

## 🔧 Cách Fix CORS

### Bước 1: Kiểm tra Lambda Function trả về CORS headers

Lambda function đã có CORS headers, nhưng cần đảm bảo OPTIONS method được xử lý đúng.

### Bước 2: Cấu hình CORS trong API Gateway

#### Option A: Enable CORS tự động (Khuyến nghị)

1. Vào **API Gateway Console**
2. Chọn API của bạn
3. Chọn resource `/orders` (hoặc resource bạn đã tạo)
4. Chọn method **POST**
5. Click **Actions** → **Enable CORS**
6. Cấu hình:
   - **Access-Control-Allow-Origin**: `*` (hoặc domain cụ thể: `http://localhost:5173`)
   - **Access-Control-Allow-Headers**: `Content-Type`
   - **Access-Control-Allow-Methods**: `POST, OPTIONS`
7. Click **Enable CORS and replace existing CORS headers**

#### Option B: Tạo OPTIONS method thủ công

1. Chọn resource `/orders`
2. Click **Actions** → **Create Method** → **OPTIONS**
3. Integration type: **Lambda Function**
4. Lambda Function: chọn function của bạn
5. Click **Save**

### Bước 3: Deploy API

**QUAN TRỌNG**: Sau khi enable CORS, phải deploy API!

1. Click **Actions** → **Deploy API**
2. Deployment stage: `prod` (hoặc stage bạn đang dùng)
3. Click **Deploy**

### Bước 4: Test lại

1. Refresh browser (Ctrl+Shift+R để hard refresh)
2. Thử submit form lại

## 🐛 Troubleshooting

### Vẫn gặp CORS error sau khi enable CORS?

1. **Kiểm tra API đã được deploy chưa**
   - Phải deploy sau mỗi lần thay đổi CORS

2. **Kiểm tra Lambda function trả về đúng headers**
   - Xem CloudWatch Logs
   - Đảm bảo headers có `Access-Control-Allow-Origin`

3. **Kiểm tra OPTIONS method**
   - OPTIONS request phải trả về status 200
   - Xem trong API Gateway → Method → OPTIONS → Test

4. **Clear browser cache**
   - Ctrl+Shift+R (hard refresh)
   - Hoặc mở DevTools → Network → Disable cache

### Test OPTIONS request

```bash
curl -X OPTIONS https://5vk7ifeqyd.execute-api.ap-southeast-2.amazonaws.com/prod/orders \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Kết quả mong đợi:
- Status: 200
- Headers có: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`

## ✅ Checklist

- [ ] Đã enable CORS trong API Gateway
- [ ] Đã deploy API sau khi enable CORS
- [ ] Lambda function trả về CORS headers
- [ ] OPTIONS method trả về status 200
- [ ] Đã clear browser cache

