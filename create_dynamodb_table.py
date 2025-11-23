"""
Script để tạo DynamoDB table cho F07 Order Request
Chạy script này để tạo bảng trong AWS DynamoDB
"""

import boto3
from botocore.exceptions import ClientError

# Cấu hình
TABLE_NAME = 'f07-orders'
REGION = 'ap-southeast-2'  # Thay đổi region nếu cần

# Tạo DynamoDB client
dynamodb = boto3.client('dynamodb', region_name=REGION)

def create_table():
    """
    Tạo DynamoDB table với cấu trúc phù hợp cho order requests
    """
    try:
        response = dynamodb.create_table(
            TableName=TABLE_NAME,
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'S'  # String
                },
                {
                    'AttributeName': 'createdAt',
                    'AttributeType': 'S'  # String (ISO format)
                }
            ],
            BillingMode='PAY_PER_REQUEST',  # On-demand pricing
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'createdAt-index',
                    'KeySchema': [
                        {
                            'AttributeName': 'createdAt',
                            'KeyType': 'HASH'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    }
                }
            ],
            Tags=[
                {
                    'Key': 'Project',
                    'Value': 'F07-Order-System'
                },
                {
                    'Key': 'Environment',
                    'Value': 'Production'
                }
            ]
        )
        
        print(f"✅ Đang tạo table '{TABLE_NAME}'...")
        print(f"⏳ Vui lòng đợi table được tạo (có thể mất vài phút)...")
        
        # Đợi table được tạo
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=TABLE_NAME)
        
        print(f"✅ Table '{TABLE_NAME}' đã được tạo thành công!")
        print(f"📍 Region: {REGION}")
        print(f"🔑 Partition Key: id (String)")
        print(f"📊 Global Secondary Index: createdAt-index")
        
        return response
        
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"⚠️  Table '{TABLE_NAME}' đã tồn tại!")
        else:
            print(f"❌ Lỗi khi tạo table: {e}")
            raise
    except Exception as e:
        print(f"❌ Lỗi không mong đợi: {e}")
        raise

def describe_table():
    """
    Hiển thị thông tin về table
    """
    try:
        response = dynamodb.describe_table(TableName=TABLE_NAME)
        table = response['Table']
        
        print("\n📋 Thông tin table:")
        print(f"   Tên: {table['TableName']}")
        print(f"   Status: {table['TableStatus']}")
        print(f"   Region: {REGION}")
        print(f"   Billing Mode: {table['BillingModeSummary']['BillingMode']}")
        print(f"   Item Count: {table.get('ItemCount', 0)}")
        print(f"   Table Size: {table.get('TableSizeBytes', 0)} bytes")
        
        return table
    except ClientError as e:
        print(f"❌ Lỗi khi lấy thông tin table: {e}")
        return None

if __name__ == '__main__':
    print("🚀 Bắt đầu tạo DynamoDB table cho F07 Order Request...\n")
    
    # Kiểm tra AWS credentials
    try:
        sts = boto3.client('sts')
        identity = sts.get_caller_identity()
        print(f"🔐 Đang sử dụng AWS Account: {identity.get('Account', 'N/A')}")
        print(f"👤 User/Role: {identity.get('Arn', 'N/A')}\n")
    except Exception as e:
        print(f"⚠️  Cảnh báo: Không thể xác thực AWS credentials: {e}")
        print("   Đảm bảo bạn đã cấu hình AWS credentials (aws configure hoặc environment variables)\n")
    
    # Tạo table
    create_table()
    
    # Hiển thị thông tin table
    describe_table()
    
    print("\n✨ Hoàn tất! Bạn có thể bắt đầu sử dụng table này với Lambda function.")

