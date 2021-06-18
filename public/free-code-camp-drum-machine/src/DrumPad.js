import React, {Component} from 'react';

class DrumPad extends Component
{

    click = () => 
    {
        const {letter, name} = this.props;
        let audio = document.getElementById(letter);
        audio.currentTime=0;
        audio.play();
        document.getElementById("text").textContent = name;
    }

    componentDidMount()
    {
        const {letter} = this.props;

        document.addEventListener("keydown", (event) => {
            if(`${event.key}`.toUpperCase() === letter)
                    this.click();
        });
    }

    render()
    {
        const {letter} = this.props;

        return (
            <div id={letter + "-pad"} className="drum-pad btn btn-primary col p-2 m-2 justify-content-center" onClick={()=>this.click()}
            style={{width: "10rem", height: "10rem"}}>
                <h1 style={{display: "flex"}} verticalAlign="middle" className="align-items-center h-100 text-center justify-content-center">{letter}</h1>
                <audio src={"./audio/" + letter + ".mp3"}  id={letter} className="clip"/>
            </div>
            );
    }
}

export default DrumPad;