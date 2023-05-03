const express = require('express');
const User = require("./db/user");
const cors = require('cors');
const Product = require('./db/product');
const app = express();
require('./db/config');
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
    res.send(user);


});

app.post("/login", async (req, res) => {

    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            res.send(user);
        }
        else {
            res.send({ result: 'No user found' });
        }
    }
    else {
        res.send({ result: 'No user found' });
    }


});

app.post("/add-product", async (req, res) => {

    let product = new Product(req.body);
    let result = await product.save();

    res.send(result);

})
app.get("/product-list", async (req, res) => {

    let products = await Product.find();

    if (products.length > 0) {
        res.send(products);
    }
    else {
        res.send({ result: "No product found" });
    }

})

app.delete("/deleteproduct/:id", async (req, res) => {

    const result = await Product.deleteOne({ _id: req.params.id })
    res.send(result);
})

app.put("/updateproduct/:id", async (req, res) => {

    const result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);
})
app.get("/singleproduct/:id", async (req, res) => {

    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    }
    else {
        res.send({ result: "No record found" });
    }
})

app.get("/search/:key", async(req, res)=>{
    let result = await Product.find({
        "$or":[
            {name: {$regex: req.params.key}},
            {price: {$regex: req.params.key}},
            {company: {$regex: req.params.key}},
            {category: {$regex: req.params.key}},
        ]
    });
    res.send(result);
})

app.listen(5002);


