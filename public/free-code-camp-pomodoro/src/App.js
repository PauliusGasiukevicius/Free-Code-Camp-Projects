import React, {Component} from 'react';
import './App.css';
import DurationControl from './DurationControl';
import TimeDisplay from './TimeDisplay';

class App extends Component {

  constructor(props)
  {
    super(props);

    this.handle = null;

    this.state = {
      sessionTime: 25,
      breakTime: 5,
      timerLabel: "Session",
      minutes: 25,
      seconds: 0,
      isRunning: false,
      isSesion: true,
      lastTime: 0,
      nextSecond: 1000
    };
  }

  getTime = () =>
  {
    let min = "" + this.state.minutes;
    if(min.length < 2)min = "0"+min;

    let sec = "" + this.state.seconds;
    if(sec.length < 2)sec = "0"+sec;

    return min + ":" + sec;
  }

  reset = () =>
  {
    this.setState({sessionTime: 25, breakTime: 5, timerLabel: "Session", minutes: 25, seconds: 0, isSesion: true, isRunning: false});
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  }

  incSession = () =>
  {
    if(this.state.isRunning)return;
    this.setState({sessionTime: Math.min(this.state.sessionTime+1,60), seconds: 0, minutes:  Math.min(this.state.sessionTime+1,60)});
  }

  incBreak = () =>
  {
    if(this.state.isRunning)return;
    this.setState({breakTime: Math.min(this.state.breakTime+1,60)});
  }

  decSession = () =>
  {
    if(this.state.isRunning)return;
    this.setState({sessionTime: Math.max(this.state.sessionTime-1,1), seconds: 0, minutes:  Math.max(this.state.sessionTime-1,1)});
  }

  decBreak = () =>
  {
    if(this.state.isRunning)return;
    this.setState({breakTime: Math.max(this.state.breakTime-1,1)});
  }

  tick = () =>
  {
    if(!this.state.isRunning)return;

    let s = this.state.seconds;
    let m = this.state.minutes;

    if(m==0 && s==0)
    {
      let audio = document.getElementById("beep");
      audio.currentTime=0;
      audio.play();

      if(this.state.isSesion)
        {
          this.setState({isSesion: false, timerLabel: "Break", minutes: this.state.breakTime});
        }
      else
        {
          this.setState({isSesion: true, timerLabel: "Session", minutes: this.state.sessionTime});
        }
    }
    else if(s===0)
    {
      s=59;
      m=Math.max(m-1,0);
      this.setState({minutes: m, seconds: s});
    }
    else 
    {
      s--;
      this.setState({minutes: m, seconds: s});
    }

    this.setState({lastTime: new Date().getTime()});
    this.handle = setTimeout(this.tick,1000);
  }

  startStop = () =>
  {

    if(this.state.isRunning)
    {
      this.setState({isRunning: !this.state.isRunning});
      let time = new Date().getTime() - this.state.lastTime;
      this.setState({nextSecond: 1000 - time});
      clearTimeout(this.handle);
    }
    else
    {
      this.setState({isRunning: !this.state.isRunning});

      this.handle = setTimeout(this.tick, this.state.nextSecond);
      this.setState({nextSecond: 1000});
    }
  }

  render()
  {
    return (
      <div className="justify-content-center d-flex" 
      style={{height: "100vh", backgroundPosition: "center", backgroundSize: "cover",
      backgroundImage: `url("https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compmins&cs=tinysrgb&dpr=3&h=750&w=1260")`}}>
      
      <div className="d-flex justify-content-center rounded-square align-self-center align-items-center" style={{minHeight: "90vmin", minWidth: "90vmin", backgroundColor: "rgba(255,255,255,0.3)"}}>
        <div className="align-self-center justify-content-center p-2" style={{minHeight: "80vmin", minWidth: "80vmin"}}>
          <p className="text-center p-2 m-3" style={{fontSize: "5vmin"}}>🍅Pomodoro Clock🍅</p>
          <DurationControl name="session" initialTime={this.state.sessionTime} inc={this.incSession} dec={this.decSession}/>
          <DurationControl name="break" initialTime={this.state.breakTime} inc={this.incBreak} dec={this.decBreak}/>
          <TimeDisplay timerLabel={this.state.timerLabel} time={""+this.getTime()} reset={this.reset} startStop={this.startStop}/>
          <audio id="beep" src="./audio/beep.wav"></audio>
        </div>
      </div>
      </div>
    );
  }
}

export default App;
