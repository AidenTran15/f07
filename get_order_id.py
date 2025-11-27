"""
Script để lấy Order ID từ DynamoDB
Chạy script này để lấy order ID thực tế để test update function
"""

import boto3
from botocore.exceptions import ClientError

# Cấu hình
TABLE_NAME = 'f07-orders'
REGION = 'ap-southeast-2'  # Thay đổi region nếu cần

# Tạo DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE_NAME)

def get_order_ids():
    """
    Lấy danh sách order IDs từ DynamoDB
    """
    try:
        # Scan table để lấy tất cả orders
        response = table.scan(
            ProjectionExpression='id, #status, createdAt',
            ExpressionAttributeNames={'#status': 'status'}
        )
        
        items = response.get('Items', [])
        
        if not items:
            print("❌ Không tìm thấy order nào trong table")
            return []
        
        print(f"\n✅ Tìm thấy {len(items)} order(s):\n")
        print("-" * 80)
        print(f"{'Order ID':<40} {'Status':<15} {'Created At':<25}")
        print("-" * 80)
        
        for item in items:
            order_id = item.get('id', 'N/A')
            status = item.get('status', 'N/A')
            created_at = item.get('createdAt', 'N/A')
            print(f"{order_id:<40} {status:<15} {created_at:<25}")
        
        print("-" * 80)
        print("\n💡 Copy Order ID từ bảng trên và paste vào test event")
        print("   Thay 'YOUR_ORDER_ID_HERE' bằng Order ID thực tế\n")
        
        return [item.get('id') for item in items]
        
    except ClientError as e:
        print(f"❌ Lỗi khi lấy orders: {e}")
        return []
    except Exception as e:
        print(f"❌ Lỗi không mong đợi: {e}")
        return []

if __name__ == '__main__':
    print("🔍 Đang lấy danh sách Order IDs từ DynamoDB...\n")
    
    # Kiểm tra AWS credentials
    try:
        sts = boto3.client('sts')
        identity = sts.get_caller_identity()
        print(f"🔐 Đang sử dụng AWS Account: {identity.get('Account', 'N/A')}")
        print(f"👤 User/Role: {identity.get('Arn', 'N/A')}\n")
    except Exception as e:
        print(f"⚠️  Cảnh báo: Không thể xác thực AWS credentials: {e}")
        print("   Đảm bảo bạn đã cấu hình AWS credentials (aws configure hoặc environment variables)\n")
    
    # Lấy order IDs
    order_ids = get_order_ids()
    
    if order_ids:
        print(f"\n📋 Danh sách Order IDs (để copy):")
        for i, order_id in enumerate(order_ids[:5], 1):  # Chỉ hiển thị 5 đầu tiên
            print(f"   {i}. {order_id}")

