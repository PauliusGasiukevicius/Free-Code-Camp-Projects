import React from 'react';
import './App.css';
import Calculator from './Calculator';

function App() {
  return (
    <div className="App justify-content-center d-flex" style={{height: "100vh"}}>
      <div className="card bg-light mb-3 row align-self-center" style={{maxWidth: "100rem"}}>
  <div className="card-header"><strong>JS Calculator</strong></div>
  <div className="card-body container-fluid p-0" style={{minWidth: "30rem"}}>
    <Calculator />
  </div>
</div>
    </div>
  );
}

export default App;
