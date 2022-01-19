import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState<number>(1);

  return (
    <div className="App">
      <button onClick={() => setCount((count) => count + 1)} className="btn">
        🪂 Click me login : {count}
      </button>
    </div>
  );
}

export default App;
