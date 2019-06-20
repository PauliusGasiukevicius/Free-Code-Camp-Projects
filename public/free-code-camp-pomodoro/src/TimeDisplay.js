import React, {Component} from 'react';

class TimeDisplay extends Component
{
    render()
    {
        return(
            <div className="w-100 ">
                <div className="row container-fluid p-0 m-0">
                    <div className="col container-fluid p-0 m-0 justify-content-center">
                        <p style={{fontSize: "4.5vmin"}} className="align-self-center text-center p-2" id="timer-label">{this.props.timerLabel}</p>     
                        <div className="m-2 fluid-container">
                            <p style={{fontSize: "6vmin"}} id="time-left" className="align-self-center text-center p-2 border border-primary rounded">{this.props.time}</p>
                        </div>
                    </div>
                </div>
                <div className="row container-fluid p-0 m-0 ">
                <div className="col container-fluid p-0 m-0 d-flex justify-content-center">
                    <div onClick={this.props.startStop} id="start_stop" className="btn btn-primary align-self-center">
                        <span role="img" className="container-fluid" style={{fontSize: "6vmin"}}>⏯️</span>
                    </div>
                </div>
                <div className="col container-fluid p-0 m-0 d-flex justify-content-center">
                    <div onClick={this.props.reset} id="reset" className="btn btn-primary align-self-center">
                        <span role="img" className="container-fluid" style={{fontSize: "6vmin"}}>🔁</span>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default TimeDisplay;