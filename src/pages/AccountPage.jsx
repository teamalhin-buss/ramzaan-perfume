import { orderService } from '../services/firestore';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Package, LogOut, Shield, Calendar, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle, RefreshCw, Eye, ShoppingBag, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

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

  // Memoized pagination calculations
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return orders.slice(startIndex, endIndex);
  }, [orders, currentPage, ordersPerPage]);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Reset to first page when orders change
  useEffect(() => {
    setCurrentPage(1);
  }, [orders]);

  // Order status configuration
  const getOrderStatusConfig = (status) => {
    const configs = {
      pending: { icon: Clock, color: 'var(--gray-500)', bgColor: 'transparent', textColor: 'var(--gray-300)' },
      processing: { icon: RefreshCw, color: 'var(--border-medium)', bgColor: 'transparent', textColor: 'var(--white)' },
      shipped: { icon: Truck, color: 'var(--white)', bgColor: 'transparent', textColor: 'var(--white)' },
      delivered: { icon: CheckCircle, color: 'var(--white)', bgColor: 'transparent', textColor: 'var(--white)' },
      cancelled: { icon: XCircle, color: '#ef4444', bgColor: 'transparent', textColor: '#ef4444' }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleReorder = (order) => {
    // Navigate to product page or add to cart
    navigate('/', { state: { reorderItems: order.items } });
  };

  const handleViewOrder = (orderId) => {
    // Could navigate to order details page
    console.log('View order:', orderId);
  };

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
                 <div className="skeleton-loader">
                   <div className="skeleton-item"></div>
                   <div className="skeleton-item"></div>
                   <div className="skeleton-item"></div>
                 </div>
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
               <>
                 <div className="orders-list">
                   {paginatedOrders.map((order) => {
                     const statusConfig = getOrderStatusConfig(order.status);
                     const StatusIcon = statusConfig.icon;
                     return (
                       <div key={order.id} className="order-item">
                         <div className="order-header">
                           <div className="order-info">
                             <span className="order-id">#{order.id}</span>
                             <span className="order-date">
                               <Calendar size={14} />
                               {formatDate(order.createdAt)}
                             </span>
                           </div>
                           <div className={`order-status ${order.status}`}>
                             <StatusIcon size={12} />
                             {order.status}
                           </div>
                         </div>
                         <div className="order-items">
                           {order.items.map((item, index) => (
                             <div key={index} className="order-item-row">
                               <div className="item-details">
                                 <span className="item-name">{item.name}</span>
                                 <span className="item-price">₹{item.price}</span>
                               </div>
                               <span className="item-quantity">x{item.quantity}</span>
                             </div>
                           ))}
                         </div>
                         <div className="order-footer">
                           <div className="order-actions">
                             <button
                               className="action-button view-button"
                               onClick={() => handleViewOrder(order.id)}
                               aria-label={`View order ${order.id}`}
                             >
                               <Eye size={14} />
                               View
                             </button>
                             <button
                               className="action-button reorder-button"
                               onClick={() => handleReorder(order)}
                               aria-label={`Reorder items from order ${order.id}`}
                             >
                               <ShoppingBag size={14} />
                               Reorder
                             </button>
                           </div>
                           <div className="order-total-section">
                             <span className="order-total-label">Total</span>
                             <span className="order-total">₹{order.total}</span>
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>

                 {totalPages > 1 && (
                   <div className="pagination">
                     <button
                       className="pagination-button"
                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                       disabled={currentPage === 1}
                       aria-label="Previous page"
                     >
                       <ChevronLeft size={16} />
                     </button>

                     <div className="pagination-info">
                       <span className="pagination-text">
                         Page {currentPage} of {totalPages}
                       </span>
                     </div>

                     <button
                       className="pagination-button"
                       onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                       disabled={currentPage === totalPages}
                       aria-label="Next page"
                     >
                       <ChevronRight size={16} />
                     </button>
                   </div>
                 )}
               </>
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
