import { useNavigate } from 'react-router-dom'
import './ThankYou.css'

const ThankYou = () => {
  const navigate = useNavigate()

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        <h1>Thank you!</h1>
        <p>We received your registration and payment. See you soon!</p>
        <button onClick={() => navigate('/')}>Return Home</button>
      </div>
    </div>
  )
}

export default ThankYou
