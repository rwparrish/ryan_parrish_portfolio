interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout-container">
      <div className="layout-header">
        <div className="layout-header-content">
          <div className="layout-header-text">SYSTEM://terminal_access</div>
          <a 
            href="/" 
            className="layout-return-link"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/ryan_parrish_portfolio/';
            }}
          >
            <span style={{ fontSize: '20px' }}>←</span> 
            <span>RETURN_TO_BRIDGE</span>
          </a>
          <div className="layout-header-text">
            <span>SEC_LEVEL: ALPHA</span>
            <span style={{ margin: '0 20px' }}>|</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="layout-content">
        {children}
      </div>

      {/* Corner Decorations */}
      {[
        { top: 0, left: 0, transform: 'rotate(0deg)' },
        { top: 0, right: 0, transform: 'rotate(90deg)' },
        { bottom: 0, right: 0, transform: 'rotate(180deg)' },
        { bottom: 0, left: 0, transform: 'rotate(270deg)' }
      ].map((style, index) => (
        <div key={index} className="layout-corner" style={style} />
      ))}
    </div>
  );
}

export default Layout;
