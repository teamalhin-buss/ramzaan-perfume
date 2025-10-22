import { orderService, reviewService, productService, userService } from '../services/firestore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Users,
  DollarSign,
  Star,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Check,
  X,
  BarChart,
  TrendingUp,
  ShoppingCart,
  Eye,
  AlertCircle,
  RefreshCw,
  Download,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Shield,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [productData, setProductData] = useState({
    name: 'Ramzaan',
    price: 1499,
    stock: 50,
    description: 'Experience timeless elegance in every drop',
    notes: 'Oud, Amber, Musk',
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAdmin) {
      alert('Access denied. Admin only.');
      navigate('/account');
      return;
    }

    // Load data from Firestore
    const loadData = async () => {
      setLoading(true);
      try {
        // Load orders
        const ordersResult = await orderService.getAllOrders();
        if (ordersResult.success) {
          console.log('Loaded orders:', ordersResult.data.map(o => ({ id: o.id, status: o.status })));
          setOrders(ordersResult.data);
        }

        // Load reviews
        const reviewsResult = await reviewService.getAllReviews();
        if (reviewsResult.success) {
          setReviews(reviewsResult.data);
        }

        // Load users
        const usersResult = await userService.getAllUsers();
        if (usersResult.success) {
          setUsers(usersResult.data);
        }

        // Load product data
        const productResult = await productService.getProduct();
        if (productResult.success) {
          setProductData(productResult.data);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAdmin, navigate]);

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    const result = await productService.updateProduct(productData);
    if (result.success) {
      alert('Product updated successfully!');
    } else {
      alert('Failed to update product: ' + result.error);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    console.log('Attempting to update order:', orderId, 'to status:', newStatus);
    const result = await orderService.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      alert('Order status updated successfully!');
    } else {
      console.error('Failed to update order status:', result.error);
      alert('Failed to update order status: ' + result.error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const result = await orderService.deleteOrder(orderId);
      if (result.success) {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrders(updatedOrders);
      } else {
        alert('Failed to delete order: ' + result.error);
      }
    }
  };

  const handleReviewAction = async (reviewId, action) => {
    if (action === 'delete') {
      const result = await reviewService.deleteReview(reviewId);
      if (result.success) {
        const updatedReviews = reviews.filter(review => review.id !== reviewId);
        setReviews(updatedReviews);
        alert('Review deleted successfully!');
      } else {
        alert('Failed to delete review: ' + result.error);
        // Refresh the reviews list in case of stale data
        const reviewsResult = await reviewService.getAllReviews();
        if (reviewsResult.success) {
          setReviews(reviewsResult.data);
        }
      }
    } else if (action === 'approve') {
      console.log('Attempting to approve review:', reviewId);
      const result = await reviewService.approveReview(reviewId);
      if (result.success) {
        const updatedReviews = reviews.map(review =>
          review.id === reviewId ? { ...review, approved: true } : review
        );
        setReviews(updatedReviews);
        alert('Review approved successfully!');
      } else {
        console.error('Failed to approve review:', result.error);
        alert('Failed to approve review: ' + result.error);
        // Refresh the reviews list in case the review no longer exists
        const reviewsResult = await reviewService.getAllReviews();
        if (reviewsResult.success) {
          setReviews(reviewsResult.data);
        }
      }
    }
  };

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  };

  const getCustomerCount = () => {
    return users.length;
  };

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === '' ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredReviews = () => {
    return reviews.filter(review => {
      return searchTerm === '' ||
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.text.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const refreshData = () => {
    window.location.reload();
  };

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Are you sure you want to ${newRole === 'admin' ? 'promote' : 'demote'} this user?`)) {
      const result = await userService.updateUser(userId, { role: newRole });
      if (result.success) {
        // Update local state
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
        alert(`User ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'} successfully!`);
      } else {
        alert('Failed to update user role: ' + result.error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/account');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>ALH Admin</h2>
        </div>

        <nav className="admin-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart size={20} />
            Dashboard
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={20} />
            Orders
          </button>
          <button
            className={activeTab === 'customers' ? 'active' : ''}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={20} />
            Customers
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            <User size={20} />
            Users
          </button>
          <button
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={20} />
            Reviews
          </button>
          <button
            className={activeTab === 'product' ? 'active' : ''}
            onClick={() => setActiveTab('product')}
          >
            <Package size={20} />
            Product
          </button>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'customers' && 'Customer Management'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'reviews' && 'Review Moderation'}
              {activeTab === 'product' && 'Product Settings'}
            </h1>
            {(activeTab === 'orders' || activeTab === 'reviews' || activeTab === 'customers') && (
              <div className="header-actions">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {activeTab === 'orders' && (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                )}
                <button onClick={refreshData} className="refresh-btn">
                  <RefreshCw size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="admin-user">
            <span>Welcome, {user?.name}</span>
          </div>
        </header>

        <div className="admin-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <ShoppingCart size={28} />
                </div>
                <div className="stat-info">
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
                <div className="stat-trend">
                  <TrendingUp size={14} />
                  <span>+12%</span>
                </div>
              </div>

              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <DollarSign size={28} />
                </div>
                <div className="stat-info">
                  <h3>₹{getTotalRevenue()}</h3>
                  <p>Total Revenue</p>
                </div>
                <div className="stat-trend positive">
                  <TrendingUp size={14} />
                  <span>+8%</span>
                </div>
              </div>

              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <Users size={28} />
                </div>
                <div className="stat-info">
                  <h3>{getCustomerCount()}</h3>
                  <p>Customers</p>
                </div>
                <div className="stat-trend">
                  <TrendingUp size={14} />
                  <span>+5%</span>
                </div>
              </div>

              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <Star size={28} />
                </div>
                <div className="stat-info">
                  <h3>{reviews.filter(r => r.approved).length}</h3>
                  <p>Approved Reviews</p>
                </div>
                <div className="stat-trend">
                  <TrendingUp size={14} />
                  <span>+15%</span>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="recent-orders glass-card">
                <div className="card-header">
                  <h3>Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="view-all-btn">
                    <Eye size={14} />
                    View All
                  </button>
                </div>
                <div className="orders-table">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="order-row">
                      <div className="order-info">
                        <span className="order-id">#{order.id}</span>
                        <span className="order-customer">{order.shippingDetails?.name}</span>
                      </div>
                      <div className="order-meta">
                        <span className="order-date">{order.date}</span>
                        <span className={`order-status ${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="order-amount">₹{order.total}</span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="no-data">
                      <Package size={48} />
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions glass-card">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button onClick={() => setActiveTab('product')} className="action-btn">
                    <Package size={16} />
                    Update Product
                  </button>
                  <button onClick={() => setActiveTab('reviews')} className="action-btn">
                    <Star size={16} />
                    Moderate Reviews
                  </button>
                  <button onClick={() => setActiveTab('customers')} className="action-btn">
                    <Users size={16} />
                    View Customers
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Settings Tab */}
          {activeTab === 'product' && (
            <div className="product-settings">
              <form onSubmit={handleProductUpdate} className="settings-form glass-card">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={productData.name}
                    onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={productData.price}
                      onChange={(e) => setProductData({ ...productData, price: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      value={productData.stock}
                      onChange={(e) => setProductData({ ...productData, stock: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Scent Notes (comma separated)</label>
                  <input
                    type="text"
                    value={productData.notes}
                    onChange={(e) => setProductData({ ...productData, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="submit-button">
                  <Settings size={18} />
                  Update Product
                </button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-management">
              <div className="section-header">
                <h3>Order Management</h3>
                <p>Manage and track all customer orders</p>
              </div>

              {loading ? (
                <div className="loading-state">
                  <RefreshCw size={32} className="spinning" />
                  <p>Loading orders...</p>
                </div>
              ) : (
                <div className="orders-list-admin">
                  {getFilteredOrders().map((order) => (
                    <div key={order.id} className="order-card-admin glass-card">
                      <div className="order-header-admin">
                        <div className="order-basic-info">
                          <h4>Order #{order.id}</h4>
                          <div className="order-meta">
                            <span className="order-date">
                              <Calendar size={14} />
                              {order.date}
                            </span>
                            <span className={`order-status ${order.status}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="order-actions">
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="order-content">
                        <div className="order-items-admin">
                          <h5>Items Ordered:</h5>
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item-row">
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">x{item.quantity}</span>
                              <span className="item-price">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="order-customer-info">
                          <h5>Customer Details:</h5>
                          <div className="customer-details">
                            <p><User size={14} /> {order.shippingDetails?.name}</p>
                            <p><Mail size={14} /> {order.shippingDetails?.email}</p>
                            <p><Phone size={14} /> {order.shippingDetails?.phone}</p>
                            <p><MapPin size={14} /> {order.shippingDetails?.address}, {order.shippingDetails?.city}, {order.shippingDetails?.state} {order.shippingDetails?.pincode}</p>
                          </div>
                        </div>
                      </div>

                      <div className="order-footer-admin">
                        <div className="order-total-section">
                          <span className="order-total-label">Total Amount:</span>
                          <span className="order-total">₹{order.total}</span>
                        </div>
                        <div className="order-status-update">
                          <label>Update Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {getFilteredOrders().length === 0 && (
                    <div className="no-data">
                      <ShoppingCart size={64} />
                      <h3>No orders found</h3>
                      <p>{searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'No orders have been placed yet'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="users-management">
              <div className="section-header">
                <h3>User Management</h3>
                <p>Manage all registered users and their roles</p>
              </div>

              {loading ? (
                <div className="loading-state">
                  <RefreshCw size={32} className="spinning" />
                  <p>Loading users...</p>
                </div>
              ) : (
                <div className="users-list">
                  {users.map((user) => {
                    const userOrders = orders.filter(order => order.userId === user.id);
                    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
                    const lastOrder = userOrders.length > 0 ?
                      userOrders.sort((a, b) => new Date(b.createdAt?.toDate?.() || b.date) - new Date(a.createdAt?.toDate?.() || a.date))[0] : null;

                    return (
                      <div key={user.id} className="user-card glass-card">
                        <div className="user-header">
                          <div className="user-avatar">
                            {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="user-info">
                            <h4>{user.name || 'Unnamed User'}</h4>
                            <p className="user-email">
                              <Mail size={14} />
                              {user.email}
                            </p>
                            <div className="user-role">
                              <span className={`role-badge ${user.role || 'user'}`}>
                                {user.role === 'admin' ? 'Admin' : 'User'}
                              </span>
                            </div>
                          </div>
                          <div className="user-actions">
                            {user.role !== 'admin' && (
                              <button
                                className="promote-btn"
                                onClick={() => handleRoleChange(user.id, 'admin')}
                                title="Promote to Admin"
                              >
                                <Shield size={16} />
                              </button>
                            )}
                            {user.role === 'admin' && user.email !== 'admin@alh.com' && (
                              <button
                                className="demote-btn"
                                onClick={() => handleRoleChange(user.id, 'user')}
                                title="Demote to User"
                              >
                                <User size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="user-stats">
                          <div className="stat-item">
                            <ShoppingCart size={16} />
                            <span>{userOrders.length} Orders</span>
                          </div>
                          <div className="stat-item">
                            <DollarSign size={16} />
                            <span>₹{totalSpent} Spent</span>
                          </div>
                          <div className="stat-item">
                            <Calendar size={16} />
                            <span>
                              {user.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) || 'Unknown'}
                            </span>
                          </div>
                          <div className="stat-item">
                            <Clock size={16} />
                            <span>
                              {lastOrder ?
                                new Date(lastOrder.createdAt?.toDate?.() || lastOrder.date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short'
                                }) : 'Never'
                              }
                            </span>
                          </div>
                        </div>

                        {userOrders.length > 0 && (
                          <div className="user-recent-activity">
                            <h5>Recent Activity:</h5>
                            <div className="activity-list">
                              {userOrders.slice(0, 3).map((order) => (
                                <div key={order.id} className="activity-item">
                                  <span className="activity-type">Order</span>
                                  <span className="activity-id">#{order.id}</span>
                                  <span className="activity-amount">₹{order.total}</span>
                                  <span className={`activity-status ${order.status}`}>
                                    {order.status}
                                  </span>
                                  <span className="activity-date">
                                    {new Date(order.createdAt?.toDate?.() || order.date).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short'
                                    })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {users.length === 0 && (
                    <div className="no-data">
                      <Users size={64} />
                      <h3>No users found</h3>
                      <p>No users have registered yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="customers-management">
              <div className="section-header">
                <h3>Customer Management</h3>
                <p>View and manage registered customers</p>
              </div>

              {loading ? (
                <div className="loading-state">
                  <RefreshCw size={32} className="spinning" />
                  <p>Loading customers...</p>
                </div>
              ) : (
                <div className="customers-list">
                  {getFilteredReviews().map((customer) => {
                    const customerOrders = orders.filter(order => order.userId === customer.id);
                    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);

                    return (
                      <div key={customer.id} className="customer-card glass-card">
                        <div className="customer-header">
                          <div className="customer-avatar">
                            {customer.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="customer-info">
                            <h4>{customer.name || 'Unknown User'}</h4>
                            <p className="customer-email">
                              <Mail size={14} />
                              {customer.email}
                            </p>
                            <p className="customer-joined">
                              <Calendar size={14} />
                              Joined {customer.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                            </p>
                          </div>
                        </div>

                        <div className="customer-stats">
                          <div className="stat-item">
                            <ShoppingCart size={16} />
                            <span>{customerOrders.length} Orders</span>
                          </div>
                          <div className="stat-item">
                            <DollarSign size={16} />
                            <span>₹{totalSpent} Spent</span>
                          </div>
                          <div className="stat-item">
                            <Star size={16} />
                            <span>{customerOrders.length > 0 ? 'Active' : 'New'}</span>
                          </div>
                        </div>

                        {customerOrders.length > 0 && (
                          <div className="customer-recent-orders">
                            <h5>Recent Orders:</h5>
                            <div className="recent-orders-list">
                              {customerOrders.slice(0, 3).map((order) => (
                                <div key={order.id} className="mini-order">
                                  <span>#{order.id}</span>
                                  <span>{order.date}</span>
                                  <span>₹{order.total}</span>
                                  <span className={`status-badge ${order.status}`}>
                                    {order.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {getFilteredReviews().length === 0 && (
                    <div className="no-data">
                      <Users size={64} />
                      <h3>No customers found</h3>
                      <p>{searchTerm ? 'Try adjusting your search' : 'No customers have registered yet'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="reviews-management">
              <div className="section-header">
                <h3>Review Moderation</h3>
                <p>Approve or reject customer reviews</p>
              </div>

              {loading ? (
                <div className="loading-state">
                  <RefreshCw size={32} className="spinning" />
                  <p>Loading reviews...</p>
                </div>
              ) : (
                <div className="reviews-list-admin">
                  {getFilteredReviews().map((review) => (
                    <div key={review.id} className="review-card-admin glass-card">
                      <div className="review-header-admin">
                        <div className="review-info">
                          <h4>{review.name}</h4>
                          <div className="review-meta">
                            <div className="star-rating">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" />
                              ))}
                            </div>
                            <span className="review-date">
                              <Calendar size={14} />
                              {review.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                            </span>
                          </div>
                        </div>
                        <div className="review-actions">
                          {!review.approved && (
                            <button
                              className="approve-btn"
                              onClick={() => handleReviewAction(review.id, 'approve')}
                              title="Approve Review"
                            >
                              <Check size={16} />
                              Approve
                            </button>
                          )}
                          <button
                            className="delete-btn"
                            onClick={() => handleReviewAction(review.id, 'delete')}
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="review-content">
                        <p className="review-text-admin">"{review.text}"</p>
                        {review.approved && (
                          <span className="approved-badge">
                            <Check size={12} />
                            Approved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {getFilteredReviews().length === 0 && (
                    <div className="no-data">
                      <Star size={64} />
                      <h3>No reviews found</h3>
                      <p>{searchTerm ? 'Try adjusting your search' : 'No reviews have been submitted yet'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
