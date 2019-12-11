module.exports = (app) =>
{
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
}