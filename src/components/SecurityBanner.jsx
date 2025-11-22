import { Shield, Lock, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import './SecurityBanner.css';

const SecurityBanner = ({ variant = 'default', message, details }) => {
    const variants = {
        default: {
            icon: Shield,
            title: 'Secure Checkout',
            description: 'Your information is encrypted and secure',
            color: 'gold'
        },
        ssl: {
            icon: Lock,
            title: 'SSL Encrypted',
            description: '256-bit encryption protecting your data',
            color: 'green'
        },
        verified: {
            icon: CheckCircle,
            title: 'Payment Verified',
            description: 'Secured by Razorpay',
            color: 'green'
        },
        warning: {
            icon: AlertTriangle,
            title: 'Attention Required',
            description: message || 'Please verify your details',
            color: 'orange'
        },
        info: {
            icon: Info,
            title: 'Important Information',
            description: message || '',
            color: 'blue'
        }
    };

    const config = variants[variant] || variants.default;
    const Icon = config.icon;

    return (
        <div className={`security-banner security-banner-${config.color}`}>
            <div className="security-banner-icon">
                <Icon size={24} />
            </div>
            <div className="security-banner-content">
                <div className="security-banner-title">{message || config.title}</div>
                <div className="security-banner-description">{details || config.description}</div>
            </div>
            <div className="security-banner-badge">
                <Lock size={12} />
            </div>
        </div>
    );
};

export const SecurityFeatures = () => {
    const features = [
        {
            icon: Lock,
            title: 'SSL Encrypted',
            description: 'All data transmitted is encrypted'
        },
        {
            icon: Shield,
            title: 'Secure Payment',
            description: 'PCI-DSS compliant processing'
        },
        {
            icon: CheckCircle,
            title: 'Safe & Trusted',
            description: 'No card details stored'
        }
    ];

    return (
        <div className="security-features">
            <div className="security-features-title">
                <Shield size={16} />
                <span>Your Security is Our Priority</span>
            </div>
            <div className="security-features-grid">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div key={index} className="security-feature-item">
                            <div className="security-feature-icon">
                                <Icon size={18} />
                            </div>
                            <div className="security-feature-content">
                                <div className="security-feature-title">{feature.title}</div>
                                <div className="security-feature-description">{feature.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SecurityBanner;
