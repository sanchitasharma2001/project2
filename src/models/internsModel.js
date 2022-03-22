const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const internSchema = mongoose.Schema({
    isDeleted: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: 'name is required'
    },
    email: {
        type: String,
        trim: true,
        required: "email is required",
        unique: true,
        lowercase: true
        
    },
    mobile: {
        type: Number,
        unique: true
    },
    collegeId: {
        type: ObjectId,
        required: "id is required",
        ref: 'collegeModel'
    }
    
}, { timestamps: true })
module.exports = mongoose.model("internsModel", internSchema)



