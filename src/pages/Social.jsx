import Header from '../components/Header.jsx'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://topdawg-os.onrender.com'

const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{height:100%;background:#07070E;color:#EEEEF5;font-family:'Inter',sans-serif}
  .social-page{min-height:100vh;display:flex;flex-direction:column;background:#07070E}
  .social-main{flex:1;padding:36px 24px;display:flex;flex-direction:column;gap:20px;max-width:900px;width:100%;margin:0 auto;animation:hFadeUp .4s ease .1s forwards;opacity:0}
  .sec-lbl{font-size:10px;font-weight:600;color:#50506A;letter-spacing:.14em;text-transform:uppercase}
  .connect-card{background:#0F0F1C;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:28px}
  .connect-card h2{font-size:14px;font-weight:600;color:#EEEEF5;margin-bottom:6px}
  .connect-card p{font-size:12px;color:#50506A;margin-bottom:20px}
  .platform-row{display:flex;gap:10px;flex-wrap:wrap}
  .fb-connect-btn{display:flex;align-items:center;gap:8px;background:#1877F2;color:#fff;font-weight:700;font-size:13px;padding:11px 20px;border-radius:9px;border:none;cursor:pointer;font-family:inherit;transition:opacity .15s}
  .fb-connect-btn:hover{opacity:.88}
  .placeholder-card{background:#0F0F1C;border:1px dashed rgba(255,255,255,.07);border-radius:12px;padding:56px 24px;text-align:center}
  .placeholder-card p{font-size:13px;color:#30304A}
  @keyframes hFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`

export default function Social() {
  function connectMeta() {
    window.location.href = `${BACKEND}/auth/social/meta/connect`
  }

  return (
    <>
      <style>{css}</style>
      <div className="social-page">
        <Header />
        <main className="social-main">
          <div className="sec-lbl">Digital Presence</div>

          <div className="connect-card">
            <h2>Connect your accounts</h2>
            <p>One click connects both Facebook and Instagram.</p>
            <div className="platform-row">
              <button className="fb-connect-btn" onClick={connectMeta}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Connect Facebook &amp; Instagram
              </button>
            </div>
          </div>

          <div className="placeholder-card">
            <p>Analytics will appear here after connecting your accounts.</p>
          </div>
        </main>
      </div>
    </>
  )
}
