import { useNavigate, useLocation } from 'react-router-dom'

const css = `
  .td-hdr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(255,255,255,.06);
    background: #07070E;
    flex-shrink: 0;
    position: relative;
    animation: hFadeUp .35s ease forwards;
  }
  .td-hdr-logo {
    width: 72px;
    height: 72px;
    object-fit: contain;
    filter: invert(1);
  }
  .td-hdr-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .td-hdr-wordmark {
    font-family: 'Antonio', sans-serif;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #EEEEF5;
  }
  .td-hdr-os {
    font-size: 10px;
    font-weight: 600;
    background: rgba(201,162,39,.12);
    color: #c9a227;
    border: 1px solid rgba(201,162,39,.28);
    border-radius: 4px;
    padding: 2px 7px;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .td-hdr-back {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: 1px solid rgba(201,162,39,.3);
    border-radius: 7px;
    color: #c9a227;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
    cursor: pointer;
    font-family: inherit;
    transition: all .15s;
  }
  .td-hdr-back:hover {
    background: rgba(201,162,39,.08);
    border-color: rgba(201,162,39,.5);
  }
  @keyframes hFadeUp {
    from { opacity:0; transform:translateY(8px) }
    to   { opacity:1; transform:translateY(0) }
  }
`

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <style>{css}</style>
      <header className="td-hdr">
        {!isHome && (
          <button className="td-hdr-back" onClick={() => navigate('/')}>← Home</button>
        )}
        <img className="td-hdr-logo" src="/logo.png" alt="Top Dawg Moving LLC" />
        <div className="td-hdr-name-row">
          <span className="td-hdr-wordmark">Top Dawg Moving LLC</span>
          <span className="td-hdr-os">OS</span>
        </div>
      </header>
    </>
  )
}
