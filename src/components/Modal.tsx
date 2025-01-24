interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: '#000',
                border: '1px solid #00ff88',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                width: '90%',
                height: '90%',
                position: 'relative',
                borderRadius: '4px'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: '1px solid #00ff88',
                        color: '#00ff88',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontFamily: '"Share Tech Mono", monospace',
                        zIndex: 1001
                    }}
                >
                    [X] CLOSE
                </button>
                {children}
            </div>
        </div>
    );
} 