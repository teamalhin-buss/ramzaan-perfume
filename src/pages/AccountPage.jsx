import { orderService } from '../services/firestore';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Package, LogOut, Shield, Calendar, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle, RefreshCw, Eye, ShoppingBag, ChevronLeft, ChevronRight, Loader2, Search, Filter, SortAsc, SortDesc, ChevronDown, ChevronUp, BarChart3, Download, MoreHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './AccountPage.css';

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, login, signup, logout, loginWithGoogle, sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
  const [otpStep, setOtpStep] = useState('phone'); // 'phone' or 'verify'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Get user-specific orders from Firestore
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // New state for enhanced order history
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

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

  // Memoized filtered and sorted orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = searchTerm === '' ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = a.createdAt?.toDate?.() || new Date(a.createdAt);
          bValue = b.createdAt?.toDate?.() || new Date(b.createdAt);
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.createdAt?.toDate?.() || new Date(a.createdAt);
          bValue = b.createdAt?.toDate?.() || new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  // Memoized pagination calculations
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return filteredAndSortedOrders.slice(startIndex, endIndex);
  }, [filteredAndSortedOrders, currentPage, ordersPerPage]);

  // Calculate summary statistics
  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const statusCounts = orders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {});

    return { totalOrders, totalSpent, statusCounts };
  }, [orders]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / ordersPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

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

  // Order tracking timeline data
  const getOrderTracking = (order) => {
    const baseDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
    const trackingSteps = [
      {
        status: 'Order Placed',
        icon: CheckCircle,
        date: baseDate,
        completed: true,
        description: 'Your order has been confirmed'
      }
    ];

    switch (order.status) {
      case 'processing':
        trackingSteps.push({
          status: 'Processing',
          icon: RefreshCw,
          date: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
          completed: true,
          description: 'Your order is being prepared'
        });
        break;
      case 'shipped':
        trackingSteps.push(
          {
            status: 'Processing',
            icon: RefreshCw,
            date: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000),
            completed: true,
            description: 'Your order is being prepared'
          },
          {
            status: 'Shipped',
            icon: Truck,
            date: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000), // 1 day later
            completed: true,
            description: 'Your order has been shipped'
          }
        );
        break;
      case 'delivered':
        trackingSteps.push(
          {
            status: 'Processing',
            icon: RefreshCw,
            date: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000),
            completed: true,
            description: 'Your order is being prepared'
          },
          {
            status: 'Shipped',
            icon: Truck,
            date: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000),
            completed: true,
            description: 'Your order has been shipped'
          },
          {
            status: 'Delivered',
            icon: CheckCircle,
            date: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days later
            completed: true,
            description: 'Your order has been delivered successfully'
          }
        );
        break;
      case 'cancelled':
        trackingSteps.push({
          status: 'Cancelled',
          icon: XCircle,
          date: new Date(baseDate.getTime() + 1 * 60 * 60 * 1000), // 1 hour later
          completed: true,
          description: 'Your order has been cancelled'
        });
        break;
    }

    return trackingSteps;
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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleExportOrders = () => {
    // Simple CSV export functionality
    const csvContent = [
      ['Order ID', 'Date', 'Status', 'Total', 'Items'],
      ...filteredAndSortedOrders.map(order => [
        order.id,
        formatDate(order.createdAt),
        order.status,
        `₹${order.total}`,
        order.items.map(item => `${item.name} (x${item.quantity})`).join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'order-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        setError('');
        if (result.user?.role === 'admin') {
          navigate('/admin');
        }
      } else {
        setError(result.error || 'Google login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Format phone number with country code if not present
      let phoneNumber = formData.phone;
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+91' + phoneNumber; // Default to India
      }

      const result = await sendOTP(phoneNumber);
      if (result.success) {
        setOtpSent(true);
        setOtpStep('verify');
        setResendTimer(60); // 60 seconds timer
        setError('');
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await verifyOTP(formData.otp);
      if (result.success) {
        setError('');
        if (result.user?.role === 'admin') {
          navigate('/admin');
        }
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    await handleSendOTP();
  };

  const switchToEmail = () => {
    setAuthMethod('email');
    setOtpStep('phone');
    setOtpSent(false);
    setError('');
    setFormData(prev => ({ ...prev, phone: '', otp: '' }));
  };

  const switchToPhone = () => {
    setAuthMethod('phone');
    setOtpStep('phone');
    setOtpSent(false);
    setError('');
    setFormData(prev => ({ ...prev, email: '', password: '' }));
  };

  // Timer effect for resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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

            {/* Google Sign-In as Primary Option */}
            {isLoginMode && (
              <div className="auth-primary-section">
                <button
                  type="button"
                  className="google-auth-button primary-google-button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="auth-divider">
                  <span>or</span>
                </div>

                {/* Auth Method Selector */}
                <div className="auth-method-selector">
                  <button
                    type="button"
                    className={`method-button ${authMethod === 'email' ? 'active' : ''}`}
                    onClick={switchToEmail}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    className={`method-button ${authMethod === 'phone' ? 'active' : ''}`}
                    onClick={switchToPhone}
                  >
                    Phone
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={isLoginMode && authMethod === 'phone' && otpStep === 'verify' ? handleVerifyOTP : handleSubmit} className="auth-form">
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

              {/* Email/Phone Authentication */}
              {isLoginMode && authMethod === 'email' && (
                <>
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
                </>
              )}

              {/* Phone OTP Authentication */}
              {isLoginMode && authMethod === 'phone' && (
                <>
                  {otpStep === 'phone' && (
                    <div className="form-group">
                      <label>
                        📱 Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number (10 digits)"
                        required
                        maxLength="10"
                      />
                    </div>
                  )}

                  {otpStep === 'verify' && (
                    <div className="form-group">
                      <label>
                        🔐 Enter OTP
                      </label>
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="Enter 6-digit OTP"
                        required
                        maxLength="6"
                        pattern="[0-9]{6}"
                      />
                      <div className="otp-actions">
                        <button
                          type="button"
                          className="resend-otp"
                          onClick={handleResendOTP}
                          disabled={resendTimer > 0 || loading}
                        >
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Signup Form */}
              {!isLoginMode && (
                <>
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
                </>
              )}

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
                onClick={isLoginMode && authMethod === 'phone' && otpStep === 'phone' ? handleSendOTP : undefined}
              >
                {loading ? 'Please wait...' :
                 isLoginMode && authMethod === 'phone' && otpStep === 'phone' ? 'Send OTP' :
                 isLoginMode && authMethod === 'phone' && otpStep === 'verify' ? 'Verify OTP' :
                 (isLoginMode ? 'Login' : 'Create Account')}
              </button>

            </form>

            <div className="auth-switch">
              <p>
                {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setAuthMethod('email');
                  setOtpStep('phone');
                  setOtpSent(false);
                  setError('');
                  setFormData(prev => ({ ...prev, phone: '', otp: '' }));
                }}>
                  {isLoginMode ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>

            {/* reCAPTCHA container for invisible captcha */}
            <div id="recaptcha-container"></div>

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
                <div className="header-actions">
                  {orders.length > 0 && (
                    <span className="order-count">{filteredAndSortedOrders.length} of {orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
                  )}
                  {orders.length > 0 && (
                    <button
                      className="export-button"
                      onClick={handleExportOrders}
                      aria-label="Export orders to CSV"
                    >
                      <Download size={16} />
                      Export
                    </button>
                  )}
                </div>
              </div>

              {/* Order Statistics */}
              {orders.length > 0 && (
                <div className="order-stats">
                  <div className="stat-card">
                    <BarChart3 size={20} />
                    <div>
                      <span className="stat-value">{orderStats.totalOrders}</span>
                      <span className="stat-label">Total Orders</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Package size={20} />
                    <div>
                      <span className="stat-value">₹{orderStats.totalSpent.toLocaleString()}</span>
                      <span className="stat-label">Total Spent</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <CheckCircle size={20} />
                    <div>
                      <span className="stat-value">{orderStats.statusCounts.delivered || 0}</span>
                      <span className="stat-label">Delivered</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Search and Filters */}
              {orders.length > 0 && (
                <div className="filters-section">
                  <div className="search-bar">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Search orders by ID or product name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search orders"
                    />
                  </div>

                  <div className="filter-controls">
                    <button
                      className="filter-toggle"
                      onClick={() => setShowFilters(!showFilters)}
                      aria-expanded={showFilters}
                      aria-controls="filter-options"
                    >
                      <Filter size={16} />
                      Filters
                      {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {showFilters && (
                      <div className="filter-options" id="filter-options">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          aria-label="Filter by status"
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                 {/* Orders Cards */}
                 <div className="orders-cards-container">
                   {paginatedOrders.map((order) => {
                     const statusConfig = getOrderStatusConfig(order.status);
                     const StatusIcon = statusConfig.icon;
                     const isExpanded = expandedOrder === order.id;

                     return (
                       <div key={order.id} className={`order-card ${isExpanded ? 'expanded' : ''}`}>
                         <div className="order-card-header">
                           <div className="order-card-main">
                             <div className="order-card-info">
                               <div className="order-id">#{order.id}</div>
                               <div className="order-date">
                                 <Calendar size={14} />
                                 {formatDate(order.createdAt)}
                               </div>
                               <div className="order-items-count">
                                 {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                               </div>
                             </div>
                             <div className="order-card-status">
                               <div className={`order-status ${order.status}`}>
                                 <StatusIcon size={14} />
                                 <span>{order.status}</span>
                               </div>
                             </div>
                           </div>
                           <button
                             className="expand-button"
                             onClick={() => toggleOrderExpansion(order.id)}
                             aria-expanded={isExpanded}
                             aria-label={`${isExpanded ? 'Collapse' : 'Expand'} order details`}
                           >
                             {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                           </button>
                         </div>

                         <div className="order-card-total">
                           <span className="order-total">₹{order.total}</span>
                         </div>

                         {isExpanded && (
                           <div className="order-expanded-details">
                             {/* Order Tracking Timeline */}
                             <div className="order-tracking">
                               <h4>Order Tracking</h4>
                               <div className="tracking-timeline">
                                 {getOrderTracking(order).map((step, index) => {
                                   const StepIcon = step.icon;
                                   return (
                                     <div key={index} className={`tracking-step ${step.completed ? 'completed' : 'pending'}`}>
                                       <div className="tracking-icon">
                                         <StepIcon size={16} />
                                       </div>
                                       <div className="tracking-content">
                                         <div className="tracking-status">{step.status}</div>
                                         <div className="tracking-date">
                                           {step.date.toLocaleDateString('en-IN', {
                                             day: 'numeric',
                                             month: 'short',
                                             hour: '2-digit',
                                             minute: '2-digit'
                                           })}
                                         </div>
                                         <div className="tracking-description">{step.description}</div>
                                       </div>
                                     </div>
                                   );
                                 })}
                               </div>
                             </div>

                             {/* Order Items */}
                             <div className="order-items-section">
                               <h4>Order Items</h4>
                               <div className="expanded-items">
                                 {order.items.map((item, index) => (
                                   <div key={index} className="expanded-item">
                                     <div className="item-image">
                                       <img
                                         src={item.image || '/images/perfume-bottle.png'}
                                         alt={item.name}
                                         onError={(e) => {
                                           e.target.src = '/images/perfume-bottle.png';
                                         }}
                                       />
                                     </div>
                                     <div className="item-details">
                                       <div className="item-info">
                                         <span className="item-name">{item.name}</span>
                                         <span className="item-quantity">x{item.quantity}</span>
                                       </div>
                                       <span className="item-price">₹{item.price}</span>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           </div>
                         )}

                         <div className="order-card-actions">
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
                       </div>
                     );
                   })}
                 </div>

                 {/* Enhanced Pagination */}
                 {totalPages > 1 && (
                   <div className="pagination">
                     <div className="pagination-controls">
                       <button
                         className="pagination-button"
                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                         disabled={currentPage === 1}
                         aria-label="Previous page"
                       >
                         <ChevronLeft size={16} />
                       </button>

                       <div className="pagination-pages">
                         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                           let pageNum;
                           if (totalPages <= 5) {
                             pageNum = i + 1;
                           } else if (currentPage <= 3) {
                             pageNum = i + 1;
                           } else if (currentPage >= totalPages - 2) {
                             pageNum = totalPages - 4 + i;
                           } else {
                             pageNum = currentPage - 2 + i;
                           }

                           return (
                             <button
                               key={pageNum}
                               className={`page-number ${pageNum === currentPage ? 'active' : ''}`}
                               onClick={() => setCurrentPage(pageNum)}
                               aria-label={`Go to page ${pageNum}`}
                               aria-current={pageNum === currentPage ? 'page' : undefined}
                             >
                               {pageNum}
                             </button>
                           );
                         })}
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

                     <div className="pagination-info">
                       <span className="pagination-text">
                         Showing {Math.min((currentPage - 1) * ordersPerPage + 1, filteredAndSortedOrders.length)} to {Math.min(currentPage * ordersPerPage, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length} orders
                       </span>
                     </div>
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
