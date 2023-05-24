const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());

var BASE_URL = 'https://vc.blinkly.com';

var ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NTI2YzFmZjllNmE4MDhiZjNmZTljZiIsInVzZXJuYW1lIjoicmFiYml0IiwiaWF0IjoxNjg0MTQzODI0LCJleHAiOjE3MTU2Nzk4MjR9.CTFOT8Ylg4hidVk_zU6CPTFqHj2xdnAthtoOp4sBbvo';



// app.use("/uploads", express.static(path.join(__dirname, 'uploads/')));


// API call snippet for post pdf files pages to convert/render video
// BASE_URL : API base URL
// ACCESS_TOKEN : Authorization access token 
const coolPath = path.join(__dirname, 'uploads/Loan Project Field.pdf');
// console.log(__dirname)
// console.log(path)
// console.log(coolPath);
app.post('/welcome', async (req, res, next) => {
    var request = require('request');
    var fs = require('fs');
    var options = {
        'method': 'POST',
        'url': BASE_URL + '/vc',
        'headers': {
            'Authorization': ACCESS_TOKEN
        },
        formData: {
            'filelists': {
                'value': fs.createReadStream("Loan Project Field.pdf"), // pdf only
                'options': {
                    'filename': 'filename',
                    'contentType': 'application/pdf'
                }
            }
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);

        res.status(200).json(JSON.parse(response.body))
    });



})

// API call snippet for post pdf files pages to convert/render video
// BASE_URL : API base URL
// ACCESS_TOKEN : Authorization access token 
// :dirname : value of same key from pdf post api response
// :videoname : value of same key from pdf post api response

app.get("/getvideo", async (req, res, next) => {
    var request = require('request');
    var options = {
        'method': 'GET',
        'url': BASE_URL + '/vc/status/pYBRorv7q/filename_1',
        'headers': {
            'Authorization': ACCESS_TOKEN
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.status(200).json(JSON.parse(response.body))
    });

})


app.listen(5002);