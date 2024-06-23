import mongoose from "mongoose";

export default async function dbConnction() {
  try {
    const connect = await mongoose.connect(process.env.DB_STRING, {});
    if (connect.connect) {
      console.log(`DATABASE CONNCTED: ${connect.connection.host}`);
    }
  } catch (error) {
    console.log(error);
    console.log("try to connect...!?");
    await dbConnction();
  }
}
