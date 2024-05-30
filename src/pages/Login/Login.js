import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Login.css';
export default function Login() {

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Perform login logic here (e.g., authentication)
    
    // If login is successful, navigate to the dashboard
    navigate('/');
  };
  return (
    <div className="login-container">
    <div className="login-status">
      <h3>Trạng thái web</h3>
      <ul>
        <li className="login-status-item login-new-model">đã thêm mô hình mới</li>
        <li className="login-status-item login-maintenance">đang bảo trì chặt</li>
        <li className="login-status-item login-fixing">đang sửa lỗi model</li>
      </ul>
    </div>
    <div className="login-box">
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="username">Tên Đăng Nhập</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="login-input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button className="login-button" type="submit">Đăng nhập</button>
        </form>
    </div>
  </div>
  )
}
