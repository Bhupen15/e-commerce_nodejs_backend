const express = require('express');
const User = require("./db/user");
const cors = require('cors');
const Product = require('./db/product');
const app = express();
require('./db/config');

const Jwt = require('jsonwebtoken');
const jwtKey = "e-comm";


const multer = require('multer');
const dayjs = require('dayjs');
// const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());



app.post("/register", async (req, res) => {

    //    let user= new User(req.body);
    //    let result = await user.save();
    // let user = User.create({name:"test",email:"asdasd",password:"asdasdasd"})
    // console.log(req.body, User);
    let user = await User.create(req.body);

    user = user.toObject();
    delete user.password;
    Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send({ result: "Something went wrong, Please try after sometime" });
        }
        res.send({ user, auth: token });
    })


});

app.post("/login", async (req, res) => {

    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({ result: "Something went wrong, Please try after sometime" });
                }
                res.send({ user, auth: token });
            })

        }
        else {
            res.send({ result: 'No user found' });
        }
    }
    else {
        res.send({ result: 'No user found' });
    }


});

app.post("/add-product", verifyToken, async (req, res) => {

    let product = new Product(req.body);
    let result = await product.save();

    res.send(result);

})
app.get("/product-list", verifyToken, async (req, res) => {

    let products = await Product.find();

    if (products.length > 0) {
        res.send(products);
    }
    else {
        res.send({ result: "No product found" });
    }

})

app.delete("/deleteproduct/:id", verifyToken, async (req, res) => {

    const result = await Product.deleteOne({ _id: req.params.id })
    res.send(result);
})

app.put("/updateproduct/:id", verifyToken, async (req, res) => {

    const result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);
})
app.get("/singleproduct/:id", verifyToken, async (req, res) => {

    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    }
    else {
        res.send({ result: "No record found" });
    }
})

app.get("/search/:key", verifyToken, async (req, res) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key, $options: 'i'  } },
            { price: { $regex: req.params.key } },
            { company: { $regex: req.params.key, $options: 'i' }  },
            { category: { $regex: req.params.key, $options: 'i'  } },
        ]
    });
    res.send(result);
})

function verifyToken(req, res, next) {

    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];

        // console.log("Middileware called", token);
        // token= token.slice(1,-1);
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.status(401).send({ result: "Please provide valid token" });

            }
            else {

                next();
            }
        });
    }
    else {
        res.status(403).send({ result: "Please add token with header" });
    }

}


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            let a = file.originalname.split(".");
            let ex = a.pop();
            let name = a.join("_");

            let k = name + "-" + dayjs().format('YYYY-MM-DD_HH:MM:ss:SSS') + "." + ex;
            cb(null, k);
        }
    })
}).single('image');

app.post("/upload-image", upload, async(req, res) => {
    console.log(req.file);

    let user = new User(req.body.file);
  

    res.send("File uploaded");
    // res.send("File uploaded");
})


app.listen(5002);


