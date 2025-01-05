import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Conversation } from '@11labs/client';
import Lottie from 'lottie-react';
import animationData from './assets/call-animation.json';

function App() {
  const [conversation, setConversation] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [agentStatus, setAgentStatus] = useState('listening');
  const hasStartedRef = useRef(false);
  const agentId = import.meta.env.VITE_API_KEY;
  async function startConversation() {
    try {
      // Request microphone permission
      if (hasStartedRef.current) return; // Prevent multiple starts
      hasStartedRef.current = true;
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation
      const newConversation = await Conversation.startSession({
        agentId: agentId, // Replace with your agent ID
        onConnect: () => {
          setConnectionStatus('Connected');
        },
        onDisconnect: () => {
          setConnectionStatus('Disconnected');
        },
        onError: (error) => {
          console.error('Error:', error);
        },
        onModeChange: async (mode: any) => {
          setAgentStatus(mode.mode === 'speaking' ? 'speaking' : 'listening');

          // Play audio if the agent is speaking
          if (mode.mode === 'speaking' && mode.audioUrl) {
            const audio = new Audio(mode.audioUrl);
            await audio.play();
          }
        },
      });

      await newConversation.setVolume({ volume: 5.0 });

      setConversation(newConversation);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }

  async function stopConversation() {
    if (conversation) {
      await conversation.endSession();
      setConversation(null);
      hasStartedRef.current = false;
    }
  }
  useEffect(() => {
    if (!hasStartedRef.current) {
      startConversation();
    }
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#1a1d21', // Dark background
        color: '#e5e7eb', // Light text color
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* <h1
        style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          textAlign: 'center',
          color: '#f5eb10', // Accent color for the title
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        Conversational AI
      </h1> */}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1d21', // Card background
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <img
          src="./public/MicroMind.png" // Replace with the actual path to your logo
          alt="Company Logo"
          style={{
            // padding: '5px',
            // margin: '0px',
            width: '320px', // Adjust size as needed
            // height: '250px',
            objectFit: 'contain', // Maintain aspect ratio
            position: 'relative',
            marginBottom: '-2rem',
            marginTop: '1.5rem',
            // left: '-100px',
            // margin: '1rem',
          }}
        />
        <div
          style={{
            width: '600px',
            height: '600px',
            marginBottom: '1.5rem',
          }}
        >
          <Lottie animationData={animationData} loop={true} />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <button
            onClick={startConversation}
            disabled={conversation !== null}
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: conversation === null ? '#4caf50' : '#555b62',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: conversation === null ? 'pointer' : 'not-allowed',
              transition: 'background 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            Start Conversation
          </button>
          <button
            onClick={stopConversation}
            disabled={conversation === null}
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: conversation !== null ? '#f44336' : '#555b62',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: conversation !== null ? 'pointer' : 'not-allowed',
              transition: 'background 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            Stop Conversation
          </button>
        </div>

        <div
          style={{
            textAlign: 'center',
            fontSize: '1.2rem',
          }}
        >
          <p>
            <strong>Status:</strong>{' '}
            <span
              style={{
                color: connectionStatus === 'Connected' ? '#4caf50' : '#f44336',
              }}
            >
              {connectionStatus}
            </span>
          </p>
          <p>
            <strong>Agent:</strong> {agentStatus}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
