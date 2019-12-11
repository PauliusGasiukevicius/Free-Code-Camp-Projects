module.exports = (app) =>
{
    app.get("/api/whoami", (req,res) => {
        res.send({"ipaddress": req.headers['x-forwarded-for'], 
                  "language": req.headers['accept-language'], 
                  "software": req.headers['user-agent']});
    });
}