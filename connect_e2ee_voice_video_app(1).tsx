// ... existing code ...
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, ShieldCheck, Lock, Key, Video, VideoOff, Mic, MicOff, 
  Monitor, MessageSquare, PhoneOff, Settings, Info, Radio, RefreshCw, 
  Copy, Check, AlertTriangle, Users, Cpu, Activity, Download, Circle,
  Sparkles, Sliders, Play, Square, Eye, EyeOff, Send, UserCheck, Smartphone,
  Grid, Layout, Maximize2, Paperclip, Smile, FileText, Share2, LogOut, X,
  LockKeyhole, KeyRound, Award, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing,
  PhoneMissed, User, Search, ArrowRight, ChevronDown, CheckCircle2, Globe, Clock
} from 'lucide-react';

// Country Codes for Phone Auth
const COUNTRY_CODES = [
  { code: '+1', country: 'United States', flag: '🇺🇸', iso: 'US' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩', iso: 'BD' },
  { code: '+91', country: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+33', country: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', iso: 'JP' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', iso: 'AE' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', iso: 'BR' },
];

export default function App() {
  // App Auth & View Mode State: 'auth-phone' | 'auth-otp' | 'auth-profile' | 'app' | 'call' | 'summary'
  const [authState, setAuthState] = useState('auth-phone'); 
  const [viewMode, setViewMode] = useState('lobby'); // 'lobby' | 'contacts' | 'call' | 'summary'
  
  // User Profile
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('🔒 Using Connect E2EE Voice & Video');
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Dialpad & Direct Call State
  const [dialpadNumber, setDialpadNumber] = useState('');
  const [showDialpad, setShowDialpad] = useState(false);
  const [callType, setCallType] = useState('video'); // 'video' | 'audio'

  // Connect Room & Key Security States
  const [roomId, setRoomId] = useState('CONNECT-8821-SEC');
  const [roomKey, setRoomKey] = useState('c91b-4f7a-82e1-90dc');
  const [isLocked, setIsLocked] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Audio / Video Media Controls
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [selectedCam, setSelectedCam] = useState('HD WebCam (Integrated)');
  const [selectedMic, setSelectedMic] = useState('Studio Noise-Canceling Mic');
  const [bgEffect, setBgEffect] = useState('blur'); // 'none' | 'blur' | 'virtual'

  // Dynamic Layout Mode: 'grid' | 'speaker'
  const [layoutMode, setLayoutMode] = useState('grid');
  
  // Call Features & Chat
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'stats' | 'security' | 'participants'
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Connect Engine', text: 'E2EE AES-256-GCM session established with peer nodes.', time: '14:02', isSystem: true },
    { id: 2, sender: 'Alice (Node 0x4B)', text: 'Encrypted line clear. Sound & video quality are sharp!', time: '14:03', isSystem: false },
  ]);
  const [messageInput, setMessageInput] = useState('');
  
  // Recording State & Call Duration
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  // Contacts List
  const [contacts, setContacts] = useState([
    { id: 'c1', name: 'Alice Smith', phone: '+1 (555) 234-5678', status: 'Online', verified: true, avatarBg: 'from-emerald-500 to-teal-700' },
    { id: 'c2', name: 'Bob Johnson', phone: '+44 7911 123456', status: 'In Call', verified: true, avatarBg: 'from-cyan-500 to-blue-700' },
    { id: 'c3', name: 'Dr. Evelyn Vance', phone: '+880 1711 000111', status: 'Online', verified: true, avatarBg: 'from-purple-500 to-indigo-700' },
    { id: 'c4', name: 'David Miller', phone: '+49 151 23456789', status: 'Offline', verified: false, avatarBg: 'from-amber-500 to-orange-700' },
  ]);

  // Call Logs
  const [callHistory, setCallHistory] = useState([
    { id: 'h1', name: 'Alice Smith', type: 'incoming', media: 'video', time: '10:42 AM', duration: '12:04', encrypted: true },
    { id: 'h2', name: 'Bob Johnson', type: 'outgoing', media: 'audio', time: 'Yesterday', duration: '05:22', encrypted: true },
    { id: 'h3', name: 'Unknown (+880 1800-000)', type: 'missed', media: 'video', time: 'Oct 28', duration: '00:00', encrypted: true },
  ]);

  // Call Active Target Peer
  const [activePeer, setActivePeer] = useState({ name: 'Alice Smith', phone: '+1 (555) 234-5678' });

  // Video Stream Refs
  const localVideoRef = useRef(null);

  // OTP Countdown Timer
  useEffect(() => {
    let timer = null;
    if (authState === 'auth-otp' && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [authState, otpTimer]);

  // Call Timer
  useEffect(() => {
    let interval = null;
    if (viewMode === 'call') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [viewMode]);

  // Recording Timer
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Local Video Canvas Stream Simulation
  useEffect(() => {
    if (viewMode !== 'call') return;

    let animId;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    const drawLocalCanvas = () => {
      if (ctx) {
        ctx.fillStyle = '#060913';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (camActive) {
          const time = Date.now() * 0.002;
          ctx.save();

          if (bgEffect === 'blur') {
            ctx.filter = 'blur(14px)';
            ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.filter = 'none';
          } else if (bgEffect === 'virtual') {
            const grad = ctx.createRadialGradient(320, 240, 40, 320, 240, 320);
            grad.addColorStop(0, '#0f172a');
            grad.addColorStop(1, '#020617');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // Simulated User Silhouette
          ctx.beginPath();
          ctx.arc(320, 190, 75, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Animated Security Matrix HUD Rings
          ctx.beginPath();
          ctx.arc(320, 190, 92 + Math.sin(time) * 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([8, 12]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Body Silhouette
          ctx.beginPath();
          ctx.ellipse(320, 370, 135, 85, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Scanning Line
          const scanY = (Math.sin(time * 1.8) * 0.5 + 0.5) * canvas.height;
          ctx.beginPath();
          ctx.moveTo(0, scanY);
          ctx.lineTo(canvas.width, scanY);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        } else {
          ctx.fillStyle = '#090d16';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.font = '14px monospace';
          ctx.fillStyle = '#64748b';
          ctx.textAlign = 'center';
          ctx.fillText('CAMERA FEED OFF (ENCRYPTED MUTE)', canvas.width / 2, canvas.height / 2);
        }

        if (localVideoRef.current) {
          const stream = canvas.captureStream(30);
          localVideoRef.current.srcObject = stream;
        }
      }
      animId = requestAnimationFrame(drawLocalCanvas);
    };

    drawLocalCanvas();
    return () => cancelAnimationFrame(animId);
  }, [viewMode, camActive, bgEffect]);

  // Auth Functions
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 5) return;
    setAuthState('auth-otp');
    setOtpTimer(30);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    // Auto focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSimulateAutoFill = () => {
    setOtpInput(['8', '4', '2', '9', '0', '1']);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput.join('').length < 6) return;
    setAuthState('auth-profile');
  };

  const handleCompleteProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setUserProfile({
      name: profileName,
      phone: `${selectedCountry.code} ${phoneInput}`,
      bio: profileBio,
    });
    setAuthState('app');
    setViewMode('contacts');
  };

  const handleLogout = () => {
    setUserProfile(null);
    setPhoneInput('');
    setOtpInput(['', '', '', '', '', '']);
    setProfileName('');
    setAuthState('auth-phone');
  };

  // Direct Calling
  const handleStartCallWithContact = (contact, type = 'video') => {
    setActivePeer({ name: contact.name, phone: contact.phone });
    setCallType(type);
    setCallDuration(0);
    setViewMode('call');

    // Add to History
    setCallHistory(prev => [
      { id: Date.now().toString(), name: contact.name, type: 'outgoing', media: type, time: 'Just Now', duration: 'In Progress', encrypted: true },
      ...prev
    ]);
  };

  const handleDialpadCall = (type = 'video') => {
    if (!dialpadNumber) return;
    const fullNumber = dialpadNumber.startsWith('+') ? dialpadNumber : `${selectedCountry.code} ${dialpadNumber}`;
    setActivePeer({ name: `Encrypted Peer (${fullNumber})`, phone: fullNumber });
    setCallType(type);
    setCallDuration(0);
    setShowDialpad(false);
    setViewMode('call');

    setCallHistory(prev => [
      { id: Date.now().toString(), name: fullNumber, type: 'outgoing', media: type, time: 'Just Now', duration: 'In Progress', encrypted: true },
      ...prev
    ]);
  };

  // Dynamic Chat Actions
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), sender: userProfile ? userProfile.name : 'You', text: messageInput, time: timeStr, isSystem: false }
    ]);
    setMessageInput('');
  };

  const handleSimulateFile = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [
      ...prev,
      { 
        id: Date.now(), 
        sender: userProfile ? userProfile.name : 'You', 
        text: 'Shared encrypted payload: [security_audit_log.enc] (2.4 MB)', 
        time: timeStr, 
        isFile: true,
        isSystem: false 
      }
    ]);
  };

  const handleGenerateNewKey = () => {
    const chars = 'abcdef0123456789';
    const randomHex = () => Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const newKey = `${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}`;
    setRoomKey(newKey);
    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'Connect Engine', text: `Key re-negotiated: ${newKey}`, time: 'Now', isSystem: true }
    ]);
  };

  const copyRoomKey = () => {
    navigator.clipboard.writeText(roomKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(`https://connect.sec/join?room=${roomId}&key=${roomKey}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleEndCall = () => {
    setViewMode('summary');
    setIsRecording(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      
      {/* HEADER / BRANDING BAR */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                CONNECT
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                E2EE AES-256
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">End-to-End Encrypted Voice & Video</p>
          </div>
        </div>

        {viewMode === 'call' && (
          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-semibold text-emerald-400">
                LIVE [{formatTime(callDuration)}]
              </span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>PEER: {activePeer.name}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {userProfile && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-xl border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-xs">
                {userProfile.name[0]}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">{userProfile.name}</p>
                <p className="text-[9px] font-mono text-emerald-400">{userProfile.phone}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-2 text-slate-400 hover:text-red-400 p-1" 
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button 
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800/90 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Key Fingerprint</span>
          </button>
        </div>
      </header>

      {/* STEP 1: PHONE AUTHENTICATION SCREEN */}
      {authState === 'auth-phone' && (
        <main className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative z-10">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Smartphone className="w-7 h-7 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100">Welcome to Connect</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your mobile phone number to authenticate via encrypted SMS verification.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">COUNTRY / REGION</label>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 font-mono text-sm flex items-center justify-between hover:border-slate-700 transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span>{selectedCountry.country} ({selectedCountry.code})</span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Country Selection Dropdown */}
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-30 divide-y divide-slate-800/50">
                      {COUNTRY_CODES.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(item);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-mono flex items-center justify-between hover:bg-slate-800 transition"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">{item.flag}</span>
                            <span className="text-slate-200">{item.country}</span>
                          </span>
                          <span className="text-emerald-400 font-semibold">{item.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">PHONE NUMBER</label>
                <div className="flex gap-2">
                  <span className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-emerald-400 text-sm flex items-center justify-center font-bold">
                    {selectedCountry.code}
                  </span>
                  <input 
                    type="tel" 
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="123 456 7890"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500/50"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Connect verifies numbers via zero-knowledge encrypted handshake without storing your address book.</span>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold font-mono rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition flex items-center justify-center gap-2"
              >
                <span>SEND VERIFICATION CODE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      )}

      {/* STEP 2: 6-DIGIT OTP VERIFICATION SCREEN */}
      {authState === 'auth-otp' && (
        <main className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative z-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <Lock className="w-7 h-7" />
            </div>

            <h1 className="text-xl font-bold text-slate-100">Verify Phone Number</h1>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Enter the 6-digit passcode sent to <span className="text-emerald-400 font-mono font-bold">{selectedCountry.code} {phoneInput}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-2">
                {otpInput.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-11 h-12 bg-slate-950 border border-slate-800 rounded-xl text-center font-mono text-lg font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <button 
                  type="button" 
                  onClick={handleSimulateAutoFill}
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto-fill Code
                </button>

                <span className="text-slate-400">
                  Resend in: <span className="text-amber-400 font-bold">{otpTimer}s</span>
                </span>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setAuthState('auth-phone')}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl transition"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold font-mono text-xs rounded-xl transition"
                >
                  VERIFY & CONTINUE
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {/* STEP 3: PROFILE SETUP SCREEN */}
      {authState === 'auth-profile' && (
        <main className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative z-10">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1 mx-auto mb-3 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-slate-300">
                  <User className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-slate-100">Setup Profile Identity</h1>
              <p className="text-xs text-slate-400 mt-1">This name will be attached to your local public encryption keys.</p>
            </div>

            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">FULL NAME / HANDLE</label>
                <input 
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">STATUS BIO</label>
                <input 
                  type="text"
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 font-mono text-xs focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold font-mono rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
              >
                ENTER CONNECT DASHBOARD
              </button>
            </form>
          </div>
        </main>
      )}

      {/* APP MAIN DASHBOARD & CONTACTS VIEW */}
      {authState === 'app' && (viewMode === 'contacts' || viewMode === 'lobby') && (
        <main className="flex-1 flex flex-col md:flex-row bg-slate-950 overflow-hidden relative">
          
          {/* LEFT SIDEBAR: CONTACTS & DIALPAD LAUNCHER */}
          <div className="w-full md:w-96 border-r border-slate-800 bg-slate-900/90 flex flex-col">
            
            {/* Navigation Tabs */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewMode('contacts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    viewMode === 'contacts' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Contacts
                </button>
                <button 
                  onClick={() => setViewMode('lobby')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    viewMode === 'lobby' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Quick Room
                </button>
              </div>

              <button 
                onClick={() => setShowDialpad(true)}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                title="Open Phone Dialpad"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts or phone..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            {/* CONTACTS LIST / RECENT CALL LOGS */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 mb-1">
                Synced E2EE Contacts ({filteredContacts.length})
              </div>

              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id}
                  className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl hover:border-slate-700 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${contact.avatarBg} flex items-center justify-center font-bold text-xs text-white shadow-md relative`}>
                      {contact.name[0]}
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                        contact.status === 'Online' ? 'bg-emerald-500' : contact.status === 'In Call' ? 'bg-amber-400' : 'bg-slate-500'
                      }`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-slate-200">{contact.name}</p>
                        {contact.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[10px] font-mono text-slate-400">{contact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleStartCallWithContact(contact, 'audio')}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 transition"
                      title="Encrypted Audio Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleStartCallWithContact(contact, 'video')}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 transition"
                      title="Encrypted Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* RECENT CALL LOGS SECTION */}
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 pt-4 mb-1">
                Recent Secure Logs
              </div>

              {callHistory.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                      {log.type === 'incoming' && <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400" />}
                      {log.type === 'outgoing' && <PhoneOutgoing className="w-3.5 h-3.5 text-cyan-400" />}
                      {log.type === 'missed' && <PhoneMissed className="w-3.5 h-3.5 text-red-400" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">{log.name}</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                        <span>{log.time}</span>
                        <span>•</span>
                        <span>{log.duration}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded">
                    E2EE
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT SIDE MAIN PREVIEW / CALL LAUNCHER */}
          <div className="flex-1 p-6 flex flex-col justify-between items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black overflow-y-auto">
            
            {viewMode === 'contacts' ? (
              <div className="max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl text-center shadow-2xl my-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Authenticated Phone Session</h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Your phone identity <span className="text-emerald-400 font-mono font-bold">{userProfile?.phone}</span> is bound to your local key pair. Select a contact from the left panel or dial a number directly.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button 
                    onClick={() => setShowDialpad(true)}
                    className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl font-mono text-xs text-slate-200 flex flex-col items-center justify-center gap-2 transition"
                  >
                    <Phone className="w-6 h-6 text-emerald-400" />
                    <span>Open Dialpad</span>
                  </button>

                  <button 
                    onClick={() => setViewMode('lobby')}
                    className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl font-mono text-xs text-slate-200 flex flex-col items-center justify-center gap-2 transition"
                  >
                    <Radio className="w-6 h-6 text-cyan-400" />
                    <span>Create Room Code</span>
                  </button>
                </div>
              </div>
            ) : (
              /* QUICK ROOM SETUP LOBBY */
              <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl my-auto">
                <h2 className="text-lg font-bold text-slate-100 mb-1">Quick Custom Room</h2>
                <p className="text-xs text-slate-400 mb-4">Generate custom link or room key for external peers.</p>

                <div className="space-y-3 mb-6">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">ROOM IDENTIFIER</label>
                    <input 
                      type="text" 
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-mono text-slate-400">ENCRYPTION KEY (E2EE)</label>
                      <button onClick={handleGenerateNewKey} className="text-[10px] font-mono text-emerald-400 hover:underline">Re-key</button>
                    </div>
                    <input 
                      type="text" 
                      readOnly 
                      value={roomKey}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-amber-300 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => { setCallDuration(0); setViewMode('call'); }}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold font-mono rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Video className="w-5 h-5" /> JOIN ROOM CALL
                </button>
              </div>
            )}

          </div>
        </main>
      )}

      {/* ACTIVE CALL VIEW (RETAINED & ENHANCED) */}
      {viewMode === 'call' && (
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* MAIN CALL GRID AREA */}
          <div className="flex-1 bg-slate-950 p-4 flex flex-col justify-between overflow-y-auto">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-3 z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  CONNECTED TO {activePeer.name.toUpperCase()}
                </span>
                {isRecording && (
                  <span className="px-3 py-1 bg-red-950/80 border border-red-500/50 rounded-lg text-xs font-mono text-red-400 flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-red-500 animate-pulse" />
                    REC [{formatTime(recordingTime)}]
                  </span>
                )}
              </div>

              {/* View Layout Controls */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-lg font-mono text-xs flex items-center gap-1 transition ${
                    layoutMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Grid Layout View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setLayoutMode('speaker')}
                  className={`p-1.5 rounded-lg font-mono text-xs flex items-center gap-1 transition ${
                    layoutMode === 'speaker' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Speaker Focus View"
                >
                  <Layout className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Streams Container Grid */}
            <div className={`grid gap-4 flex-1 ${
              layoutMode === 'speaker' || isScreenSharing 
                ? 'grid-cols-1 lg:grid-cols-3' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
            }`}>
              
              {/* Screen Share Screen Display */}
              {isScreenSharing && (
                <div className="lg:col-span-2 relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                  <div className="absolute top-3 left-3 z-10 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-lg text-xs font-mono text-cyan-400 flex items-center gap-2">
                    <Monitor className="w-4 h-4" /> DESKTOP PRESENTATION (ENCRYPTED)
                  </div>
                  <div className="flex-1 bg-slate-950 flex items-center justify-center relative p-8">
                    <div className="w-full h-full border border-dashed border-cyan-500/30 rounded-xl p-6 flex flex-col items-center justify-center bg-cyan-950/10">
                      <Monitor className="w-16 h-16 text-cyan-400/50 mb-3 animate-bounce" />
                      <p className="text-sm font-mono text-cyan-300">Live WebRTC Desktop Stream</p>
                      <p className="text-xs text-slate-500 mt-1">SRTP encrypted feed directly broadcasted to mesh</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Local Participant Card */}
              <div className={`relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-700 transition ${
                layoutMode === 'speaker' && !isScreenSharing ? 'lg:col-span-2 min-h-[300px]' : ''
              }`}>
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover bg-slate-950" 
                />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 pointer-events-auto">
                    <span className="text-xs font-mono text-slate-200">{userProfile ? userProfile.name : 'You'}</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded">
                      AES-256
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    <div className={`p-1.5 rounded-lg backdrop-blur-md border ${micActive ? 'bg-slate-950/80 border-slate-800 text-emerald-400' : 'bg-red-500/20 border-red-500/40 text-red-400'}`}>
                      {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`p-1.5 rounded-lg backdrop-blur-md border ${camActive ? 'bg-slate-950/80 border-slate-800 text-emerald-400' : 'bg-red-500/20 border-red-500/40 text-red-400'}`}>
                      {camActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Peer Simulated Video Card */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-700 transition">
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center relative min-h-[220px]">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-emerald-500/40 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)] mb-3">
                      <span className="font-mono text-2xl text-emerald-400 font-bold">{activePeer.name[0]}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-200">{activePeer.name}</p>
                    <p className="text-xs text-emerald-400 font-mono mt-0.5">{activePeer.phone}</p>
                  </div>

                  <div className="absolute top-3 right-3 flex items-end gap-1 h-4">
                    <span className="w-1 bg-emerald-500 h-2 animate-pulse" />
                    <span className="w-1 bg-emerald-500 h-4 animate-pulse delay-75" />
                    <span className="w-1 bg-emerald-500 h-3 animate-pulse delay-150" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-xl flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-200">{activePeer.name}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-emerald-400">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>

            {/* CALL ACTION CONTROLS DOCK */}
            <div className="mt-4 flex items-center justify-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl backdrop-blur-md z-10">
              <button 
                onClick={() => setMicActive(!micActive)}
                className={`p-3 rounded-xl border font-mono text-xs flex items-center gap-2 transition ${
                  micActive 
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' 
                    : 'bg-red-500/20 border-red-500/40 text-red-400'
                }`}
              >
                {micActive ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => setCamActive(!camActive)}
                className={`p-3 rounded-xl border font-mono text-xs flex items-center gap-2 transition ${
                  camActive 
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' 
                    : 'bg-red-500/20 border-red-500/40 text-red-400'
                }`}
              >
                {camActive ? <Video className="w-5 h-5 text-emerald-400" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-xl border font-mono text-xs flex items-center gap-2 transition ${
                  isScreenSharing 
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Monitor className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-xl border font-mono text-xs flex items-center gap-2 transition ${
                  isRecording 
                    ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isRecording ? <Square className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>

              <div className="h-6 w-px bg-slate-800 mx-1" />

              <button 
                onClick={handleEndCall}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition flex items-center gap-2"
              >
                <PhoneOff className="w-5 h-5" /> DISCONNECT
              </button>
            </div>

          </div>

          {/* SIDEBAR CHAT & METRICS PANEL */}
          <div className="w-80 border-l border-slate-800 bg-slate-900/90 flex flex-col z-10">
            <div className="flex border-b border-slate-800">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-xs font-mono font-medium border-b-2 flex justify-center items-center gap-1.5 transition ${
                  activeTab === 'chat' ? 'border-emerald-500 text-emerald-400 bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </button>

              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-3 text-xs font-mono font-medium border-b-2 flex justify-center items-center gap-1.5 transition ${
                  activeTab === 'stats' ? 'border-emerald-500 text-emerald-400 bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Stats
              </button>
            </div>

            {/* TAB CONTENT: CHAT */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={msg.isSystem ? "text-center my-2" : ""}>
                      {msg.isSystem ? (
                        <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400/80 inline-block">
                          {msg.text}
                        </span>
                      ) : (
                        <div className={`p-3 rounded-xl border text-xs ${
                          msg.sender === (userProfile ? userProfile.name : 'You')
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-slate-200 ml-4' 
                            : 'bg-slate-950 border-slate-800 text-slate-300 mr-4'
                        }`}>
                          <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1">
                            <span className="font-semibold text-emerald-400">{msg.sender}</span>
                            <span>{msg.time}</span>
                          </div>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type encrypted message..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    />
                    <button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl transition">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB CONTENT: METRICS */}
            {activeTab === 'stats' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Latency (RTT)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-mono font-bold text-emerald-400">14 ms</span>
                    <span className="text-xs font-mono text-emerald-500">P2P SRTP</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Packet Loss Rate</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-mono font-bold text-emerald-400">0.00%</span>
                    <span className="text-xs font-mono text-slate-400">0 / 8410 pkts</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* POST-CALL SUMMARY VIEW */}
      {viewMode === 'summary' && (
        <main className="flex-1 flex items-center justify-center p-6 bg-slate-950 relative">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-100 mb-1">Call Session Disconnected</h2>
            <p className="text-xs font-mono text-emerald-400 mb-6">Zero Session Records Stored</p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left font-mono text-xs space-y-2 mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Peer Contact:</span>
                <span className="text-slate-200">{activePeer.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Duration:</span>
                <span className="text-slate-200">{formatTime(callDuration)}</span>
              </div>
            </div>

            <button 
              onClick={() => setViewMode('contacts')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-semibold rounded-xl transition"
            >
              RETURN TO CONTACTS
            </button>
          </div>
        </main>
      )}

      {/* PHONE DIALPAD MODAL */}
      {showDialpad && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xs w-full p-6 shadow-2xl relative text-center">
            <button 
              onClick={() => setShowDialpad(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-mono font-semibold text-slate-300 mb-4 flex items-center justify-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-400" /> DIRECT ENCRYPTED DIAL
            </h3>

            {/* Dialpad Display */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4 text-center font-mono text-lg font-bold text-emerald-400 min-h-[48px] flex items-center justify-center">
              {dialpadNumber || <span className="text-slate-600 text-xs font-normal">Enter phone number...</span>}
            </div>

            {/* Dialpad Buttons Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4 font-mono">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
                <button
                  key={num}
                  onClick={() => setDialpadNumber(prev => prev + num)}
                  className="py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-base font-bold rounded-xl transition active:scale-95"
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setDialpadNumber(prev => prev.slice(0, -1))}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                title="Backspace"
              >
                ←
              </button>
              
              <button 
                onClick={() => handleDialpadCall('audio')}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" /> CALL AUDIO
              </button>

              <button 
                onClick={() => handleDialpadCall('video')}
                className="p-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl transition"
                title="Call Video"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KEY FINGERPRINT VERIFICATION MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-2">
              <LockKeyhole className="w-4 h-4" /> CRYPTOGRAPHIC HANDSHAKE
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-2">Key Fingerprint Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Compare this secret cryptographic string with participants out-of-band to guarantee zero wiretapping.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-amber-300 break-all mb-4">
              {roomKey}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={copyRoomKey}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 rounded-xl transition flex items-center justify-center gap-2"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Fingerprint Copied' : 'Copy Key String'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}