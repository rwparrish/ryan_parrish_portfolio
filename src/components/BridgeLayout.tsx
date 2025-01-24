interface BridgeLayoutProps {
  children: React.ReactNode;
}

export const BridgeLayout = ({ children }: BridgeLayoutProps) => (
  <div style={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#000',
    position: 'absolute',
    boxSizing: 'border-box',
    overflow: 'hidden',
  }}>
    {/* Main Content */}
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      zIndex: 1
    }}>
      {children}
    </div>

    {/* Bridge Status Display */}
    <div style={{
      position: 'absolute',
      top: '2vh',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '8px 20px',
      background: 'rgba(0, 20, 40, 0.9)',
      border: '1px solid rgba(0, 100, 255, 0.3)',
      borderRadius: '3px',
      color: '#00a8ff',
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '12px',
      zIndex: 4,
      display: 'flex',
      gap: '20px',
      boxShadow: '0 0 20px rgba(0, 100, 255, 0.2)'
    }}>
      <span>MAIN VIEWPORT</span>
      <span>|</span>
      <span>SHIELDS: NOMINAL</span>
      <span>|</span>
      <span>SECTOR: SOL-3</span>
    </div>

    {/* Bridge Control Panel Bottom */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: '15vw',
      right: '15vw',
      height: '8vh',
      zIndex: 3,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '10px',
      gap: '20px',
      color: '#00a8ff',
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '12px'
    }}>
      <span>NAV: ONLINE</span>
      <span>|</span>
      <span>SENSORS: ACTIVE</span>
      <span>|</span>
      <span>VIEW: STANDARD</span>
    </div>
  </div>
); 