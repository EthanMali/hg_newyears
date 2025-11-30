import { useState } from 'react'
import axios from 'axios'
import './RegistrationForm.css'
import { translations, type Language } from '../translations'

interface FormData {
  coupleName: string
  phone: string
  numberOfKids: number
}

interface FormErrors {
  coupleName?: string
  phone?: string
  numberOfKids?: string
  submit?: string
}

const RegistrationForm = () => {
  const [language, setLanguage] = useState<Language>('en')
  const t = translations[language]

  const [formData, setFormData] = useState<FormData>({
    coupleName: '',
    phone: '',
    numberOfKids: 0
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en')
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.coupleName.trim()) {
      newErrors.coupleName = t.errors.coupleNameRequired
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.errors.phoneRequired
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t.errors.phoneInvalid
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Send registration data to server
      const response = await axios.post('http://localhost:5000/api/register', {
        coupleName: formData.coupleName,
        phone: formData.phone,
        numberOfKids: formData.numberOfKids
      })

      if (response.status === 201 || response.status === 200) {
        setSubmitSuccess(true)
        // Reset form
        setFormData({
          coupleName: '',
          phone: '',
          numberOfKids: 0
        })
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000)
      }
    } catch (error: any) {
      if (error.response) {
        setErrors({
          submit: error.response.data.message || t.errors.registrationFailed
        })
      } else {
        setErrors({
          submit: t.errors.networkError
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="registration-container">
      <div className="registration-card">
        <button 
          className="language-switcher"
          onClick={toggleLanguage}
          aria-label="Switch language"
        >
          {language === 'en' ? 'RU' : 'EN'}
        </button>
        
        <h1 className="registration-title">{t.title}</h1>
        <p className="registration-subtitle">{t.subtitle}</p>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="coupleName">{t.coupleName}</label>
            <input
              type="text"
              id="coupleName"
              name="coupleName"
              value={formData.coupleName}
              onChange={handleChange}
              className={errors.coupleName ? 'error' : ''}
              placeholder={t.coupleNamePlaceholder}
            />
            {errors.coupleName && <span className="error-message">{errors.coupleName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">{t.phone}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder={t.phonePlaceholder}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="numberOfKids">{t.numberOfKids}</label>
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
          {submitSuccess && <div className="success-message">{t.successMessage}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? t.registering : t.registerButton}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm

