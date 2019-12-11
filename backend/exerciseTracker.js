module.exports = (app, mongoose) => {
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
}