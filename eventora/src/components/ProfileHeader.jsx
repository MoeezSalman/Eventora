import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileInitial, setProfileInitial] = useState("U");
  const [userRole, setUserRole] = useState("attendee");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("eventora_user") || "{}");
    if (user.name) {
      setProfileInitial(user.name.charAt(0).toUpperCase());
    }
    if (user.role) {
      setUserRole(String(user.role).toLowerCase().trim());
    }

    const handleProfileUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem("eventora_user") || "{}");
      if (updatedUser.name) {
        setProfileInitial(updatedUser.name.charAt(0).toUpperCase());
      }
      if (updatedUser.role) {
        setUserRole(String(updatedUser.role).toLowerCase().trim());
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eventora_token");
    localStorage.removeItem("eventora_user");
    localStorage.removeItem("eventora_notifications");
    window.dispatchEvent(new Event("profileUpdated"));
    navigate("/");
  };

  const headerStyles = `
    .profile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 14px 32px;
      border-bottom: 1px solid rgba(123, 116, 221, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(8px);
      background: rgba(3, 5, 9, 0.9);
    }

    .profile-header-logo {
      display: flex;
      gap: 10px;
      align-items: center;
      font-weight: 800;
      font-size: 1.1rem;
      color: #fff;
    }

    .profile-header-logo-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      font-size: 1rem;
    }

    .profile-header-spacer {
      flex: 1;
    }

    .profile-header-button {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      display: grid;
      place-items: center;
      font-weight: 700;
      cursor: pointer;
      border: none;
      color: #fff;
      font-size: 1rem;
      flex-shrink: 0;
      transition: all 0.25s ease;
    }

    .profile-header-button:hover {
      transform: scale(1.05);
    }

    .profile-header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .profile-header-tabs {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .profile-header-tab {
      padding: 9px 16px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.04);
      color: #c7cced;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .profile-header-tab:hover,
    .profile-header-tab.active {
      color: #fff;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      border-color: transparent;
      transform: translateY(-1px);
    }

    .profile-header-button {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      display: grid;
      place-items: center;
      font-weight: 700;
      cursor: pointer;
      border: none;
      color: #fff;
      font-size: 1rem;
      flex-shrink: 0;
      transition: all 0.25s ease;
    }

    .profile-header-button:hover {
      transform: scale(1.05);
    }

    .profile-header-logout {
      padding: 10px 16px;
      border: 1px solid rgba(255,255,255,0.16);
      border-radius: 999px;
      background: transparent;
      color: #c7cced;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .profile-header-logout:hover {
      color: #fff;
      background: rgba(255,255,255,0.08);
      transform: translateY(-1px);
    }
  `;

  const attendeeTabs = [
    { label: "Browse", path: "/dashboard" },
    { label: "My Tickets", path: "/tickets" },
    { label: "History", path: "/history" },
  ];

  return (
    <>
      <style>{headerStyles}</style>
      <nav className="profile-header">
        <div className="profile-header-logo">
          <div className="profile-header-logo-icon">🎉</div>
          <span>Eventora</span>
        </div>

        {userRole === "attendee" ? (
          <div className="profile-header-tabs">
            {attendeeTabs.map((tab) => (
              <button
                key={tab.path}
                type="button"
                className={`profile-header-tab ${location.pathname === tab.path ? "active" : ""}`}
                onClick={() => navigate(tab.path)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="profile-header-actions">
          <button
            className="profile-header-logout"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button 
            className="profile-header-button" 
            onClick={() => navigate("/profile")} 
            title="Go to Profile"
          >
            {profileInitial}
          </button>
        </div>
      </nav>
    </>
  );
};

export default ProfileHeader;
