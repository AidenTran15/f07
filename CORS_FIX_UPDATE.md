# Hướng dẫn Fix CORS cho Update Order API

## 🔴 Lỗi hiện tại:
```
Access to fetch at '...' from origin 'http://localhost:5173' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
```

## ✅ Giải pháp:

### Bước 1: Kiểm tra Lambda Function

1. Vào **Lambda Console** → `f07-update-order`
2. Đảm bảo code đã có xử lý OPTIONS request (đã có trong `lambda_update_order.py`)
3. **Deploy** lại Lambda function nếu vừa cập nhật

### Bước 2: Cấu hình API Gateway - QUAN TRỌNG NHẤT

#### 2.1. Tạo OPTIONS Method (nếu chưa có)

1. Vào **API Gateway Console**
2. Chọn API của bạn
3. Chọn resource `/{id}` (hoặc resource tương ứng)
4. Click **Actions** → **Create Method** → Chọn **OPTIONS**
5. Click **Save**

#### 2.2. Cấu hình OPTIONS Integration

1. Với OPTIONS method đã chọn:
   - **Integration type**: Chọn **Mock**
   - Click **Save**

2. Vào **Integration Response**:
   - Click **Add integration response**
   - **Status code**: `200`
   - **Method response status**: `200`
   - Click **Save**

3. Vào **Method Response**:
   - Click **Add header response**
   - Thêm các headers sau:
     - `Access-Control-Allow-Origin`
     - `Access-Control-Allow-Headers`
     - `Access-Control-Allow-Methods`
     - `Access-Control-Max-Age`

4. Vào lại **Integration Response**:
   - Click vào **200** response
   - Trong **Header Mappings**:
     - `Access-Control-Allow-Origin`: `'*'` (hoặc `'http://localhost:5173'` cho dev)
     - `Access-Control-Allow-Headers`: `'Content-Type, Authorization, X-Requested-With'`
     - `Access-Control-Allow-Methods`: `'PUT, OPTIONS, GET, POST'`
     - `Access-Control-Max-Age`: `'3600'`

#### 2.3. Cấu hình PUT Method

1. Chọn **PUT** method
2. Vào **Method Response**:
   - Đảm bảo có các CORS headers như trên
3. Vào **Integration Response**:
   - Đảm bảo có header mappings cho CORS như trên

### Bước 3: Enable CORS cho Resource (Cách nhanh)

**Lưu ý**: Cách này có thể ghi đè cấu hình thủ công, nhưng thường hiệu quả nhất.

1. Vào **API Gateway Console**
2. Chọn resource `/{id}`
3. Click **Actions** → **Enable CORS**
4. Cấu hình:
   - **Access-Control-Allow-Origin**: `*` (hoặc `http://localhost:5173`)
   - **Access-Control-Allow-Headers**: `Content-Type, Authorization, X-Requested-With`
   - **Access-Control-Allow-Methods**: Chọn `PUT` và `OPTIONS`
   - **Access-Control-Max-Age**: `3600`
5. Click **Enable CORS and replace existing CORS headers**
6. **QUAN TRỌNG**: Click **Yes, replace existing values**

### Bước 4: Deploy API

**BẮT BUỘC** sau mọi thay đổi:

1. Click **Actions** → **Deploy API**
2. Chọn **Deployment stage**: `prod` (hoặc stage bạn đang dùng)
3. Click **Deploy**

### Bước 5: Test

1. Mở **Browser DevTools** (F12)
2. Vào tab **Network**
3. Thử update order từ admin page
4. Kiểm tra:
   - **OPTIONS** request trả về status `200`
   - Response headers có đầy đủ CORS headers
   - **PUT** request thành công

## 🔍 Debug nếu vẫn lỗi:

### Kiểm tra OPTIONS request:

1. Mở **Network tab** trong DevTools
2. Tìm request **OPTIONS** đến API
3. Kiểm tra:
   - Status code phải là `200` (không phải 404, 403, 500)
   - Response headers phải có CORS headers

### Kiểm tra API Gateway:

1. Vào **API Gateway Console**
2. Chọn resource `/{id}`
3. Click **OPTIONS** method
4. Click **TEST**
5. Kiểm tra response phải có status `200` và CORS headers

### Kiểm tra Lambda:

1. Vào **Lambda Console** → `f07-update-order`
2. Tạo test event:
   ```json
   {
     "httpMethod": "OPTIONS"
   }
   ```
3. Test và kiểm tra response có status `200`

## 📝 Lưu ý:

- **Luôn deploy API** sau khi thay đổi CORS
- **Clear browser cache** nếu vẫn lỗi
- Trong production, thay `*` bằng domain cụ thể
- CORS chỉ hoạt động khi cả OPTIONS và PUT đều trả về đúng headers

## 🎯 Checklist:

- [ ] Lambda function có xử lý OPTIONS request
- [ ] API Gateway có OPTIONS method
- [ ] OPTIONS method trả về status 200
- [ ] CORS headers được cấu hình đúng
- [ ] API đã được deploy
- [ ] Browser cache đã được clear
- [ ] Test thành công từ browser

