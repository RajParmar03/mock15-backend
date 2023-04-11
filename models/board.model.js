const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
    name: String,
    tasks: {
        type : Array,
        default : [
            {}
        ]
    }
});

const BoardModel = mongoose.model("board" , boardSchema);

module.exports = BoardModel;