import React, {Component} from 'react';

class Button extends Component
{
    render()
    {
        let {id, value, additionalClassNames, sz, buttonClick} = this.props;
        if(!sz)sz = "";

        return (
            <div className={"d-flex justify-content-center col" + sz} style={{padding: "0", margin:"0"}}>
                <div onClick={()=>buttonClick(value)} className={"w-100 d-flex justify-content-center btn " + additionalClassNames} style={{minWidth: "5rem", minHeight: "5rem", margin: "0.1rem"}}>
                    <div className=" align-self-center" id={id}>{value}</div>
                </div>
            </div>
        );
    }    
}


export default Button;
