# Hướng dẫn Setup Admin Page

Hướng dẫn để setup Lambda function GET orders và trang admin.

## 📋 Mục lục

1. [Tạo Lambda Function GET Orders](#1-tạo-lambda-function-get-orders)
2. [Cấu hình API Gateway](#2-cấu-hình-api-gateway)
3. [Test Admin Page](#3-test-admin-page)

---

## 1. Tạo Lambda Function GET Orders

### Bước 1: Tạo Lambda function mới

1. Vào **AWS Lambda Console**
2. Click **Create function**
3. Chọn **Author from scratch**
4. Điền thông tin:
   - Function name: `f07-get-orders`
   - Runtime: `Python 3.11` (hoặc 3.10)
   - Architecture: `x86_64`
5. Click **Create function**

### Bước 2: Upload code

**Option A: Copy-paste code trực tiếp (Khuyến nghị)**

1. Vào **Code** tab trong Lambda Console
2. Xóa code mặc định
3. Copy toàn bộ nội dung từ file `lambda_get_orders.py`
4. Paste vào editor
5. Click **Deploy**

**Option B: Upload từ file zip**

1. Tạo deployment package (tương tự như `lambda_function.py`)
2. Upload file zip

### Bước 3: Cấu hình Environment Variables

1. Vào tab **Configuration** → **Environment variables**
2. Click **Edit**
3. Thêm biến:
   - Key: `TABLE_NAME`
   - Value: `f07-orders`
4. Click **Save**

### Bước 4: Cấu hình IAM Role

Lambda function cần quyền đọc DynamoDB:

1. Vào **Configuration** → **Permissions**
2. Click vào Role name
3. Trong IAM Console, click **Add permissions** → **Create inline policy**
4. Chọn **JSON** và paste:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:GetItem"
            ],
            "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/f07-orders"
        }
    ]
}
```

**Lưu ý**: Thay `REGION` và `ACCOUNT_ID` bằng giá trị thực tế của bạn.

### Bước 5: Kiểm tra Handler Configuration

1. Vào **Configuration** → **General configuration**
2. Đảm bảo **Handler** = `lambda_function.lambda_handler`
   - Nếu file là `lambda_get_orders.py`, handler sẽ là `lambda_get_orders.lambda_handler`
   - Hoặc đổi tên file trong Lambda Console thành `lambda_function.py`

---

## 2. Cấu hình API Gateway

### Bước 1: Thêm GET method

1. Vào **API Gateway Console**
2. Chọn API của bạn
3. Chọn resource `/orders` (hoặc tạo mới nếu chưa có)
4. Click **Actions** → **Create Method** → **GET**
5. Integration type: **Lambda Function**
6. Lambda Region: chọn region của bạn
7. Lambda Function: `f07-get-orders`
8. Click **Save** → **OK** (khi được hỏi về permission)

### Bước 2: Enable CORS cho GET method

1. Chọn **GET** method
2. Click **Actions** → **Enable CORS**
3. Đảm bảo:
   - Access-Control-Allow-Origin: `*` (hoặc domain cụ thể)
   - Access-Control-Allow-Headers: `Content-Type`
   - Access-Control-Allow-Methods: `GET, OPTIONS`
4. Click **Enable CORS and replace existing CORS headers**

### Bước 3: Deploy API

**QUAN TRỌNG**: Phải deploy sau mỗi lần thay đổi!

1. Click **Actions** → **Deploy API**
2. Deployment stage: `prod`
3. Click **Deploy**

---

## 3. Test Admin Page

### Bước 1: Test Lambda Function

1. Vào Lambda Console → `f07-get-orders`
2. Click **Test**
3. Tạo test event:

```json
{
  "httpMethod": "GET"
}
```

4. Click **Test** và kiểm tra kết quả

### Bước 2: Test API Gateway

```bash
curl https://a2es4ycii4.execute-api.ap-southeast-2.amazonaws.com/prod/orders
```

Hoặc nếu endpoint là root:
```bash
curl https://a2es4ycii4.execute-api.ap-southeast-2.amazonaws.com/prod
```

### Bước 3: Test từ Frontend

1. Chạy dev server: `npm run dev`
2. Mở browser: `http://localhost:5173`
3. Click tab **Admin**
4. Kiểm tra danh sách orders

---

## 🐛 Troubleshooting

### Lambda không trả về data

- Kiểm tra DynamoDB table có data chưa
- Kiểm tra IAM permissions
- Xem CloudWatch Logs

### CORS error

- Đảm bảo đã enable CORS cho GET method
- Đảm bảo đã deploy API

### Empty list

- Kiểm tra DynamoDB table có items chưa
- Kiểm tra table name trong environment variables

---

## 📝 Lưu ý

- Scan operation có thể tốn kém với table lớn (> 1MB)
- Cân nhắc thêm pagination nếu có nhiều orders
- Có thể tối ưu bằng cách dùng GSI với createdAt để sort

---

## ✅ Checklist

- [ ] Lambda function `f07-get-orders` đã được tạo
- [ ] Code đã được upload
- [ ] Environment variable `TABLE_NAME` đã được set
- [ ] IAM permissions đã được cấu hình
- [ ] GET method đã được thêm vào API Gateway
- [ ] CORS đã được enable
- [ ] API đã được deploy
- [ ] Admin page hiển thị đúng

