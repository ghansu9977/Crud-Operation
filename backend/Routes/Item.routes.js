import express from "express";

import { ViewAll, UpdateItem, DeleteItem, AddItems, viewById, AddBulkItems, AddItemsFromExcel } from "../Controller/Item.Controller.js";
import upload from "../MiddleWare/upload.js";

const router = express.Router();

router.post("/add", AddItems);
router.get("/view", ViewAll);
router.get("/view/:id",viewById);
router.put("/update/:id", UpdateItem); 
router.delete("/delete/:id", DeleteItem); 
router.post("/add-bulk", AddBulkItems);
router.post("/xls",upload.single('file'),AddItemsFromExcel)


export default router;
