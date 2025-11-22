import { useState } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle, Lock } from 'lucide-react';
import './SecureInput.css';

const SecureInput = ({
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    label,
    icon: Icon,
    error,
    success,
    helperText,
    required = false,
    maxLength,
    autoComplete,
    disabled = false,
    secure = false,
    validationStatus,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const handleChange = (e) => {
        let sanitizedValue = e.target.value;

        // Input sanitization based on type
        switch (type) {
            case 'tel':
            case 'phone':
                // Only allow digits
                sanitizedValue = sanitizedValue.replace(/\D/g, '');
                break;
            case 'text':
                // Remove potentially harmful characters
                sanitizedValue = sanitizedValue.replace(/[<>]/g, '');
                break;
            case 'email':
                // Trim whitespace
                sanitizedValue = sanitizedValue.trim().toLowerCase();
                break;
            case 'number':
                // Only allow numbers and decimal point
                sanitizedValue = sanitizedValue.replace(/[^\d.]/g, '');
                break;
            default:
                break;
        }

        onChange({
            ...e,
            target: {
                ...e.target,
                name,
                value: sanitizedValue
            }
        });
    };

    const getValidationIcon = () => {
        if (validationStatus === 'valid') return <Check size={18} className="validation-icon valid" />;
        if (validationStatus === 'invalid') return <X size={18} className="validation-icon invalid" />;
        if (validationStatus === 'checking') return <AlertCircle size={18} className="validation-icon checking" />;
        return null;
    };

    return (
        <div className={`secure-input-wrapper ${error ? 'has-error' : ''} ${success ? 'has-success' : ''} ${isFocused ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}>
            {label && (
                <label htmlFor={name} className="secure-input-label">
                    {Icon && <Icon size={16} />}
                    {label}
                    {required && <span className="required-indicator">*</span>}
                    {secure && <Lock size={12} className="secure-indicator" title="Secure encrypted field" />}
                </label>
            )}

            <div className="secure-input-container">
                {Icon && !label && (
                    <div className="input-icon-left">
                        <Icon size={18} />
                    </div>
                )}

                <input
                    id={name}
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        setIsFocused(false);
                        if (onBlur) onBlur(e);
                    }}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    className={`secure-input ${Icon && !label ? 'with-left-icon' : ''} ${validationStatus ? 'with-validation' : ''}`}
                    {...props}
                />

                <div className="input-icons-right">
                    {type === 'password' && (
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                    {getValidationIcon()}
                </div>

                {/* Progress bar for loading/validation */}
                {value && !error && !success && (
                    <div className="input-progress-bar" />
                )}
            </div>

            {/* Helper text or error message */}
            {error && (
                <div className="input-message error-message-secure">
                    <X size={14} />
                    <span>{error}</span>
                </div>
            )}

            {success && !error && (
                <div className="input-message success-message-secure">
                    <Check size={14} />
                    <span>{success}</span>
                </div>
            )}

            {helperText && !error && !success && (
                <div className="input-message helper-text-secure">
                    <AlertCircle size={14} />
                    <span>{helperText}</span>
                </div>
            )}

            {/* Character count for fields with maxLength */}
            {maxLength && value && (
                <div className="character-count">
                    {value.length}/{maxLength}
                </div>
            )}
        </div>
    );
};

export default SecureInput;
