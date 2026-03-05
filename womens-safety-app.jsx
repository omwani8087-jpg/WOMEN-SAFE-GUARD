import { useState, useEffect, useRef } from "react";

const TABS = ["home", "contacts", "map", "resources", "settings"];

const SAFE_LOCATIONS = [
  { name: "City Police Station", distance: "0.3 km", type: "police", lat: 19.076, lng: 72.877 },
  { name: "Apollo Hospital", distance: "0.7 km", type: "hospital", lat: 19.079, lng: 72.881 },
  { name: "Women's Shelter Home", distance: "1.1 km", type: "shelter", lat: 19.073, lng: 72.872 },
  { name: "Fire Station No. 4", distance: "1.4 km", type: "fire", lat: 19.082, lng: 72.874 },
];

const RESOURCES = [
  { title: "Women Helpline", number: "1091", desc: "24/7 national women helpline", icon: "📞" },
  { title: "Police Emergency", number: "100", desc: "Immediate police assistance", icon: "🚓" },
  { title: "Ambulance", number: "108", desc: "Medical emergency response", icon: "🚑" },
  { title: "Domestic Violence", number: "181", desc: "Domestic abuse support line", icon: "🏠" },
  { title: "Cyber Crime", number: "1930", desc: "Report online harassment", icon: "💻" },
];

const SAFETY_TIPS = [
  "Share your live location with trusted contacts when traveling alone.",
  "Trust your instincts — if something feels wrong, it probably is.",
  "Keep your phone charged and carry a portable power bank.",
  "Learn basic self-defense techniques for confidence.",
  "Know the emergency exits of places you frequent.",
  "Vary your daily routes to avoid predictability.",
];

const typeColors = {
  police: "#3b82f6",
  hospital: "#ef4444",
  shelter: "#8b5cf6",
  fire: "#f97316",
};

const typeIcons = {
  police: "🚔",
  hospital: "🏥",
  shelter: "🏡",
  fire: "🚒",
};

const initialContacts = [
  { id: 1, name: "Mom", phone: "+91 98765 43210", relation: "Mother", avatar: "M", trusted: true },
  { id: 2, name: "Priya", phone: "+91 87654 32109", relation: "Best Friend", avatar: "P", trusted: true },
  { id: 3, name: "Rahul", phone: "+91 76543 21098", relation: "Brother", avatar: "R", trusted: false },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(null);
  const [contacts, setContacts] = useState(initialContacts);
  const [locationSharing, setLocationSharing] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
  const [alertSent, setAlertSent] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [sosHeld, setSosHeld] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);
  const sosTimer = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTipIndex(i => (i + 1) % SAFETY_TIPS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sosCountdown !== null && sosCountdown > 0) {
      sosTimer.current = setTimeout(() => setSosCountdown(c => c - 1), 1000);
    } else if (sosCountdown === 0) {
      setAlertSent(true);
      setSosCountdown(null);
    }
    return () => clearTimeout(sosTimer.current);
  }, [sosCountdown]);

  const startSosHold = () => {
    setSosHeld(true);
    setHoldProgress(0);
    let prog = 0;
    progressTimer.current = setInterval(() => {
      prog += 2;
      setHoldProgress(Math.min(prog, 100));
    }, 60);
    holdTimer.current = setTimeout(() => {
      triggerSOS();
    }, 3000);
  };

  const endSosHold = () => {
    setSosHeld(false);
    setHoldProgress(0);
    clearTimeout(holdTimer.current);
    clearInterval(progressTimer.current);
  };

  const triggerSOS = () => {
    clearInterval(progressTimer.current);
    setSosHeld(false);
    setHoldProgress(100);
    setSosActive(true);
    setLocationSharing(true);
    setSosCountdown(3);
    setAlertSent(false);
  };

  const cancelSOS = () => {
    setSosActive(false);
    setAlertSent(false);
    setSosCountdown(null);
    clearTimeout(sosTimer.current);
    setHoldProgress(0);
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts(prev => [...prev, {
      id: Date.now(),
      ...newContact,
      avatar: newContact.name[0].toUpperCase(),
      trusted: false,
    }]);
    setNewContact({ name: "", phone: "", relation: "" });
    setShowAddContact(false);
  };

  const removeContact = (id) => setContacts(prev => prev.filter(c => c.id !== id));
  const toggleTrusted = (id) => setContacts(prev => prev.map(c => c.id === id ? { ...c, trusted: !c.trusted } : c));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', serif",
      color: "#f0e6ff",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, #3b0764 0%, transparent 70%)",
        opacity: 0.5,
      }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 200, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 100% at 50% 100%, #1e0533 0%, transparent 70%)",
        opacity: 0.4,
      }} />

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(167,139,250,0.15)",
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 0 16px rgba(168,85,247,0.5)",
          }}>🛡️</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", color: "#e9d5ff" }}>SafeHer</div>
            <div style={{ fontSize: 10, color: "#a78bfa", letterSpacing: "0.08em" }}>YOUR SAFETY COMPANION</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {locationSharing && (
            <div style={{
              fontSize: 10, padding: "4px 10px", borderRadius: 20,
              background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
              color: "#4ade80", display: "flex", alignItems: "center", gap: 5,
              animation: "pulse 2s infinite",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              LIVE
            </div>
          )}
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, cursor: "pointer",
          }}>👤</div>
        </div>
      </header>

      {/* SOS Overlay */}
      {sosActive && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.92)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 24, animation: "fadeIn 0.3s ease",
        }}>
          <div style={{
            width: 160, height: 160, borderRadius: "50%",
            background: alertSent ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.1)",
            border: `3px solid ${alertSent ? "#ef4444" : "rgba(239,68,68,0.4)"}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            boxShadow: alertSent ? "0 0 60px rgba(239,68,68,0.5), 0 0 120px rgba(239,68,68,0.2)" : "0 0 40px rgba(239,68,68,0.3)",
            animation: "sosPulse 1s infinite",
          }}>
            <div style={{ fontSize: 40 }}>{alertSent ? "✅" : "🆘"}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#ef4444", letterSpacing: "0.1em" }}>
              {alertSent ? "SENT!" : sosCountdown !== null ? sosCountdown : "SOS"}
            </div>
            <div style={{ fontSize: 11, color: "#fca5a5", marginTop: 4 }}>
              {alertSent ? "Help is coming" : sosCountdown !== null ? "Alerting contacts..." : "ACTIVE"}
            </div>
          </div>

          {alertSent && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 16, padding: "16px 24px", textAlign: "center", maxWidth: 280,
            }}>
              <div style={{ fontSize: 13, color: "#fca5a5", marginBottom: 8 }}>Alert sent to:</div>
              {contacts.filter(c => c.trusted).map(c => (
                <div key={c.id} style={{ fontSize: 14, color: "#f0e6ff", padding: "4px 0" }}>
                  ✓ {c.name} ({c.phone})
                </div>
              ))}
              <div style={{ fontSize: 12, color: "#a78bfa", marginTop: 8 }}>📍 Live location shared</div>
            </div>
          )}

          <button
            onClick={cancelSOS}
            style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#f0e6ff", padding: "12px 32px", borderRadius: 30,
              fontSize: 14, cursor: "pointer", letterSpacing: "0.05em",
            }}
          >
            {alertSent ? "CLOSE" : "CANCEL SOS"}
          </button>
        </div>
      )}

      {/* Main Content */}
      <main style={{ position: "relative", zIndex: 1, paddingBottom: 80 }}>
        {tab === "home" && <HomeTab
          contacts={contacts}
          locationSharing={locationSharing}
          setLocationSharing={setLocationSharing}
          tipIndex={tipIndex}
          sosHeld={sosHeld}
          holdProgress={holdProgress}
          startSosHold={startSosHold}
          endSosHold={endSosHold}
        />}
        {tab === "contacts" && <ContactsTab
          contacts={contacts}
          removeContact={removeContact}
          toggleTrusted={toggleTrusted}
          showAddContact={showAddContact}
          setShowAddContact={setShowAddContact}
          newContact={newContact}
          setNewContact={setNewContact}
          addContact={addContact}
        />}
        {tab === "map" && <MapTab />}
        {tab === "resources" && <ResourcesTab />}
        {tab === "settings" && <SettingsTab locationSharing={locationSharing} setLocationSharing={setLocationSharing} />}
      </main>

      {/* Bottom Nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "rgba(10,10,15,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(167,139,250,0.15)",
        display: "flex", justifyContent: "space-around",
        padding: "10px 0 16px",
        zIndex: 40,
      }}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "contacts", icon: "👥", label: "Contacts" },
          { id: "map", icon: "🗺️", label: "Map" },
          { id: "resources", icon: "📚", label: "Resources" },
          { id: "settings", icon: "⚙️", label: "Settings" },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "4px 12px", borderRadius: 12,
              transition: "all 0.2s",
              opacity: tab === item.id ? 1 : 0.45,
            }}
          >
            <div style={{
              fontSize: 20,
              filter: tab === item.id ? "drop-shadow(0 0 8px rgba(168,85,247,0.8))" : "none",
              transform: tab === item.id ? "scale(1.15)" : "scale(1)",
              transition: "all 0.2s",
            }}>{item.icon}</div>
            <span style={{
              fontSize: 9, letterSpacing: "0.06em",
              color: tab === item.id ? "#a78bfa" : "#6b7280",
              fontFamily: "sans-serif",
            }}>{item.label.toUpperCase()}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @keyframes sosPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>
    </div>
  );
}

function HomeTab({ contacts, locationSharing, setLocationSharing, tipIndex, sosHeld, holdProgress, startSosHold, endSosHold }) {
  return (
    <div style={{ padding: "20px 20px 0" }}>
      {/* Safety tip */}
      <div style={{
        background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)",
        borderRadius: 14, padding: "12px 16px", marginBottom: 24,
        display: "flex", gap: 10, alignItems: "flex-start",
        animation: "slideUp 0.4s ease",
      }}>
        <span style={{ fontSize: 18 }}>💡</span>
        <div>
          <div style={{ fontSize: 10, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: 3 }}>SAFETY TIP</div>
          <div style={{ fontSize: 13, color: "#e9d5ff", lineHeight: 1.5 }}>{SAFETY_TIPS[tipIndex]}</div>
        </div>
      </div>

      {/* SOS Button */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16, letterSpacing: "0.06em", fontFamily: "sans-serif" }}>
          HOLD FOR 3 SECONDS TO ACTIVATE SOS
        </div>
        <div style={{ position: "relative" }}>
          {/* Outer ring */}
          <svg width={200} height={200} style={{ position: "absolute", top: -10, left: -10 }}>
            <circle cx={100} cy={100} r={90} fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth={4} />
            <circle
              cx={100} cy={100} r={90}
              fill="none"
              stroke="#ef4444"
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={565}
              strokeDashoffset={565 - (565 * holdProgress / 100)}
              transform="rotate(-90 100 100)"
              style={{ transition: "stroke-dashoffset 0.06s linear", filter: "drop-shadow(0 0 8px #ef4444)" }}
            />
          </svg>
          <button
            onMouseDown={startSosHold}
            onMouseUp={endSosHold}
            onMouseLeave={endSosHold}
            onTouchStart={startSosHold}
            onTouchEnd={endSosHold}
            style={{
              width: 180, height: 180, borderRadius: "50%",
              background: sosHeld
                ? "radial-gradient(circle, #dc2626, #991b1b)"
                : "radial-gradient(circle, #ef4444, #b91c1c)",
              border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: sosHeld
                ? "0 0 60px rgba(239,68,68,0.8), 0 0 100px rgba(239,68,68,0.4), inset 0 0 30px rgba(0,0,0,0.3)"
                : "0 0 40px rgba(239,68,68,0.4), 0 0 80px rgba(239,68,68,0.15)",
              transform: sosHeld ? "scale(0.96)" : "scale(1)",
              transition: "all 0.15s ease",
              userSelect: "none", WebkitUserSelect: "none",
            }}
          >
            <div style={{ fontSize: 40, pointerEvents: "none" }}>🆘</div>
            <div style={{
              fontSize: 28, fontWeight: 900, color: "white", letterSpacing: "0.1em",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)", pointerEvents: "none",
            }}>SOS</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 4, fontFamily: "sans-serif", pointerEvents: "none" }}>
              {sosHeld ? "HOLD..." : "EMERGENCY"}
            </div>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          {
            icon: locationSharing ? "📍" : "📍",
            label: locationSharing ? "Stop Sharing" : "Share Location",
            sublabel: locationSharing ? "Location is LIVE" : "Send to contacts",
            color: locationSharing ? "#4ade80" : "#a78bfa",
            bg: locationSharing ? "rgba(34,197,94,0.12)" : "rgba(139,92,246,0.12)",
            border: locationSharing ? "rgba(34,197,94,0.3)" : "rgba(139,92,246,0.3)",
            action: () => setLocationSharing(v => !v),
          },
          {
            icon: "💬",
            label: "Send Check-in",
            sublabel: "Message contacts",
            color: "#f472b6",
            bg: "rgba(244,114,182,0.12)",
            border: "rgba(244,114,182,0.3)",
            action: () => alert("Check-in message sent to trusted contacts!"),
          },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            style={{
              background: item.bg, border: `1px solid ${item.border}`,
              borderRadius: 16, padding: "16px 12px",
              cursor: "pointer", textAlign: "center",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 13, color: item.color, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 10, color: "#9ca3af", fontFamily: "sans-serif" }}>{item.sublabel}</div>
          </button>
        ))}
      </div>

      {/* Trusted Contacts Status */}
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "16px", marginBottom: 24,
      }}>
        <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: 12, fontFamily: "sans-serif" }}>
          TRUSTED CONTACTS ({contacts.filter(c => c.trusted).length} active)
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {contacts.filter(c => c.trusted).map(c => (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 20, padding: "6px 12px",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
              }}>{c.avatar}</div>
              <span style={{ fontSize: 13, color: "#e9d5ff" }}>{c.name}</span>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
            </div>
          ))}
          {contacts.filter(c => c.trusted).length === 0 && (
            <div style={{ fontSize: 13, color: "#6b7280" }}>No trusted contacts. Add some in Contacts tab.</div>
          )}
        </div>
      </div>

      {/* Nearby Safe Locations */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: 12, fontFamily: "sans-serif" }}>
          NEARBY SAFE LOCATIONS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SAFE_LOCATIONS.slice(0, 3).map((loc, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12, padding: "12px 14px",
              animation: `slideUp ${0.3 + i * 0.1}s ease`,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${typeColors[loc.type]}20`,
                border: `1px solid ${typeColors[loc.type]}40`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>{typeIcons[loc.type]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: "#e9d5ff" }}>{loc.name}</div>
                <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "sans-serif" }}>{loc.distance} away</div>
              </div>
              <button style={{
                background: `${typeColors[loc.type]}20`, border: `1px solid ${typeColors[loc.type]}40`,
                color: typeColors[loc.type], borderRadius: 8, padding: "5px 10px",
                fontSize: 11, cursor: "pointer", fontFamily: "sans-serif",
              }}>Navigate</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactsTab({ contacts, removeContact, toggleTrusted, showAddContact, setShowAddContact, newContact, setNewContact, addContact }) {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e9d5ff" }}>Emergency Contacts</div>
          <div style={{ fontSize: 12, color: "#9ca3af", fontFamily: "sans-serif" }}>{contacts.length} contacts saved</div>
        </div>
        <button
          onClick={() => setShowAddContact(true)}
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            border: "none", borderRadius: 12, padding: "9px 16px",
            color: "white", fontSize: 13, cursor: "pointer", fontWeight: 600,
          }}
        >+ Add</button>
      </div>

      {showAddContact && (
        <div style={{
          background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: 16, padding: 16, marginBottom: 20,
          animation: "slideUp 0.3s ease",
        }}>
          <div style={{ fontSize: 13, color: "#a78bfa", marginBottom: 12, fontFamily: "sans-serif" }}>NEW CONTACT</div>
          {["name", "phone", "relation"].map(field => (
            <input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newContact[field]}
              onChange={e => setNewContact(prev => ({ ...prev, [field]: e.target.value }))}
              style={{
                width: "100%", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(167,139,250,0.25)", borderRadius: 10,
                color: "#f0e6ff", padding: "10px 14px", fontSize: 14,
                marginBottom: 10, outline: "none", fontFamily: "sans-serif",
              }}
            />
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addContact} style={{
              flex: 1, background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none", borderRadius: 10, padding: "10px",
              color: "white", fontSize: 14, cursor: "pointer", fontWeight: 600,
            }}>Save</button>
            <button onClick={() => setShowAddContact(false)} style={{
              flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10, padding: "10px", color: "#9ca3af", fontSize: 14, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {contacts.map((c, i) => (
          <div key={c.id} style={{
            background: "rgba(255,255,255,0.04)", border: `1px solid ${c.trusted ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 14, padding: 14, animation: `slideUp ${0.2 + i * 0.06}s ease`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: c.trusted ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 700, color: "#e9d5ff",
                boxShadow: c.trusted ? "0 0 16px rgba(168,85,247,0.4)" : "none",
              }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 15, color: "#e9d5ff", fontWeight: 600 }}>{c.name}</span>
                  {c.trusted && <span style={{
                    fontSize: 9, padding: "2px 7px", borderRadius: 10,
                    background: "rgba(139,92,246,0.2)", color: "#a78bfa",
                    letterSpacing: "0.05em", fontFamily: "sans-serif",
                  }}>TRUSTED</span>}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", fontFamily: "sans-serif" }}>{c.phone} · {c.relation}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => toggleTrusted(c.id)}
                style={{
                  flex: 1, fontSize: 12, padding: "7px 0", borderRadius: 8, cursor: "pointer",
                  background: c.trusted ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${c.trusted ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.1)"}`,
                  color: c.trusted ? "#a78bfa" : "#9ca3af", fontFamily: "sans-serif",
                }}
              >{c.trusted ? "★ Trusted" : "☆ Set Trusted"}</button>
              <button
                onClick={() => alert(`Calling ${c.name}...`)}
                style={{
                  padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14,
                  background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80",
                }}
              >📞</button>
              <button
                onClick={() => removeContact(c.id)}
                style={{
                  padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14,
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444",
                }}
              >🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapTab() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#e9d5ff", marginBottom: 4 }}>Nearby Safe Zones</div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20, fontFamily: "sans-serif" }}>
        Mumbai, Maharashtra · Last updated just now
      </div>

      {/* Map placeholder */}
      <div style={{
        borderRadius: 18, overflow: "hidden", marginBottom: 20,
        background: "linear-gradient(135deg, rgba(30,5,51,0.8), rgba(10,10,15,0.9))",
        border: "1px solid rgba(139,92,246,0.2)",
        height: 220, display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {/* Simulated map grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08,
          backgroundImage: "linear-gradient(rgba(167,139,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.5) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />
        {/* Center dot (user) */}
        <div style={{
          width: 16, height: 16, borderRadius: "50%",
          background: "#a855f7",
          boxShadow: "0 0 20px rgba(168,85,247,0.8), 0 0 0 8px rgba(168,85,247,0.2)",
          position: "absolute",
        }} />
        {/* Sample pins */}
        {[
          { top: "30%", left: "25%", color: "#3b82f6", icon: "🚔" },
          { top: "55%", left: "65%", color: "#ef4444", icon: "🏥" },
          { top: "25%", left: "68%", color: "#8b5cf6", icon: "🏡" },
        ].map((pin, i) => (
          <div key={i} style={{
            position: "absolute", top: pin.top, left: pin.left,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
              background: pin.color, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 12px ${pin.color}80`,
            }}>
              <span style={{ transform: "rotate(45deg)", fontSize: 14 }}>{pin.icon}</span>
            </div>
          </div>
        ))}
        <div style={{
          position: "absolute", bottom: 12, right: 12, fontSize: 11,
          color: "#a78bfa", fontFamily: "sans-serif",
          background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 8,
        }}>
          📍 Your location
        </div>
      </div>

      {/* Safe locations list */}
      <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: 12, fontFamily: "sans-serif" }}>
        ALL SAFE LOCATIONS NEARBY
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SAFE_LOCATIONS.map((loc, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "14px 16px",
            animation: `slideUp ${0.2 + i * 0.08}s ease`,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: `${typeColors[loc.type]}18`,
              border: `1px solid ${typeColors[loc.type]}35`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>{typeIcons[loc.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "#e9d5ff", marginBottom: 2 }}>{loc.name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", fontFamily: "sans-serif" }}>{loc.distance} away</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{
                background: `${typeColors[loc.type]}18`, border: `1px solid ${typeColors[loc.type]}35`,
                color: typeColors[loc.type], borderRadius: 8, padding: "6px 12px",
                fontSize: 12, cursor: "pointer", fontFamily: "sans-serif",
              }}>Go</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesTab() {
  const [activeTip, setActiveTip] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#e9d5ff", marginBottom: 4 }}>Emergency Resources</div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20, fontFamily: "sans-serif" }}>Helplines & safety information</div>

      {/* Helplines */}
      <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: 12, fontFamily: "sans-serif" }}>EMERGENCY HELPLINES</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {RESOURCES.map((r, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "14px 16px",
            animation: `slideUp ${0.2 + i * 0.06}s ease`,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "#e9d5ff" }}>{r.title}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif" }}>{r.desc}</div>
            </div>
            <button
              onClick={() => alert(`Calling ${r.number}...`)}
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none", borderRadius: 10, padding: "8px 14px",
                color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 0 12px rgba(139,92,246,0.3)",
              }}
            >{r.number}</button>
          </div>
        ))}
      </div>

      {/* Safety tips */}
      <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: 12, fontFamily: "sans-serif" }}>PERSONAL SAFETY TIPS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SAFETY_TIPS.map((tip, i) => (
          <div
            key={i}
            onClick={() => setActiveTip(activeTip === i ? null : i)}
            style={{
              background: activeTip === i ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeTip === i ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 12, padding: "12px 14px", cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "#a78bfa", fontSize: 14 }}>▸</span>
              <span style={{ fontSize: 13, color: "#e9d5ff", lineHeight: 1.5 }}>{tip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ locationSharing, setLocationSharing }) {
  const [settings, setSettings] = useState({
    notifications: true,
    vibration: true,
    autoShare: false,
    darkMode: true,
    voiceAlert: true,
    background: true,
  });

  const toggle = key => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const groups = [
    {
      label: "LOCATION & PRIVACY",
      items: [
        { key: "ls", label: "Live Location Sharing", sub: locationSharing ? "Currently active" : "Tap to enable", value: locationSharing, onToggle: () => setLocationSharing(v => !v) },
        { key: "autoShare", label: "Auto-Share on SOS", sub: "Share location automatically", value: settings.autoShare, onToggle: () => toggle("autoShare") },
        { key: "background", label: "Background Tracking", sub: "Track even when app is closed", value: settings.background, onToggle: () => toggle("background") },
      ]
    },
    {
      label: "ALERTS & NOTIFICATIONS",
      items: [
        { key: "notifications", label: "Push Notifications", sub: "Receive safety alerts", value: settings.notifications, onToggle: () => toggle("notifications") },
        { key: "vibration", label: "Vibration", sub: "Vibrate on SOS trigger", value: settings.vibration, onToggle: () => toggle("vibration") },
        { key: "voiceAlert", label: "Voice Alert", sub: "Play audio when SOS triggered", value: settings.voiceAlert, onToggle: () => toggle("voiceAlert") },
      ]
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#e9d5ff", marginBottom: 4 }}>Settings</div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24, fontFamily: "sans-serif" }}>Manage your safety preferences</div>

      {/* Profile card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))",
        border: "1px solid rgba(139,92,246,0.25)",
        borderRadius: 18, padding: "18px 20px", marginBottom: 28,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, boxShadow: "0 0 20px rgba(168,85,247,0.4)",
        }}>👩</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e9d5ff" }}>Priya Sharma</div>
          <div style={{ fontSize: 12, color: "#a78bfa", fontFamily: "sans-serif" }}>+91 98765 43210</div>
          <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "sans-serif", marginTop: 2 }}>● Account Verified</div>
        </div>
      </div>

      {groups.map((group, gi) => (
        <div key={gi} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: 12, fontFamily: "sans-serif" }}>{group.label}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {group.items.map((item, ii) => (
              <div key={item.key} style={{
                display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "14px 16px",
                animation: `slideUp ${0.2 + (gi + ii) * 0.07}s ease`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "#e9d5ff" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif" }}>{item.sub}</div>
                </div>
                <div
                  onClick={item.onToggle}
                  style={{
                    width: 46, height: 26, borderRadius: 13, cursor: "pointer",
                    background: item.value ? "linear-gradient(90deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.1)",
                    position: "relative", transition: "all 0.3s",
                    boxShadow: item.value ? "0 0 12px rgba(168,85,247,0.4)" : "none",
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: "absolute", top: 3, left: item.value ? 23 : 3,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "white", transition: "all 0.3s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button style={{
        width: "100%", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
        color: "#f87171", borderRadius: 14, padding: "14px", fontSize: 14, cursor: "pointer",
        fontFamily: "sans-serif",
      }}>Sign Out</button>
    </div>
  );
}
