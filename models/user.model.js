const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email : String,
    password : String,
    boards : {
        type : Array,
        default : []
    }
});

const UserModel = mongoose.model("user" , userSchema);

module.exports = UserModel;