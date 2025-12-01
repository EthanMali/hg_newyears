import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Payment.css'
import { translations, type Language } from '../translations'
import { getApiUrl } from '../utils/api'
import { savePreferredLanguage, loadPreferredLanguage } from '../utils/languagePreference'

interface PaymentDetails {
  coupleName: string
  phone?: string
  numberOfKids: number
  amount: number
  cashAppLink?: string
}

const Payment = () => {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<Language>('en')
  const t = translations[language]
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasOpenedCashApp, setHasOpenedCashApp] = useState(false)
  const [cashAppClickedAt, setCashAppClickedAt] = useState<number | null>(null)
  const [canCompleteRegistration, setCanCompleteRegistration] = useState(false)

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en')
  }

  // Persist language when toggled
  useEffect(() => {
    savePreferredLanguage(language)
  }, [language])

  // comp language preference on mount
  useEffect(() => {
    const stored = loadPreferredLanguage()
    if (stored) {
      setLanguage(stored)
    }
  }, [])

  // Load registration details from localStorage or session
  useEffect(() => {
    try {
      const registered = localStorage.getItem('registrationData')
      if (registered) {
        const data = JSON.parse(registered)
        setPaymentDetails(data)
      } else {
        // If no registration data, redirect back to form
        navigate('/')
      }
    } catch (e) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    if (cashAppClickedAt === null) return

    setCanCompleteRegistration(false)
    const timer = setTimeout(() => setCanCompleteRegistration(true), 5000)
    return () => clearTimeout(timer)
  }, [cashAppClickedAt])

  const handleCashAppClick = () => {
    setHasOpenedCashApp(true)
    setCashAppClickedAt(Date.now())
  }

  const handlePayment = async () => {
    if (!paymentDetails) return
    if (!hasOpenedCashApp) {
      alert(language === 'en'
        ? 'Please click "Pay with Cash App" to complete your payment first.'
        : 'Пожалуйста, нажмите «Оплатить через Cash App», чтобы сначала завершить платеж.')
      return
    }
    if (!canCompleteRegistration) {
      alert(language === 'en'
        ? 'Please wait a few seconds after opening Cash App before completing registration.'
        : 'Пожалуйста, подождите несколько секунд после открытия Cash App перед завершением регистрации.')
      return
    }

    setIsProcessing(true)

    try {
      // Here you would integrate with your payment processor (Stripe, PayPal, etc.)
      // For now, this is a placeholder that simulates payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate successful payment
      // After successful payment, register the user on the server
      try {
        const resp = await axios.post(getApiUrl('/api/register'), {
          coupleName: paymentDetails.coupleName,
          phone: paymentDetails.phone || '',
          numberOfKids: paymentDetails.numberOfKids,
          amount: paymentDetails.amount,
          husbandName: (paymentDetails as any).husbandName,
          wifeName: (paymentDetails as any).wifeName,
          lastName: (paymentDetails as any).lastName
        })

        if (resp.status === 200 || resp.status === 201) {
          // Clear registration data and redirect to thank you page
          localStorage.removeItem('registrationData')
          navigate('/thank-you')
        } else {
          alert(language === 'en' ? 'Payment succeeded but registration failed. Please contact support.' : 'Платеж прошел, но регистрация не удалась. Пожалуйста, свяжитесь с поддержкой.')
        }
      } catch (regErr: any) {
        console.error('Registration error after payment', regErr)
        alert(language === 'en' ? 'Payment succeeded but registration failed. Please try again or contact support.' : 'Платеж прошел, но регистрация не удалась. Попробуйте еще раз или свяжитесь с поддержкой.')
      }
    } catch (error) {
      alert(language === 'en' ? 'Payment failed. Please try again.' : 'Платеж не удался. Пожалуйста, попробуйте еще раз.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (!paymentDetails) {
    return <div className="payment-container">Loading...</div>
  }

  return (
    <div className="payment-container">
      <button
        className="language-switcher"
        onClick={toggleLanguage}
        aria-label="Switch language"
      >
        {language === 'en' ? 'RU' : 'EN'}
      </button>

      <div className="payment-card">
        <h1 className="payment-title">
          {language === 'en' ? 'Payment Details' : 'Детали платежа'}
        </h1>
        <p className="payment-subtitle">
          {language === 'en' ? 'Please review and complete your payment' : 'Пожалуйста, просмотрите и завершите платеж'}
        </p>

        <div className="payment-summary">
          <div className="summary-item">
            <span className="summary-label">
              {language === 'en' ? 'Couple Name:' : 'Имя пары:'}
            </span>
            <span className="summary-value">{paymentDetails.coupleName}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">
              {language === 'en' ? 'Number of Kids:' : 'Количество детей:'}
            </span>
            <span className="summary-value">{paymentDetails.numberOfKids}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-item total">
            <span className="summary-label">
              {language === 'en' ? 'Total Amount:' : 'Общая сумма:'}
            </span>
            <span className="summary-value amount">${paymentDetails.amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="payment-methods">
          <p className="methods-title">
            {language === 'en' ? 'Payment Method' : 'Способ оплаты'}
          </p>
          <div className="method-options">
            {/* Single Cash App option; replace link as needed */}
            <a
              className="cashapp-link"
              href={paymentDetails.cashAppLink || 'https://cash.app/$hgspringfield/100'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCashAppClick}
            >
              {language === 'en' ? 'Pay with Cash App' : 'Оплатить через Cash App'}
            </a>
            
          </div>
        </div>
        <div className="payment-footer-divider" aria-hidden="true" />
        <div className="payment-actions">
          <button
            className="payment-button cancel"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            {language === 'en' ? 'Back' : 'Назад'}
          </button>
          

          {hasOpenedCashApp && canCompleteRegistration && (
            <button
              className="payment-button confirm"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              
              {isProcessing 
                ? (language === 'en' ? 'Processing...' : 'Обработка...')
                : (language === 'en' ? 'Complete Registration' : 'Завершить регистрацию')}
            </button>
          )}
        
        </div>

        
      </div>
    </div>
  )
}

export default Payment
