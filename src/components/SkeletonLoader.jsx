import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'product' }) => {
    if (type === 'product') {
        return (
            <div className="skeleton-product">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-subtitle"></div>
                    <div className="skeleton-rating"></div>
                    <div className="skeleton-price"></div>
                    <div className="skeleton-button"></div>
                </div>
            </div>
        );
    }

    if (type === 'review') {
        return (
            <div className="skeleton-review">
                <div className="skeleton-review-header">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-name"></div>
                </div>
                <div className="skeleton-stars"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
            </div>
        );
    }

    return null;
};

export default SkeletonLoader;
