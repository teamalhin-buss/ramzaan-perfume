import { orderService } from '../services/firestore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Package, LogOut, Shield, Calendar, MapPin, CreditCard } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './AccountPage.css';

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, login, signup, logout, isAuthenticated } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get user-specific orders from Firestore
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const loadUserOrders = async () => {
      if (user) {
        setOrdersLoading(true);
        const result = await orderService.getUserOrders(user.id);
        if (result.success) {
          setOrders(result.data);
        }
        setOrdersLoading(false);
      } else {
        setOrders([]);
        setOrdersLoading(false);
      }
    };

    loadUserOrders();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setError('');
          if (result.user?.role === 'admin') {
            navigate('/admin');
          }
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
        }
      } else {
        const result = await signup(formData.email, formData.password, formData.name);
        if (result.success) {
          setError('');
          setIsLoginMode(true); // Switch to login mode after successful signup
        } else {
          setError(result.error || 'Account creation failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    alert('Logged out successfully');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="account-page">
        <Header />
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-icon">
              <User size={40} strokeWidth={1.5} />
            </div>
            <h2>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="auth-subtitle">
              {isLoginMode ? 'Login to access your account' : 'Join us today'}
            </p>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLoginMode && (
                <div className="form-group">
                  <label>
                    <User size={18} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required={!isLoginMode}
                  />
                </div>
              )}

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={18} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Please wait...' : (isLoginMode ? 'Login' : 'Create Account')}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setIsLoginMode(!isLoginMode)}>
                  {isLoginMode ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>

            {isLoginMode && (
              <div className="admin-hint">
                <Shield size={14} />
                <p>Admin: admin@alh.com / admin123</p>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="account-page">
      <Header />
      <div className="profile-container">
        <div className="container">
          <div className="page-header">
            <h2 className="section-title">My Account</h2>
            <p className="section-subtitle">Manage your profile and orders</p>
          </div>

          <div className="profile-grid">
            {/* Profile Info */}
            <div className="profile-card">
              <div className="card-header">
                <h3>Profile</h3>
              </div>
              
              <div className="profile-header">
                <div className="profile-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h4>{user.name}</h4>
                  <p className="profile-email">
                    <Mail size={14} />
                    {user.email}
                  </p>
                  {user.role === 'admin' && (
                    <span className="admin-badge">
                      <Shield size={12} />
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-box">
                  <Package size={20} />
                  <div>
                    <span className="stat-number">{orders.length}</span>
                    <span className="stat-label">Orders</span>
                  </div>
                </div>
                <div className="stat-box">
                  <Calendar size={20} />
                  <div>
                    <span className="stat-number">2025</span>
                    <span className="stat-label">Member Since</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                {user.role === 'admin' && (
                  <button 
                    className="admin-panel-button"
                    onClick={() => navigate('/admin')}
                  >
                    <Shield size={18} />
                    Admin Panel
                  </button>
                )}
                <button className="logout-button" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            {/* Order History */}
            <div className="orders-card">
              <div className="card-header">
                <h3>
                  <Package size={24} />
                  Order History
                </h3>
                {orders.length > 0 && (
                  <span className="order-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
                )}
              </div>
              
              {ordersLoading ? (
                <div className="loading-orders">
                  <p>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="no-orders">
                  <Package size={64} strokeWidth={1} />
                  <p>No orders yet</p>
                  <span className="no-orders-hint">Start shopping to see your orders here</span>
                  <button 
                    className="shop-button"
                    onClick={() => navigate('/')}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-header">
                        <div className="order-info">
                          <span className="order-id">#{order.id}</span>
                          <span className="order-date">
                            <Calendar size={14} />
                            {order.date}
                          </span>
                        </div>
                        <span className={`order-status ${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item-row">
                            <span>{item.name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <span className="order-total-label">Total</span>
                        <span className="order-total">₹{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;
