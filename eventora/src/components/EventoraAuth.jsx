import { useState } from "react";
import { useNavigate } from "react-router-dom";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    display: flex;
    min-height: 100vh;
    background: #0d0e1a;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
  }

  /* ── LEFT PANEL ── */
  .auth-left {
    flex: 1;
    padding: 48px 56px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    background: radial-gradient(ellipse at 30% 40%, rgba(99,60,180,0.18) 0%, transparent 65%);
    position: relative;
    overflow: hidden;
    justify-content: space-between;
  }
  .auth-left::before {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 340px; height: 340px;
    background: radial-gradient(circle, rgba(99,60,180,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .left-content {
    display: flex;
    flex-direction: column;
    gap: 28px;
    flex: 1;
    justify-content: center;
  }

  .logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo-icon {
    width: 32px; height: 32px;
    background: #7c3aed;
    border-radius: 7px;
    flex-shrink: 0;
  }
  .logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }

  .live-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    background: rgba(99,60,180,0.25);
    border: 1px solid rgba(124,58,237,0.4);
    border-radius: 999px;
    color: #c4b5fd;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1.5px;
    cursor: pointer;
    width: fit-content;
  }
  .live-dot {
    width: 7px; height: 7px;
    background: #a78bfa;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.4; transform:scale(1.4); }
  }

  .main-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 3.5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -1.5px;
  }
  .gradient-text {
    background: linear-gradient(90deg, #a78bfa, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 15px;
    color: #8b8fa8;
    line-height: 1.65;
    max-width: 380px;
  }

  .category-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .category {
    padding: 8px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    font-size: 13px;
    color: #c4b5fd;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .category:hover { background: rgba(124,58,237,0.2); }

  .stats-row {
    display: flex;
    gap: 40px;
    padding-top: 8px;
    flex-wrap: wrap;
  }
  .stat-item { line-height: 1; }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    display: block;
    margin-bottom: 4px;
  }
  .stat-label {
    font-size: 13px;
    color: #6b7280;
  }

  /* ── RIGHT PANEL ── */
  .auth-right {
    width: 460px;
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 20px;
    background: rgba(255,255,255,0.02);
    border-left: 1px solid rgba(255,255,255,0.06);
    overflow-y: auto;
    flex-shrink: 0;
  }

  .auth-tabs {
    display: flex;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    padding: 4px;
    width: 100%;
  }
  .tab {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background: transparent;
    color: #8b8fa8;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .tab.active {
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    color: #fff;
  }

  .auth-box {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 32px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .welcome-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
  .welcome-sub {
    font-size: 14px;
    color: #8b8fa8;
    margin-top: 4px;
  }

  .role-row {
    display: flex;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 4px;
    gap: 4px;
  }
  .role-btn {
    flex: 1;
    padding: 9px;
    border: none;
    border-radius: 7px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background: transparent;
    color: #8b8fa8;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .role-btn.active {
    background: #7c3aed;
    color: #fff;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 8px;
  }
  .auth-form label {
    font-size: 13px;
    font-weight: 600;
    color: #d1d5db;
  }
  .auth-form input {
    width: 100%;
    padding: 13px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  .auth-form input:focus { border-color: #7c3aed; }
  .auth-form input::placeholder { color: #4b5563; }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    cursor: pointer;
    margin-top: 6px;
    transition: opacity 0.2s, transform 0.1s;
    letter-spacing: 0.3px;
  }
  .submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .submit-btn:active { transform: translateY(0); }

  .signup-row {
    font-size: 13px;
    color: #8b8fa8;
    text-align: center;
  }
  .signup-link {
    color: #a78bfa;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }
  .signup-link:hover { text-decoration: underline; }

  .security-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #4b5563;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-top: 16px;
    gap: 8px;
  }

  /* ── RESPONSIVE ── */

  /* Tablet: stack vertically, left panel shrinks */
  @media (max-width: 900px) {
    .auth-root {
      flex-direction: column;
      min-height: 100vh;
    }
    .auth-left {
      padding: 36px 32px;
      gap: 20px;
      flex: none;
    }
    .left-content {
      gap: 20px;
    }
    .main-title {
      font-size: clamp(28px, 5vw, 40px);
    }
    .stats-row {
      gap: 28px;
    }
    .auth-right {
      width: 100%;
      border-left: none;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 36px 32px;
    }
  }

  /* Mobile */
  @media (max-width: 600px) {
    .auth-left {
      padding: 28px 20px;
    }
    .auth-right {
      padding: 28px 20px;
    }
    .auth-box {
      padding: 24px 20px;
    }
    .main-title {
      font-size: clamp(26px, 7vw, 34px);
      letter-spacing: -1px;
    }
    .subtitle {
      font-size: 14px;
    }
    .stats-row {
      gap: 24px;
    }
    .stat-num {
      font-size: 22px;
    }
    .security-row {
      flex-direction: column;
      align-items: center;
      gap: 6px;
      text-align: center;
    }
    .category-row {
      gap: 8px;
    }
    .category {
      font-size: 12px;
      padding: 7px 13px;
    }
  }

  @media (max-width: 380px) {
    .auth-left {
      padding: 24px 16px;
    }
    .auth-right {
      padding: 24px 16px;
    }
    .auth-box {
      padding: 20px 16px;
    }
  }
`;

export default function EventoraAuth() {
  const [activeTab, setActiveTab] = useState("signin");
  const [activeRole, setActiveRole] = useState("attendee");
  const navigate = useNavigate();
  const isSignIn = activeTab === "signin";

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        {/* LEFT */}
        <div className="auth-left">
          <div className="logo-row">
            <div className="logo-icon" />
            <span className="logo-text">Eventora</span>
          </div>

          <div className="left-content">
            <button className="live-btn">
              <span className="live-dot" />
              # LIVE EVENTS NEAR YOU
            </button>

            <h1 className="main-title">
              Your next<br />
              great <span className="gradient-text">experience</span><br />
              starts here.
            </h1>

            <p className="subtitle">
              Browse, book, and attend the events that matter — concerts, conferences, sports, and more. Your digital pass, always in your pocket.
            </p>

            <div className="category-row">
              {["🎵 Music","🏀 Sports","🗂️ Conferences","🎭 Cultural","🛠 Workshops"].map(c => (
                <span key={c} className="category">{c}</span>
              ))}
            </div>
          </div>

          <div className="stats-row">
            {[["500+","Monthly Events"],["120K","Active Users"],["98%","Satisfaction"]].map(([n,l]) => (
              <div className="stat-item" key={l}>
                <span className="stat-num">{n}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-tabs">
            <button className={`tab ${activeTab === "signin" ? "active" : ""}`} onClick={() => setActiveTab("signin")}>
              Sign In
            </button>
            <button className={`tab ${activeTab === "signup" ? "active" : ""}`} onClick={() => setActiveTab("signup")}>
              Create Account
            </button>
          </div>

          <div className="auth-box">
            <div>
              <h2 className="welcome-title">
                {isSignIn ? "Welcome back 👋" : "Create your account 👋"}
              </h2>
              <p className="welcome-sub">
                {isSignIn ? "Sign in to continue to Eventora" : "Sign up to get started with Eventora"}
              </p>
            </div>

            <div className="role-row">
              <button className={`role-btn ${activeRole === "attendee" ? "active" : ""}`} onClick={() => setActiveRole("attendee")}>
                Attendee
              </button>
              <button className={`role-btn ${activeRole === "organizer" ? "active" : ""}`} onClick={() => setActiveRole("organizer")}>
                Organizer
              </button>
            </div>

            <div className="auth-form">
              {!isSignIn && (
                <div className="form-field">
                  <label>Full Name</label>
                  <input type="text" placeholder="Your Name" />
                </div>
              )}
              <div className="form-field">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" />
              </div>
              <div className="form-field">
                <label>Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
             <button
  className="submit-btn"
  onClick={() => navigate("/dashboard")}
>
  {isSignIn ? "Sign In →" : "Create Account →"}
</button>
            </div>

            <div className="signup-row">
              {isSignIn ? (
                <>No account? <span className="signup-link" onClick={() => setActiveTab("signup")}>Sign up free →</span></>
              ) : (
                <>Already have an account? <span className="signup-link" onClick={() => setActiveTab("signin")}>Sign in →</span></>
              )}
            </div>

            <div className="security-row">
              <span>🔒 SSL Encrypted</span>
              <span>✔️ Verified Secure</span>
              <span>🕑 24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}