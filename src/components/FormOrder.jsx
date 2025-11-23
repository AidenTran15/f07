import { useState } from 'react'
import './FormOrder.css'

function FormOrder() {
  const [formData, setFormData] = useState({
    // Thông tin liên hệ
    contactSMS: '',
    contactInstagram: '',
    contactZalo: '',
    
    // Ngày giờ giao hàng
    deliveryDay: '',
    deliveryMonth: '',
    deliveryYear: '',
    deliveryHour: '',
    deliveryMinute: '',
    
    // Dịp
    occasion: '',
    occasionOther: '',
    
    // Loại hoa
    flowerType: [],
    flowerTypeOther: '',
    
    // Thiết kế hoa
    flowerDesignCode: '',
    flowerMessage: '',
    
    // Thiết kế thiệp
    cardDesignCode: '',
    cardMessage: '',
    
    // Thông tin giao hàng
    shippingAddress: '',
    recipientPhone: '',
    recipientName: '',
    
    // Tư vấn
    needConsultation: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      if (name === 'flowerType') {
        setFormData(prev => ({
          ...prev,
          flowerType: checked
            ? [...prev.flowerType, value]
            : prev.flowerType.filter(item => item !== value)
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // API Gateway endpoint
      const apiUrl = import.meta.env.VITE_API_URL || 'https://5vk7ifeqyd.execute-api.ap-southeast-2.amazonaws.com/prod'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
          id: crypto.randomUUID()
        })
      })

      if (response.ok) {
        setSubmitted(true)
        // Reset form
        setFormData({
          contactSMS: '',
          contactInstagram: '',
          contactZalo: '',
          deliveryDay: '',
          deliveryMonth: '',
          deliveryYear: '',
          deliveryHour: '',
          deliveryMinute: '',
          occasion: '',
          occasionOther: '',
          flowerType: [],
          flowerTypeOther: '',
          flowerDesignCode: '',
          flowerMessage: '',
          cardDesignCode: '',
          cardMessage: '',
          shippingAddress: '',
          recipientPhone: '',
          recipientName: '',
          needConsultation: ''
        })
      } else {
        alert('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại!')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="form-container">
        <div className="success-message">
          <h2>Đơn hàng đã được gửi thành công! 🎉</h2>
          <p>Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ với bạn sớm nhất có thể.</p>
          <p className="deposit-note">Lưu ý: Đơn hàng đặt trước cần đặt cọc 50%.</p>
          <button onClick={() => setSubmitted(false)} className="btn-primary">
            Đặt hàng mới
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="order-form">
        <h1 className="form-title">F07 ORDER REQUEST</h1>
        
        {/* Thông tin liên hệ */}
        <section className="form-section">
          <h2>Thông tin liên hệ</h2>
          <div className="form-group">
            <label>SMS</label>
            <input
              type="text"
              name="contactSMS"
              value={formData.contactSMS}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="form-group">
            <label>Instagram</label>
            <input
              type="text"
              name="contactInstagram"
              value={formData.contactInstagram}
              onChange={handleChange}
              placeholder="@username"
            />
          </div>
          <div className="form-group">
            <label>Zalo</label>
            <input
              type="text"
              name="contactZalo"
              value={formData.contactZalo}
              onChange={handleChange}
              placeholder="Số điện thoại Zalo"
            />
          </div>
        </section>

        {/* Ngày giờ giao hàng */}
        <section className="form-section">
          <h2>Ngày giờ giao hàng</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày</label>
              <input
                type="number"
                name="deliveryDay"
                value={formData.deliveryDay}
                onChange={handleChange}
                min="1"
                max="31"
                placeholder="DD"
              />
            </div>
            <div className="form-group">
              <label>Tháng</label>
              <input
                type="number"
                name="deliveryMonth"
                value={formData.deliveryMonth}
                onChange={handleChange}
                min="1"
                max="12"
                placeholder="MM"
              />
            </div>
            <div className="form-group">
              <label>Năm</label>
              <input
                type="number"
                name="deliveryYear"
                value={formData.deliveryYear}
                onChange={handleChange}
                min={new Date().getFullYear()}
                placeholder="YYYY"
              />
            </div>
            <div className="form-group">
              <label>Giờ</label>
              <input
                type="number"
                name="deliveryHour"
                value={formData.deliveryHour}
                onChange={handleChange}
                min="0"
                max="23"
                placeholder="HH"
              />
            </div>
            <div className="form-group">
              <label>Phút</label>
              <input
                type="number"
                name="deliveryMinute"
                value={formData.deliveryMinute}
                onChange={handleChange}
                min="0"
                max="59"
                placeholder="MM"
              />
            </div>
          </div>
        </section>

        {/* Dịp */}
        <section className="form-section">
          <h2>Dịp</h2>
          <div className="radio-group">
            {['Sinh nhật', 'Kỷ niệm', 'Cảm ơn', 'Khai trương', 'Xin lỗi', 'Khác'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="occasion"
                  value={option}
                  checked={formData.occasion === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>
          {formData.occasion === 'Khác' && (
            <div className="form-group">
              <input
                type="text"
                name="occasionOther"
                value={formData.occasionOther}
                onChange={handleChange}
                placeholder="Nhập dịp khác"
              />
            </div>
          )}
        </section>

        {/* Loại hoa */}
        <section className="form-section">
          <h2>Loại hoa yêu cầu</h2>
          <div className="checkbox-group">
            {['Hoa hồng', 'Baby', 'Tulip', 'Peony', 'Cúc tana', 'Lan', 'Không', 'Khác'].map(flower => (
              <label key={flower} className="checkbox-label">
                <input
                  type="checkbox"
                  name="flowerType"
                  value={flower}
                  checked={formData.flowerType.includes(flower)}
                  onChange={handleChange}
                />
                {flower}
              </label>
            ))}
          </div>
          {formData.flowerType.includes('Khác') && (
            <div className="form-group">
              <input
                type="text"
                name="flowerTypeOther"
                value={formData.flowerTypeOther}
                onChange={handleChange}
                placeholder="Nhập loại hoa khác"
              />
            </div>
          )}
        </section>

        {/* Thiết kế hoa */}
        <section className="form-section">
          <h2>Thiết kế hoa</h2>
          <div className="form-group">
            <label>Mã thiết kế hoa</label>
            <input
              type="text"
              name="flowerDesignCode"
              value={formData.flowerDesignCode}
              onChange={handleChange}
              placeholder="Nhập mã thiết kế"
            />
          </div>
          <div className="form-group">
            <label>Tin nhắn</label>
            <textarea
              name="flowerMessage"
              value={formData.flowerMessage}
              onChange={handleChange}
              placeholder="Nhập tin nhắn cho thiết kế hoa"
              rows="3"
            />
          </div>
        </section>

        {/* Thiết kế thiệp */}
        <section className="form-section">
          <h2>Thiết kế thiệp</h2>
          <div className="form-group">
            <label>Mã thiết kế thiệp</label>
            <input
              type="text"
              name="cardDesignCode"
              value={formData.cardDesignCode}
              onChange={handleChange}
              placeholder="Nhập mã thiết kế"
            />
          </div>
          <div className="form-group">
            <label>Nội dung</label>
            <textarea
              name="cardMessage"
              value={formData.cardMessage}
              onChange={handleChange}
              placeholder="Nhập nội dung thiệp"
              rows="3"
            />
          </div>
        </section>

        {/* Thông tin giao hàng */}
        <section className="form-section">
          <h2>Thông tin giao hàng</h2>
          <div className="form-group">
            <label>Địa chỉ giao hàng</label>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              placeholder="Nhập địa chỉ đầy đủ"
              rows="3"
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại người nhận</label>
            <input
              type="text"
              name="recipientPhone"
              value={formData.recipientPhone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
          <div className="form-group">
            <label>Tên người nhận</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Nhập tên người nhận"
              required
            />
          </div>
        </section>

        {/* Tư vấn */}
        <section className="form-section">
          <h2>Bạn có cần tư vấn thêm không?</h2>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="needConsultation"
                value="Có"
                checked={formData.needConsultation === 'Có'}
                onChange={handleChange}
              />
              Có
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="needConsultation"
                value="Không"
                checked={formData.needConsultation === 'Không'}
                onChange={handleChange}
              />
              Không
            </label>
          </div>
        </section>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi'}
        </button>
      </form>
    </div>
  )
}

export default FormOrder

