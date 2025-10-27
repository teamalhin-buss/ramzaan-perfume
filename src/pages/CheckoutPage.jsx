import { orderService } from '../services/firestore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, User, Mail, Phone, CheckCircle, Truck, Shield, Lock } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const keralaDistricts = [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
    'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
    'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
  ];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('checkoutFormData');
    const savedPaymentMethod = localStorage.getItem('checkoutPaymentMethod');
    const savedPromoCode = localStorage.getItem('checkoutPromoCode');
    const savedDiscount = localStorage.getItem('checkoutDiscount');
    const savedStep = localStorage.getItem('checkoutCurrentStep');

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        // Only load if user data hasn't changed
        if (!user?.name || parsedData.name === user.name) {
          setFormData(prevData => ({ ...prevData, ...parsedData }));
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod);
    }

    if (savedPromoCode) {
      setPromoCode(savedPromoCode);
    }

    if (savedDiscount) {
      setDiscount(parseFloat(savedDiscount) || 0);
    }

    if (savedStep) {
      setCurrentStep(parseInt(savedStep) || 0);
    }
  }, [user]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('checkoutPaymentMethod', paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    localStorage.setItem('checkoutPromoCode', promoCode);
  }, [promoCode]);

  useEffect(() => {
    localStorage.setItem('checkoutDiscount', discount.toString());
  }, [discount]);

  useEffect(() => {
    localStorage.setItem('checkoutCurrentStep', currentStep.toString());
  }, [currentStep]);

  // Clear localStorage on successful order completion
  const clearCheckoutData = () => {
    localStorage.removeItem('checkoutFormData');
    localStorage.removeItem('checkoutPaymentMethod');
    localStorage.removeItem('checkoutPromoCode');
    localStorage.removeItem('checkoutDiscount');
    localStorage.removeItem('checkoutCurrentStep');
  };

  const steps = ['Shipping Details', 'Payment Method', 'Review & Pay'];

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) newErrors.name = 'Name is required';
        else if (value.length < 2) newErrors.name = 'Name must be at least 2 characters';
        else delete newErrors.name;
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(value)) newErrors.email = 'Invalid email format';
        else delete newErrors.email;
        break;
      case 'phone':
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!value.trim()) newErrors.phone = 'Phone number is required';
        else if (!phoneRegex.test(value)) newErrors.phone = 'Invalid Indian phone number';
        else delete newErrors.phone;
        break;
      case 'district':
        if (!value.trim()) newErrors.district = 'District is required';
        else if (!keralaDistricts.includes(value)) newErrors.district = 'Please select a valid district';
        else delete newErrors.district;
        break;
      case 'pincode':
        const pincodeRegex = /^[1-9]\d{5}$/;
        if (!value.trim()) newErrors.pincode = 'Pincode is required';
        else if (!pincodeRegex.test(value)) newErrors.pincode = 'Invalid pincode';
        else delete newErrors.pincode;
        break;
      default:
        if (!value.trim()) newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        else delete newErrors[name];
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validate shipping form
      const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'district', 'pincode'];
      let hasErrors = false;
      requiredFields.forEach(field => {
        if (!formData[field].trim()) {
          validateField(field, '');
          hasErrors = true;
        }
      });
      if (hasErrors || Object.keys(errors).length > 0) return;
    }
    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(nextStep);
    trackCheckoutStep(nextStep);
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const applyPromoCode = () => {
    // Simple promo code logic - in real app, validate against backend
    if (promoCode.toLowerCase() === 'ramzaan10') {
      setDiscount(getCartTotal() * 0.1);
      // Track promo code usage
      if (typeof gtag !== 'undefined') {
        gtag('event', 'promo_code_applied', {
          event_category: 'checkout',
          event_label: 'ramzaan10',
          value: getCartTotal() * 0.1
        });
      }
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setDiscount(Math.min(getCartTotal() * 0.2, 500));
      if (typeof gtag !== 'undefined') {
        gtag('event', 'promo_code_applied', {
          event_category: 'checkout',
          event_label: 'welcome20',
          value: Math.min(getCartTotal() * 0.2, 500)
        });
      }
    } else {
      alert('Invalid promo code');
      setDiscount(0);
    }
  };

  // Track checkout steps
  const trackCheckoutStep = (step) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'checkout_progress', {
        event_category: 'checkout',
        event_label: `step_${step + 1}`,
        value: step + 1
      });
    }
  };

  // Track when user reaches payment
  const trackPaymentAttempt = (method) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'begin_checkout', {
        event_category: 'ecommerce',
        items: cartItems.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        value: getCartTotal() - discount,
        currency: 'INR',
        payment_method: method
      });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const finalTotal = getCartTotal() - discount;
      trackPaymentAttempt(paymentMethod);

      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        const orderId = 'ORD' + Date.now();
        const orderData = {
          id: orderId,
          userId: user?.id || 'guest',
          userName: formData.name,
          userEmail: formData.email,
          items: cartItems,
          total: finalTotal,
          discount: discount,
          date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          createdAt: new Date().toISOString(),
          status: 'pending',
          paymentMethod: 'Cash on Delivery',
          shippingDetails: formData,
        };

        const orderResult = await orderService.createOrder(orderData);
        if (!orderResult.success) {
          throw new Error('Failed to save order');
        }

        // Track successful COD order
        if (typeof gtag !== 'undefined') {
          gtag('event', 'purchase', {
            event_category: 'ecommerce',
            transaction_id: orderId,
            value: finalTotal,
            currency: 'INR',
            items: cartItems.map(item => ({
              item_id: item.id,
              item_name: item.name,
              price: item.price,
              quantity: item.quantity
            }))
          });
        }

        clearCart();
        clearCheckoutData();
        navigate('/order-confirmation', { state: { order: orderData } });
        return;
      }

      // Razorpay Integration
      const options = {
        key: 'rzp_live_RONRvyhhsshRSc', // Replace with your Razorpay key
        amount: finalTotal * 100, // Amount in paise
        currency: 'INR',
        name: 'ALH Perfumes',
        description: 'Ramzaan Perfume Purchase',
        image: ASSETS.product.main,
        handler: async function (response) {
          try {
            const orderId = 'ORD' + Date.now();
            const orderData = {
              id: orderId,
              userId: user?.id || 'guest',
              userName: formData.name,
              userEmail: formData.email,
              items: cartItems,
              total: finalTotal,
              discount: discount,
              date: new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }),
              createdAt: new Date().toISOString(),
              status: 'paid',
              paymentId: response.razorpay_payment_id,
              paymentMethod: paymentMethod === 'upi' ? 'UPI' : 'Razorpay',
              shippingDetails: formData,
            };

            const orderResult = await orderService.createOrder(orderData);
            if (!orderResult.success) {
              console.error('Failed to save order:', orderResult.error);
              alert('Payment successful but order saving failed. Please contact support.');
              return;
            }

            // Track successful payment
            if (typeof gtag !== 'undefined') {
              gtag('event', 'purchase', {
                event_category: 'ecommerce',
                transaction_id: orderId,
                value: finalTotal,
                currency: 'INR',
                payment_method: paymentMethod,
                items: cartItems.map(item => ({
                  item_id: item.id,
                  item_name: item.name,
                  price: item.price,
                  quantity: item.quantity
                }))
              });
            }

            clearCart();
            clearCheckoutData();
            navigate('/order-confirmation', { state: { order: orderData } });
          } catch (error) {
            console.error('Order processing error:', error);
            alert('Payment successful but order processing failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#F8D57E',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            // Track payment abandonment
            if (typeof gtag !== 'undefined') {
              gtag('event', 'payment_abandoned', {
                event_category: 'checkout',
                event_label: paymentMethod
              });
            }
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);

      // Track payment failure
      if (typeof gtag !== 'undefined') {
        gtag('event', 'payment_failed', {
          event_category: 'checkout',
          event_label: paymentMethod
        });
      }
    }
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
          <h2 className="section-title">Secure Checkout</h2>

          {/* Progress Indicator */}
          <div className="checkout-progress">
            {steps.map((step, index) => (
              <div key={step} className={`progress-step ${index <= currentStep ? 'active' : ''}`}>
                <div className="step-number">{index + 1}</div>
                <span className="step-label">{step}</span>
              </div>
            ))}
          </div>

          <div className="checkout-grid">
            {/* Main Content Area */}
            <div className="checkout-main">
              {currentStep === 0 && (
                <div className="checkout-form glass-card">
                  <h3>Shipping Details</h3>
                  <form>
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
                          placeholder="Enter your name"
                          className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
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
                          placeholder="Enter your email"
                          className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
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
                        placeholder="Enter your phone number"
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
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
                        placeholder="Enter your address"
                        rows="3"
                        className={errors.address ? 'error' : ''}
                      ></textarea>
                      {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          className={errors.city ? 'error' : ''}
                        />
                        {errors.city && <span className="error-message">{errors.city}</span>}
                      </div>

                      <div className="form-group">
                        <label>District</label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          className={errors.district ? 'error' : ''}
                        >
                          <option value="">Select District</option>
                          {keralaDistricts.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                        {errors.district && <span className="error-message">{errors.district}</span>}
                      </div>

                      <div className="form-group">
                        <label>Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="Pincode"
                          className={errors.pincode ? 'error' : ''}
                        />
                        {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                      </div>
                    </div>

                    <button type="button" className="glow-button next-button" onClick={handleNext}>
                      Continue to Payment
                    </button>
                  </form>
                </div>
              )}

              {currentStep === 1 && (
                <div className="checkout-form glass-card">
                  <h3>Payment Method</h3>
                  <div className="payment-methods">
                    <div
                      className={`payment-option ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('razorpay')}
                    >
                      <CreditCard size={24} />
                      <div>
                        <h4>Razorpay (Credit/Debit Card, Net Banking)</h4>
                        <p>Secure payment gateway</p>
                      </div>
                    </div>
                    <div
                      className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <CreditCard size={24} />
                      <div>
                        <h4>UPI</h4>
                        <p>Pay using UPI apps like GPay, PhonePe</p>
                      </div>
                    </div>
                    <div
                      className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <Truck size={24} />
                      <div>
                        <h4>Cash on Delivery</h4>
                        <p>Pay when you receive your order</p>
                      </div>
                    </div>
                  </div>

                  <div className="step-buttons">
                    <button type="button" className="back-button" onClick={handlePrev}>
                      Back
                    </button>
                    <button type="button" className="glow-button next-button" onClick={handleNext}>
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="checkout-form glass-card">
                  <h3>Review & Pay</h3>

                  {/* Promo Code */}
                  <div className="promo-section">
                    <div className="promo-input-group">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <button type="button" onClick={applyPromoCode} className="apply-promo">
                        Apply
                      </button>
                    </div>
                    {discount > 0 && (
                      <div className="discount-applied">
                        <CheckCircle size={16} />
                        Discount applied: ₹{discount}
                      </div>
                    )}
                  </div>

                  {/* Trust Signals */}
                  <div className="trust-signals">
                    <div className="trust-item">
                      <Shield size={20} />
                      <span>SSL Secured</span>
                    </div>
                    <div className="trust-item">
                      <Lock size={20} />
                      <span>Secure Payment</span>
                    </div>
                    <div className="trust-item">
                      <Truck size={20} />
                      <span>Free Shipping</span>
                    </div>
                  </div>

                  <form onSubmit={handlePayment}>
                    <button
                      type="submit"
                      className="glow-button pay-button"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="spinner"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          {paymentMethod === 'cod' ? 'Place Order' : 'Pay'} ₹{getCartTotal() - discount}
                        </>
                      )}
                    </button>
                  </form>

                  <div className="step-buttons">
                    <button type="button" className="back-button" onClick={handlePrev}>
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="order-summary glass-card sticky-summary">
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
                {discount > 0 && (
                  <div className="total-row discount">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>₹{getCartTotal() - discount}</span>
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
