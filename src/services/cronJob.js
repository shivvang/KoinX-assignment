import axios from "axios";
import Crypto from "../models/crypto.model.js";
import cron from "node-cron";


//previous approach :-

// The await pauses the execution at each API call.
// Once one API call is completed and saved in the database, it moves to the next coin.
// This ensures operations happen one at a time in strict order.

// Time-Consuming: Each operation depends on the previous one to complete, leading to N sequential operations.
// If each fetch+save takes 1 second, 3 coins will take 3 seconds.

// const fetchAndSaveCryptoData = async () => {
//    try {
//      // an array of coin IDs to fetch
//      const coins = ["bitcoin", "ethereum", "matic-network"];
     
//      // Iterate over coins and fetch/save data
//      for (const coin of coins) {
//        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`);
//        const result = response.data;
 
//        // Save to the database
//        await new Crypto({
//          coin: result.id,
//          price: result.market_data.current_price.usd,
//          marketCap: result.market_data.market_cap.usd,
//          change24h: result.market_data.price_change_percentage_24h,
//          timestamp: new Date(), 
//        }).save();
//      }
 
//      console.log("Crypto data fetched and stored successfully.");
//    } catch (error) {
//      console.error("Error fetching crypto data:", error.message);
//    }
//  };



// New Approach:-

// Faster Execution: All API calls and database saves are initiated at the same time. Total time = the time for the longest individual operation.
// If each fetch+save takes 1 second, 3 coins will still take 1 second (not 3 seconds).
// Efficient Use of Resources: Since the tasks are independent, they don't block each other.
// Scalable: Works well for handling multiple asynchronous tasks without unnecessary delays.


// Define a function to fetch and save crypto data

const coins = ["bitcoin", "ethereum", "matic-network"];

const fetchAndSaveCryptoData = async () => {
  try {
    const fetchDataAndSavePromises = coins.map(async (coin) => {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`);

      if (!response) {
        console.log(`Error fetching ${coin}. Response was empty.`);
      }

      const result = response.data;

      console.log(`Data fetched for ${coin}:`, result);

      console.log(`Saving ${coin} data to the database...`);

      try {
        await new Crypto({
          coin: result.id,
          price: result.market_data.current_price.usd,
          marketCap: result.market_data.market_cap.usd,
          change24h: result.market_data.price_change_percentage_24h,
          timestamp: new Date(),
        }).save();
        console.log(`${coin} data saved successfully.`);
      } catch (saveError) {
        console.error(`Error saving ${coin} data to the database:`, saveError.message);
      }
    });

    // Wait for all fetch and save operations to complete
    await Promise.all(fetchDataAndSavePromises);

    console.log("All coin data fetched and saved successfully.");

  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
  }
};

//a cron job that calls the fetchAndSaveCryptoData function every 2 hours

const cronJob = cron.schedule(
  "0 */2 * * *", // Every 2 hours at the start of the hour
  async () => {
    console.log("Cron job started...");
    await fetchAndSaveCryptoData();
    console.log("Cron job finished.");
  },
  { scheduled: false }
);


const startCronJob = () => {
   cronJob.start();
 };
 
 export default startCronJob;