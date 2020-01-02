const fetch = require('node-fetch');
module.exports = (app, mongoose) => {
    mongoose.set('useFindAndModify', false);

    let stockSchema = new mongoose.Schema(
        {stock: String,
        likes: Number,
        upvoters: [String]
        });
    let Stock = mongoose.model('stock', stockSchema);

    let getStockFromApi = async (stock) => {
        let res = await fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`);
        let json = await res.json();
        return json;
    };

    app.get('/api/stock-prices', async (req, res) => {
        let result = {stockData: []};

        if(!Array.isArray(req.query.stock))
        req.query.stock = [req.query.stock];

        for(stockName of req.query.stock)
        {
            let trueStock = await getStockFromApi(stockName);
            let currentStock = await Stock.findOne({stock: stockName}).exec() || null;
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

            if(!currentStock)
            {
                let newStock = new Stock({stock: stockName, likes: 0, upvoters: []});
                currentStock = await newStock.save();
            }

            if(req.query.like)
            {
                if(!currentStock.upvoters.includes(ip))
                {
                    currentStock.likes++;
                    currentStock.upvoters.push(ip);
                }
                await Stock.findByIdAndUpdate(currentStock._id, currentStock);
            }
                let copy = {price: trueStock.latestPrice, stock: currentStock.stock, likes: currentStock.likes};
                //console.log(copy);
                result.stockData.push(copy);
        }

        if(req.query.stock.length == 2)
        {
            let rel_like = result.stockData[0].likes - result.stockData[1].likes;
            result.stockData[0].rel_like = rel_like;
            result.stockData[1].rel_like = -rel_like;
            delete result.stockData[0].likes;
            delete result.stockData[1].likes;
        }

        return res.send(result);
    });
}