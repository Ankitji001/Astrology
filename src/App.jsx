import { useState, useRef } from 'react'
import heroBg from './assets/hero_background.mp4'
import personImg from './assets/person.png'

// Dynamic list of 12 distinct celestial inline SVGs for the Cosmic Gallery
const CELESTIAL_SYMBOLS = [
  // 1. Crescent Moon
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>,
  // 2. Bright Sun
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>,
  // 3. Four-point Star
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>,
  // 4. Overlapping Orbits
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(-30 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(30 12 12)" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.3" />
  </svg>,
  // 5. Astrolabe / Compass
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36" />
  </svg>,
  // 6. Spiral Galaxy
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c2.5 0 4-1.5 4-3s-1.5-3-4-3-4 1.5-4 3 1.5 3 4 3Z" />
    <path d="M12 15c4 0 7-2 7-5s-3-5-7-5-7 2-7 5 3 5 7 5Z" />
    <path d="M12 18c6 0 10-2.5 10-6s-4-6-10-6-10 2.5-10 6 4 6 10 6Z" />
  </svg>,
  // 7. Gibbous Moon Phase
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path d="M12 3a6 6 0 0 1 0 18" />
  </svg>,
  // 8. Planet with Ring (Saturn style)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="6" />
    <path d="M2 12h20" transform="rotate(-15 12 12)" />
    <path d="M5.5 10c0-1.5 2.5-2 6.5-2s6.5.5 6.5 2" transform="rotate(-15 12 12)" />
  </svg>,
  // 9. Triple Crescent Goddess Symbol
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.5 18a6 6 0 1 1 0-12 6 6 0 0 0 0 12Z" />
    <circle cx="12" cy="12" r="5" />
    <path d="M16.5 6a6 6 0 1 1 0 12 6 6 0 0 0 0-12Z" />
  </svg>,
  // 10. Starry Orion / Constellation Map
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" fill="currentColor" />
    <circle cx="6" cy="10" r="1.5" fill="currentColor" />
    <circle cx="18" cy="8" r="1.5" fill="currentColor" />
    <circle cx="10" cy="14" r="1" fill="currentColor" />
    <circle cx="14" cy="14" r="1" fill="currentColor" />
    <circle cx="8" cy="19" r="1.5" fill="currentColor" />
    <circle cx="16" cy="19" r="1.5" fill="currentColor" />
    <path d="M12 5L6 10M12 5l6 3M6 10l4 4M18 8l-4 4M10 14h4M10 14l-2 5M14 14l2 5" strokeDasharray="3 3" />
  </svg>,
  // 11. Hourglass of Eternity
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 2h14M5 22h14M19 2v4a7 7 0 0 1-7 7 7 7 0 0 1-7-7V2M5 22v-4a7 7 0 0 1 7-7 7 7 0 0 1 7 7v4" />
    <path d="M12 16v2M11 17h2" />
  </svg>,
  // 12. Celestial Eye / Third Eye
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDomestic, setIsDomestic] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    tob: '',
    pob: '',
    consultType: 'Video Deep-Dive'
  })
  const [errors, setErrors] = useState({})
  const [activeModal, setActiveModal] = useState(null)
  
  // Ref for scrolling to the booking section
  const bookingRef = useRef(null)

  // Price calculations based on Toggle and Dropdown state
  const getPlanPrice = (planName) => {
    if (planName === 'Voice Consultation') {
      return isDomestic ? { amount: 1500, symbol: '₹' } : { amount: 30, symbol: '$' }
    } else {
      return isDomestic ? { amount: 2500, symbol: '₹' } : { amount: 50, symbol: '$' }
    }
  }

  const currentPrice = getPlanPrice(formData.consultType)

  // Handle setting plan and scrolling down
  const handleSelectPlan = (planName) => {
    setFormData((prev) => ({ ...prev, consultType: planName }))
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Full Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.dob) newErrors.dob = 'Date of birth is required'
    if (!formData.tob) newErrors.tob = 'Time of birth is required'
    if (!formData.pob.trim()) newErrors.pob = 'Place of birth is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Open Razorpay Payment Modal
  const triggerRazorpayCheckout = async () => {
    if (!window.Razorpay) {
      alert("Payment gateway (Razorpay) failed to load. Please verify your internet connection, disable any ad-blockers, and refresh the page.");
      return;
    }

    let orderId = null;

    // Try fetching the secure order ID from the Vercel serverless function
    try {
      const apiResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          consultType: formData.consultType,
          isDomestic: isDomestic
        })
      });

      if (apiResponse.ok) {
        const orderData = await apiResponse.json();
        orderId = orderData.orderId;
      } else {
        console.warn("Secure order creation failed. Falling back to client-side integration.");
      }
    } catch (err) {
      console.warn("Serverless API not reachable. Using client-side integration fallback.", err);
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: currentPrice.amount * 100, // Amount in paise/cents
      currency: isDomestic ? 'INR' : 'USD',
      name: 'Celestial Guidance',
      description: `${formData.consultType} with Vikram Kumar Sharma`,
      image: '/favicon.ico',
      order_id: orderId, // Passes the tamper-proof Vercel order ID if created
      handler: function (response) {
        const paymentId = response.razorpay_payment_id;
        redirectToWhatsApp(paymentId);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#FF6B00',
      },
      modal: {
        ondismiss: function () {
          console.log("Payment window closed by user");
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay initiation failed", err);
      alert("There was an issue opening the payment gateway. Please check if your API Key in .env is correct.");
    }
  }

  // Redirect to WhatsApp with payment details
  const redirectToWhatsApp = (paymentId) => {
    const message = `✨ *Celestial Guidance Booking & Payment Confirmation* ✨\n\n` +
      `💳 *Payment ID:* ${paymentId}\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📧 *Email:* ${formData.email}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `📅 *Date of Birth:* ${formData.dob}\n` +
      `⏰ *Time of Birth:* ${formData.tob}\n` +
      `📍 *Place of Birth:* ${formData.pob}\n` +
      `🔮 *Selected Plan:* ${formData.consultType}\n` +
      `💵 *Paid Amount:* ${currentPrice.symbol} ${currentPrice.amount}\n\n` +
      `Payment completed successfully. Please confirm slot availability. Thank you!`;

    const encodedMessage = encodeURIComponent(message)
    let whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || ''
    // Clean phone number: remove any non-digit character (like spaces, +, -, etc.)
    whatsappNumber = whatsappNumber.replace(/\D/g, '')

    if (!whatsappNumber) {
      alert("WhatsApp number is not configured in the environment settings.");
      return;
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  // Form submit click handler
  const handleWhatsAppRedirect = (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    triggerRazorpayCheckout()
  }

  const renderModalContent = () => {
    switch (activeModal) {
      case 'privacy':
        return (
          <>
            <h4>1. Data We Collect</h4>
            <p>We collect personal information that you provide to us, including your Full Name, Email Address, Contact Number, and Birth Details (Date, Time, and Place of Birth) solely for the purpose of generating personalized Vedic astrological charts and calculations.</p>
            <h4>2. Data Security & Usage</h4>
            <p>Your details are processed securely and used exclusively by Vikram Kumar Sharma's office to prepare your horoscope and coordinate scheduling. We do not sell, share, or lease your private data to any third parties.</p>
            <h4>3. Payment Information</h4>
            <p>All online payments are securely processed through Razorpay. We do not store or collect your payment card details or bank credentials on our servers.</p>
          </>
        )
      case 'terms':
        return (
          <>
            <h4>1. Astrological Services</h4>
            <p>Astrological consultations are based on Vedic principles and represent subjective guidance. These consultations do not constitute legal, medical, or financial advice. Decisions made based on our readings are the sole responsibility of the client.</p>
            <h4>2. Booking & Schedule</h4>
            <p>Sessions must be booked and paid for in advance. While we make every effort to accommodate your preferred timing, final session slots are subject to coordinate confirmation via WhatsApp.</p>
            <h4>3. User Obligations</h4>
            <p>Clients must provide accurate and complete birth information (Date, Time, and Place of Birth) to ensure calculation accuracy. Inaccurate data will result in incorrect readings.</p>
          </>
        )
      case 'refund':
        return (
          <>
            <h4>1. Cancellation & Rescheduling</h4>
            <p>We respect your time and request that you respect ours. You can reschedule or cancel a session under the following guidelines:</p>
            <ul>
              <li><strong>Cancellations requested 24 hours or more</strong> before the scheduled slot are eligible for a <strong>100% refund</strong>.</li>
              <li><strong>Cancellations requested within 24 hours</strong> of the slot are eligible for a <strong>50% refund</strong>, or a free rescheduling to a future slot.</li>
            </ul>
            <h4>2. Refund Processing Time</h4>
            <p>Once a cancellation is approved, refunds will be initiated automatically to your original payment method. The refund amount will be credited back to your bank account or card within <strong>5 to 7 business days</strong>, subject to your bank's policies.</p>
            <h4>3. Post-Consultation</h4>
            <p>No refunds will be issued once a voice call or video deep-dive consultation has been successfully conducted.</p>
          </>
        )
      case 'disclaimer':
        return (
          <>
            <h4>1. General Disclaimer</h4>
            <p>The information, advice, and predictions provided by astrologer Vikram Kumar Sharma are intended for educational and spiritual guidance. Astrology is not a science and is subject to individual interpretation. Clients should exercise their own judgment.</p>
            <h4>2. Business Contact Info</h4>
            <p>For any service queries, cancellation requests, or payment issues, please contact us directly:</p>
            <ul>
              <li><strong>Practitioner:</strong> Vikram Kumar Sharma</li>
              <li><strong>Practitioner:</strong> Age - 42 </li>
              <li><strong>Email Support:</strong>vinvicky07@gmail.com</li>
              <li><strong>Contact Number:</strong> +91 9718871309</li>
              <li><strong>Office Address:</strong>  New Delhi, 110001, India</li>
            </ul>
          </>
        )
      default:
        return null
    }
  }

  const getModalTitle = () => {
    switch (activeModal) {
      case 'privacy': return 'Privacy Policy'
      case 'terms': return 'Terms of Service'
      case 'refund': return 'Refund & Cancellation Policy'
      case 'disclaimer': return 'Disclaimer & Contact Info'
      default: return ''
    }
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20M12 12l5.5-5.5M12 12l-5.5 5.5M12 12l5.5 5.5M12 12L6.5 6.5" />
          </svg>
          Celestial Guidance
        </div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#home" className="active" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About Vikram</a></li>
          <li><a href="#gallery" onClick={() => setMenuOpen(false)}>Cosmic Gallery</a></li>
          <li><a href="#plans" onClick={() => setMenuOpen(false)}>Consultations</a></li>
          <li><a href="#booking" onClick={() => setMenuOpen(false)}>Contact Us</a></li>
        </ul>
        <div className="nav-socials">
          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
            </svg>
          </a>
          {/* Facebook */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          {/* Bookmark Star Icon */}
          <a href="#plans" title="Book Session">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </a>
        </div>
        <button 
          className={`nav-toggle ${menuOpen ? 'open' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero-section">
        {/* Muted background video from user's assets */}
        <video className="hero-video-bg" autoPlay loop muted playsInline>
          <source src={heroBg} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-container">
          <div className="hero-content">
            <h1>Unlock Your <span className="highlight">Celestial</span> Path in Delhi</h1>
            <p>
              Navigate life's complexities with professional Vedic astrological insights. Find clarity, purpose, and growth through the wisdom of the stars.
            </p>
            <div className="hero-actions">
              <button onClick={() => handleSelectPlan('Video Deep-Dive')} className="btn btn-primary">
                Consult with Vikram Now
              </button>
              <a href="#about" className="btn btn-outline">Our Story</a>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
              <div className="hero-image-frame">
                <img src={personImg} alt="Vedic Astrologer Vikram Kumar Sharma" />
                <div className="hero-image-label">
                  <div className="tagline">Master Vedic Astrologer</div>
                  <div className="name">Vikram Kumar Sharma</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Vikram Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-header">
            <span className="section-tag">The Journey</span>
            <h2>Wisdom Across Two Decades</h2>
          </div>
          <div className="about-text">
            <p>
              With over 20 years of experience, <span className="highlight">Vikram Kumar Sharma</span> is a renowned Vedic astrologer based in Delhi, dedicated to bringing cosmic clarity to modern lives. His profound insights into planetary alignments have helped thousands navigate their personal and professional journeys with confidence and purpose.
            </p>
            <p>
              Our Delhi-based practice bridges the gap between ancient Vedic wisdom and the complexities of 21st-century urban living. We offer a comprehensive lens into the human experience, empowering you with the knowledge to make conscious choices that align with your cosmic blueprint.
            </p>
          </div>
        </div>
      </section>

      {/* Cosmic Gallery Section */}
      <section id="gallery" className="gallery-section">
        <div className="section-title-wrapper">
          <h2>Portals to the <span className="highlight">Infinite</span></h2>
          <p>
            A curated collection of the cosmos that inspires our practice, capturing the divine order of the universe.
          </p>
        </div>
        <div className="gallery-grid">
          {/* Card 1 */}
          <div className="cosmic-card">
            <div className="cosmic-symbol-grid">
              {CELESTIAL_SYMBOLS.map((symbol, index) => (
                <div key={`c1-${index}`} className="cosmic-symbol-box">
                  {symbol}
                </div>
              ))}
            </div>
          </div>
          {/* Card 2 */}
          <div className="cosmic-card">
            <div className="cosmic-symbol-grid">
              {CELESTIAL_SYMBOLS.map((symbol, index) => (
                <div key={`c2-${index}`} className="cosmic-symbol-box">
                  {symbol}
                </div>
              ))}
            </div>
          </div>
          {/* Card 3 */}
          <div className="cosmic-card">
            <div className="cosmic-symbol-grid">
              {CELESTIAL_SYMBOLS.map((symbol, index) => (
                <div key={`c3-${index}`} className="cosmic-symbol-box">
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Consultation Plans Section */}
      <section id="plans" className="pricing-section">
        <div className="section-title-wrapper">
          <h2>Consultation Plans</h2>
        </div>
        <div className="currency-toggle-wrapper">
          <div className="currency-toggle">
            <button 
              type="button" 
              onClick={() => setIsDomestic(true)} 
              className={`toggle-option ${isDomestic ? 'active' : ''}`}
            >
              Domestic (INR)
            </button>
            <button 
              type="button" 
              onClick={() => setIsDomestic(false)} 
              className={`toggle-option ${!isDomestic ? 'active' : ''}`}
            >
              International (USD)
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {/* Card 1: Voice Consultation */}
          <div className="pricing-card">
            <div className="card-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3>Voice Consultation</h3>
            <div className="price-display">
              <span className="price-currency">{isDomestic ? '₹' : '$'}</span>
              <span className="price-val">{isDomestic ? '1500' : '30'}</span>
            </div>
            <ul className="features-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                30 Minutes Private Voice Call
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Vedic Birth Chart Analysis
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Specific Problem Resolution
              </li>
            </ul>
            <button 
              type="button" 
              onClick={() => handleSelectPlan('Voice Consultation')} 
              className="btn btn-outline"
            >
              Select Basic Plan
            </button>
          </div>

          {/* Card 2: Video Deep-Dive */}
          <div className="pricing-card popular">
            <span className="popular-badge">Best Value</span>
            <div className="card-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 8-6 4 6 4V8Z" />
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
              </svg>
            </div>
            <h3>Video Deep-Dive</h3>
            <div className="price-display">
              <span className="price-currency">{isDomestic ? '₹' : '$'}</span>
              <span className="price-val">{isDomestic ? '2500' : '50'}</span>
            </div>
            <ul className="features-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                45 Minutes Video Session
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Comprehensive Life Cycle Reading
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Session Video Recording
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Personalized Remedy PDF
              </li>
            </ul>
            <button 
              type="button" 
              onClick={() => handleSelectPlan('Video Deep-Dive')} 
              className="btn btn-primary"
            >
              Book Premium Session
            </button>
          </div>
        </div>
      </section>

      {/* Booking Form and Order Summary Section */}
      <section ref={bookingRef} id="booking" className="booking-section">
        <div className="booking-card">
          {/* Left Column: Input Form */}
          <div className="booking-form-side">
            <h3>Secure Your Slot</h3>
            <p className="sub">Consult with Vikram Kumar Sharma in Delhi or Online.</p>
            
            <form onSubmit={handleWhatsAppRedirect}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name"
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter your full name" 
                  className="form-input" 
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="yourname@example.com" 
                    className="form-input" 
                  />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone / WhatsApp</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    id="phone"
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="e.g. +91 98765 43210" 
                    className="form-input" 
                  />
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="dob">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob" 
                    id="dob"
                    value={formData.dob} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                  {errors.dob && <span className="error-msg">{errors.dob}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="tob">Time of Birth</label>
                  <input 
                    type="time" 
                    name="tob" 
                    id="tob"
                    value={formData.tob} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                  {errors.tob && <span className="error-msg">{errors.tob}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pob">Place of Birth</label>
                <input 
                  type="text" 
                  name="pob" 
                  id="pob"
                  value={formData.pob} 
                  onChange={handleInputChange} 
                  placeholder="City, State e.g., Delhi, India" 
                  className="form-input" 
                />
                {errors.pob && <span className="error-msg">{errors.pob}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="consultType">Consultation Type</label>
                <select 
                  name="consultType" 
                  id="consultType"
                  value={formData.consultType} 
                  onChange={handleInputChange} 
                  className="form-input"
                  style={{ appearance: 'auto' }}
                >
                  <option value="Voice Consultation">Voice Consultation</option>
                  <option value="Video Deep-Dive">Video Deep-Dive</option>
                </select>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary (Orange Checkout Box) */}
          <div className="checkout-side">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span className="summary-label">Selected Plan</span>
              <span className="summary-value plan-title">{formData.consultType}</span>
            </div>

            <div className="summary-row" style={{ marginTop: '10px' }}>
              <span className="summary-label">Format</span>
              <span className="summary-value">
                {formData.consultType === 'Voice Consultation' ? '30 Mins Voice Call' : '45 Mins Video Call'}
              </span>
            </div>

            <div className="total-row">
              <span className="total-label">Final Total</span>
              <span className="total-amount">
                {currentPrice.symbol} {currentPrice.amount}
              </span>
            </div>

            <button 
              type="button" 
              onClick={handleWhatsAppRedirect} 
              className="btn-whatsapp"
            >
              {/* WhatsApp Message/Send Icon */}
              <svg viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.283 3.507 8.485-.006 6.66-5.345 11.997-11.958 11.997-2.005-.001-3.973-.504-5.717-1.465L0 24zm6.59-4.846c1.6.95 3.167 1.448 4.787 1.449 5.517 0 10.006-4.487 10.01-10.002.002-2.673-1.036-5.185-2.924-7.075C16.634 1.637 14.12 1.05 11.45 1.05 5.93 1.05 1.443 5.539 1.44 11.056c-.001 1.716.452 3.393 1.31 4.882l-1.002 3.66 3.754-.984z" />
              </svg>
              Pay & Connect on WhatsApp
            </button>

            <div className="whatsapp-info-block">
              <div className="whatsapp-info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div className="whatsapp-info-text">
                Upon successful payment, you will be instantly redirected to WhatsApp to confirm your appointment with Vikram's office.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v20M2 12h20" />
            </svg>
            Celestial Guidance
          </div>
          <ul className="footer-links">
            <li><button type="button" onClick={() => setActiveModal('privacy')} className="footer-link-btn">Privacy Policy</button></li>
            <li><button type="button" onClick={() => setActiveModal('terms')} className="footer-link-btn">Terms of Service</button></li>
            <li><button type="button" onClick={() => setActiveModal('refund')} className="footer-link-btn">Refund Policy</button></li>
            <li><button type="button" onClick={() => setActiveModal('disclaimer')} className="footer-link-btn">Disclaimer & Contact</button></li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Celestial Guidance | Delhi, India. All rights reserved.</p>
        </div>
      </footer>

      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{getModalTitle()}</h3>
              <button 
                type="button" 
                className="modal-close" 
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
