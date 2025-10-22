import Header from '../components/Header';
import Footer from '../components/Footer';
import './TermsPage.css';

const TermsPage = () => {
  return (
    <div className="terms-page">
      <Header />
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">Terms & Conditions</h1>
          <p className="section-subtitle">Last Updated: 22 October 2025</p>
        </div>

        <div className="terms-content">
          <div className="terms-intro">
            <p>
              Welcome to <strong>ALH.</strong> ("we," "our," or "us"). By accessing or using our website
              <strong> alh.netlify.app / alhdot.in</strong> ("Website"), you agree to comply with and be bound by these Terms & Conditions.
              Please read carefully.
            </p>
          </div>

          <div className="terms-section">
            <h2>1. Use of Website</h2>
            <p>
              You agree to use this Website only for lawful purposes. Any activity that harms the Website, its users, or its content is strictly prohibited.
            </p>
          </div>

          <div className="terms-section">
            <h2>2. Intellectual Property</h2>
            <p>
              All content, logos, product names, and images on this Website are the property of <strong>ALH.</strong> You may not copy, reproduce, distribute, or create derivative works without prior written consent.
            </p>
          </div>

          <div className="terms-section">
            <h2>3. Products and Services</h2>
            <p>
              <strong>ALH.</strong> sells perfumes online. We make every effort to provide accurate product descriptions, images, and pricing. However, we do not guarantee that all information is error-free. We reserve the right to modify or discontinue products at any time without prior notice.
            </p>
          </div>

          <div className="terms-section">
            <h2>4. Payment</h2>
            <p>
              All payments are processed securely through <strong>Razorpay</strong>. By making a purchase, you agree to provide accurate payment information. Orders will be processed only after successful payment confirmation.
            </p>
          </div>

          <div className="terms-section">
            <h2>5. Shipping and Delivery</h2>
            <p>
              Products are shipped within <strong>Kerala</strong> via <strong>India Post</strong>. Delivery times are estimates; delays caused by courier services are not the responsibility of <strong>ALH.</strong>
            </p>
          </div>

          <div className="terms-section">
            <h2>6. Returns and Refunds</h2>
            <p>
              Returns are accepted for:
            </p>
            <ul>
              <li>Damaged items</li>
              <li>Wrong products</li>
              <li>Any reason within <strong>7 days</strong> of delivery</li>
            </ul>
            <p>
              Refunds will be issued after the returned product is received and inspected. Return shipping costs are borne by the customer unless the item is defective or incorrect.
            </p>
          </div>

          <div className="terms-section">
            <h2>7. Limitation of Liability</h2>
            <p>
              <strong>ALH.</strong> is not liable for any direct, indirect, incidental, or consequential loss arising from the use of the Website or purchase of products.
            </p>
          </div>

          <div className="terms-section">
            <h2>8. Privacy Policy (Short Version)</h2>
            <p>
              We collect personal information such as name, address, email, and payment details solely for order processing and service improvement. Data will not be shared with third parties except as required for payment processing or delivery. By using the Website, you consent to this collection and use.
            </p>
          </div>

          <div className="terms-section">
            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Updates will be posted on this page with a revised "Last Updated" date.
            </p>
          </div>

          <div className="terms-section">
            <h2>10. Contact Information</h2>
            <p>
              For queries or concerns regarding these Terms, contact us at:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:help.alh.in@gmail.com">help.alh.in@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;