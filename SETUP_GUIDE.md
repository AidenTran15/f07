# Hướng dẫn Setup F07 Order System

Hướng dẫn chi tiết để setup hệ thống đặt hàng F07 với AWS Lambda, API Gateway và DynamoDB.

## 📋 Mục lục

1. [Tạo DynamoDB Table](#1-tạo-dynamodb-table)
2. [Tạo Lambda Function](#2-tạo-lambda-function)
3. [Tạo API Gateway](#3-tạo-api-gateway)
4. [Cấu hình Frontend](#4-cấu-hình-frontend)
5. [Test hệ thống](#5-test-hệ-thống)

---

## 1. Tạo DynamoDB Table

### Bước 1: Cài đặt AWS CLI và boto3

```bash
# Cài đặt AWS CLI (nếu chưa có)
# Windows: https://aws.amazon.com/cli/
# Hoặc dùng: pip install awscli

# Cài đặt boto3
pip install boto3
```

### Bước 2: Cấu hình AWS Credentials

```bash
aws configure
```

Nhập:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `ap-southeast-1` (hoặc region bạn muốn)
- Default output format: `json`

### Bước 3: Chạy script tạo table

```bash
python create_dynamodb_table.py
```

Script sẽ tạo table `f07-orders` với:
- **Partition Key**: `id` (String)
- **Global Secondary Index**: `createdAt-index`
- **Billing Mode**: Pay per request (on-demand)

---

## 2. Tạo Lambda Function

### Bước 1: Tạo deployment package

1. Tạo thư mục cho Lambda function:
```bash
mkdir lambda-deployment
cd lambda-deployment
```

2. Copy file `lambda_function.py` vào thư mục này

3. Cài đặt dependencies:
```bash
pip install boto3 -t .
```

4. Tạo file zip:
```bash
# Windows PowerShell
Compress-Archive -Path * -DestinationPath lambda-function.zip

# Linux/Mac
zip -r lambda-function.zip .
```

### Bước 2: Tạo Lambda function trên AWS Console

1. Vào **AWS Lambda Console**
2. Click **Create function**
3. Chọn **Author from scratch**
4. Điền thông tin:
   - Function name: `f07-order-handler`
   - Runtime: `Python 3.11` (hoặc 3.10)
   - Architecture: `x86_64`
5. Click **Create function**

### Bước 3: Upload code

**Option A: Sử dụng script tự động (Khuyến nghị)**

```bash
# Windows PowerShell
.\create_lambda_package.ps1

# Linux/Mac
chmod +x create_lambda_package.sh
./create_lambda_package.sh
```

**Option B: Upload thủ công**

1. Trong Lambda function, scroll xuống **Code source**
2. Click **Upload from** → **.zip file**
3. Upload file `lambda-function.zip` vừa tạo
4. Click **Save**

**Option C: Copy-paste code trực tiếp (Đơn giản nhất)**

1. Vào **Code** tab trong Lambda Console
2. Xóa code mặc định
3. Copy toàn bộ nội dung từ file `lambda_function.py`
4. Paste vào editor
5. Click **Deploy**

### Bước 3.5: Kiểm tra Handler Configuration (QUAN TRỌNG!)

1. Vào tab **Configuration** → **General configuration**
2. Click **Edit**
3. Đảm bảo **Handler** field là: `lambda_function.lambda_handler`
   - Format: `filename.function_name`
   - File: `lambda_function.py` → `lambda_function`
   - Function: `lambda_handler`
4. Click **Save**

**⚠️ Lưu ý**: Nếu bạn gặp lỗi "Handler 'lambda_handler' missing", xem file `LAMBDA_FIX_HANDLER.md` để fix.

### Bước 4: Cấu hình Environment Variables

1. Vào tab **Configuration** → **Environment variables**
2. Click **Edit**
3. Thêm biến:
   - Key: `TABLE_NAME`
   - Value: `f07-orders`
4. Click **Save**

### Bước 5: Cấu hình IAM Role

Lambda function cần quyền truy cập DynamoDB:

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
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/f07-orders"
        }
    ]
}
```

**Lưu ý**: Thay `REGION` và `ACCOUNT_ID` bằng giá trị thực tế của bạn.

---

## 3. Tạo API Gateway

### Bước 1: Tạo REST API

1. Vào **API Gateway Console**
2. Click **Create API**
3. Chọn **REST API** → **Build**
4. Điền:
   - Protocol: **REST**
   - Create new API: **New API**
   - API name: `f07-order-api`
   - Endpoint Type: **Regional**
5. Click **Create API**

### Bước 2: Tạo Resource và Method

1. Trong API, click **Actions** → **Create Resource**
   - Resource Name: `orders`
   - Resource Path: `orders`
   - Enable CORS: ✅ (tick)
   - Click **Create Resource**

2. Chọn resource `orders` vừa tạo, click **Actions** → **Create Method**
   - Chọn **POST**
   - Click tick mark ✅
   - Integration type: **Lambda Function**
   - Lambda Region: chọn region của bạn
   - Lambda Function: `f07-order-handler`
   - Click **Save** → **OK** (khi được hỏi về permission)

3. Tạo OPTIONS method (cho CORS):
   - Chọn resource `orders`
   - Click **Actions** → **Create Method** → **OPTIONS**
   - Integration type: **Mock**
   - Click **Save**
   - Vào **Integration Response**:
     - Method Response: Thêm header `Access-Control-Allow-Origin`
     - Integration Response: 
       - Status: 200
       - Header Mappings: `Access-Control-Allow-Origin` = `'*'`

### Bước 3: Enable CORS cho POST method

1. Chọn **POST** method
2. Click **Actions** → **Enable CORS**
3. Đảm bảo:
   - Access-Control-Allow-Origin: `*` (hoặc domain cụ thể)
   - Access-Control-Allow-Headers: `Content-Type`
   - Access-Control-Allow-Methods: `POST, OPTIONS`
4. Click **Enable CORS and replace existing CORS headers**

### Bước 4: Deploy API

1. Click **Actions** → **Deploy API**
2. Deployment stage: `prod` (hoặc tạo mới)
3. Click **Deploy**
4. **Lưu lại Invoke URL** (sẽ có dạng: `https://xxxxx.execute-api.region.amazonaws.com/prod`)

---

## 4. Cấu hình Frontend

### Bước 1: Tạo file .env

Tạo file `.env` trong thư mục root:

```env
VITE_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/orders
```

**Lưu ý**: Thay URL bằng Invoke URL từ bước 3.4 + `/orders`

### Bước 2: Cập nhật .gitignore

Đảm bảo `.env` đã có trong `.gitignore` (đã có sẵn)

### Bước 3: Restart dev server

```bash
npm run dev
```

---

## 5. Test hệ thống

### Test Lambda Function

1. Vào Lambda Console → `f07-order-handler`
2. Click **Test**
3. Tạo test event với nội dung:

```json
{
  "httpMethod": "POST",
  "body": "{\"shippingAddress\":\"123 Test St\",\"recipientPhone\":\"0901234567\",\"recipientName\":\"Test User\",\"contactSMS\":\"0901234567\"}"
}
```

4. Click **Test** và kiểm tra kết quả

### Test API Gateway

Sử dụng curl hoặc Postman:

```bash
curl -X POST https://your-api-url/prod/orders \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": "123 Test Street",
    "recipientPhone": "0901234567",
    "recipientName": "Test User",
    "contactSMS": "0901234567"
  }'
```

### Test từ Frontend

1. Mở ứng dụng React: `http://localhost:5173`
2. Điền form và submit
3. Kiểm tra DynamoDB Console để xem item mới được tạo

---

## 🔒 Security Best Practices

1. **CORS**: Thay `*` bằng domain cụ thể trong production
2. **API Keys**: Cân nhắc thêm API key cho API Gateway
3. **Rate Limiting**: Cấu hình throttling trong API Gateway
4. **Input Validation**: Lambda function đã có validation cơ bản, có thể thêm nhiều hơn
5. **Error Handling**: Đã có error handling, có thể cải thiện logging

---

## 📊 Monitoring

### CloudWatch Logs

Lambda function tự động log vào CloudWatch:
- Vào **CloudWatch** → **Log groups** → `/aws/lambda/f07-order-handler`

### DynamoDB Metrics

Xem metrics trong DynamoDB Console:
- Table `f07-orders` → **Metrics** tab

---

## 🐛 Troubleshooting

### Lambda không thể ghi vào DynamoDB
- Kiểm tra IAM permissions
- Kiểm tra table name trong environment variables

### CORS errors
- Đảm bảo đã enable CORS cho cả POST và OPTIONS methods
- Kiểm tra headers trong API Gateway

### API Gateway 403/500 errors
- Kiểm tra CloudWatch Logs của Lambda
- Kiểm tra API Gateway logs

---

## 📝 Next Steps

1. Thêm authentication (API keys, Cognito)
2. Thêm email notifications (SES)
3. Thêm admin dashboard để xem orders
4. Thêm image upload cho thiết kế
5. Thêm payment integration

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
- AWS CloudWatch Logs
- API Gateway logs
- DynamoDB table metrics

