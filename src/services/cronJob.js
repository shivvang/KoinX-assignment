import axios from "axios";
import cron from "node-cron";
import Crypto from "../models/crypto.model.js";


const fetchAndSaveCryptoData = async () => {
   try {
     // an array of coin IDs to fetch
     const coins = ["bitcoin", "ethereum", "matic-network"];
     
     // Iterate over coins and fetch/save data
     for (const coin of coins) {
       const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`);
       const result = response.data;
 
       // Save to the database
       await new Crypto({
         coin: result.id,
         price: result.market_data.current_price.usd,
         marketCap: result.market_data.market_cap.usd,
         change24h: result.market_data.price_change_percentage_24h,
         timestamp: new Date(), 
       }).save();
     }
 
     console.log("Crypto data fetched and stored successfully.");
   } catch (error) {
     console.error("Error fetching crypto data:", error.message);
   }
 };

 //The cron expression 0 */2 * * * would schedule the task every 2 hours starting from the top of each hour divisible by 2 
 // (like 12:00, 2:00, 4:00, etc.)
const cronJob = cron.schedule("0 */2 * * *",fetchAndSaveCryptoData,{scheduled:false});

const startCronJob = () => {
   cronJob.start();
   console.log("Cron job started.");
 };
 
 export default startCronJob;