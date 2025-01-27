import { Layout } from '../components/Layout';
import { TerminalText } from '../components/TerminalText';

export default function Contact() {
    const content = [
        {
            text: "Let's start a conversation and learn something new. Connect with me on ",
            delay: 0,
        },
        {
            text: "LinkedIn",
            delay: 2300,
            isLink: true,
            href: "https://www.linkedin.com/in/rwparrish/"
        },
        {
            text: "or send me an email at ",
            delay: 2750
        },
        {
            text: "ryanwparrish@gmail.com",
            delay: 3350,
            isLink: true,
            href: "mailto:ryanwparrish@gmail.com"
        },
        {
            text: ".",
            delay: 3400
        }
    ];

  return (
    <Layout title="Make First Contact">
      <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                width: '100%',
                padding: '0 20px',
                boxSizing: 'border-box',
                position: 'relative'
            }}>
                <div style={{
                    border: '2px solid #00ff88',
                    borderRadius: '50%',
                    padding: '5px',
                    boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                    marginBottom: '20px'
                }}>
                    <img
                        src="src/assets/headshot.jpg"
                        alt="Profile"
                        style={{
                            width: '250px',
                            height: '250px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                </div>

                <div style={{
                    maxWidth: '700px',
                    width: '100%',
                    padding: '20px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '8px',
                    border: '1px solid #00ff88',
                    boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
                    margin: '0 20px 20px 20px'
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {content.map((item, index) => (
                            <TerminalText
                                key={index}
                                text={item.text}
                                delay={item.delay}
                                speed={30}
                                color={item.color}
                                isLink={item.isLink}
                                href={item.href}
                            />
                        ))}
                    </div>
                </div>
            </div>
    </Layout>
  );
}
