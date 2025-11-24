# Các tùy chọn Icon cho Section Headers

Hiện tại đang dùng: **Diamond shape** (hình thoi xoay 45 độ)

## Các tùy chọn khác:

### Option 1: Diamond (Hiện tại)
```css
.form-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #ff6bb3 0%, #ff4da6 50%, #e91e63 100%);
  border-radius: 2px;
  box-shadow: 
    0 0 12px rgba(255, 107, 179, 0.6),
    0 2px 4px rgba(233, 30, 99, 0.3);
}
```

### Option 2: Vertical Line (Đường thẳng dọc)
```css
.form-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #ff6bb3 0%, #ff4da6 50%, #e91e63 100%);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(255, 107, 179, 0.5);
}
```

### Option 3: Rounded Square (Hình vuông bo góc)
```css
.form-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #ff6bb3 0%, #ff4da6 50%, #e91e63 100%);
  border-radius: 3px;
  box-shadow: 
    0 0 12px rgba(255, 107, 179, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

### Option 4: Hexagon (Hình lục giác)
```css
.form-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) rotate(30deg);
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #ff6bb3 0%, #ff4da6 50%, #e91e63 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  box-shadow: 0 0 12px rgba(255, 107, 179, 0.6);
}
```

### Option 5: Arrow Right (Mũi tên phải)
```css
.form-section h2::before {
  content: '→';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #ff6bb3;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(255, 107, 179, 0.5);
}
```

### Option 6: Double Line (Hai đường gạch)
```css
.form-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 20px;
  background: linear-gradient(180deg, #ff6bb3 0%, #ff4da6 50%, #e91e63 100%);
  border-radius: 1px;
  box-shadow: 
    3px 0 0 rgba(255, 107, 179, 0.6),
    0 0 8px rgba(255, 107, 179, 0.4);
}
```

### Option 7: Circle with Border (Vòng tròn có viền)
```css
.form-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid #ff6bb3;
  border-radius: 50%;
  box-shadow: 
    0 0 12px rgba(255, 107, 179, 0.6),
    inset 0 0 8px rgba(255, 107, 179, 0.2);
}
```

### Option 8: Star (Ngôi sao)
```css
.form-section h2::before {
  content: '✦';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #ff6bb3;
  font-size: 1rem;
  text-shadow: 0 0 10px rgba(255, 107, 179, 0.6);
}
```

## Cách thay đổi:

1. Mở file `src/components/FormOrder.css`
2. Tìm `.form-section h2::before`
3. Thay thế bằng code của option bạn muốn
4. Save và refresh browser

