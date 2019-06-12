import React, {Component} from 'react';

class Screen extends Component
{
    render()
    {
        return (
            <div id="display" className="col border border-primary d-flex justify-content-center" style={{minHeight: "4rem", marginBottom: "0.5rem"}}>
                <div className="align-self-center">{this.props.display}</div>
            </div>
        );
    }    
}


export default Screen;
