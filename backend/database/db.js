import mongoose from "mongoose";

const connectDb = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('mongodb is connected');
    } catch (error) {
        console.log("err",error)
    }
}

export default connectDb;