import React, {Component} from 'react';

class DurationControl extends Component
{
    render()
    {
        let {name, initialTime} = this.props;
        return(
            <div className=" m-0 container-fluid p-2 justify-content-center w-100">
                <div className="row justify-content-center p-0 m-0">
                    <div className="col m-0 h-100 w-100 text-center align-self-center">
                        <p style={{fontSize: "4vmin"}} className=" font-italic h-100 m-0 p-1" id={name + "-label"}>{name + " time"}</p>
                    </div>
                </div>
                <div className="row m-0 p-0">
                    <div className="col-2 m-0 p-0">
                        <div className="d-flex justify-content-center">
                            <div onClick={this.props.dec} style={{minHeight: "10vmin", minWidth: "10vmin", fontSize: "6vmin"}} className=" btn btn-primary container-fluid align-self-center" id={name + "-decrement"}>-</div>
                        </div>
                    </div>
                    <div className="col m-0 p-0 d-flex justify-content-center w-100">
                        <div style={{fontSize: "4vmin"}}className="text-center border border-primary rounded w-100 d-flex justify-content-center h-100" id={name + "-length"}>
                            <p className="align-self-center p-0 m-0">{initialTime}</p>
                        </div>
                        </div>
                    <div className="col-2 m-0 p-0">
                    <div className="d-flex justify-content-center">
                            <div onClick={this.props.inc} style={{minHeight: "10vmin", minWidth: "10vmin", fontSize: "6vmin"}}  className=" btn btn-primary container-fluid align-self-center" id={name + "-increment"}>+</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DurationControl;