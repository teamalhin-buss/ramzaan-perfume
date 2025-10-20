import { orderService } from '../services/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ASSETS } from '../config/assets';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Razorpay Integration
    const options = {
      key: 'rzp_live_RONRvyhhsshRSc', // Replace with your Razorpay key
      amount: getCartTotal() * 100, // Amount in paise
      currency: 'INR',
      name: 'ALH Perfumes',
      description: 'Ramzaan Perfume Purchase',
      image: ASSETS.product.main,
      handler: async function (response) {
        // Payment successful
        const order = {
          id: 'ORD' + Date.now(),
          userId: user?.id || 'guest',
          userName: formData.name,
          userEmail: formData.email,
          items: cartItems,
          total: getCartTotal(),
          date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          createdAt: new Date().toISOString(),
          status: 'pending',
          paymentId: response.razorpay_payment_id,
          paymentMethod: 'Razorpay',
          shippingDetails: formData,
        };

        // Save order to Firestore
        const orderResult = await orderService.createOrder(order);
        if (!orderResult.success) {
          console.error('Failed to save order:', orderResult.error);
          alert('Payment successful but order saving failed. Please contact support.');
          return;
        }

        clearCart();
        alert('✅ Payment successful! Your order has been placed.\n\nOrder ID: ' + order.id);
        navigate('/account');
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#F8D57E',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="empty-cart-container">
          <div className="container">
            <div className="empty-cart glass-card">
              <h2>Your cart is empty</h2>
              <p>Add some products to checkout</p>
              <button className="glow-button" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header />
      <div className="checkout-container">
        <div className="container">
          <h2 className="section-title">Checkout</h2>

          <div className="checkout-grid">
            {/* Shipping Form */}
            <div className="checkout-form glass-card">
              <h3>Shipping Details</h3>
              <form onSubmit={handlePayment}>
                <div className="form-row">
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
                      required
                      placeholder="Enter your name"
                    />
                  </div>

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
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={18} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <MapPin size={18} />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter your address"
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder="State"
                    />
                  </div>

                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <button type="submit" className="glow-button pay-button">
                  <CreditCard size={20} />
                  Pay ₹{getCartTotal()}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="order-summary glass-card">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>₹{getCartTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
