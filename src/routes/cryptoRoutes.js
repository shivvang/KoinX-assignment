import expres from "express";
import { getLatestCoinStats, getStandardDeviation } from "../controllers/crypto.controller.js";


const cryptoRouter  = new expres.Router();

cryptoRouter.get("/stats",getLatestCoinStats);

cryptoRouter.get("/deviation",getStandardDeviation);

export default cryptoRouter;  