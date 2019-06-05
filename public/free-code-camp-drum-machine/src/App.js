import React from 'react';
import './App.css';
import DrumPad from './DrumPad';

function App() {
  return (
    <div id="drum-machine" className="row container-fluid justify-content-center" style={{height: "90vh"}}>
      <div id="display" className="card w-50 h-100 align-self-center m-3">
        <h5 className="card-header text-center" id="text">...</h5>
        <div className="card-body container-fluid h-100">
            <div className="row">
              <DrumPad letter="Q" name="Synthesized piano note 11"/>
              <DrumPad letter="W" name="Synthesized piano note 12"/>
              <DrumPad letter="E" name="Synthesized piano note 13"/>
            </div>
            <div className="row">
              <DrumPad letter="A" name="Synthesized piano note 14"/>
              <DrumPad letter="S" name="Synthesized piano note 15"/>
              <DrumPad letter="D" name="Synthesized piano note 16"/>
            </div>
            <div className="row">
              <DrumPad letter="Z" name="Synthesized piano note 17"/>
              <DrumPad letter="X" name="Synthesized piano note 18"/>
              <DrumPad letter="C" name="Synthesized piano note 19"/>
            </div>
        </div>
        </div>
    </div>
  );
}

export default App;
