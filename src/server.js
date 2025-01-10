import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDatabase from "./db/connect.js";
import cryptoRouter from "./routes/cryptoRoutes.js"
import startCronJob from "./services/cronJob.js";

const app = express();


// Middleware for parsing JSON
app.use(express.json());

// Route configuration
app.use("/api/crypto",cryptoRouter);

const PORT = process.env.PORT || 8000;

//connect to database
connectDatabase().then(()=>{
    app.on("error",(err)=>{
        console.log("error",err);
        throw err;
    })

    startCronJob();

    app.listen(PORT,()=>{
        console.log(` server is currently running on port : ${PORT}`);
    })

}).catch((err)=>{
    console.log("Mongo Db connection Failed!!",err);
});