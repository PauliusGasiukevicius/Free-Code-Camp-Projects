module.exports = (app, mongoose) => {
    mongoose.set('useFindAndModify', false);
    let bookSchema = new mongoose.Schema(
        {title: String,
        comments: [String]
        });
    let Book = mongoose.model('book', bookSchema);

    app.post('/api/books', (req, resp) => {
        let book = new Book({title: req.body.title, comments: []});
        book.save((err,res) => {
            if(err)return resp.send("DB ERROR");
            return resp.send(res);
        });
    });

    app.get('/api/books', (req,resp) => {
        Book.find({}, (err,docs) => {
            if(err)return resp.send("DB ERROR");
            let res = JSON.parse(JSON.stringify(docs));
            res.forEach(element => {
               element.commentcount = element.comments.length || 0;
            });
            return resp.send(res);
        });
    });

    app.get('/api/books/:_id', (req,resp) => {
        Book.findById(req.params._id, (err,doc) => {
            if(err)return resp.send("DB ERROR");
            return resp.send(doc);
        });
    });

    app.post('/api/books/:_id', (req,resp) => {
        Book.findById(req.params._id, (err,doc) => {
            if(err)return resp.send("DB ERROR");
            doc.comments.push(req.body.comment);

            Book.findByIdAndUpdate(req.params._id,doc, (err) => {
                if(err)return resp.send("DB ERROR");
                return resp.send(doc);
            });
        });
    });

    app.delete('/api/books/:_id', (req,resp) => {
        Book.findByIdAndDelete(req.params._id, (err) => {
            if(err)return resp.send(`no book exists`);
            return resp.send(`delete successful`);
        });
    });

    app.delete('/api/books', (req,resp) => {
       Book.deleteMany((err) => {
           if(err)return resp.send(`DB error`);
           return resp.send('complete delete successful');
       });
    });
}