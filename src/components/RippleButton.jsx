import { useState } from 'react';
import './RippleButton.css';

const RippleButton = ({
    children,
    onClick,
    className = '',
    variant = 'primary',
    disabled = false,
    ...props
}) => {
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
        if (disabled) return;

        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple = {
            x,
            y,
            size,
            id: Date.now()
        };

        setRipples([...ripples, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples(ripples => ripples.filter(r => r.id !== newRipple.id));
        }, 800);

        if (onClick) onClick(e);
    };

    return (
        <button
            className={`ripple-button ripple-button-${variant} ${className} ${disabled ? 'disabled' : ''}`}
            onClick={handleClick}
            disabled={disabled}
            {...props}
        >
            {children}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size
                    }}
                />
            ))}
        </button>
    );
};

export default RippleButton;
