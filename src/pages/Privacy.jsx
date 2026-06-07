import Header from '../components/Header.jsx'

const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{background:#07070E;color:#EEEEF5;font-family:'Inter',sans-serif}
  .priv-page{min-height:100vh;display:flex;flex-direction:column;background:#07070E}
  .priv-main{max-width:720px;width:100%;margin:0 auto;padding:40px 24px 80px;animation:hFadeUp .4s ease forwards}
  .priv-main h1{font-size:22px;font-weight:700;margin-bottom:6px;color:#EEEEF5}
  .priv-main .date{font-size:12px;color:#50506A;margin-bottom:32px}
  .priv-main h2{font-size:14px;font-weight:600;color:#c9a227;margin:24px 0 8px;text-transform:uppercase;letter-spacing:.08em}
  .priv-main p{font-size:14px;color:#9090A8;line-height:1.7;margin-bottom:12px}
  .priv-main a{color:#c9a227}
  @keyframes hFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`

export default function Privacy() {
  return (
    <>
      <style>{css}</style>
      <div className="priv-page">
        <Header />
        <main className="priv-main">
          <h1>Privacy Policy</h1>
          <p className="date">Effective date: June 7, 2026</p>

          <h2>Overview</h2>
          <p>Top Dawg OS is a private business dashboard for Top Dawg Moving LLC. It is not a public app. Only authorized users may access it.</p>

          <h2>Information We Collect</h2>
          <p>When you connect your Facebook or Instagram account, we collect your Facebook Page access token and Instagram account ID. These are used solely to display your business analytics within the dashboard.</p>

          <h2>How We Use Your Information</h2>
          <p>Access tokens are stored securely in Google Firestore and are used exclusively to fetch your Page and Instagram metrics (followers, reach, engagement, posts). We do not sell, share, or use your data for advertising.</p>

          <h2>Data Storage</h2>
          <p>Tokens are stored in Google Firebase (Firestore). We do not store personal profile information beyond what is required to authenticate API requests.</p>

          <h2>Third-Party Services</h2>
          <p>This app connects to the Facebook Graph API and Instagram Graph API (Meta Platforms, Inc.) to retrieve business analytics. Your use of those services is governed by Meta's own privacy policy.</p>

          <h2>Data Deletion</h2>
          <p>To request deletion of your data, disconnect your Facebook account from the dashboard. All stored tokens will be removed. You may also email us at the address below.</p>

          <h2>Contact</h2>
          <p>For any privacy-related questions, contact: <a href="mailto:lilwatson610@gmail.com">lilwatson610@gmail.com</a></p>
        </main>
      </div>
    </>
  )
}
