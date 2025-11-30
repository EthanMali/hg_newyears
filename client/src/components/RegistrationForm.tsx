import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './RegistrationForm.css'
import { translations, type Language } from '../translations'
import '../index.css';          // ← make sure this line exists
import { savePreferredLanguage, loadPreferredLanguage } from '../utils/languagePreference'

interface FormData {
  husbandName: string
  wifeName: string
  lastName: string
  phone: string
  numberOfKids: number
  coupleName?: string
}

interface FormErrors {
  husbandName?: string
  wifeName?: string
  lastName?: string
  phone?: string
  numberOfKids?: string
  submit?: string
}

const RegistrationForm = () => {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<Language>('en')
  const t = translations[language]

  const [formData, setFormData] = useState<FormData>({
    husbandName: '',
    wifeName: '',
    lastName: '',
    phone: '',
    numberOfKids: 0
  })

  const [errors, setErrors] = useState<FormErrors>({})
  
  const [showKidsTooltip, setShowKidsTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const helpIconRef = useRef<HTMLButtonElement>(null)

  const toggleLanguage = () => {
    setLanguage((prev: Language) => prev === 'en' ? 'ru' : 'en')
  }

  // Persist language when toggled
  useEffect(() => {
    savePreferredLanguage(language)
  }, [language])

  // Show language picker on first load if user hasn't chosen
  const [showLangModal, setShowLangModal] = useState(false)
  useEffect(() => {
    const stored = loadPreferredLanguage()
    if (stored) {
      setLanguage(stored)
    } else {
      setShowLangModal(true)
    }
  }, [])

  const chooseLanguage = (lang: Language) => {
    setLanguage(lang)
    try {
      localStorage.setItem('preferredLanguage', lang)
    } catch (e) {
      // ignore
    }
    setShowLangModal(false)
  }

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showKidsTooltip &&
        tooltipRef.current &&
        helpIconRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !helpIconRef.current.contains(event.target as Node)
      ) {
        setShowKidsTooltip(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showKidsTooltip])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.husbandName.trim()) {
      newErrors.husbandName = t.errors.husbandNameRequired
    }
    
    if (!formData.wifeName.trim()) {
      newErrors.wifeName = t.errors.wifeNameRequired
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t.errors.lastNameRequired
    }



    if (formData.numberOfKids < 0) {
      newErrors.numberOfKids = t.errors.kidsNegative
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleKidsChange = (delta: number) => {
    const newValue = Math.max(0, formData.numberOfKids + delta)
    setFormData(prev => ({
      ...prev,
      numberOfKids: newValue
    }))
    if (errors.numberOfKids) {
      setErrors(prev => ({
        ...prev,
        numberOfKids: undefined
      }))
    }
  }

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '')
    
    // If empty, return empty string
    if (!phoneNumber) return ''
    
    // Limit to 15 digits (international standard)
    const limitedNumber = phoneNumber.slice(0, 15)
    
    // Format based on length
    if (limitedNumber.length <= 3) {
      return limitedNumber
    } else if (limitedNumber.length <= 6) {
      return `(${limitedNumber.slice(0, 3)}) ${limitedNumber.slice(3)}`
    } else if (limitedNumber.length <= 10) {
      return `(${limitedNumber.slice(0, 3)}) ${limitedNumber.slice(3, 6)}-${limitedNumber.slice(6)}`
    } else {
      // For numbers longer than 10 digits (international), format differently
      return `(${limitedNumber.slice(0, 3)}) ${limitedNumber.slice(3, 6)}-${limitedNumber.slice(6, 10)} ${limitedNumber.slice(10)}`
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Format phone number in real-time
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value)
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleKidsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    const newValue = Math.max(0, value)
    setFormData(prev => ({
      ...prev,
      numberOfKids: newValue
    }))
    if (errors.numberOfKids) {
      setErrors(prev => ({
        ...prev,
        numberOfKids: undefined
      }))
    }
  }

  // When the user clicks "Continue to Payment" we validate, save the
  // registration details to localStorage and navigate to the payment page.
  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm()) return

    try {
      const amount = 100 
      const payload = {
        coupleName: `${formData.husbandName} & ${formData.wifeName} ${formData.lastName}`.trim(),
        husbandName: formData.husbandName,
        wifeName: formData.wifeName,
        lastName: formData.lastName,
        phone: formData.phone,
        numberOfKids: formData.numberOfKids,
        amount
      }

      // Persist locally; server registration happens after payment confirmation
      localStorage.setItem('registrationData', JSON.stringify(payload));

      // Navigate to payment page
      navigate('/payment');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to register. Please try again.'
      }));
    }
  }

  return (
    <div className="registration-container">
      <button
        className="language-switcher"
        onClick={toggleLanguage}
        aria-label="Switch language"
      >
        {language === 'en' ? 'RU' : 'EN'}
      </button>

      {showLangModal && (
        <div className="lang-modal-backdrop" role="dialog" aria-modal="true">
          <div className="lang-modal">
            <h2>{language === 'en' ? 'Choose language' : 'Выберите язык'}</h2>
            <p className="lang-modal-sub">{language === 'en' ? 'Please select your preferred language.' : 'Пожалуйста, выберите предпочитаемый язык.'}</p>
            <div className="lang-options">
              <button className="lang-option" onClick={() => chooseLanguage('en')}>English</button>
              <button className="lang-option" onClick={() => chooseLanguage('ru')}>Русский</button>
            </div>
          </div>
        </div>
      )}

      <div className="registration-header">
        <h1 className="registration-title">{t.title}</h1>
        <p className="registration-subtitle">{t.subtitle}</p>
      </div>
      
  <form onSubmit={(e) => e.preventDefault()} className="registration-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="husbandName">{t.husbandName}</label>
              <input
                type="text"
                id="husbandName"
                name="husbandName"
                value={formData.husbandName}
                onChange={handleChange}
                className={errors.husbandName ? 'error' : ''}
                placeholder={t.husbandNamePlaceholder}
              />
              {errors.husbandName && <span className="error-message">{errors.husbandName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="wifeName">{t.wifeName}</label>
              <input
                type="text"
                id="wifeName"
                name="wifeName"
                value={formData.wifeName}
                onChange={handleChange}
                className={errors.wifeName ? 'error' : ''}
                placeholder={t.wifeNamePlaceholder}
              />
              {errors.wifeName && <span className="error-message">{errors.wifeName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">{t.lastName}</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder={t.lastNamePlaceholder}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          {/*<div className="form-group">
            <label htmlFor="phone">{t.phone}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder={t.phonePlaceholder}
              maxLength={20}
              inputMode="tel"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>*/}

          <div className="form-group">
            <label htmlFor="numberOfKids" className="label-with-help">
              {t.numberOfKids}
            </label>
            <div className="kids-counter">
              <button
                type="button"
                className="counter-button"
                onClick={() => handleKidsChange(-1)}
                disabled={formData.numberOfKids === 0}
              >
                −
              </button>
              <input
                type="number"
                id="numberOfKids"
                name="numberOfKids"
                value={formData.numberOfKids}
                onChange={handleKidsInputChange}
                min="0"
                className={errors.numberOfKids ? 'error counter-input' : 'counter-input'}
              />
              <button
                type="button"
                className="counter-button"
                onClick={() => handleKidsChange(1)}
              >
                +
              </button>
            </div>
            {errors.numberOfKids && <span className="error-message">{errors.numberOfKids}</span>}
          </div>

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

            <div className="button-group">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg 
                          transition-all duration-200 ease-in-out 
                          shadow-md hover:shadow-lg 
                          transform hover:-translate-y-0.5 
                          active:translate-y-0 active:shadow-md
                          focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
              >
                {language === 'en' ? 'Continue to Payment' : 'Перейти к оплате'}
              </button>
            </div>
        </form>
      </div>
  )
}

export default RegistrationForm

