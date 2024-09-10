const mongoose = require('mongoose');
const { Schema } = mongoose;


const ResourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    status: { type: String, default: 'Available' }
});

const agencySchema = new Schema({
    govtId:{type:Number, required:true, unique:true},
    password:{type:String, required:true},
    deptName:{type:String, required:true},
    address:{type:String},
    city:{type:String, required:true},
    coordinates:[],
    pinCode:{type:Number, required:true},
    state:{type:String, required:true},
    resources:[ResourceSchema],
    token:{type:String},
    
});


exports.Agency = mongoose.model('Agency', agencySchema);
