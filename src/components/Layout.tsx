interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout = ({ children, title }: LayoutProps) => (
  <div style={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#000',
    color: '#00ff88',
    position: 'absolute',
    border: '2px solid #00ff88',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 50px rgba(0, 255, 136, 0.1)',
  }}>
    {/* Terminal Header */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '40px',
      background: 'linear-gradient(90deg, #000 0%, rgba(0, 255, 136, 0.1) 50%, #000 100%)',
      borderBottom: '1px solid #00ff88',
      display: 'flex',
      alignItems: 'center',
      padding: '0 15px',
      fontFamily: '"Share Tech Mono", monospace',
      zIndex: 2
    }}>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        position: 'relative'
      }}>
        <div style={{ fontSize: '14px' }}>SYSTEM://terminal_access</div>
        <a href="/" style={{ 
          color: '#00ff88', 
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '14px',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap'
        }}>
          <span style={{ fontSize: '20px' }}>←</span> 
          <span>RETURN_TO_BRIDGE</span>
        </a>
        <div style={{ 
          fontSize: '14px',
          display: 'flex',
          gap: '20px'
        }}>
          <span>SEC_LEVEL: ALPHA</span>
          <span>|</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>

    {/* Corner Decorations */}
    {[
      { top: 0, left: 0, transform: 'rotate(0deg)' },
      { top: 0, right: 0, transform: 'rotate(90deg)' },
      { bottom: 0, right: 0, transform: 'rotate(180deg)' },
      { bottom: 0, left: 0, transform: 'rotate(270deg)' }
    ].map((style, index) => (
      <div key={index} style={{
        position: 'absolute',
        width: '20px',
        height: '20px',
        border: '1px solid #00ff88',
        borderRadius: '0',
        ...style,
        borderRight: 'none',
        borderBottom: 'none',
        zIndex: 2
      }} />
    ))}

    {/* Scrollable Content Container */}
    <div style={{
      position: 'absolute',
      top: '40px',
      left: 0,
      right: 0,
      bottom: '30px',
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Title */}
      <h1 style={{ 
        fontFamily: '"Share Tech Mono", monospace',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        margin: '0 0 20px 0'
      }}>{title}</h1>

      {/* Main Content */}
      {children}
    </div>

    {/* Terminal Footer */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '30px',
      background: 'linear-gradient(90deg, #000 0%, rgba(0, 255, 136, 0.1) 50%, #000 100%)',
      borderTop: '1px solid #00ff88',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '12px',
      color: '#00ff88',
      zIndex: 2
    }}>
      <span>STATUS: ONLINE</span>
      <span>TERMINAL_ID: X-742</span>
      <span>CONNECTION: SECURE</span>
    </div>
  </div>
);
