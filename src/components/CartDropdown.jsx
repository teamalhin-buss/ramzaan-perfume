import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartDropdown.css';

const CartDropdown = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-dropdown">
        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <span className="cart-count">0 items</span>
        </div>
        <div className="cart-empty">
          <ShoppingBag size={48} strokeWidth={1} />
          <p>Your cart is empty</p>
          <span className="cart-empty-hint">Add items to get started</span>
        </div>
      </div>
    );
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const savings = cartItems.reduce((sum, item) => sum + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0);

  return (
    <div className="cart-dropdown">
      {/* Cart Header */}
      <div className="cart-header">
        <h3>Shopping Cart</h3>
        <span className="cart-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h4 className="cart-item-name">{item.name}</h4>
              <p className="cart-item-price">
                ₹{item.price}
                {item.originalPrice && (
                  <span className="cart-item-original">₹{item.originalPrice}</span>
                )}
              </p>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="cart-item-total">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button 
              className="remove-button"
              onClick={() => removeFromCart(item.id)}
              aria-label="Remove item"
              title="Remove from cart"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Cart Footer */}
      <div className="cart-footer">
        {/* Savings Display */}
        {savings > 0 && (
          <div className="cart-savings">
            <span>You saved:</span>
            <span className="savings-amount">₹{savings.toFixed(2)}</span>
          </div>
        )}

        {/* Subtotal */}
        <div className="cart-subtotal">
          <span>Subtotal:</span>
          <span className="subtotal-amount">₹{getCartTotal().toFixed(2)}</span>
        </div>

        {/* Shipping Info */}
        <div className="cart-shipping-info">
          {getCartTotal() >= 999 ? (
            <span className="free-shipping">✓ Free shipping eligible</span>
          ) : (
            <span className="shipping-progress">
              Add ₹{(999 - getCartTotal()).toFixed(2)} more for free shipping
            </span>
          )}
        </div>

        {/* Checkout Button */}
        <Link to="/checkout" className="checkout-button">
          <span>Proceed to Checkout</span>
          <span className="checkout-arrow">→</span>
        </Link>
        
        {/* Continue Shopping */}
        <Link to="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartDropdown;
