# Fix Lỗi: Handler 'lambda_handler' missing on module 'lambda_function'

Lỗi này xảy ra khi Lambda không tìm thấy handler function. Dưới đây là các cách fix:

## 🔧 Cách Fix

### Cách 1: Kiểm tra Handler Configuration (QUAN TRỌNG NHẤT)

1. Vào **Lambda Console** → Chọn function của bạn
2. Vào tab **Configuration** → **General configuration**
3. Click **Edit**
4. Kiểm tra **Handler** field phải là: `lambda_function.lambda_handler`
   - Format: `filename.function_name`
   - File: `lambda_function.py`
   - Function: `lambda_handler`
5. Click **Save**

### Cách 2: Upload lại code đúng cách

#### Option A: Upload trực tiếp trong Lambda Console

1. Vào **Code** tab
2. Xóa code hiện tại (nếu có)
3. Click **Upload from** → **.zip file** hoặc **Upload from** → **.zip file**
4. Tạo file zip đúng cách (xem bên dưới)
5. Upload và Save

#### Option B: Tạo deployment package đúng cách

**Windows PowerShell:**

```powershell
# Tạo thư mục tạm
mkdir lambda-deployment
cd lambda-deployment

# Copy file lambda_function.py
Copy-Item ..\lambda_function.py .

# Cài đặt dependencies (nếu cần)
pip install boto3 -t .

# Tạo zip (KHÔNG zip thư mục, chỉ zip nội dung)
Get-ChildItem | Compress-Archive -DestinationPath ..\lambda-function.zip -Force
cd ..
```

**Linux/Mac:**

```bash
# Tạo thư mục tạm
mkdir lambda-deployment
cd lambda-deployment

# Copy file
cp ../lambda_function.py .

# Cài đặt dependencies
pip install boto3 -t .

# Tạo zip (chỉ zip nội dung, không zip thư mục)
zip -r ../lambda-function.zip .
cd ..
```

**QUAN TRỌNG**: File `lambda_function.py` phải ở **root** của zip file, không phải trong thư mục con!

### Cách 3: Copy-paste code trực tiếp

1. Vào **Code** tab trong Lambda Console
2. Xóa tất cả code hiện tại
3. Copy toàn bộ nội dung từ file `lambda_function.py`
4. Paste vào editor
5. Click **Deploy**

### Cách 4: Kiểm tra file encoding

Đảm bảo file `lambda_function.py` là UTF-8 encoding, không phải UTF-8 BOM.

---

## ✅ Checklist

Trước khi test lại, đảm bảo:

- [ ] Handler configuration: `lambda_function.lambda_handler`
- [ ] File `lambda_function.py` có function `lambda_handler(event, context)`
- [ ] File được upload đúng (nếu dùng zip, file phải ở root)
- [ ] Runtime: Python 3.11 hoặc 3.10
- [ ] Code đã được Deploy/Save

---

## 🧪 Test sau khi fix

1. Vào **Test** tab
2. Chọn test event (ví dụ: `test-success-minimal`)
3. Click **Test**
4. Kiểm tra kết quả

Nếu vẫn lỗi, kiểm tra **CloudWatch Logs** để xem chi tiết lỗi.

