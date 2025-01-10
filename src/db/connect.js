import mongoose from "mongoose";

const connectDatabase = async ()=>{
    try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_DB_CONNECTION_URI );
    console.log(
        `\n MongoDb connected [[DB HOST : ${connectionInstance.connection.host}]]`
      );
    } catch (error) {
        console.log("error connecting to Db",error);
        process.exit(1);
    }
}

export default connectDatabase;