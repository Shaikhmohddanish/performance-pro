import React from 'react';

export default function SimpleApp() {
  console.log('SimpleApp rendering...');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #0a0f24, #06101e)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Performance Pros
      </h1>
      <p style={{ fontSize: '1.2rem', textAlign: 'center', maxWidth: '600px' }}>
        Engineered to Convert. Optimized to Perform.
      </p>
      <button 
        style={{
          backgroundColor: '#00e5ff',
          color: '#0a0f24',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '25px',
          fontSize: '1rem',
          fontWeight: 'bold',
          marginTop: '2rem',
          cursor: 'pointer'
        }}
        onClick={() => window.open('https://wa.me/9892082186', '_blank')}
      >
        Get Started
      </button>
    </div>
  );
}