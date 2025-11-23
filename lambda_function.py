"""
AWS Lambda function để xử lý POST request từ API Gateway
và lưu order vào DynamoDB
"""

import json
import boto3
import os
from datetime import datetime
from uuid import uuid4

# Khởi tạo DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME', 'f07-orders')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    """
    Lambda handler để xử lý POST request
    """
    # Parse event nếu nó là string (khi test từ Lambda Console)
    if isinstance(event, str):
        try:
            event = json.loads(event)
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Invalid event format'
                })
            }
    
    # CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  # Thay đổi thành domain cụ thể trong production
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
    
    # Xử lý OPTIONS request (preflight)
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }
    
    try:
        # Parse request body
        # Nếu event có 'body' key (từ API Gateway), lấy từ đó
        # Nếu không, coi event chính là body (khi test trực tiếp)
        if 'body' in event:
            if isinstance(event.get('body'), str):
                body = json.loads(event['body'])
            else:
                body = event.get('body', {})
        else:
            # Event không có 'body', coi event chính là body data
            body = event
        
        # Validate required fields
        required_fields = ['shippingAddress', 'recipientPhone', 'recipientName']
        missing_fields = [field for field in required_fields if not body.get(field)]
        
        if missing_fields:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Missing required fields',
                    'missing_fields': missing_fields
                })
            }
        
        # Tạo order item
        order_id = body.get('id') or str(uuid4())
        created_at = body.get('createdAt') or datetime.utcnow().isoformat()
        
        order_item = {
            'id': order_id,
            'createdAt': created_at,
            # Thông tin liên hệ
            'contactSMS': body.get('contactSMS', ''),
            'contactInstagram': body.get('contactInstagram', ''),
            'contactZalo': body.get('contactZalo', ''),
            
            # Ngày giờ giao hàng
            'deliveryDay': body.get('deliveryDay', ''),
            'deliveryMonth': body.get('deliveryMonth', ''),
            'deliveryYear': body.get('deliveryYear', ''),
            'deliveryHour': body.get('deliveryHour', ''),
            'deliveryMinute': body.get('deliveryMinute', ''),
            
            # Dịp
            'occasion': body.get('occasion', ''),
            'occasionOther': body.get('occasionOther', ''),
            
            # Loại hoa
            'flowerType': body.get('flowerType', []),
            'flowerTypeOther': body.get('flowerTypeOther', ''),
            
            # Thiết kế hoa
            'flowerDesignCode': body.get('flowerDesignCode', ''),
            'flowerMessage': body.get('flowerMessage', ''),
            
            # Thiết kế thiệp
            'cardDesignCode': body.get('cardDesignCode', ''),
            'cardMessage': body.get('cardMessage', ''),
            
            # Thông tin giao hàng
            'shippingAddress': body.get('shippingAddress'),
            'recipientPhone': body.get('recipientPhone'),
            'recipientName': body.get('recipientName'),
            
            # Tư vấn
            'needConsultation': body.get('needConsultation', ''),
            
            # Metadata
            'status': 'pending',  # pending, confirmed, completed, cancelled
            'updatedAt': created_at
        }
        
        # Lưu vào DynamoDB
        table.put_item(Item=order_item)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Order created successfully',
                'orderId': order_id,
                'createdAt': created_at
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({
                'error': 'Invalid JSON in request body'
            })
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

