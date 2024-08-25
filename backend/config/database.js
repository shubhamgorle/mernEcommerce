const mongoose = require("mongoose");
// process.env.DB_URI 
const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI).then((data) => {
        console.log(`mongodb connected with server ${data.connection.host}-${process.env.PORT} `);
    }).catch((error) => {
        console.log(error)
    })
}
module.exports = connectDatabase;