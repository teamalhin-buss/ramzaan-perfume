import { useState, useEffect } from 'react';
import SecureInput from './SecureInput';
import { User, Phone, Mail, Home, Building, MapPin, Mail as MailIcon } from 'lucide-react';
import './IndiaPostAddressForm.css';

// India Post pincode to state mapping (sample - expand as needed)
const pincodeToState = {
    // Kerala (67xxxx - 69xxxx)
    '67': 'Kerala', '68': 'Kerala', '69': 'Kerala',
    // Tamil Nadu (60xxxx - 64xxxx)
    '60': 'Tamil Nadu', '61': 'Tamil Nadu', '62': 'Tamil Nadu', '63': 'Tamil Nadu', '64': 'Tamil Nadu',
    // Karnataka (56xxxx - 59xxxx)
    '56': 'Karnataka', '57': 'Karnataka', '58': 'Karnataka', '59': 'Karnataka',
    // Maharashtra (40xxxx - 44xxxx)
    '40': 'Maharashtra', '41': 'Maharashtra', '42': 'Maharashtra', '43': 'Maharashtra', '44': 'Maharashtra',
    // Delhi (11xxxx)
    '11': 'Delhi',
    // Uttar Pradesh (20xxxx - 28xxxx)
    '20': 'Uttar Pradesh', '21': 'Uttar Pradesh', '22': 'Uttar Pradesh', '23': 'Uttar Pradesh',
    '24': 'Uttar Pradesh', '25': 'Uttar Pradesh', '26': 'Uttar Pradesh', '27': 'Uttar Pradesh', '28': 'Uttar Pradesh',
    // Add more states as needed
};

const IndiaPostAddressForm = ({ formData, setFormData, errors, setErrors }) => {
    const [detectedState, setDetectedState] = useState('');
    const [pincodeInfo, setPincodeInfo] = useState(null);

    // Detect state from pincode
    useEffect(() => {
        if (formData.pincode && formData.pincode.length >= 2) {
            const prefix = formData.pincode.substring(0, 2);
            const state = pincodeToState[prefix];
            if (state) {
                setDetectedState(state);
                setFormData(prev => ({ ...prev, state: state }));
            }
        }
    }, [formData.pincode]);

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'recipientName':
                if (!value.trim()) {
                    newErrors.recipientName = 'Recipient name is required for delivery';
                } else if (value.length < 2) {
                    newErrors.recipientName = 'Name must be at least 2 characters';
                } else if (!/^[a-zA-Z\s.]+$/.test(value.trim())) {
                    newErrors.recipientName = 'Only letters, spaces, and dots allowed';
                } else {
                    delete newErrors.recipientName;
                }
                break;

            case 'houseNumber':
                if (!value.trim()) {
                    newErrors.houseNumber = 'House/Flat number is required';
                } else if (value.length < 1) {
                    newErrors.houseNumber = 'Please enter valid house/flat number';
                } else {
                    delete newErrors.houseNumber;
                }
                break;

            case 'buildingName':
                // Optional but validate if provided
                if (value && value.length > 0 && value.length < 2) {
                    newErrors.buildingName = 'Building name should be at least 2 characters';
                } else {
                    delete newErrors.buildingName;
                }
                break;

            case 'streetName':
                if (!value.trim()) {
                    newErrors.streetName = 'Street/Road name is required';
                } else if (value.length < 3) {
                    newErrors.streetName = 'Street name should be at least 3 characters';
                } else {
                    delete newErrors.streetName;
                }
                break;

            case 'locality':
                if (!value.trim()) {
                    newErrors.locality = 'Area/Locality is required';
                } else if (value.length < 2) {
                    newErrors.locality = 'Locality should be at least 2 characters';
                } else {
                    delete newErrors.locality;
                }
                break;

            case 'city':
                if (!value.trim()) {
                    newErrors.city = 'City/Town/Village name is required';
                } else if (value.length < 2) {
                    newErrors.city = 'City name should be at least 2 characters';
                } else {
                    delete newErrors.city;
                }
                break;

            case 'district':
                if (!value.trim()) {
                    newErrors.district = 'District is required';
                } else {
                    delete newErrors.district;
                }
                break;

            case 'pincode':
                const pincodeRegex = /^[1-9]\d{5}$/;
                if (!value.trim()) {
                    newErrors.pincode = 'Pincode is required';
                } else if (!pincodeRegex.test(value)) {
                    newErrors.pincode = 'Please enter a valid 6-digit Indian pincode';
                } else {
                    delete newErrors.pincode;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    newErrors.email = 'Email is required for delivery updates';
                } else if (!emailRegex.test(value)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;

            case 'phone':
                const phoneRegex = /^[6-9]\d{9}$/;
                if (!value.trim()) {
                    newErrors.phone = 'Mobile number is required';
                } else if (!phoneRegex.test(value)) {
                    newErrors.phone = 'Enter valid 10-digit mobile number (starting with 6-9)';
                } else {
                    delete newErrors.phone;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Debounced validation
        setTimeout(() => {
            validateField(name, value);
        }, 300);
    };

    return (
        <div className="india-post-address-form">
            {/* India Post Header */}
            <div className="india-post-header">
                <div className="india-post-logo">
                    <MailIcon size={24} />
                </div>
                <div className="india-post-title">
                    <h4>Delivery via India Post</h4>
                    <p>Please provide complete address as per India Post format</p>
                </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
                <h5 className="section-title">Contact Information</h5>

                <SecureInput
                    type="text"
                    name="recipientName"
                    value={formData.recipientName || ''}
                    onChange={handleChange}
                    label="Recipient Name"
                    icon={User}
                    placeholder="Full name of the person receiving the package"
                    error={errors.recipientName}
                    helperText="As per government ID (Aadhaar, PAN, etc.)"
                    required
                    secure
                    maxLength={100}
                    autoComplete="name"
                    validationStatus={
                        errors.recipientName ? 'invalid' :
                            formData.recipientName && formData.recipientName.length > 2 ? 'valid' :
                                null
                    }
                />

                <div className="form-row">
                    <SecureInput
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        label="Mobile Number"
                        icon={Phone}
                        placeholder="9876543210"
                        error={errors.phone}
                        helperText="For delivery coordination by India Post"
                        required
                        secure
                        maxLength={10}
                        autoComplete="tel"
                        validationStatus={
                            errors.phone ? 'invalid' :
                                formData.phone && /^[6-9]\d{9}$/.test(formData.phone) ? 'valid' :
                                    null
                        }
                    />

                    <SecureInput
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        label="Email Address"
                        icon={Mail}
                        placeholder="your.email@example.com"
                        error={errors.email}
                        helperText="For tracking updates"
                        required
                        secure
                        autoComplete="email"
                        validationStatus={
                            errors.email ? 'invalid' :
                                formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'valid' :
                                    null
                        }
                    />
                </div>
            </div>

            {/* Delivery Address */}
            <div className="form-section">
                <h5 className="section-title">Delivery Address (India Post Format)</h5>

                {/* Address Format Helper */}
                <div className="address-format-helper">
                    <div className="helper-icon">
                        <MapPin size={16} />
                    </div>
                    <div className="helper-text">
                        <strong>India Post Address Format:</strong>
                        <ul>
                            <li>Line 1: Recipient Name</li>
                            <li>Line 2: House/Flat No., Building Name</li>
                            <li>Line 3: Street/Road Name</li>
                            <li>Line 4: Locality/Area</li>
                            <li>Line 5: Landmark (Optional - Recommended)</li>
                            <li>Line 6: City, District, State - Pincode</li>
                        </ul>
                    </div>
                </div>

                <div className="form-row">
                    <SecureInput
                        type="text"
                        name="houseNumber"
                        value={formData.houseNumber || ''}
                        onChange={handleChange}
                        label="House/Flat Number"
                        icon={Home}
                        placeholder="H.No. 123, Flat 4B"
                        error={errors.houseNumber}
                        helperText="House/Flat/Door number"
                        required
                        maxLength={50}
                        validationStatus={
                            errors.houseNumber ? 'invalid' :
                                formData.houseNumber && formData.houseNumber.length > 0 ? 'valid' :
                                    null
                        }
                    />

                    <SecureInput
                        type="text"
                        name="buildingName"
                        value={formData.buildingName || ''}
                        onChange={handleChange}
                        label="Building/Apartment Name"
                        icon={Building}
                        placeholder="Sunshine Apartments"
                        error={errors.buildingName}
                        helperText="Optional - Building/Society/Complex name"
                        maxLength={100}
                        validationStatus={
                            formData.buildingName && formData.buildingName.length > 2 ? 'valid' : null
                        }
                    />
                </div>

                <SecureInput
                    type="text"
                    name="streetName"
                    value={formData.streetName || ''}
                    onChange={handleChange}
                    label="Street/Road Name"
                    icon={MapPin}
                    placeholder="MG Road, Main Street"
                    error={errors.streetName}
                    helperText="Street, Road, Lane, or Path name"
                    required
                    maxLength={100}
                    validationStatus={
                        errors.streetName ? 'invalid' :
                            formData.streetName && formData.streetName.length > 2 ? 'valid' :
                                null
                    }
                />

                <SecureInput
                    type="text"
                    name="locality"
                    value={formData.locality || ''}
                    onChange={handleChange}
                    label="Area/Locality"
                    icon={MapPin}
                    placeholder="Sector 15, Jayanagar, etc."
                    error={errors.locality}
                    helperText="Locality, Area, Sector, or Neighborhood"
                    required
                    maxLength={100}
                    validationStatus={
                        errors.locality ? 'invalid' :
                            formData.locality && formData.locality.length > 2 ? 'valid' :
                                null
                    }
                />

                <SecureInput
                    type="text"
                    name="landmark"
                    value={formData.landmark || ''}
                    onChange={handleChange}
                    label="Nearby Landmark"
                    icon={MapPin}
                    placeholder="Near City Hospital, Opposite Metro Station"
                    error={errors.landmark}
                    helperText="Optional - Helps delivery personnel locate easily"
                    maxLength={100}
                    validationStatus={
                        formData.landmark && formData.landmark.length > 3 ? 'valid' : null
                    }
                />


                <div className="form-row">
                    <SecureInput
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                        label="City/Town/Village"
                        placeholder="Bangalore, Mumbai, etc."
                        error={errors.city}
                        helperText="City, Town, or Village name"
                        required
                        maxLength={100}
                        validationStatus={
                            errors.city ? 'invalid' :
                                formData.city && formData.city.length > 2 ? 'valid' :
                                    null
                        }
                    />

                    <div className="form-group">
                        <label className="secure-input-label">
                            <MapPin size={16} />
                            District
                            <span className="required-indicator">*</span>
                        </label>
                        <select
                            name="district"
                            value={formData.district || ''}
                            onChange={handleChange}
                            className={`premium-select ${errors.district ? 'error' : formData.district ? 'valid' : ''}`}
                        >
                            <option value="">Select District</option>

                            <optgroup label="Kerala">
                                <option value="Alappuzha">Alappuzha</option>
                                <option value="Ernakulam">Ernakulam</option>
                                <option value="Idukki">Idukki</option>
                                <option value="Kannur">Kannur</option>
                                <option value="Kasaragod">Kasaragod</option>
                                <option value="Kollam">Kollam</option>
                                <option value="Kottayam">Kottayam</option>
                                <option value="Kozhikode">Kozhikode</option>
                                <option value="Malappuram">Malappuram</option>
                                <option value="Palakkad">Palakkad</option>
                                <option value="Pathanamthitta">Pathanamthitta</option>
                                <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                                <option value="Thrissur">Thrissur</option>
                                <option value="Wayanad">Wayanad</option>
                            </optgroup>

                            <optgroup label="Karnataka">
                                <option value="Bagalkot">Bagalkot</option>
                                <option value="Bangalore Rural">Bangalore Rural</option>
                                <option value="Bangalore Urban">Bangalore Urban</option>
                                <option value="Belgaum">Belgaum</option>
                                <option value="Bellary">Bellary</option>
                                <option value="Bidar">Bidar</option>
                                <option value="Chamarajanagar">Chamarajanagar</option>
                                <option value="Chikkamagaluru">Chikkamagaluru</option>
                                <option value="Chitradurga">Chitradurga</option>
                                <option value="Dakshina Kannada">Dakshina Kannada</option>
                                <option value="Davanagere">Davanagere</option>
                                <option value="Dharwad">Dharwad</option>
                                <option value="Gadag">Gadag</option>
                                <option value="Gulbarga">Gulbarga</option>
                                <option value="Hassan">Hassan</option>
                                <option value="Haveri">Haveri</option>
                                <option value="Kodagu">Kodagu</option>
                                <option value="Kolar">Kolar</option>
                                <option value="Koppal">Koppal</option>
                                <option value="Mandya">Mandya</option>
                                <option value="Mysore">Mysore</option>
                                <option value="Raichur">Raichur</option>
                                <option value="Shimoga">Shimoga</option>
                                <option value="Tumkur">Tumkur</option>
                                <option value="Udupi">Udupi</option>
                                <option value="Uttara Kannada">Uttara Kannada</option>
                            </optgroup>

                            <optgroup label="Tamil Nadu">
                                <option value="Chennai">Chennai</option>
                                <option value="Coimbatore">Coimbatore</option>
                                <option value="Cuddalore">Cuddalore</option>
                                <option value="Dharmapuri">Dharmapuri</option>
                                <option value="Dindigul">Dindigul</option>
                                <option value="Erode">Erode</option>
                                <option value="Kanchipuram">Kanchipuram</option>
                                <option value="Kanyakumari">Kanyakumari</option>
                                <option value="Karur">Karur</option>
                                <option value="Madurai">Madurai</option>
                                <option value="Nagapattinam">Nagapattinam</option>
                                <option value="Namakkal">Namakkal</option>
                                <option value="Perambalur">Perambalur</option>
                                <option value="Pudukkottai">Pudukkottai</option>
                                <option value="Ramanathapuram">Ramanathapuram</option>
                                <option value="Salem">Salem</option>
                                <option value="Sivaganga">Sivaganga</option>
                                <option value="Thanjavur">Thanjavur</option>
                                <option value="Theni">Theni</option>
                                <option value="Tiruchirappalli">Tiruchirappalli</option>
                                <option value="Tirunelveli">Tirunelveli</option>
                                <option value="Tiruvannamalai">Tiruvannamalai</option>
                                <option value="Vellore">Vellore</option>
                                <option value="Viluppuram">Viluppuram</option>
                                <option value="Virudhunagar">Virudhunagar</option>
                            </optgroup>

                            <optgroup label="Maharashtra">
                                <option value="Mumbai City">Mumbai City</option>
                                <option value="Mumbai Suburban">Mumbai Suburban</option>
                                <option value="Pune">Pune</option>
                                <option value="Nagpur">Nagpur</option>
                                <option value="Thane">Thane</option>
                                <option value="Nashik">Nashik</option>
                                <option value="Aurangabad">Aurangabad</option>
                                <option value="Solapur">Solapur</option>
                                <option value="Kolhapur">Kolhapur</option>
                                <option value="Raigad">Raigad</option>
                                <option value="Satara">Satara</option>
                                <option value="Sangli">Sangli</option>
                            </optgroup>

                            <optgroup label="Delhi">
                                <option value="Central Delhi">Central Delhi</option>
                                <option value="East Delhi">East Delhi</option>
                                <option value="New Delhi">New Delhi</option>
                                <option value="North Delhi">North Delhi</option>
                                <option value="North East Delhi">North East Delhi</option>
                                <option value="North West Delhi">North West Delhi</option>
                                <option value="South Delhi">South Delhi</option>
                                <option value="South East Delhi">South East Delhi</option>
                                <option value="South West Delhi">South West Delhi</option>
                                <option value="West Delhi">West Delhi</option>
                            </optgroup>

                            <optgroup label="Uttar Pradesh">
                                <option value="Lucknow">Lucknow</option>
                                <option value="Kanpur">Kanpur</option>
                                <option value="Ghaziabad">Ghaziabad</option>
                                <option value="Agra">Agra</option>
                                <option value="Meerut">Meerut</option>
                                <option value="Varanasi">Varanasi</option>
                                <option value="Allahabad">Allahabad</option>
                                <option value="Bareilly">Bareilly</option>
                                <option value="Aligarh">Aligarh</option>
                                <option value="Moradabad">Moradabad</option>
                            </optgroup>

                            <optgroup label="Other States">
                                <option value="Other">Other (Please specify in street address)</option>
                            </optgroup>
                        </select>
                        {errors.district && (
                            <div className="input-message error-message-secure">
                                <span>{errors.district}</span>
                            </div>
                        )}
                        {formData.district && !errors.district && (
                            <div className="input-message success-message-secure">
                                <span>District selected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-row">
                    <SecureInput
                        type="text"
                        name="pincode"
                        value={formData.pincode || ''}
                        onChange={handleChange}
                        label="Pincode"
                        placeholder="560001"
                        error={errors.pincode}
                        helperText={detectedState ? `Detected: ${detectedState}` : "6-digit postal code"}
                        required
                        maxLength={6}
                        validationStatus={
                            errors.pincode ? 'invalid' :
                                formData.pincode && /^[1-9]\d{5}$/.test(formData.pincode) ? 'valid' :
                                    null
                        }
                    />

                    <div className="form-group">
                        <label className="secure-input-label">
                            State
                            <span className="required-indicator">*</span>
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state || detectedState}
                            readOnly
                            className="secure-input state-readonly"
                            placeholder="Auto-detected from pincode"
                        />
                        <div className="input-message helper-text-secure">
                            <span>State is auto-detected based on pincode</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Preview */}
            {formData.recipientName && formData.houseNumber && formData.city && (
                <div className="address-preview">
                    <h6>Address Preview (India Post Format)</h6>
                    <div className="preview-address">
                        <div>{formData.recipientName}</div>
                        <div>
                            {formData.houseNumber}
                            {formData.buildingName && `, ${formData.buildingName}`}
                        </div>
                        {formData.streetName && <div>{formData.streetName}</div>}
                        {formData.locality && <div>{formData.locality}</div>}
                        {formData.landmark && <div>Landmark: {formData.landmark}</div>}
                        <div>
                            {formData.city}
                            {formData.district && `, ${formData.district}`}
                            {formData.state && `, ${formData.state}`}
                            {formData.pincode && ` - ${formData.pincode}`}
                        </div>
                        {formData.phone && <div>Mobile: {formData.phone}</div>}
                    </div>
                </div>
            )}

            {/* India Post Info */}
            <div className="india-post-info">
                <div className="info-icon">ℹ️</div>
                <div className="info-text">
                    <strong>Delivery Timeline:</strong> India Post typically delivers within 3-7 working days.
                    You'll receive tracking details via SMS and email.
                </div>
            </div>
        </div>
    );
};

export default IndiaPostAddressForm;
