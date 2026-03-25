import React from "react";
import "../App.css";

const LoginPage = () => {
  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="logo-row">
          <div className="logo-icon"> <span role="img" aria-label="logo">🟪</span> </div>
          <span className="logo-text">Eventora</span>
        </div>
        <button className="live-btn"># LIVE EVENTS NEAR YOU</button>
        <h1 className="main-title">
          Your next<br />
          great <span className="gradient-text">experience</span><br />
          starts here.
        </h1>
        <p className="subtitle">
          Browse, book, and attend the events that matter — concerts, conferences, sports, and more. Your digital pass, always in your pocket.
        </p>
        <div className="category-row">
          <span className="category">🎵 Music</span>
          <span className="category">🏀 Sports</span>
          <span className="category">🗂️ Conferences</span>
          <span className="category">🎭 Cultural</span>
          <span className="category">🛠 Workshops</span>
        </div>
        <div className="stats-row">
          <div><span className="stat-num">500+</span><br />Monthly Events</div>
          <div><span className="stat-num">120K</span><br />Active Users</div>
          <div><span className="stat-num">98%</span><br />Satisfaction</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-tabs">
          <button className="tab active">Sign In</button>
          <button className="tab">Create Account</button>
        </div>
        <div className="auth-box">
          <h2 className="welcome-title">Welcome back <span role="img" aria-label="wave">👋</span></h2>
          <p className="welcome-sub">Sign in to continue to Eventora</p>
          <div className="role-row">
            <button className="role-btn active">Attendee</button>
            <button className="role-btn">Organizer</button>
          </div>
          <form className="auth-form">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" />
            <label>Password</label>
            <input type="password" placeholder="" />
            <div className="forgot-row">
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <button className="submit-btn" type="submit">Sign In &rarr;</button>
          </form>
          <div className="signup-row">
            No account? <a href="#" className="signup-link">Sign up free &rarr;</a>
          </div>
          <div className="security-row">
            <span>🔒 SSL Encrypted</span>
            <span>✔️ Verified Secure</span>
            <span>🕑 24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;