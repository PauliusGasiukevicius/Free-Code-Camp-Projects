const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dns = require('dns');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({limits: { fileSize: 50 * 1024 * 1024 },}));
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

app.post("/api/fileanalyse", (req, res) => {
    const file = req.files.upfile;
    res.send({name: file.name, type: file.mimetype, size: file.size});
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


    let PersonSchema = new mongoose.Schema({username: String, exercises: [{description: String, duration: Number, date: Date}]});
    let Person = mongoose.model('Person', PersonSchema);

    app.post('/api/exercise/new-user', (req, res) => {
        if(!req.body.username)return res.send("username is required.");
        Person.findOne({username: req.body.username}, (err, obj) => {
            if(err)return res.status(500).send("DB error");
            if(obj)return res.send("username is already taken");
            
            let p = new Person({username: req.body.username});
            p.save((err, obj) => {
                if(err)return res.status(500).send("DB error");
                return res.send({_id: obj._id, username: obj.username});
            });
        });
    });

    app.get('/api/exercise/users', (req, res) => {
        Person.find({}).select("_id username").exec((err, arr) => {
            if(err)return res.status(500).send("DB error");
            return res.send(arr.filter(p => p.username));
        });
    });

    app.post('/api/exercise/add', (req, res) => {
        if(!req.body._id)return res.send('UserId is required');
        if(!req.body.description)return res.send('description is required');
        if(!req.body.duration)return res.send('duration is required');
        if(!req.body.date)req.body.date = new Date();
        else req.body.date = new Date(req.body.date);

        Person.findById(req.body._id, (err, obj) => {
            if(err)return res.status(500).send("DB error");
            if(!obj)return res.send("User does not exist");
            obj.exercises.push({description : req.body.description, duration: req.body.duration, date: req.body.date});
            obj.save((err, obj)=>{
                if(err)return res.status(500).send("DB error");
                return res.send(obj);
            });
        });
    });

    app.get('/api/exercise/log/:_id', (req, res) => {
        let {from, to, limit} = req.query;

        Person.findById(req.params._id, (err, obj) => {
            if(err)return res.status(500).send("DB error");
            if(!obj)return res.send("User does not exist");

            if(from)from = new Date(from);
            if(to)from = new Date(to);

            obj.exercises = obj.exercises.filter(ex => {
                if(from && ex.date < from)return 0;
                if(to && ex.date > to)return 0;
                return 1;
            });

            obj.exercises.sort((a,b) => a.date.getTime() - b.date.getTime());
            while(obj.exercises.length > limit)obj.exercises.pop();
            return res.send(obj);
        });
    });
    
});