module.exports = (app, mongoose) => {

    mongoose.set('useFindAndModify', false);
    let issueSchema = new mongoose.Schema(
        {issue_title: String,
         issue_text: String,
         created_by: String,
         assigned_to: String,
         status_text: String,
         created_on: Date,
         updated_on: Date,
         open: Boolean});
    let Issue = mongoose.model('issue', issueSchema);

    app.post(`/api/issues/:projectname`, (req,resp) => {
        let issue = new Issue({
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to || '',
            status_text: req.body.status_text || '',
            created_on: new Date(),
            updated_on: new Date(),
            open: true});
        
            issue.save((err,res) => {
                if(err)return resp.send("DB ERROR");
                return resp.send(res);
            });
    });

    app.put(`/api/issues/:projectname`, (req,resp) => {
        if(!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text && !req.body.open)
        return resp.send('no updated field sent');

        Issue.findById(req.body._id, (err,issue) => {
            if(req.body.issue_title)issue.issue_title = req.body.issue_title;
            if(req.body.issue_text)issue.issue_text = req.body.issue_text;
            if(req.body.assigned_to)issue.assigned_to = req.body.assigned_to;
            if(req.body.status_text)issue.status_text = req.body.status_text;
            if(req.body.created_by)issue.created_by = req.body.created_by;
            if(req.body.open)issue.open = req.body.open;
            issue.updated_on = new Date();

            Issue.findByIdAndUpdate(req.body._id,issue, (err,doc) => {
                if(err)return resp.send("DB ERROR");
                return resp.send('successfully updated');
            });
        });
    });

    app.delete(`/api/issues/:projectname`, (req,resp) => {
        Issue.findByIdAndDelete(req.body._id, (err) => {
            if(err)return resp.send(`could not delete ${req.body._id}.`);
            return resp.send(`deleted  ${req.body._id}`);
        });
    });

    app.get(`/api/issues/:projectname`, (req,resp) => {
        Issue.find(req.query, (err,docs) => {
            if(err)return resp.send("DB ERROR");
            return resp.send(docs);
        });
    });

}