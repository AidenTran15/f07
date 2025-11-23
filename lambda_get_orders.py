"""
AWS Lambda function để GET orders từ DynamoDB
Sử dụng cho admin page
"""

import json
import boto3
import os
from boto3.dynamodb.conditions import Key
from decimal import Decimal

# Khởi tạo DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME', 'f07-orders')
table = dynamodb.Table(table_name)

def decimal_default(obj):
    """Convert Decimal to int/float for JSON serialization"""
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    """
    Lambda handler để GET orders từ DynamoDB
    """
    # CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  # Thay đổi thành domain cụ thể trong production
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
    
    # Parse event nếu nó là string (khi test từ Lambda Console)
    if isinstance(event, str):
        try:
            event = json.loads(event)
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Invalid event format'
                })
            }
    
    # Xử lý OPTIONS request (preflight)
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }
    
    try:
        # Lấy query parameters
        query_params = event.get('queryStringParameters') or {}
        
        # Pagination
        limit = int(query_params.get('limit', 50))  # Default 50 items
        limit = min(limit, 100)  # Max 100 items per request
        
        # Scan table để lấy tất cả orders
        # Lưu ý: Scan có thể tốn kém với table lớn, nên cân nhắc dùng GSI với createdAt
        response = table.scan(
            Limit=limit
        )
        
        items = response.get('Items', [])
        
        # Convert Decimal to int/float
        orders = []
        for item in items:
            # Convert all Decimal values
            order = json.loads(json.dumps(item, default=decimal_default))
            orders.append(order)
        
        # Sort by createdAt (newest first)
        orders.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        
        # Get total count (có thể tốn kém, nên cache nếu cần)
        count_response = table.scan(Select='COUNT')
        total_count = count_response.get('Count', 0)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'orders': orders,
                'total': total_count,
                'count': len(orders)
            }, default=decimal_default)
        }
        
    except Exception as e:
        print(f'Error: {str(e)}')
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

