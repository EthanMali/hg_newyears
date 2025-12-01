import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegistrationForm from './components/RegistrationForm'
import EventOverview from './components/EventOverview'
import Payment from './components/Payment'
import ThankYou from './components/ThankYou'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/events/register" element={<RegistrationForm />} />
          <Route path="/overview" element={<EventOverview />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

