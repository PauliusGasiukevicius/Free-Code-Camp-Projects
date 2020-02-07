module.exports = (app, mongoose) => {
    mongoose.set('useFindAndModify', false);
    let threadSchema = new mongoose.Schema({
        text: String,
        created_on: Date,
        bumped_on: Date,
        delete_password: String,
        reported: Boolean,
        messageBoard: String
        });
    let replySchema = new mongoose.Schema({
        text: String,
        created_on: Date,
        delete_password: String,
        reported: Boolean,
        threadId: mongoose.ObjectId,
        messageBoard: String
    });

    let Thread = mongoose.model('thread', threadSchema);
    let Reply = mongoose.model('reply', replySchema);

    app.get('/b/:board/', (req, res) => {
        res.sendFile(process.cwd() + '/public/free-code-camp-anonymous-message-board/board.html');
    });
    app.get('/b/:board/:threadid', (req, res) => {
        res.sendFile(process.cwd() + '/public/free-code-camp-anonymous-message-board/thread.html');
    });

    app.post('/api/threads/:board', (req, resp) => {
        if(!req.body.board)req.body.board = "general";

        let thread = new Thread({text: req.body.text,
            delete_password: req.body.delete_password,
            messageBoard: req.body.board,
            created_on: new Date(), bumped_on: new Date(),
            reported: false});

            thread.save((err,res) => {
                if(err)return resp.send("DB ERROR");
                return resp.redirect('/b/' + thread.messageBoard);
            });
    });

    app.post('/api/replies/:board', (req, resp) => {
        if(!req.body.board)req.body.board = "general";

        let reply = new Reply({text: req.body.text,
            delete_password: req.body.delete_password,
            messageBoard: req.body.board,
            created_on: new Date(),reported: false,
            threadId: mongoose.Types.ObjectId(req.body.thread_id)});

            reply.save((err,res) => {
                if(err)return resp.send("DB ERROR");
                return resp.redirect('/b/' + reply.messageBoard + "/" + reply.threadId);
            });
    });

    app.get('/api/threads/:board', (req,resp) => {
        let messageBoard = req.params.board;
        let filter = {messageBoard};

        Thread.find(filter).sort({bumped_on: -1}).limit(10).then(async threads => {
            let a = [];
            
            for(let tt of threads)
            {
                let t = Object.assign({},tt);
                delete t.delete_password;
                delete t.reported;
                delete t.messageBoard;

                await Reply.find({threadId: t._doc._id}).sort({bumped_on: -1}).then( replies => {
                    //console.log( t._doc._id, replies.length);
                    t._doc.replycount = replies.length;
                    t._doc.replies = [];

                    let lim = 3;
                    for(let rr of replies)
                    {
                        let r = Object.assign({},rr);
                        delete r.delete_password;
                        delete r.reported;
                        delete r.messageBoard;
                        delete r.threadId;
                        lim--;
                        t._doc.replies.push(r._doc);
                        if(!lim)break;
                    }
                    //console.log(t._doc);
                    a.push(t._doc);
                });
                
            }
            resp.send(a);
        }).catch();
    });

    app.get('/api/replies/:board/:thread', (req,resp) => {
        let messageBoard = req.params.board;
        let TID = req.params.thread;
        let filter = {messageBoard, _id: TID};
        Thread.find(filter).sort({bumped_on: -1}).limit(10).then(async threads => {
            let a = [];
            
            for(let tt of threads)
            {
                let t = Object.assign({},tt);
                delete t.delete_password;
                delete t.reported;
                delete t.messageBoard;

                await Reply.find({threadId: t._doc._id}).sort({bumped_on: -1}).then( replies => {
                    //console.log( t._doc._id, replies.length);
                    t._doc.replycount = replies.length;
                    t._doc.replies = [];

                    let lim = (TID ? replies.length : 3);
                    for(let rr of replies)
                    {
                        let r = Object.assign({},rr);
                        delete r.delete_password;
                        delete r.reported;
                        delete r.messageBoard;
                        delete r.threadId;
                        lim--;
                        t._doc.replies.push(r._doc);
                        if(!lim)break;
                    }
                    //console.log(t._doc);
                    a.push(t._doc);
                });
                
            }
            resp.send(a[0]);
        }).catch();
    });

    app.delete('/api/threads/:board', (req,resp) => { 
        Thread.findOne({_id: req.body.thread_id}, (err, doc) => {
            if(err)return resp.send(`DB error`);
            if(!doc)return resp.send('missing item');
            if(doc.delete_password != req.body.delete_password)return resp.send('Incorrect Password');
            Thread.findByIdAndDelete(doc._id, (err) => {
                if(err)return resp.send(`DB error`);
                return resp.send(`success`);
            });
        });
    });

    app.delete('/api/replies/:board', (req,resp) => { 
        Reply.findOne({_id: req.body.reply_id}, (err, doc) => {
            if(err)return resp.send(`DB error`);
            if(!doc)return resp.send('missing item');
            if(doc.delete_password != req.body.delete_password)return resp.send('Incorrect Password');
            Reply.findByIdAndDelete(doc._id, (err) => {
                if(err)return resp.send(`DB error`);
                return resp.send(`success`);
            });
        });
    });

    app.put('/api/threads/:board', (req,resp) => { 
        Thread.findOne({_id: req.body.thread_id}, (err, doc) => {
            if(err)return resp.send(`DB error`);
            if(!doc)return resp.send('missing item');
            doc.reported = true;
            Thread.findByIdAndUpdate(doc._id,doc, (err) => {
                if(err)return resp.send("DB ERROR");
                return resp.send('success');
            });
        });
    });

    app.put('/api/replies/:board', (req,resp) => { 
        Reply.findOne({_id: req.body.reply_id}, (err, doc) => {
            if(err)return resp.send(`DB error`);
            if(!doc)return resp.send('missing item');
            doc.reported = true;
            Reply.findByIdAndUpdate(doc._id,doc, (err) => {
                if(err)return resp.send("DB ERROR");
                return resp.send('success');
            });
        });
    });
}