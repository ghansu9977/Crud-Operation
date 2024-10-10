import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db/Config.js";
import ItemRouter from "./Routes/Item.routes.js";
const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/', ItemRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
