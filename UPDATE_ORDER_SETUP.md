# Hướng dẫn Setup Update Order Status

Hướng dẫn để setup Lambda function UPDATE order status và API Gateway.

## 📋 Mục lục

1. [Tạo Lambda Function UPDATE](#1-tạo-lambda-function-update)
2. [Cấu hình API Gateway](#2-cấu-hình-api-gateway)
3. [Test Update Function](#3-test-update-function)

---

## 1. Tạo Lambda Function UPDATE

### Bước 1: Tạo Lambda function mới

1. Vào **AWS Lambda Console**
2. Click **Create function**
3. Chọn **Author from scratch**
4. Điền thông tin:
   - Function name: `f07-update-order`
   - Runtime: `Python 3.11` (hoặc 3.10)
   - Architecture: `x86_64`
5. Click **Create function**

### Bước 2: Upload code

**Option A: Copy-paste code trực tiếp (Khuyến nghị)**

1. Vào **Code** tab trong Lambda Console
2. Xóa code mặc định
3. Copy toàn bộ nội dung từ file `lambda_update_order.py`
4. Paste vào editor
5. Click **Deploy**

### Bước 3: Cấu hình Environment Variables

1. Vào tab **Configuration** → **Environment variables**
2. Click **Edit**
3. Thêm biến:
   - Key: `TABLE_NAME`
   - Value: `f07-orders`
4. Click **Save**

### Bước 4: Cấu hình IAM Role

Lambda function cần quyền đọc và cập nhật DynamoDB:

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
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:PutItem"
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
   - Nếu file là `lambda_update_order.py`, handler sẽ là `lambda_update_order.lambda_handler`
   - Hoặc đổi tên file trong Lambda Console thành `lambda_function.py`

---

## 2. Cấu hình API Gateway

### Bước 1: Tạo Resource với Path Parameter

1. Vào **API Gateway Console**
2. Chọn API của bạn
3. Tạo resource mới:
   - Click **Actions** → **Create Resource**
   - Resource Name: `orders`
   - Resource Path: `orders`
   - Enable CORS: ✅ (tick)
   - Click **Create Resource**

4. Tạo nested resource với path parameter:
   - Chọn resource `orders` vừa tạo
   - Click **Actions** → **Create Resource**
   - Resource Name: `{id}`
   - Resource Path: `{id}`
   - Enable CORS: ✅ (tick)
   - Click **Create Resource**

### Bước 2: Thêm PUT method

1. Chọn resource `{id}` (nested trong `/orders`)
2. Click **Actions** → **Create Method** → **PUT**
3. Integration type: **Lambda Function**
4. Lambda Region: chọn region của bạn
5. Lambda Function: `f07-update-order`
6. Click **Save** → **OK** (khi được hỏi về permission)

### Bước 3: Enable CORS cho Resource

**QUAN TRỌNG**: Phải enable CORS cho cả resource `/{id}`, không chỉ PUT method!

1. Chọn resource `/{id}` (không phải PUT method)
2. Click **Actions** → **Enable CORS**
3. Cấu hình:
   - **Access-Control-Allow-Origin**: `*` (hoặc `http://localhost:5173` cho dev)
   - **Access-Control-Allow-Headers**: `Content-Type, Authorization, X-Requested-With`
   - **Access-Control-Allow-Methods**: Chọn `PUT` và `OPTIONS`
   - **Access-Control-Max-Age**: `3600`
4. Click **Enable CORS and replace existing CORS headers**
5. **QUAN TRỌNG**: Click **Yes, replace existing values**

**Lưu ý**: Nếu không có OPTIONS method, API Gateway sẽ tự động tạo.

### Bước 4: Deploy API

**QUAN TRỌNG**: Phải deploy sau mỗi lần thay đổi!

1. Click **Actions** → **Deploy API**
2. Deployment stage: `prod`
3. Click **Deploy**

### Bước 5: Kiểm tra OPTIONS Method

1. Chọn resource `/{id}`
2. Kiểm tra có **OPTIONS** method chưa
3. Nếu chưa có, API Gateway đã tự tạo khi enable CORS
4. Test OPTIONS method:
   - Click **OPTIONS** → **TEST**
   - Kiểm tra response có status `200` và CORS headers

### Bước 5: Lấy API URL

Sau khi deploy, bạn sẽ có URL dạng:
```
https://your-api-id.execute-api.region.amazonaws.com/prod/orders/{id}
```

**Lưu ý**: `{id}` sẽ được thay bằng order ID thực tế khi gọi API.

---

## 3. Test Update Function

### Test Lambda Function trực tiếp

1. Vào Lambda Console → `f07-update-order`
2. Click **Test**
3. Tạo test event:

```json
{
  "httpMethod": "PUT",
  "pathParameters": {
    "id": "test-order-id-123"
  },
  "body": "{\"status\": \"completed\"}"
}
```

4. Click **Test** và kiểm tra kết quả

### Test API Gateway

```bash
curl -X PUT https://your-api-url/prod/orders/test-order-id \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Test từ Frontend

1. Vào trang `/admin`
2. Click button "Hoàn thành" trên một order
3. Kiểm tra order chuyển sang tab "Lịch sử"

---

## 🔧 Troubleshooting CORS

Nếu gặp lỗi CORS, xem file **CORS_FIX_UPDATE.md** để có hướng dẫn chi tiết.

**Các bước nhanh:**
1. Đảm bảo đã enable CORS cho resource `/{id}` (không chỉ PUT method)
2. Đảm bảo có OPTIONS method (API Gateway tự tạo khi enable CORS)
3. **Deploy API** sau khi enable CORS
4. Clear browser cache và thử lại

---

## 🔧 Cập nhật Frontend API URL

API Gateway URL đã được cấu hình trong `AdminPage.jsx`:

```javascript
const updateApiUrl = 'https://qfv5hsw1qh.execute-api.ap-southeast-2.amazonaws.com/prod'
const updateUrl = `${updateApiUrl}/${orderId}`
```

Nếu cần thay đổi, có thể:
1. Tạo file `.env` với:
   ```env
   VITE_UPDATE_API_URL=https://695eh0vmp1.execute-api.ap-southeast-2.amazonaws.com/prod
   ```
2. Hoặc sửa trực tiếp trong `AdminPage.jsx`

---

## 📊 Order Status Flow

1. **pending** → Có thể: `confirmed`, `completed`, `cancelled`
2. **confirmed** → Có thể: `completed`, `cancelled`
3. **completed** → Không thể thay đổi (trong lịch sử)
4. **cancelled** → Không thể thay đổi (trong lịch sử)

---

## ✅ Checklist

- [ ] Lambda function `f07-update-order` đã được tạo
- [ ] Code đã được upload
- [ ] Environment variable `TABLE_NAME` đã được set
- [ ] IAM permissions đã được cấu hình (GetItem, UpdateItem)
- [ ] Resource `/orders/{id}` đã được tạo trong API Gateway
- [ ] PUT method đã được thêm
- [ ] CORS đã được enable
- [ ] API đã được deploy
- [ ] Frontend đã được cập nhật với API URL đúng

---

## 🐛 Troubleshooting

### Lambda không update được

- Kiểm tra IAM permissions (GetItem, UpdateItem)
- Kiểm tra order ID có đúng không
- Xem CloudWatch Logs

### API Gateway 404

- Kiểm tra resource path có đúng không
- Kiểm tra path parameter `{id}` đã được setup chưa

### CORS error

- Đảm bảo đã enable CORS cho PUT method
- Đảm bảo đã deploy API

---

## 📝 API Endpoint Format

**PUT** `/orders/{id}`

**Request Body:**
```json
{
  "status": "completed"  // hoặc "confirmed", "cancelled"
}
```

**Response:**
```json
{
  "message": "Order status updated successfully",
  "orderId": "...",
  "status": "completed",
  "updatedAt": "2025-11-23T..."
}
```

