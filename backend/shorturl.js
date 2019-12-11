const dns = require('dns');

module.exports = (app, mongoose) => 
{
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
}