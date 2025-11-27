"""
AWS Lambda function để UPDATE order status trong DynamoDB
Sử dụng cho admin page để cập nhật trạng thái đơn hàng
"""

import json
import boto3
import os
from datetime import datetime

# Khởi tạo DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME', 'f07-orders')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    """
    Lambda handler để UPDATE order status
    """
    # CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  # Thay đổi thành domain cụ thể trong production
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS, GET, POST',
        'Access-Control-Max-Age': '3600'
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
        # Lấy order ID từ path parameters hoặc body
        order_id = None
        
        # Kiểm tra path parameters (nếu dùng /orders/{id})
        if event.get('pathParameters') and event['pathParameters'].get('id'):
            order_id = event['pathParameters']['id']
        
        # Parse request body
        if 'body' in event:
            if isinstance(event.get('body'), str):
                body = json.loads(event['body'])
            else:
                body = event.get('body', {})
        else:
            body = event
        
        # Lấy order_id từ body nếu không có trong path
        if not order_id:
            order_id = body.get('id')
        
        if not order_id:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Order ID is required'
                })
            }
        
        # Lấy status mới từ body
        new_status = body.get('status')
        
        if not new_status:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Status is required'
                })
            }
        
        # Validate status
        valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']
        if new_status not in valid_statuses:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
                })
            }
        
        # Kiểm tra order có tồn tại không
        try:
            response = table.get_item(Key={'id': order_id})
            if 'Item' not in response:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({
                        'error': 'Order not found'
                    })
                }
        except Exception as e:
            print(f'Error checking order: {str(e)}')
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Error checking order',
                    'message': str(e)
                })
            }
        
        # Update order status
        updated_at = datetime.utcnow().isoformat()
        
        update_expression = 'SET #status = :status, updatedAt = :updatedAt'
        expression_attribute_names = {
            '#status': 'status'
        }
        expression_attribute_values = {
            ':status': new_status,
            ':updatedAt': updated_at
        }
        
        # Nếu có thêm fields khác cần update
        if body.get('notes'):
            update_expression += ', notes = :notes'
            expression_attribute_values[':notes'] = body.get('notes')
        
        try:
            table.update_item(
                Key={'id': order_id},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expression_attribute_names,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues='ALL_NEW'
            )
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'message': 'Order status updated successfully',
                    'orderId': order_id,
                    'status': new_status,
                    'updatedAt': updated_at
                })
            }
            
        except Exception as e:
            print(f'Error updating order: {str(e)}')
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Error updating order',
                    'message': str(e)
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

