# Fix CORS - OPTIONS Request không trả về 200

## 🔴 Vấn đề:
Lỗi "Response to preflight request doesn't pass access control check: It does not have HTTP ok status" nghĩa là OPTIONS request không trả về status 200.

## ✅ Giải pháp:

### Bước 1: Kiểm tra OPTIONS Method Integration Response

1. Vào **API Gateway Console**
2. Chọn resource `/` (root)
3. Click vào **OPTIONS** method
4. Vào tab **Integration Response**
5. Kiểm tra:
   - Phải có response với status `200`
   - Response headers phải có CORS headers

### Bước 2: Cấu hình OPTIONS Method Response Headers

1. Vẫn ở **OPTIONS** method
2. Vào **Method Response**
3. Đảm bảo có các headers:
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Headers`
   - `Access-Control-Allow-Methods`
   - `Access-Control-Max-Age`

4. Vào lại **Integration Response**
5. Click vào response `200`
6. Trong **Header Mappings**, đảm bảo có:
   - `Access-Control-Allow-Origin`: `'*'`
   - `Access-Control-Allow-Headers`: `'Content-Type,Authorization,X-Requested-With'`
   - `Access-Control-Allow-Methods`: `'PUT,OPTIONS'`
   - `Access-Control-Max-Age`: `'3600'`

### Bước 3: Kiểm tra OPTIONS Integration Type

1. Vào **OPTIONS** method
2. Vào tab **Integration Request**
3. Đảm bảo:
   - **Integration type**: `Mock`
   - **Integration Response**: Có response 200

### Bước 4: Test OPTIONS Method

1. Vào **OPTIONS** method
2. Click **TEST**
3. Kiểm tra:
   - Response status phải là `200`
   - Response headers phải có CORS headers

### Bước 5: Deploy API (BẮT BUỘC)

1. Click **Actions** → **Deploy API**
2. Stage: `prod`
3. Click **Deploy**

### Bước 6: Test từ Browser

1. Mở **Browser DevTools** (F12)
2. Vào tab **Network**
3. Clear cache (Ctrl+Shift+Delete)
4. Thử update order
5. Kiểm tra:
   - **OPTIONS** request phải có status `200`
   - Response headers phải có CORS headers

## 🔍 Debug trong Browser:

1. Mở **Network tab** trong DevTools
2. Tìm request **OPTIONS** đến API
3. Click vào request
4. Kiểm tra:
   - **Status Code**: Phải là `200` (không phải 404, 403, 500)
   - **Response Headers**: Phải có:
     - `Access-Control-Allow-Origin: *`
     - `Access-Control-Allow-Methods: PUT,OPTIONS`
     - `Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With`

## ⚠️ Lưu ý quan trọng:

- **Phải deploy API** sau mọi thay đổi
- **Clear browser cache** trước khi test
- OPTIONS request phải trả về `200`, không phải `404` hay `403`
- Nếu OPTIONS trả về `404`, có thể resource path không đúng

## 🎯 Nếu vẫn lỗi:

Có thể API Gateway đang dùng resource `/` nhưng request gọi `/{id}`. Kiểm tra:
1. Resource path trong API Gateway
2. URL đang gọi từ frontend
3. Có thể cần tạo resource `/{id}` riêng

