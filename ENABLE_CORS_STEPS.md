# Hướng dẫn Enable CORS cho Resource - Từng bước

## 📍 Bạn đang ở đâu:
- Resource: `/` (root resource)
- Đã có: OPTIONS và PUT methods
- Cần: Enable CORS cho resource này

## ✅ Các bước Enable CORS:

### Bước 1: Click button "Enable CORS"

1. **Nhìn vào phần "Resource details"** (bên phải màn hình)
2. Bạn sẽ thấy button màu xanh: **"Enable CORS"**
3. **Click vào button "Enable CORS"**

### Bước 2: Cấu hình CORS Settings

Sau khi click "Enable CORS", một popup/modal sẽ hiện ra với các trường:

1. **Access-Control-Allow-Origin**:
   - Nhập: `*` (hoặc `http://localhost:5173` nếu chỉ muốn cho phép localhost)
   - Hoặc để mặc định nếu đã có sẵn

2. **Access-Control-Allow-Headers**:
   - Nhập: `Content-Type, Authorization, X-Requested-With`
   - Hoặc để mặc định

3. **Access-Control-Allow-Methods**:
   - Đảm bảo có: `PUT` và `OPTIONS` được chọn
   - Tick vào checkbox của `PUT` và `OPTIONS`

4. **Access-Control-Max-Age**:
   - Nhập: `3600`
   - Hoặc để mặc định

### Bước 3: Confirm và Replace

1. **QUAN TRỌNG**: Tìm checkbox hoặc option:
   - **"Enable CORS and replace existing CORS headers"** 
   - Hoặc **"Replace existing CORS headers"**
   - **Tick vào checkbox này** ✅

2. Click button **"Enable CORS"** hoặc **"Save"** ở cuối form

### Bước 4: Deploy API (BẮT BUỘC)

Sau khi enable CORS, **PHẢI deploy API**:

1. Click **"Actions"** (menu ở trên cùng)
2. Chọn **"Deploy API"**
3. Chọn **Deployment stage**: `prod`
4. Click **"Deploy"**

### Bước 5: Kiểm tra

1. Sau khi deploy, bạn sẽ thấy banner xanh: "Successfully created deployment..."
2. Kiểm tra lại:
   - Resource `/` vẫn có OPTIONS và PUT methods
   - OPTIONS method vẫn là Mock integration
   - PUT method vẫn là Lambda integration

## 🎯 Checklist:

- [ ] Đã click button "Enable CORS" trong Resource details
- [ ] Đã cấu hình CORS settings (Origin, Headers, Methods)
- [ ] Đã tick "Replace existing CORS headers"
- [ ] Đã click Save/Enable CORS
- [ ] Đã deploy API lên stage `prod`
- [ ] Thấy banner "Successfully created deployment"

## ⚠️ Lưu ý:

- **Phải deploy API** sau khi enable CORS, nếu không CORS sẽ không hoạt động
- Nếu không thấy button "Enable CORS", có thể resource đã được enable CORS rồi
- Nếu vẫn lỗi sau khi enable, thử clear browser cache và test lại

