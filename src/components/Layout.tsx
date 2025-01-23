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
    justifyContent: 'center',
    alignItems: 'center',
    background: '#000',
    color: '#00ff88'
  }}>
    <h1>{title}</h1>
    {children}
    
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      cursor: 'pointer'
    }}>
      <a href="/" style={{ color: '#00ff88', textDecoration: 'none' }}>← Return to Home</a>
    </div>
  </div>
);
