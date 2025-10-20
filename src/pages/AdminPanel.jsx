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
  BarChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productData, setProductData] = useState({
    name: 'Ramzaan',
    price: 1499,
    stock: 50,
    description: 'Experience timeless elegance in every drop',
    notes: 'Oud, Amber, Musk',
  });

  useEffect(() => {
    if (!isAdmin) {
      alert('Access denied. Admin only.');
      navigate('/account');
      return;
    }

    // Load data from Firestore
    const loadData = async () => {
      // Load orders
      const ordersResult = await orderService.getAllOrders();
      if (ordersResult.success) {
        setOrders(ordersResult.data);
      }

      // Load reviews
      const reviewsResult = await reviewService.getAllReviews();
      if (reviewsResult.success) {
        setReviews(reviewsResult.data);
      }

      // Load product data
      const productResult = await productService.getProduct();
      if (productResult.success) {
        setProductData(productResult.data);
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
    const result = await orderService.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } else {
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
      } else {
        alert('Failed to delete review: ' + result.error);
      }
    } else if (action === 'approve') {
      const result = await reviewService.approveReview(reviewId);
      if (result.success) {
        const updatedReviews = reviews.map(review =>
          review.id === reviewId ? { ...review, approved: true } : review
        );
        setReviews(updatedReviews);
      } else {
        alert('Failed to approve review: ' + result.error);
      }
    }
  };

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  };

  const getCustomerCount = async () => {
    const result = await userService.getAllUsers();
    return result.success ? result.data.length : 0;
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
            className={activeTab === 'product' ? 'active' : ''}
            onClick={() => setActiveTab('product')}
          >
            <Package size={20} />
            Product Settings
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <Settings size={20} />
            Orders
          </button>
          <button
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={20} />
            Reviews
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
          <h1>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'product' && 'Product Settings'}
            {activeTab === 'orders' && 'Order Management'}
            {activeTab === 'reviews' && 'Review Moderation'}
          </h1>
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
                  <Package size={28} />
                </div>
                <div className="stat-info">
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
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
              </div>

              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <Users size={28} />
                </div>
                <div className="stat-info">
                  <h3>{getCustomerCount()}</h3>
                  <p>Customers</p>
                </div>
              </div>

              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <Star size={28} />
                </div>
                <div className="stat-info">
                  <h3>{reviews.length}</h3>
                  <p>Reviews</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="recent-orders glass-card">
                <h3>Recent Orders</h3>
                <div className="orders-table">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="order-row">
                      <span className="order-id">#{order.id}</span>
                      <span className="order-date">{order.date}</span>
                      <span className={`order-status ${order.status}`}>
                        {order.status}
                      </span>
                      <span className="order-amount">₹{order.total}</span>
                    </div>
                  ))}
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
              <div className="orders-list-admin">
                {orders.map((order) => (
                  <div key={order.id} className="order-card-admin glass-card">
                    <div className="order-header-admin">
                      <div>
                        <h4>Order #{order.id}</h4>
                        <p className="order-date">{order.date}</p>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="order-items-admin">
                      {order.items.map((item, index) => (
                        <p key={index}>{item.name} x {item.quantity}</p>
                      ))}
                    </div>

                    <div className="order-shipping">
                      <p><strong>Customer:</strong> {order.shippingDetails?.name}</p>
                      <p><strong>Email:</strong> {order.shippingDetails?.email}</p>
                      <p><strong>Phone:</strong> {order.shippingDetails?.phone}</p>
                      <p><strong>Address:</strong> {order.shippingDetails?.address}, {order.shippingDetails?.city}</p>
                    </div>

                    <div className="order-footer-admin">
                      <span className="order-total">₹{order.total}</span>
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
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="reviews-management">
              <div className="reviews-list-admin">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card-admin glass-card">
                    <div className="review-header-admin">
                      <div>
                        <h4>{review.name}</h4>
                        <div className="star-rating">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <div className="review-actions">
                        {!review.approved && (
                          <button
                            className="approve-btn"
                            onClick={() => handleReviewAction(review.id, 'approve')}
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          className="delete-btn"
                          onClick={() => handleReviewAction(review.id, 'delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="review-text-admin">{review.text}</p>
                    {review.approved && (
                      <span className="approved-badge">Approved</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
