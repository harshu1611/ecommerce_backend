import mongoose from "mongoose";
import validator from "validator";
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"],
    },
    photo: {
        type: String,
        required: [true, "Please add photo"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    name: {
        type: String,
        required: [true, "Please enter Name"]
    },
    // gender:{
    //     type: String,
    //     enum: ["male", "female"],
    //     required: [true, "Please enter gender"]
    // }, 
    // dob:{
    //     type: Date,
    //     // required:[true, "Please enter DOB"]
    // }   ,
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Please enter email"],
        validate: validator.default.isEmail
    }
}, {
    timestamps: true
});
// schema.virtual("age").get(function(){
//     const today= new Date();
//     const dob:Date= this.dob  //because virtual is applied on 'schema', and we need dob of current schema only.
//     let age= today.getFullYear()- dob.getFullYear()
//     if(today.getMonth()<dob.getMonth() || today.getMonth()===dob.getMonth() && today.getDate() < dob.getDate()) age--;
//     return age;
// })
export const User = mongoose.model("User", schema);
