import { Layout } from '../components/Layout';
import { TerminalText } from '../components/TerminalText';

export default function About() {
  const content = [
    {
      text: "Hi, I'm Ryan. Welcome to my corner of the digital universe. I'm a software engineer with a passion for creating innovative solutions and building products that make a difference. I love to learn and build things. If it wasn't already obvious, I'm a big fan of space and sci-fi.\n\n",
      delay: 0,
    },
    {
      text: "$ cat interests.txt\n",
      delay: 11000,
    },
    {
      text: "Other things I love include:\n\n",
      delay: 12000,
    },
    {
      text: "• Board and video games\n",
      delay: 13000,
    },
    {
      text: "• Tacos\n",
      delay: 14000,
    },
    {
      text: "• Camping under the stars\n",
      delay: 15000,
    },
    {
      text: "• Kindness\n",
      delay: 16000,
    },
    {
      text: "• Coffee\n",
      delay: 17000,
    },
    {
      text: "• Hockey\n",
      delay: 18000,
    },
    {
      text: "• Traveling\n",
      delay: 19000,
    },
    {
      text: "• My dogs\n",
      delay: 20000,
    },
    {
      text: "• Weight lifting\n",
      delay: 21000,
    },
    {
      text: "• And most importantly, my family\n\n",
      delay: 22000,
    },
    {
      text: "Thanks for stopping by! I hope you find something interesting here. If you have any questions or just want to chat, feel free to reach out. I'm always open to new connections and opportunities.\n",
      delay: 24000,
    }
  ];

  return (
    <Layout title="About Me">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
        position: 'relative'
      }}>
        <div style={{
          border: '2px solid #00ff88',
          borderRadius: '50%',
          padding: '5px',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
          position: 'sticky',
          top: '20px',
          zIndex: 1
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
          margin: '20px',
          overflowY: 'scroll',
          maxHeight: '70vh',
          scrollbarGutter: 'stable'
        }}>
          {content.map((item, index) => (
            <TerminalText 
              key={index}
              text={item.text}
              delay={item.delay}
              speed={30}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
