import Crypto from "../models/crypto.model.js";

export const getLatestCoinStats = async (req, res) => {
  try {
    const { coin } = req.query;

    // Validate that coin parameter is provided
    if (!coin) {
      return res.status(400).json({
        success: false,
        message: "Coin parameter is required. Please pass the coin ID in the request parameters.",
      });
    }

    // Fetch the latest value of the coin from the database
    const latestCoinData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

    // Check if the coin exists in the database
    if (!latestCoinData) {
      return res.status(404).json({
        success: false,
        message: `No data found for the coin '${coin}'. Please check the coin ID.`,
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
    console.error(`Error fetching latest stats for the coin '${req.params.coin}':`, error);

    
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while fetching the coin stats.",
      error: error.message,
    });
  }
};
