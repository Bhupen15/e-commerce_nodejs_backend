const express = require('express');
const path = require('path');
const User = require("./db/user");
const cors = require('cors');
const Product = require('./db/product');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use("/uploads", express.static(path.join(__dirname, 'uploads/')));

require('./db/config');

const Jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;


const multer = require('multer');
const dayjs = require('dayjs');

app.use(express.json());
app.use(cors());


//User registration api
app.post("/register", async (req, res) => {


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

//User login api
app.post("/login", async (req, res) => {
//  console.log("here", )
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




//Add product api
app.post("/add-product", verifyToken, async (req, res) => {

    let product = new Product({
        userId:req.user._id,
        ...req.body,
    });
    let result = await product.save();

    res.send(result);

})

//Product list api 
app.get("/product-list", verifyToken, async (req, res) => {



    let products = await Product.find({userId:req.user._id})
    // .populate({
    //     path:"userId",
    //     select:"_id name email"
    // });
    if (products.length > 0) {
        // filteredproducts = products.filter((val) => {
        //     if (val.userId == req.user._id)
        //         return true;
        //     else
        //         return false;
        // }

        // )
       
        res.send(products);
    }
    else {
        res.send({ result: "No product found" });
    }

})

//Delete product api
app.delete("/deleteproduct/:id", verifyToken, async (req, res) => {

    const result = await Product.deleteOne({ _id: req.params.id })
    res.send(result);
})

//Update product api
app.put("/updateproduct/:id", verifyToken, async (req, res) => {

    const result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);
})

//Single product print api
app.get("/singleproduct/:id", verifyToken, async (req, res) => {

    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    }
    else {
        res.send({ result: "No record found" });
    }
})

//Search product api
app.get("/search/:key", verifyToken, async (req, res) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key, $options: 'i' } },
            { price: { $regex: req.params.key } },
            { company: { $regex: req.params.key, $options: 'i' } },
            { category: { $regex: req.params.key, $options: 'i' } },
        ]
    });
    res.send(result);
})

//VerifyToken function
function verifyToken(req, res, next) {

    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];

        const user = Jwt.verify(token, jwtKey, (err, data) => {
            if (err) {
                res.status(401).send({ result: "Please provide valid token" });

            }
            else {

                req.user = data.user;

                next();
            }
        });

    }
    else {
        res.status(403).send({ result: "Please add token with header" });
    }

}

//Upload image function
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


//Upload image api
app.post("/upload-image", upload, verifyToken, async (req, res) => {

    const user = await User.updateOne({ _id: req.user._id },
        {
            $set: { image: req.file.path }
        }
    )

    const updated_user = await User.findById(req.user._id);

    res.send(updated_user);

})

//Single user print api
app.get("/me", verifyToken, async (req, res) => {

    let result = await User.findOne({ _id: req.user._id });
    if (result) {
        res.send(result);
    }
    else {
        res.send({ result: "No record found" });
    }
})

app.listen(5002);


