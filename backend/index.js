const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');

//Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({limits: { fileSize: 50 * 1024 * 1024 },}));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(cors({origin: '*'}));
app.use(helmet.contentSecurityPolicy({
    directives: {defaultSrc: ["'self'"], 
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']}}))

//Non-DB routes
app.get('/', (req,res) => {res.send(path.join(__dirname, '..', 'public', 'index.html'));});
require('./timestamp.js')(app);
require('./whoami.js')(app);
app.post("/api/fileanalyse", (req, res) => {res.send({name: req.files.upfile.name, type: req.files.upfile.mimetype, size: req.files.upfile.size});});
require('./ImperialMetricConverter/imperialMetricConverter.js')(app);

app.listen(process.env.PORT || 3000);

//db stuff + routes that need db
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    require('./shorturl.js')(app, mongoose);
    require('./exerciseTracker.js')(app, mongoose);
    require('./issueTracker.js')(app,mongoose);
    require('./personalLibrary.js')(app,mongoose);
    require('./stockPriceChecker.js')(app,mongoose);
});