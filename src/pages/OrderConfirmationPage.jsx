import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <Header />
        <div className="container">
          <div className="error-message">
            <p>Order details not found. Please check your orders.</p>
            <button className="glow-button" onClick={() => navigate('/account')}>
              Go to My Orders
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <Header />
      <div className="confirmation-container">
        <div className="container">
          <div className="confirmation-card glass-card">
            <div className="confirmation-header">
              <CheckCircle size={64} className="success-icon" />
              <h2>Thank You for Your Order!</h2>
              <p>Your order has been placed successfully.</p>
            </div>

            <div className="order-details">
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                <div className="order-meta">
                  <span className="order-date">
                    <Calendar size={16} />
                    {order.date}
                  </span>
                  <span className={`order-status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-sections">
                <div className="order-section">
                  <h4>
                    <Package size={20} />
                    Order Items
                  </h4>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                          <h5>{item.name}</h5>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <div className="item-price">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Total: ₹{order.total}</span>
                  </div>
                </div>

                <div className="order-section">
                  <h4>
                    <MapPin size={20} />
                    Shipping Details
                  </h4>
                  <div className="shipping-info">
                    <p><strong>{order.shippingDetails.name}</strong></p>
                    <p>{order.shippingDetails.address}</p>
                    <p>{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}</p>
                    <p>{order.shippingDetails.phone}</p>
                    <p>{order.shippingDetails.email}</p>
                  </div>
                </div>

                <div className="order-section">
                  <h4>
                    <CreditCard size={20} />
                    Payment Details
                  </h4>
                  <div className="payment-info">
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p><strong>Payment ID:</strong> {order.paymentId}</p>
                    <p><strong>Amount Paid:</strong> ₹{order.total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="confirmation-actions">
              <button className="glow-button" onClick={() => navigate('/account')}>
                View My Orders
              </button>
              <button className="secondary-button" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;