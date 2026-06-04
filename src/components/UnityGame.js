import React from 'react';
import { Container } from 'react-bootstrap';

function UnityGame() {
  return (
    <Container className="py-5">
      <h2 className="mb-4">Unity Learning Project</h2>
      <p className="text-muted mb-4">
        A work in progress — exploring Unity game development through hands-on tutorials.
      </p>
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%',
        }}
      >
        <iframe
          src="/unity-game/index.html"
          title="Unity Learning Project"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    </Container>
  );
}

export default UnityGame;