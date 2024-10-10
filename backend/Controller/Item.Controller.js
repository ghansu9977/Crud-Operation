import XLSX from 'xlsx';
import fs from 'fs';
import Item from '../Model/Item.model.js';

// Controller to add an item
const AddItems = async (req, res) => {
    const { pname,price,description } = req.body;
    const newItem = new Item({ pname,price,description });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Controller to add multiple items
const AddBulkItems = async (req, res) => {
    const items = req.body; // Expecting an array of items

    try {
        // Validate that the request body is an array
        if (!Array.isArray(items)) {
            return res.status(400).json({ message: "Request body must be an array of items." });
        }

        // Create multiple Item instances
        const newItems = items.map(item => new Item(item));

        // Save all items to the database
        const savedItems = await Item.insertMany(newItems);
        res.status(201).json(savedItems);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Controller to view all items
const ViewAll = async (req, res) => {
    try {
        const items = await Item.find(); 
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
};

// Controller to View By Id an Item

const viewById = async(req,res)=>{
    
    try{
        const id = req.params.id;
        const  item = await Item.findById(id);
        res.status(200).json(item);
    }
    catch{
        res.status(500).json({error:error.message});
    }

};

// Controller to update an item
const UpdateItem = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to delete an item
const DeleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: `Item with ID ${id} deleted successfully.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const AddItemsFromExcel = async (req, res) => {
    const file = req.file; 

    if (!file) {
        return res.status(400).json({ message: "No file uploaded." });
    }
    
    try {
        // Read the Excel file
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0]; 
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const items = XLSX.utils.sheet_to_json(sheet);

        
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "No valid items found in the Excel file." });
        }

 
        const newItems = items.map(item => new Item(item));
        const savedItems = await Item.insertMany(newItems);

        // Clean up the uploaded file
        fs.unlinkSync(file.path);

        res.status(201).json(savedItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { AddItems,AddBulkItems,ViewAll,viewById, UpdateItem, DeleteItem,AddItemsFromExcel };
