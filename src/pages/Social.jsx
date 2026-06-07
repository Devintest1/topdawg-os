import { useNavigate } from 'react-router-dom'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://topdawg-os.onrender.com'

export default function Social() {
  const navigate = useNavigate()

  function connectMeta() {
    window.location.href = `${BACKEND}/auth/social/meta/connect`
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← Home</button>
        <h1 style={styles.title}>Digital Presence</h1>
      </div>

      <div style={styles.connectSection}>
        <p style={styles.instructions}>
          Connect your accounts to start seeing your analytics.
        </p>
        <div style={styles.platformRow}>
          <button style={styles.fbBtn} onClick={connectMeta}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{marginRight:8}}>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Connect Facebook &amp; Instagram
          </button>
        </div>
      </div>

      <div style={styles.placeholder}>
        <p style={styles.placeholderText}>
          Your analytics will appear here after connecting.
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a1a 100%)',
    padding: '32px 24px',
    fontFamily: "'Inter', sans-serif",
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
    maxWidth: 900,
    margin: '0 auto 40px',
  },
  backBtn: {
    background: 'transparent',
    color: '#c9a227',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid #c9a227',
    borderRadius: 8,
    padding: '8px 14px',
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 28,
    letterSpacing: 2,
    color: '#ffffff',
  },
  connectSection: {
    maxWidth: 900,
    margin: '0 auto 40px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 16,
    padding: 32,
  },
  instructions: {
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
  },
  platformRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  fbBtn: {
    display: 'flex',
    alignItems: 'center',
    background: '#1877F2',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    padding: '12px 22px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
  },
  placeholder: {
    maxWidth: 900,
    margin: '0 auto',
    background: '#1a1a1a',
    border: '1px dashed #2a2a2a',
    borderRadius: 16,
    padding: 60,
    textAlign: 'center',
  },
  placeholderText: {
    color: '#444',
    fontSize: 14,
  },
}
