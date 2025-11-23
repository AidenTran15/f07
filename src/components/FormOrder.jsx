import { useState } from 'react'
import './FormOrder.css'

function FormOrder() {
  const [formData, setFormData] = useState({
    // Thông tin liên hệ
    contactMethod: '',
    contactValue: '',
    
    // Ngày giao hàng
    deliveryDay: '',
    deliveryMonth: '',
    deliveryYear: '',
    deliveryHour: '',
    deliveryMinute: '',
    
    // Dịp
    occasion: '',
    occasionOther: '',
    
    // Loại hoa
    flowerType: '',
    flowerTypeOther: '',
    
    // Thiết kế hoa
    flowerDesignCode: '',
    flowerDesignMessage: '',
    
    // Thiết kế thiệp
    cardDesignCode: '',
    cardMessage: '',
    
    // Thông tin giao hàng
    shippingAddress: '',
    shippingPhone: '',
    recipientName: '',
    
    // Tư vấn
    needConsultation: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    // Ở đây bạn có thể gửi dữ liệu lên server
    // Ví dụ: await fetch('/api/orders', { method: 'POST', body: JSON.stringify(formData) })
  }

  if (submitted) {
    return (
      <div className="form-container">
        <div className="success-message">
          <h2>✓ Yêu cầu đã được gửi!</h2>
          <p>Cảm ơn bạn đã đặt hàng. Shop sẽ liên hệ với bạn sớm nhất có thể.</p>
          <p className="note">Lưu ý: Đơn hàng đặt trước cần đặt cọc 50%.</p>
          <button onClick={() => {
            setSubmitted(false)
            setFormData({
              contactMethod: '',
              contactValue: '',
              deliveryDay: '',
              deliveryMonth: '',
              deliveryYear: '',
              deliveryHour: '',
              deliveryMinute: '',
              occasion: '',
              occasionOther: '',
              flowerType: '',
              flowerTypeOther: '',
              flowerDesignCode: '',
              flowerDesignMessage: '',
              cardDesignCode: '',
              cardMessage: '',
              shippingAddress: '',
              shippingPhone: '',
              recipientName: '',
              needConsultation: ''
            })
          }} className="btn-submit">
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
            <label>Phương thức liên hệ *</label>
            <select 
              name="contactMethod" 
              value={formData.contactMethod}
              onChange={handleChange}
              required
            >
              <option value="">Chọn phương thức</option>
              <option value="sms">SMS</option>
              <option value="instagram">Instagram</option>
              <option value="zalo">Zalo</option>
            </select>
          </div>
          <div className="form-group">
            <label>Số điện thoại / Username *</label>
            <input
              type="text"
              name="contactValue"
              value={formData.contactValue}
              onChange={handleChange}
              placeholder="Nhập số điện thoại hoặc username"
              required
            />
          </div>
        </section>

        {/* Ngày giờ giao hàng */}
        <section className="form-section">
          <h2>Ngày giờ giao hàng</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày *</label>
              <input
                type="number"
                name="deliveryDay"
                value={formData.deliveryDay}
                onChange={handleChange}
                placeholder="DD"
                min="1"
                max="31"
                required
              />
            </div>
            <div className="form-group">
              <label>Tháng *</label>
              <input
                type="number"
                name="deliveryMonth"
                value={formData.deliveryMonth}
                onChange={handleChange}
                placeholder="MM"
                min="1"
                max="12"
                required
              />
            </div>
            <div className="form-group">
              <label>Năm *</label>
              <input
                type="number"
                name="deliveryYear"
                value={formData.deliveryYear}
                onChange={handleChange}
                placeholder="YYYY"
                min={new Date().getFullYear()}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Giờ *</label>
              <input
                type="number"
                name="deliveryHour"
                value={formData.deliveryHour}
                onChange={handleChange}
                placeholder="HH"
                min="0"
                max="23"
                required
              />
            </div>
            <div className="form-group">
              <label>Phút *</label>
              <input
                type="number"
                name="deliveryMinute"
                value={formData.deliveryMinute}
                onChange={handleChange}
                placeholder="MM"
                min="0"
                max="59"
                required
              />
            </div>
          </div>
        </section>

        {/* Dịp */}
        <section className="form-section">
          <h2>Dịp</h2>
          <div className="form-group">
            <label>Chọn dịp *</label>
            <select 
              name="occasion" 
              value={formData.occasion}
              onChange={handleChange}
              required
            >
              <option value="">Chọn dịp</option>
              <option value="birthday">Sinh nhật</option>
              <option value="anniversary">Kỷ niệm</option>
              <option value="thankyou">Cảm ơn</option>
              <option value="grandopening">Khai trương</option>
              <option value="apology">Xin lỗi</option>
              <option value="other">Khác</option>
            </select>
          </div>
          {formData.occasion === 'other' && (
            <div className="form-group">
              <label>Mô tả dịp khác</label>
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
          <h2>Loại hoa</h2>
          <div className="form-group">
            <label>Chọn loại hoa *</label>
            <select 
              name="flowerType" 
              value={formData.flowerType}
              onChange={handleChange}
              required
            >
              <option value="">Chọn loại hoa</option>
              <option value="rose">Hồng</option>
              <option value="baby">Baby</option>
              <option value="tulip">Tulip</option>
              <option value="peony">Peony</option>
              <option value="cuc-tana">Cúc tana</option>
              <option value="orchid">Lan</option>
              <option value="none">Không</option>
              <option value="other">Khác</option>
            </select>
          </div>
          {formData.flowerType === 'other' && (
            <div className="form-group">
              <label>Mô tả loại hoa khác</label>
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
            <label>Mã thiết kế</label>
            <input
              type="text"
              name="flowerDesignCode"
              value={formData.flowerDesignCode}
              onChange={handleChange}
              placeholder="Nhập mã thiết kế (nếu có)"
            />
          </div>
          <div className="form-group">
            <label>Nội dung tin nhắn cho thiết kế hoa</label>
            <textarea
              name="flowerDesignMessage"
              value={formData.flowerDesignMessage}
              onChange={handleChange}
              placeholder="Nhập nội dung tin nhắn (nếu có)"
              rows="4"
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
              placeholder="Nhập mã thiết kế thiệp (nếu có)"
            />
          </div>
          <div className="form-group">
            <label>Nội dung tin nhắn cho thiệp</label>
            <textarea
              name="cardMessage"
              value={formData.cardMessage}
              onChange={handleChange}
              placeholder="Nhập nội dung tin nhắn cho thiệp (nếu có)"
              rows="4"
            />
          </div>
        </section>

        {/* Thông tin giao hàng */}
        <section className="form-section">
          <h2>Thông tin giao hàng</h2>
          <div className="form-group">
            <label>Địa chỉ giao hàng *</label>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              placeholder="Nhập địa chỉ giao hàng đầy đủ"
              rows="3"
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại người nhận *</label>
            <input
              type="tel"
              name="shippingPhone"
              value={formData.shippingPhone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
          <div className="form-group">
            <label>Tên người nhận *</label>
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
                value="yes"
                checked={formData.needConsultation === 'yes'}
                onChange={handleChange}
                required
              />
              <span>Có</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="needConsultation"
                value="no"
                checked={formData.needConsultation === 'no'}
                onChange={handleChange}
                required
              />
              <span>Không</span>
            </label>
          </div>
        </section>

        <button type="submit" className="btn-submit">
          Gửi
        </button>
      </form>
    </div>
  )
}

export default FormOrder

