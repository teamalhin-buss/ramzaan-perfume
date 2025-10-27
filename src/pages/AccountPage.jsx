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
  const { user, login, signup, logout, isAuthenticated } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Active section state
  const [activeSection, setActiveSection] = useState('profile');

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

          <div className="account-layout">
            {/* Sidebar Navigation */}
            <div className="account-sidebar">
              <div className="sidebar-nav">
                <button
                  className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveSection('profile')}
                >
                  <User size={18} />
                  Profile
                </button>
                <button
                  className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveSection('orders')}
                >
                  <Package size={18} />
                  Order History
                </button>
                <button
                  className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveSection('settings')}
                >
                  <Shield size={18} />
                  Settings
                </button>
                <button className="nav-item logout-nav" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="account-content">
              {activeSection === 'profile' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h3>Profile Information</h3>
                    <p>View and manage your account details</p>
                  </div>

                  <div className="profile-card">
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

                    {user.role === 'admin' && (
                      <div className="profile-actions">
                        <button
                          className="admin-panel-button"
                          onClick={() => navigate('/admin')}
                        >
                          <Shield size={18} />
                          Admin Panel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'orders' && (
                <div className="orders-section">
                  <div className="section-header">
                    <h3>Order History</h3>
                    <p>Track and manage your orders</p>
                  </div>

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
                       {/* Orders Table */}
                       <div className="orders-table-container">
                         <table className="orders-table" role="table" aria-label="Order history">
                           <thead>
                             <tr>
                               <th>
                                 <button
                                   className="sort-button"
                                   onClick={() => handleSort('date')}
                                   aria-label={`Sort by date ${sortBy === 'date' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                                 >
                                   Order Details
                                   {sortBy === 'date' && (
                                     sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                   )}
                                 </button>
                               </th>
                               <th>
                                 <button
                                   className="sort-button"
                                   onClick={() => handleSort('status')}
                                   aria-label={`Sort by status ${sortBy === 'status' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                                 >
                                   Status
                                   {sortBy === 'status' && (
                                     sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                   )}
                                 </button>
                               </th>
                               <th>
                                 <button
                                   className="sort-button"
                                   onClick={() => handleSort('total')}
                                   aria-label={`Sort by total ${sortBy === 'total' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                                 >
                                   Total
                                   {sortBy === 'total' && (
                                     sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                   )}
                                 </button>
                               </th>
                               <th>Actions</th>
                             </tr>
                           </thead>
                           <tbody>
                             {paginatedOrders.map((order) => {
                               const statusConfig = getOrderStatusConfig(order.status);
                               const StatusIcon = statusConfig.icon;
                               const isExpanded = expandedOrder === order.id;

                               return (
                                 <tr key={order.id} className={`order-row ${isExpanded ? 'expanded' : ''}`}>
                                   <td className="order-details-cell">
                                     <div className="order-summary">
                                       <div className="order-id">#{order.id}</div>
                                       <div className="order-date">
                                         <Calendar size={14} />
                                         {formatDate(order.createdAt)}
                                       </div>
                                       <div className="order-items-count">
                                         {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
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

                                     {isExpanded && (
                                       <div className="order-expanded-details">
                                         <div className="expanded-items">
                                           {order.items.map((item, index) => (
                                             <div key={index} className="expanded-item">
                                               <div className="item-info">
                                                 <span className="item-name">{item.name}</span>
                                                 <span className="item-quantity">x{item.quantity}</span>
                                               </div>
                                               <span className="item-price">₹{item.price}</span>
                                             </div>
                                           ))}
                                         </div>
                                       </div>
                                     )}
                                   </td>
                                   <td>
                                     <div className={`order-status ${order.status}`}>
                                       <StatusIcon size={14} />
                                       <span>{order.status}</span>
                                     </div>
                                   </td>
                                   <td className="order-total-cell">
                                     <span className="order-total">₹{order.total}</span>
                                   </td>
                                   <td>
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
                                   </td>
                                 </tr>
                               );
                             })}
                           </tbody>
                         </table>
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
             )}

             {activeSection === 'settings' && (
               <div className="settings-section">
                 <div className="section-header">
                   <h3>Account Settings</h3>
                   <p>Manage your account preferences and security</p>
                 </div>

                 <div className="settings-card">
                   <div className="settings-group">
                     <h4>Security</h4>
                     <div className="setting-item">
                       <div className="setting-info">
                         <span className="setting-label">Change Password</span>
                         <span className="setting-description">Update your account password</span>
                       </div>
                       <button className="setting-button">Change</button>
                     </div>
                     <div className="setting-item">
                       <div className="setting-info">
                         <span className="setting-label">Two-Factor Authentication</span>
                         <span className="setting-description">Add an extra layer of security</span>
                       </div>
                       <button className="setting-button">Enable</button>
                     </div>
                   </div>

                   <div className="settings-group">
                     <h4>Notifications</h4>
                     <div className="setting-item">
                       <div className="setting-info">
                         <span className="setting-label">Order Updates</span>
                         <span className="setting-description">Receive updates about your orders</span>
                       </div>
                       <button className="setting-toggle active">On</button>
                     </div>
                     <div className="setting-item">
                       <div className="setting-info">
                         <span className="setting-label">Promotional Emails</span>
                         <span className="setting-description">Receive offers and promotions</span>
                       </div>
                       <button className="setting-toggle">Off</button>
                     </div>
                   </div>

                   <div className="settings-group">
                     <h4>Privacy</h4>
                     <div className="setting-item">
                       <div className="setting-info">
                         <span className="setting-label">Data Export</span>
                         <span className="setting-description">Download your account data</span>
                       </div>
                       <button className="setting-button">Export</button>
                     </div>
                     <div className="setting-item danger">
                       <div className="setting-info">
                         <span className="setting-label">Delete Account</span>
                         <span className="setting-description">Permanently delete your account</span>
                       </div>
                       <button className="setting-button danger">Delete</button>
                     </div>
                   </div>
                 </div>
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
