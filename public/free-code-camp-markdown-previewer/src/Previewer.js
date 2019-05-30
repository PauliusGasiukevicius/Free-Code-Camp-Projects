import React, {Component} from 'react';

class Previewer extends Component
{
    render()
    {
        return (
            <div className="col">
                <div className="card text-white bg-primary m-1">
                <div className="card-header font-weight-bold">Previewer</div>
                    <div rows="10" className="card-body text-left bg-white text-dark" id="preview" 
                    dangerouslySetInnerHTML={{ __html: this.props.markedHTML }}/>
                </div>
            </div>
        );
    }
}

export default Previewer;