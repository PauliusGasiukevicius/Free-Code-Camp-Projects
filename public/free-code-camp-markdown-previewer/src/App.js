import React, {Component} from 'react';
import './App.css';
import Editor from './Editor.js';
import Previewer from './Previewer.js';
import marked from 'marked';
import demoText from './demoText.js';

class App extends Component
{

  constructor()
  {
    super();
    this.state = {
      text: demoText,
      markedHTML: marked(demoText, {sanitize: true, breaks: true})
    };
  }

  onTextChange = () =>
  {
    let newText = document.getElementById('editor').value;
    this.setState({text: newText});
    this.setState({markedHTML: marked(newText, {sanitize: true, breaks: true})});  
  }

  render() {
  return (
    <div className="App container-fluid h-100">
      <div className="row w-100 h-100">
        <Editor onTextChange={this.onTextChange} text={this.state.text}/>
        <Previewer markedHTML={this.state.markedHTML}/>
      </div>
    </div>
  );
}
}

export default App;
