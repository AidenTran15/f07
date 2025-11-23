import { useState, useEffect } from 'react'
import './AdminPage.css'

function AdminPage() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'https://a2es4ycii4.execute-api.ap-southeast-2.amazonaws.com/prod'

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // GET API endpoint
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let data = await response.json()
      
      console.log('Raw API response:', data) // Debug log
      
      // Xử lý response từ API Gateway
      // API Gateway trả về format: {statusCode: 200, body: "..."}
      if (data.statusCode !== undefined && data.body !== undefined) {
        // Parse body nếu nó là string
        if (typeof data.body === 'string') {
          try {
            data = JSON.parse(data.body)
          } catch (e) {
            // Nếu parse lỗi, có thể body là plain string
            console.error('Error parsing body as JSON:', e)
            console.log('Body content:', data.body)
            
            // Kiểm tra nếu là test response
            if (data.body === 'Hello from Lambda!' || data.body.includes('Hello from Lambda')) {
              throw new Error('API Gateway đang trỏ đến Lambda function test. Vui lòng kiểm tra API Gateway configuration và connect với Lambda function f07-get-orders.')
            }
            
            throw new Error('Invalid JSON in response body')
          }
        } else {
          // Body đã là object
          data = data.body
        }
      }
      
      console.log('Parsed data:', data) // Debug log
      
      // Kiểm tra format data
      if (!data || typeof data !== 'object') {
        console.error('Invalid data format:', data)
        throw new Error('Invalid data format from API. Expected object with orders array.')
      }
      
      // Kiểm tra nếu có orders array
      if (!Array.isArray(data.orders)) {
        console.error('Data does not have orders array:', data)
        throw new Error('API response does not contain orders array. Please check Lambda function configuration.')
      }
      
      setOrders(data.orders || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'confirmed':
        return 'status-confirmed'
      case 'completed':
        return 'status-completed'
      case 'cancelled':
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return 'Chờ xử lý'
    }
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Đang tải...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error">
          <p>Lỗi: {error}</p>
          <button onClick={fetchOrders} className="btn-retry">Thử lại</button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>F07 Admin - Quản lý đơn hàng</h1>
        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Tổng số đơn</div>
            <div className="stat-value">{total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Đang hiển thị</div>
            <div className="stat-value">{orders.length}</div>
          </div>
        </div>
        <button onClick={fetchOrders} className="btn-refresh">
          🔄 Làm mới
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="order-card"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="order-header">
                <div className="order-id">#{order.id.substring(0, 8)}...</div>
                <div className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>
              
              <div className="order-info">
                <div className="info-row">
                  <span className="info-label">Người nhận:</span>
                  <span className="info-value">{order.recipientName || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">SĐT:</span>
                  <span className="info-value">{order.recipientPhone || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Địa chỉ:</span>
                  <span className="info-value">{order.shippingAddress || 'N/A'}</span>
                </div>
                {order.deliveryDay && order.deliveryMonth && order.deliveryYear && (
                  <div className="info-row">
                    <span className="info-label">Giao hàng:</span>
                    <span className="info-value">
                      {order.deliveryDay}/{order.deliveryMonth}/{order.deliveryYear}
                      {order.deliveryHour && order.deliveryMinute && 
                        ` ${order.deliveryHour}:${order.deliveryMinute}`
                      }
                    </span>
                  </div>
                )}
                {order.occasion && (
                  <div className="info-row">
                    <span className="info-label">Dịp:</span>
                    <span className="info-value">{order.occasion}</span>
                  </div>
                )}
                {order.flowerType && order.flowerType.length > 0 && (
                  <div className="info-row">
                    <span className="info-label">Loại hoa:</span>
                    <span className="info-value">{order.flowerType.join(', ')}</span>
                  </div>
                )}
              </div>
              
              <div className="order-footer">
                <div className="order-date">
                  Tạo: {formatDate(order.createdAt)}
                </div>
                {order.contactSMS && (
                  <div className="order-contact">
                    Liên hệ: {order.contactSMS}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết đơn hàng</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>Thông tin đơn hàng</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>ID:</label>
                    <span>{selectedOrder.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày tạo:</label>
                    <span>{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin giao hàng</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Người nhận:</label>
                    <span>{selectedOrder.recipientName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>SĐT:</label>
                    <span>{selectedOrder.recipientPhone || 'N/A'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Địa chỉ:</label>
                    <span>{selectedOrder.shippingAddress || 'N/A'}</span>
                  </div>
                  {(selectedOrder.deliveryDay || selectedOrder.deliveryMonth || selectedOrder.deliveryYear) && (
                    <div className="detail-item">
                      <label>Ngày giao:</label>
                      <span>
                        {selectedOrder.deliveryDay || '--'}/{selectedOrder.deliveryMonth || '--'}/{selectedOrder.deliveryYear || '--'}
                        {selectedOrder.deliveryHour && selectedOrder.deliveryMinute && 
                          ` ${selectedOrder.deliveryHour}:${selectedOrder.deliveryMinute}`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin liên hệ</h3>
                <div className="detail-grid">
                  {selectedOrder.contactSMS && (
                    <div className="detail-item">
                      <label>SMS:</label>
                      <span>{selectedOrder.contactSMS}</span>
                    </div>
                  )}
                  {selectedOrder.contactInstagram && (
                    <div className="detail-item">
                      <label>Instagram:</label>
                      <span>{selectedOrder.contactInstagram}</span>
                    </div>
                  )}
                  {selectedOrder.contactZalo && (
                    <div className="detail-item">
                      <label>Zalo:</label>
                      <span>{selectedOrder.contactZalo}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedOrder.occasion && (
                <div className="detail-section">
                  <h3>Dịp</h3>
                  <p>{selectedOrder.occasion}{selectedOrder.occasionOther ? ` - ${selectedOrder.occasionOther}` : ''}</p>
                </div>
              )}

              {selectedOrder.flowerType && selectedOrder.flowerType.length > 0 && (
                <div className="detail-section">
                  <h3>Loại hoa</h3>
                  <p>{selectedOrder.flowerType.join(', ')}{selectedOrder.flowerTypeOther ? ` - ${selectedOrder.flowerTypeOther}` : ''}</p>
                </div>
              )}

              {selectedOrder.flowerDesignCode && (
                <div className="detail-section">
                  <h3>Thiết kế hoa</h3>
                  <p><strong>Mã:</strong> {selectedOrder.flowerDesignCode}</p>
                  {selectedOrder.flowerMessage && <p><strong>Tin nhắn:</strong> {selectedOrder.flowerMessage}</p>}
                </div>
              )}

              {selectedOrder.cardDesignCode && (
                <div className="detail-section">
                  <h3>Thiết kế thiệp</h3>
                  <p><strong>Mã:</strong> {selectedOrder.cardDesignCode}</p>
                  {selectedOrder.cardMessage && <p><strong>Nội dung:</strong> {selectedOrder.cardMessage}</p>}
                </div>
              )}

              {selectedOrder.needConsultation && (
                <div className="detail-section">
                  <h3>Tư vấn</h3>
                  <p>{selectedOrder.needConsultation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage

