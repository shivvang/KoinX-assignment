import expres from "express";
import { getLatestCoinStats } from "../controllers/crypto.controller.js";


const cryptoRouter  = new expres.Router();
cryptoRouter.get("/stats",getLatestCoinStats);

export default cryptoRouter;  