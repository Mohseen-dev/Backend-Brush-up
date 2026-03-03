import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectToDB = async () =>{
    try {
       const databaseInstance =  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
       console.log(`Database connected successfully :: db/index.js :: ${databaseInstance.connection.host}`);

    } catch (error) {
        console.log("Database connection failed ::",error.message)
    }

}

export default connectToDB;