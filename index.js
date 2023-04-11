const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const UserModel = require("./models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BoardModel = require("./models/board.model");


const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).send("you are on the raj parmar mock 15 backend...");
});

app.post("/signup", async (req, res) => {
    let { email, password } = req.body;
    try {
        let users = await UserModel.find({ email });
        if (users.length > 0) {
            res.status(400).send({ msg: "User is already exist..." });
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                // Store hash in your password DB.
                if (err) {
                    res.status(400).send({ msg: "failed to create an account..." });
                } else {
                    let newUser = new UserModel({ email, password: hash });
                    await newUser.save();
                    res.status(200).send({ msg: "successfully created an account..." });
                }
            });
        }
    } catch (error) {
        res.status(400).send({ msg: "failed to create an account..." });
    }
});

app.post("/login", async (req, res) => {
    let { email, password } = req.body;
    try {
        let users = await UserModel.find({ email });
        if (users.length > 0) {
            bcrypt.compare(password, users[0].password, async (err, result) => {
                // result == true
                if (!result) {
                    res.status(400).send({ msg: "invalid credentials..." });
                } else {
                    const token = jwt.sign({ email: email }, 'rajuparmar');
                    res.status(200).send({ msg: "Login Successful...", token });
                }
            });
        } else {
            res.status(400).send({ msg: "no user found with this email id..." });
        }
    } catch (error) {
        res.status(400).send({ msg: "failed to login user..." });
    }
});

app.post("/getuser", async (req, res) => {
    let { token } = req.body;
    const { email } = jwt.verify(token, 'rajuparmar');
    try {
        let users = await UserModel.find({ email });
        if (users.length > 0) {
            res.status(200).send({ user: users[0] });
        } else {
            res.status(400).send({ msg: "invalid token..." });
        }
    } catch (error) {
        res.status(400).send({ msg: "failed to get user" });
    }
});

app.patch("/createboard/:id", async (req, res) => {
    let id = req.params.id;

    try {
        let user = await UserModel.findById({ _id: id });

        let newBoard = new BoardModel({ name: "new board" });

        await newBoard.save();
        let newBoards = [...user.boards, newBoard];

        await UserModel.findByIdAndUpdate({ _id: id }, { boards: newBoards });

        res.status(200).send({ msg: "successfully created board..." });
    } catch (error) {
        res.status(400).send({ msg: "failed to create board" });
    }
})





app.listen(8080, async () => {
    try {
        await connection;
        console.log("successfully connected with DB...");
    } catch (error) {
        console.log("failed to connect with DB...");
        console.log("error is : ", error);
    }

    console.log("server is successfully started at port 8080...");
});
