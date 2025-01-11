import mongoose from "mongoose";

const cryptoSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    enum:["bitcoin","ethereum","matic-network"]
  },
  price: {
    type: Number,
    required: true,
  },
  marketCap: {
    type: Number,
    required: true,
  },
  change24h: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});


//index on the timestamp field in descending order, so queries will return the newest documents first.
cryptoSchema.index({timestamp:-1});

cryptoSchema.index({coin:1});

const Crypto = mongoose.model("Crypto", cryptoSchema);

export default Crypto;
