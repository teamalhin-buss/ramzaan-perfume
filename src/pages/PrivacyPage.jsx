import Header from '../components/Header';
import Footer from '../components/Footer';
import './PrivacyPage.css';

const PrivacyPage = () => {
  return (
    <div className="privacy-page">
      <Header />
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">Privacy Policy</h1>
          <p className="section-subtitle">Last Updated: 22 October 2025</p>
        </div>

        <div className="privacy-content">
          <div className="privacy-intro">
            <p>
              Welcome to <strong>ALH.</strong> This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
              <strong> alh.netlify.app / alhdot.in</strong> and use our services.
            </p>
          </div>

          <div className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the website includes:</p>

            <h3>Personal Data</h3>
            <p>
              Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the website or when you choose to participate in various activities related to the website, such as online chat and message boards.
            </p>

            <h3>Derivative Data</h3>
            <p>
              Information our servers automatically collect when you access the website, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the website.
            </p>

            <h3>Financial Data</h3>
            <p>
              Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the website.
            </p>

            <h3>Data from Social Networks</h3>
            <p>
              User information from social networking sites, such as Facebook, Google+, Instagram, Pinterest, Twitter, including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks.
            </p>
          </div>

          <div className="privacy-section">
            <h2>2. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the website to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Process your transactions and send you related information, including purchase confirmations and invoices</li>
              <li>Send you technical notices, updates, security alerts, and support and administrative messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Communicate with you about products, services, offers, and events offered by ALH and others, and provide news and information we think will be of interest to you</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our website</li>
              <li>Personalize and improve the website and provide advertising, content, or features that match user profiles or interests</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>3. Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>

            <h3>By Law or to Protect Rights</h3>
            <p>
              If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
            </p>

            <h3>Third-Party Service Providers</h3>
            <p>
              We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </p>

            <h3>Marketing Communications</h3>
            <p>
              With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.
            </p>

            <h3>Interactions with Other Users</h3>
            <p>
              If you interact with other users of the website, those users may see your name, profile photo, and descriptions of your activity.
            </p>

            <h3>Online Postings</h3>
            <p>
              When you post comments, contributions, or other content to the website, your posts may be viewed by all users and may be publicly distributed outside the website in perpetuity.
            </p>

            <h3>Business Transfers</h3>
            <p>
              We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </p>

            <h3>Affiliates</h3>
            <p>
              We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.
            </p>
          </div>

          <div className="privacy-section">
            <h2>4. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </div>

          <div className="privacy-section">
            <h2>5. Policy for Children</h2>
            <p>
              We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
            </p>
          </div>

          <div className="privacy-section">
            <h2>6. Options Regarding Your Information</h2>
            <p>You have several options regarding the use of information on our website:</p>
            <ul>
              <li>You can always opt not to disclose information, even though it may be needed to take advantage of certain website features</li>
              <li>You can set your browser to remove or reject browser cookies, with the drawback that certain features of the website may not function properly without the aid of cookies</li>
              <li>If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by contacting us using the contact information provided below</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>7. Contact Information</h2>
            <p>For queries or concerns regarding this Privacy Policy, contact us at:</p>
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

export default PrivacyPage;