import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateProfile, changePassword } from "../services/userService";
import ProfileHeader from "./ProfileHeader";

const styles = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'DM Sans', sans-serif; background: #090b14; color: #f8fafc; }

  .profile-shell { max-width: 980px; margin: 0 auto; padding: 24px; }
  .profile-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; }
  .profile-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; }
  .profile-title { font-size: clamp(26px, 3vw, 34px); font-weight: 800; margin-bottom: 8px; }
  .profile-subtitle { color: #9ca3af; margin-bottom: 20px; }
  .form-row { display: grid; gap: 16px; margin-bottom: 18px; }
  label { display: block; margin-bottom: 8px; font-size: 13px; color: #cbd5e1; font-weight: 700; }
  input { width: 100%; padding: 14px 16px; border-radius: 14px; border: 1px solid rgba(148,163,184,0.18); background: rgba(255,255,255,0.05); color: #fff; font-size: 14px; }
  .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; margin-bottom: 14px; }
  .save-btn { width: fit-content; padding: 12px 18px; border-radius: 14px; border: none; background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff; font-weight: 700; cursor: pointer; }
  .toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px; border-radius: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); }
  .toggle-label { display: flex; flex-direction: column; gap: 4px; }
  .toggle-title { color: #fff; font-weight: 700; }
  .toggle-description { color: #9ca3af; font-size: 13px; }
  .switch { position: relative; width: 46px; height: 26px; border-radius: 999px; background: rgba(255,255,255,0.12); cursor: pointer; }
  .switch::after { content: ""; position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #fff; top: 4px; left: 4px; transition: transform 0.2s ease; }
  .switch.active::after { transform: translateX(20px); }
  .feedback { color: #34d399; margin-top: 10px; }
  .error { color: #f87171; margin-top: 10px; }
  @media (max-width: 780px) { .profile-grid { grid-template-columns: 1fr; } }
`;

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { user } = await getCurrentUser();
        setUser(user);
        setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
        const savedNotifications = JSON.parse(localStorage.getItem("eventora_notifications") || "null");
        if (savedNotifications) setNotifications(savedNotifications);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load profile.");
      }
    };
    loadUser();
  }, []);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
    setError("");
  };

  const handleNotificationToggle = (key) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    localStorage.setItem("eventora_notifications", JSON.stringify(next));
    setMessage("Notification settings saved.");
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      const { user: updatedUser } = await updateProfile({ name: form.name, email: form.email, phone: form.phone });
      setUser(updatedUser);
      setForm({ name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone || "" });
      localStorage.setItem("eventora_user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("profileUpdated"));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError("Please enter both current and new password.");
      setMessage("");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setMessage("");
      return;
    }

    try {
      setChanging(true);
      setError("");
      await changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setMessage("Password changed successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to change password.");
      setMessage("");
    } finally {
      setChanging(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <ProfileHeader />
      <div className="profile-shell">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <h1 className="profile-title">Profile & Settings</h1>
            <p className="profile-subtitle">Update personal information, change your password, and manage notifications.</p>
          </div>
          <button className="save-btn" onClick={() => navigate("/history")}>View Booking History</button>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="section-title">Personal information</div>
            <div className="form-row">
              <div>
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleFormChange} />
              </div>
              <div>
                <label>Email address</label>
                <input name="email" value={form.email} onChange={handleFormChange} />
              </div>
              <div>
                <label>Phone number</label>
                <input name="phone" value={form.phone || ""} onChange={handleFormChange} placeholder="Optional" />
              </div>
            </div>
            <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
          </div>

          <div className="profile-card">
            <div className="section-title">Notification preferences</div>
            <div className="toggle-row" onClick={() => handleNotificationToggle("email")}> 
              <div className="toggle-label">
                <span className="toggle-title">Email notifications</span>
                <span className="toggle-description">Receive booking updates, reminders and offers.</span>
              </div>
              <div className={`switch ${notifications.email ? "active" : ""}`} />
            </div>
            <div className="toggle-row" onClick={() => handleNotificationToggle("sms")}> 
              <div className="toggle-label">
                <span className="toggle-title">SMS notifications</span>
                <span className="toggle-description">Get SMS alerts for ticket changes and event updates.</span>
              </div>
              <div className={`switch ${notifications.sms ? "active" : ""}`} />
            </div>
          </div>

          <div className="profile-card" style={{ gridColumn: "1 / -1" }}>
            <div className="section-title">Security</div>
            <div className="form-row">
              <div>
                <label>Current password</label>
                <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
              </div>
              <div>
                <label>New password</label>
                <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} />
              </div>
            </div>
            <button className="save-btn" onClick={handleChangePassword} disabled={changing}>{changing ? "Updating..." : "Change password"}</button>
          </div>

          {message && <div className="feedback">{message}</div>}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </>
  );
}
