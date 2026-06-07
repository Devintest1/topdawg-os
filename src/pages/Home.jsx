import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://topdawg-os.onrender.com'

const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{height:100%;background:#07070E;color:#EEEEF5;font-family:'Inter',sans-serif}
  .home{height:100vh;display:flex;flex-direction:column}



  .home-main{flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:36px;padding:48px 24px 24px;overflow:hidden;animation:hFadeUp .4s ease .1s forwards;opacity:0}
  .sec-lbl{font-size:10px;font-weight:600;color:#50506A;letter-spacing:.14em;text-transform:uppercase;text-align:center}

  .feature-grid{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:860px;width:100%}

  .fb{display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 20px;background:#0F0F1C;border:1px solid rgba(255,255,255,.07);border-radius:12px;cursor:pointer;text-decoration:none;color:inherit;width:180px;min-height:120px;transition:all .18s ease;position:relative;overflow:hidden;font-family:inherit;text-align:center;border:none}
  .fb::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,162,39,.5),transparent);opacity:0;transition:opacity .18s}
  .fb:hover,.fb:active{background:#141420;border-color:rgba(201,162,39,.28) !important;transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.4),0 0 0 1px rgba(201,162,39,.08)}
  .fb:active{transform:translateY(0)}
  .fb:hover::before{opacity:1}
  .fb-ic{width:32px;height:32px;border-radius:8px;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .fb-label{font-size:13px;font-weight:600;color:#EEEEF5;line-height:1.2}
  .fb-desc{font-size:11px;color:#50506A;line-height:1.3;padding:6px 7px;background:rgba(15,15,28,.55);border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.4);align-self:stretch;text-align:center}
  .fb-arrow{margin-top:auto;font-size:11px;color:#c9a227;font-weight:500;display:flex;align-items:center;gap:4px;opacity:0;transition:opacity .18s}
  .fb:hover .fb-arrow{opacity:1}

  .fb.soon{cursor:default;opacity:.4;pointer-events:none}
  .fb.soon .fb-ic{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08)}
  .soon-badge{font-size:9px;font-weight:700;background:rgba(255,255,255,.05);color:#50506A;border:1px solid rgba(255,255,255,.07);border-radius:3px;padding:1px 5px;letter-spacing:.06em;text-transform:uppercase;position:absolute;top:12px;right:12px}

  .fb-wrap{display:flex;flex-direction:column;gap:8px;width:180px;min-height:120px}
  .fb-chevron{margin-top:auto;font-size:11px;color:#c9a227;line-height:1}

  .dp-wrap{position:relative}
  .dp-card{cursor:pointer;border:1px solid rgba(255,255,255,.07) !important}
  .dp-card.pay-open{background:#141420 !important;border-color:rgba(201,162,39,.35) !important}
  .dp-chevron-btn{background:none;border:none;font-size:11px;color:#c9a227;line-height:1;cursor:pointer;padding:6px 12px;border-radius:6px;font-family:inherit;transition:background .15s;margin-top:auto;align-self:center}
  .dp-chevron-btn:hover{background:rgba(201,162,39,.12)}
  .dp-dropdown{position:absolute;top:calc(100% + 8px);left:0;right:0;z-index:200;display:flex;flex-direction:column;gap:8px;animation:hFadeUp .15s ease}
  .fb-sub{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#0F0F1C;border:1px solid rgba(201,162,39,.18);border-radius:10px;cursor:pointer;transition:all .15s;animation:hFadeUp .15s ease;width:100%}
  .fb-sub:hover{background:#141420;border-color:rgba(201,162,39,.35)}
  .fb-sub-ic{width:30px;height:30px;border-radius:7px;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .fb-sub-name{font-size:13px;font-weight:600;color:#EEEEF5}
  .fb-sub-desc{font-size:10px;color:#50506A;margin-top:1px}

  @keyframes hFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

  @media(min-width:601px){
    .home-hdr{justify-content:center;position:relative}
    .h-brand{flex-direction:column;align-items:center;gap:5px}
    .h-div{display:none}
  }
`

export default function Home() {
  const navigate = useNavigate()
  const [socialOpen, setSocialOpen] = useState(false)
  const socialRef = useRef()

  useEffect(() => {
    if (!socialOpen) return
    const handler = (e) => {
      if (socialRef.current && !socialRef.current.contains(e.target)) setSocialOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [socialOpen])

  return (
    <>
      <style>{css}</style>
      <div className="home">

        <Header />

        <main className="home-main">
          <div className="sec-lbl">Select a workflow</div>

          <div className="feature-grid">

            {/* Digital Presence — split click card */}
            <div className="fb-wrap dp-wrap" ref={socialRef}>
              <div
                className={"fb dp-card" + (socialOpen ? " pay-open" : "")}
                onClick={() => { navigate('/social'); setSocialOpen(false) }}
              >
                <div className="fb-ic">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="#c9a227" strokeWidth="1.4"/>
                    <path d="M8 1.5C8 1.5 5.5 4 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4 10.5 8S8 14.5 8 14.5M1.5 8h13" stroke="#c9a227" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="fb-label">Digital Presence</div>
                <div className="fb-desc">Facebook · Instagram</div>
                <button
                  className="dp-chevron-btn"
                  onClick={(e) => { e.stopPropagation(); setSocialOpen(o => !o) }}
                >
                  {socialOpen ? '▲' : '▼'}
                </button>
              </div>
              {socialOpen && (
                <div className="dp-dropdown">
                  <div className="fb-sub" onClick={() => { navigate('/social'); setSocialOpen(false) }}>
                    <div className="fb-sub-ic">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a227">
                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="fb-sub-name">Facebook</div>
                      <div className="fb-sub-desc">Top Dawg Moving LLC</div>
                    </div>
                  </div>
                  <div className="fb-sub" onClick={() => { navigate('/social'); setSocialOpen(false) }}>
                    <div className="fb-sub-ic">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <defs><linearGradient id="ig2" x1="0" y1="16" x2="16" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#F9A825"/><stop offset="40%" stopColor="#E1306C"/><stop offset="100%" stopColor="#833AB4"/></linearGradient></defs>
                        <rect x="1" y="1" width="14" height="14" rx="4" stroke="url(#ig2)" strokeWidth="1.4"/>
                        <circle cx="8" cy="8" r="2.8" stroke="url(#ig2)" strokeWidth="1.4"/>
                        <circle cx="11.8" cy="4.2" r="0.8" fill="url(#ig2)"/>
                      </svg>
                    </div>
                    <div>
                      <div className="fb-sub-name">Instagram</div>
                      <div className="fb-sub-desc">@topdawgmoving</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="fb soon">
              <span className="soon-badge">Soon</span>
              <div className="fb-ic">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#50506A" strokeWidth="1.4"/><path d="M1 6.5h14" stroke="#50506A" strokeWidth="1.4"/><path d="M4 9.5h2M4 11h2" stroke="#50506A" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </div>
              <div className="fb-label">Invoicing</div>
              <div className="fb-desc">Jobs &amp; billing</div>
            </div>

            <div className="fb soon">
              <span className="soon-badge">Soon</span>
              <div className="fb-ic">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#50506A" strokeWidth="1.4"/><path d="M8 5v3l2 2" stroke="#50506A" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </div>
              <div className="fb-label">Scheduling</div>
              <div className="fb-desc">Crew &amp; job calendar</div>
            </div>

            <div className="fb soon">
              <span className="soon-badge">Soon</span>
              <div className="fb-ic">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 2H3a1 1 0 00-1 1v7a1 1 0 001 1h2v2.5L8.5 11H13a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="#50506A" strokeWidth="1.4" strokeLinejoin="round"/></svg>
              </div>
              <div className="fb-label">Client Portal</div>
              <div className="fb-desc">Live job updates</div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}
