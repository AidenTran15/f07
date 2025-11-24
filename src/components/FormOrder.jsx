import { useState } from 'react'
import './FormOrder.css'

function FormOrder() {
  const [formData, setFormData] = useState({
    // Thông tin liên hệ - chỉ chọn 1
    contactMethod: '', // 'SMS', 'Instagram', 'Zalo'
    contactValue: '', // Giá trị tương ứng
    
    // Ngày giờ giao hàng
    deliveryDate: '', // Format: YYYY-MM-DD
    deliveryTime: '', // Format: HH:MM
    
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
          // Map contactMethod và contactValue về format cũ để tương thích với backend
          contactSMS: formData.contactMethod === 'SMS' ? formData.contactValue : '',
          contactInstagram: formData.contactMethod === 'Instagram' ? formData.contactValue : '',
          contactZalo: formData.contactMethod === 'Zalo' ? formData.contactValue : '',
          // Parse deliveryDate và deliveryTime về format cũ
          deliveryDay: formData.deliveryDate ? new Date(formData.deliveryDate).getDate().toString() : '',
          deliveryMonth: formData.deliveryDate ? (new Date(formData.deliveryDate).getMonth() + 1).toString() : '',
          deliveryYear: formData.deliveryDate ? new Date(formData.deliveryDate).getFullYear().toString() : '',
          deliveryHour: formData.deliveryTime ? formData.deliveryTime.split(':')[0] : '',
          deliveryMinute: formData.deliveryTime ? formData.deliveryTime.split(':')[1] : '',
          createdAt: new Date().toISOString(),
          id: crypto.randomUUID()
        })
      })

      if (response.ok) {
        setSubmitted(true)
        // Reset form
        setFormData({
          contactMethod: '',
          contactValue: '',
          deliveryDate: '',
          deliveryTime: '',
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
          <h2>Đơn hàng đã được gửi thành công</h2>
          <p>Cảm ơn bạn đã đặt hàng tại F07</p>
          <p>Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ với bạn sớm nhất có thể.</p>
          <p className="deposit-note">Lưu ý: Đơn hàng đặt trước cần đặt cọc 50%</p>
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
        <h1 className="form-title">F07 Order Request</h1>
        
        {/* Thông tin liên hệ */}
        <section className="form-section">
          <h2>Thông tin liên hệ</h2>
          <p style={{ marginBottom: '2rem', color: '#9f1853', fontSize: '0.875rem', letterSpacing: '0.5px', fontWeight: 300, fontFamily: 'Inter, sans-serif' }}>
            Vui lòng chọn một phương thức liên hệ
          </p>
          <div className="radio-group">
            <label className={`radio-label ${formData.contactMethod === 'SMS' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="contactMethod"
                value="SMS"
                checked={formData.contactMethod === 'SMS'}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    contactMethod: e.target.value,
                    contactValue: prev.contactMethod === 'SMS' ? prev.contactValue : ''
                  }))
                }}
              />
              <span>SMS</span>
            </label>
            <label className={`radio-label ${formData.contactMethod === 'Instagram' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="contactMethod"
                value="Instagram"
                checked={formData.contactMethod === 'Instagram'}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    contactMethod: e.target.value,
                    contactValue: prev.contactMethod === 'Instagram' ? prev.contactValue : ''
                  }))
                }}
              />
              <span>Instagram</span>
            </label>
            <label className={`radio-label ${formData.contactMethod === 'Zalo' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="contactMethod"
                value="Zalo"
                checked={formData.contactMethod === 'Zalo'}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    contactMethod: e.target.value,
                    contactValue: prev.contactMethod === 'Zalo' ? prev.contactValue : ''
                  }))
                }}
              />
              <span>Zalo</span>
            </label>
          </div>
          {formData.contactMethod && (
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>
                {formData.contactMethod === 'SMS' && 'Số điện thoại'}
                {formData.contactMethod === 'Instagram' && 'Tên Instagram (@username)'}
                {formData.contactMethod === 'Zalo' && 'Số điện thoại Zalo'}
              </label>
              <input
                type="text"
                name="contactValue"
                value={formData.contactValue}
                onChange={handleChange}
                placeholder={
                  formData.contactMethod === 'SMS' ? 'Nhập số điện thoại' :
                  formData.contactMethod === 'Instagram' ? '@username' :
                  'Số điện thoại Zalo'
                }
              />
            </div>
          )}
        </section>

        {/* Ngày giờ giao hàng */}
        <section className="form-section">
          <h2>Ngày giờ giao hàng</h2>
          <div className="datetime-picker-container">
            <div className="form-group">
              <label>Chọn ngày</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="date-picker"
              />
            </div>
            <div className="form-group">
              <label>Chọn giờ</label>
              <input
                type="time"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="time-picker"
              />
            </div>
          </div>
          {formData.deliveryDate && formData.deliveryTime && (
            <div className="selected-datetime">
              <span>Đã chọn: </span>
              <strong>
                {new Date(formData.deliveryDate).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} lúc {formData.deliveryTime}
              </strong>
            </div>
          )}
        </section>

        {/* Dịp */}
        <section className="form-section">
          <h2>Dịp</h2>
          <div className="radio-group">
            {['Sinh nhật', 'Kỷ niệm', 'Cảm ơn', 'Khai trương', 'Xin lỗi', 'Khác'].map(option => (
              <label key={option} className={`radio-label ${formData.occasion === option ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="occasion"
                  value={option}
                  checked={formData.occasion === option}
                  onChange={handleChange}
                />
                <span>{option}</span>
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
              <label key={flower} className={`checkbox-label ${formData.flowerType.includes(flower) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="flowerType"
                  value={flower}
                  checked={formData.flowerType.includes(flower)}
                  onChange={handleChange}
                />
                <span>{flower}</span>
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
            <label className={`radio-label ${formData.needConsultation === 'Có' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="needConsultation"
                value="Có"
                checked={formData.needConsultation === 'Có'}
                onChange={handleChange}
              />
              <span>Có</span>
            </label>
            <label className={`radio-label ${formData.needConsultation === 'Không' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="needConsultation"
                value="Không"
                checked={formData.needConsultation === 'Không'}
                onChange={handleChange}
              />
              <span>Không</span>
            </label>
          </div>
        </section>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi đơn hàng'}
        </button>
      </form>
    </div>
  )
}

export default FormOrder

