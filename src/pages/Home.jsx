import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://topdawg-os.onrender.com'

export default function Home() {
  const navigate = useNavigate()

  function connectMeta() {
    window.location.href = `${BACKEND}/auth/social/meta/connect`
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logoCard}>
          <img src={logo} alt="Top Dawg Moving LLC" style={styles.logo} />
        </div>
        <h1 style={styles.company}>Top Dawg Moving LLC</h1>
        <p style={styles.tagline}>Your Business. Your Dashboard.</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate('/social')}>
          <div style={styles.cardIcon}>📊</div>
          <h2 style={styles.cardTitle}>Digital Presence</h2>
          <p style={styles.cardSub}>Facebook · Instagram analytics</p>
          <button style={styles.primaryBtn} onClick={e => { e.stopPropagation(); navigate('/social') }}>
            View Dashboard
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>📦</div>
          <h2 style={styles.cardTitle}>Jobs</h2>
          <p style={styles.cardSub}>Coming soon</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>💰</div>
          <h2 style={styles.cardTitle}>Invoicing</h2>
          <p style={styles.cardSub}>Coming soon</p>
        </div>
      </div>

      <footer style={styles.footer}>
        Top Dawg OS &mdash; Built for Top Dawg Moving LLC
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a1a 100%)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCard: {
    background: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: '24px 32px',
    marginBottom: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,162,39,0.3)',
    backdropFilter: 'blur(8px)',
  },
  logo: {
    width: 260,
    height: 'auto',
    display: 'block',
  },
  company: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 36,
    letterSpacing: 3,
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    color: '#c9a227',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    width: '100%',
    maxWidth: 840,
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 16,
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    cursor: 'default',
    transition: 'border-color 0.2s',
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
  },
  cardSub: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  primaryBtn: {
    marginTop: 'auto',
    background: '#c9a227',
    color: '#0d0d0d',
    fontWeight: 700,
    fontSize: 13,
    padding: '10px 18px',
    borderRadius: 8,
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 48,
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
}
