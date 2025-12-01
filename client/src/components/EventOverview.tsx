import { useState, useEffect } from 'react'
import axios from 'axios'
import './EventOverview.css'
import { getApiUrl } from '../utils/api'

interface Registration {
  id: string
  coupleName: string
  phone: string
  email?: string
  numberOfKids: number
  specialRequests?: string
  attendanceStatus?: 'confirmed' | 'pending' | 'declined'
  createdAt: string
}

interface OverviewData {
  count: number
  totalAdults: number
  totalKids: number
  registrations: Registration[]
  lastUpdated: string
}

const recalcStats = (registrations: Registration[]) => {
  const count = registrations.length
  const totalAdults = count * 2
  const totalKids = registrations.reduce((sum, reg) => sum + (reg.numberOfKids || 0), 0)
  return { count, totalAdults, totalKids }
}

const EventOverview = () => {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!id) return
    if (!window.confirm('Delete this registration?')) return

    try {
      setDeletingId(id)
      await axios.delete(getApiUrl(`/api/users/${id}`))

      setData(prev => {
        if (!prev) return prev
        const updatedRegs = prev.registrations.filter(reg => reg.id !== id)
        const { count, totalAdults, totalKids } = recalcStats(updatedRegs)
        return {
          ...prev,
          registrations: updatedRegs,
          count,
          totalAdults,
          totalKids,
          lastUpdated: new Date().toISOString()
        }
      })
    } catch (deleteError) {
      alert('Failed to delete registration. Please try again.')
      console.error('Delete error:', deleteError)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(getApiUrl('/api/users'))
        if (res.data.success) {
          setData(res.data)
        } else {
          setError('Failed to load data')
        }
      } catch (err) {
        setError('Server offline or unreachable.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredGuests = data?.registrations?.filter(reg => {
    const term = search.toLowerCase()
    return (
      reg.coupleName.toLowerCase().includes(term) ||
      reg.phone.includes(term) ||
      (reg.email?.toLowerCase().includes(term) ?? false)
    )
  }) || []

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    return (
      <span className={`status-badge status-${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="overview-container">
        <div className="overview-header">
          <h1 className="overview-title">Loading...</h1>
          <p className="overview-subtitle">Please wait while we fetch the latest data</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="overview-container">
        <div className="overview-header">
          <h1 className="overview-title">Error Loading Data</h1>
          <p className="overview-subtitle">{error}</p>
          <button 
            className="btn" 
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem' }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="overview-container">
      <header className="overview-header">
        <h1 className="overview-title">Guest List Overview</h1>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{data?.count || 0}</div>
          <div className="stat-label">Total Couples</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data?.totalAdults || 0}</div>
          <div className="stat-label">Adults</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data?.totalKids || 0}</div>
          <div className="stat-label">Children</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {(data?.totalAdults || 0) + (data?.totalKids || 0)}
          </div>
          <div className="stat-label">Total Guests</div>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search guests by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="guests-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Kids</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  {search ? 'No guests match your search.' : 'No guests found.'}
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr key={guest.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{guest.coupleName}</div>
                    {guest.specialRequests && (
                      <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                        {guest.specialRequests}
                      </div>
                    )}
                  </td>
                  <td>
                    <div>{guest.phone}</div>
                    {guest.email && (
                      <div style={{ fontSize: '0.9rem', color: '#3b82f6' }}>
                        <a href={`mailto:${guest.email}`} style={{ color: 'inherit' }}>
                          {guest.email}
                        </a>
                      </div>
                    )}
                  </td>
                  <td>
                    {guest.numberOfKids || 0}
                  </td>
                  <td>
                    {getStatusBadge(guest.attendanceStatus)}
                  </td>
                  <td>
                    {new Date(guest.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(guest.id)}
                      disabled={deletingId === guest.id}
                    >
                      {deletingId === guest.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="action-buttons">
        <button className="btn btn-back" onClick={() => window.history.back()}>
          Back to Form
        </button>
        <button className="btn btn-print" onClick={() => window.print()}>
          Print Guest List
        </button>
      </div>
    </div>
  )
}

export default EventOverview
