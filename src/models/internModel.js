const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const validator = require("validator")
const intern = mongoose.Schema({
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
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    mobile: {
        type: Number,
        minlength: [10, 'Mimium 10numbers'],
    },
    collegeId: {
        type: ObjectId,
        required: "id is required",
        ref: 'collegeModel'
    }
    
}, { timestamps: true })
module.exports = mongoose.model("internModel", internSchema)



