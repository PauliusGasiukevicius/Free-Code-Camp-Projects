const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dns = require('dns');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app. get('/', (req,res) => {res.send(path.join(__dirname, '..', 'public', 'index.html'));});

app.get("/api/timestamp/:date_string?", (req, res) => {
    try
      {
        let dateString = req.params.date_string || (new Date()).toString();
        let d = new Date(dateString);
        res.send({"unix": d.getTime(), "utc" : d.toUTCString() });
      }
    catch(e)
      {res.send({"unix": null, "utc" : "Invalid Date" });}
});

app.get("/api/whoami", (req,res) => {
    res.send({"ipaddress": req.headers['x-forwarded-for'], 
              "language": req.headers['accept-language'], 
              "software": req.headers['user-agent']});
});

app.listen(process.env.PORT || 3000);

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    let shortURLSchema = new mongoose.Schema({url: String, short: String});
    let shortURL = mongoose.model('shortURL', shortURLSchema);
        
    app.post('/api/shorturl/new', (req, resp) => {
            dns.lookup(req.body.url.replace('https://www.','').replace('http://www.','').replace('https://.',''), (err) => {
                if(err)return resp.send({"error":"invalid URL"});
            
                shortURL.findOne({url: req.body.url}, (err, res) => {
                    if(err)return resp.send("DB error");
                    if(res )return resp.send({"original_url":res.url,"short_url":res.short});
                
                    let url = new shortURL({url: req.body.url, short: Math.random().toString(36).substring(2,7)});
                    url.save((err, res) => {
                        if(err)return resp.send("DB ERROR");
                        return resp.send({"original_url":res.url,"short_url":res.short});
                    });
                });
            
            });
    });
            
    app.get('/api/shorturl/:url', (req, res) => {
        shortURL.findOne({short: req.params.url}, (err, obj) => {
            if(err)return res.send({"error":"invalid URL"});
            return res.redirect(obj.url);
        });
    });
});