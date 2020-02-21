import React, {useState} from 'react';
import './App.css';

function Article ({article}) {
  return (
    <div onClick={() => window.open("https://en.wikipedia.org/?curid=" + article.pageid, "_blank")} 
    className="card border-success mb-3 btn w-75">
    <div className="card-header">{article.title}</div>
    <div className="card-body text-success">
      <p className="card-text" dangerouslySetInnerHTML={{__html: article.snippet}}></p>
    </div>
    </div>
  );
}

function App() {

  const [articles,setArticles] = useState([]);

  let searchArticles = () => {
    let txt = document.getElementById("txt").value;
    console.log(txt);
    let url = "https://en.wikipedia.org/w/api.php"; 

    let params = {
        action: "query",
        list: "search",
        srsearch: txt,
        format: "json",
        props: "info"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
    fetch(url)
    .then(r => r.json())
    .then(r => {
      console.log(r);
      setArticles(r.query.search);
    })
    .catch(e => console.log(e));
  }

  return (
    <div>
    <div className="App h-100 d-flex align-items-center justify-content-center">
      <div className = "input-group form-inline justify-content-center align-items-center w-75 m-2 align-self-center justify-self-center">
          <input id="txt" className="w-100 ml-auto justify-content-center align-items-center form-control mr-sm-2" type="search" placeholder="Search for articles" aria-label="Search"/>
          <button onClick={()=>searchArticles()} className="m-1 btn btn-outline-success my-2 my-md-0" type="submit">
          <i className="fa fa-search"></i></button>
          <button onClick={()=>{window.location.href="https://en.wikipedia.org/wiki/Special:Random"}} className="m-1 btn btn-outline-success">Random wikipedia article</button>
      </div>
      </div>
      <div className="d-flex align-items-center justify-content-center flex-wrap">
      {
        articles.map(a => <Article  article={a} key={"wat" + a.pageid} />)
      }
      </div>
    </div>
  );
}

export default App;
