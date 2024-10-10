import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    pname: {
        type: String,
        required: true,
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});

const Item = mongoose.model("Item", itemSchema);


export default Item;
