import Crypto from "../models/crypto.model.js";

export const getLatestCoinStats = async (req, res) => {
  try {

    const coins = ["bitcoin", "ethereum", "matic-network"];

    const { coin } = req.query;

    // Validate that coin parameter is provided
    if (!coin) {
      return res.status(400).json({
        success: false,
        message: "Coin parameter is required. Please pass the coin  in the request parameters.",
      });
    }

    //is it one of the given coin

    if (!coins.includes(coin)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coin. Valid coins are: bitcoin, ethereum, matic-network."
      });
    }

    // Fetch the latest value of the coin from the database
    const latestCoinData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

    // Check if the coin exists in the database
    if (!latestCoinData) {
      return res.status(404).json({
        success: false,
        message: `No data found for the coin '${coin}'. Please check the coin .`,
      });
    }

  
    return res.status(200).json({
      success: true,
      message: `Latest data fetched successfully for the coin '${coin}'.`,
      data: {
        coin: latestCoinData.coin,
        price: latestCoinData.price,
        marketCap: latestCoinData.marketCap,
        change24h: latestCoinData.change24h,
        timestamp: latestCoinData.timestamp,
      },
    });
  } catch (error) {
    console.error(`Error fetching latest stats for the coin '${req.query.coin}':`, error);

    
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while fetching the coin stats.",
      error: error.message,
    });
  }
};


export const getStandardDeviation  =async(req,res)=>{
try {
  
  const coins = ["bitcoin", "ethereum", "matic-network"];

  const { coin } = req.query;

    if (!coin) {
      return res.status(400).json({ success: false, message: "Coin parameter is required." });
    }

     //is it one of the given coin

     if (!coins.includes(coin)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coin. Valid coins are: bitcoin, ethereum, matic-network."
      });
    }

    // Fetch the last 100 records for the specified coin
    const records = await Crypto.find({ coin })
      .sort({ timestamp: -1 })
      .limit(100)
      .select("price");

    if (records.length === 0) {
      return res.status(404).json({ success: false, message: "No records found for the specified coin." });
    }


    const prices = records.map(record => record.price);

    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;

    const stdDeviation = Math.sqrt(variance);

   // Return the result
   return res.json({
    success: true,
    coin,
    standardDeviation: stdDeviation.toFixed(2),
    message: "Standard deviation calculated successfully.",
  });


} catch (error) {
  console.error(`Error fetching StandardDeviation for the coin '${req.query.coin}':`, error);

  return res.status(500).json({
    success: false,
    message: "An internal server error occurred while fetching the coin deviation.",
    error: error.message,
  });
}
}