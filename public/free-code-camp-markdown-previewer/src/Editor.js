import React, {Component} from 'react';

class Editor extends Component
{
    render()
    {
        const {onTextChange,text} = this.props;

        return (
            <div className="col">
                <div className="card text-white bg-primary m-1">
                <div className="card-header font-weight-bold">Editor</div>
                    <textarea rows="20" className="card-body" id="editor" onChange={onTextChange} value={text}/>
                </div>
            </div>
        );
    }
}

export default Editor;