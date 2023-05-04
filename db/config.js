const mongoose = require('mongoose');

module.export = mongoose.connect("mongodb://localhost:27017/ecommerce")

// mongodb://localhost:27017/ecommerce
// .then(x => {
//     console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
// })
// .catch(err => {
//     console.error('Error connecting to mongo', err)
// });
 