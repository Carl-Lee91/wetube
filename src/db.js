import mongoose, { mongo } from "mongoose";

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/WeTube", {useNewUrlParser: true}, {useFindAndModify: false},{useUnigiedTopology: true},);

const db =  mongoose.connection;

const handleOpen = () => console.log("Connected to DB")
const handleError = (error) => console.log("DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);