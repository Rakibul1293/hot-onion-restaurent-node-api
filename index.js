const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());


const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const users = ["Asad", 'Moin', 'Sabed', 'Susmita', 'Sohana', 'Sabana'];


app.get('/foodItems', (req, res) => {
    // client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineFoodStore").collection("foodType");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        });
        // client.close();
    });
});

app.get('/foodItem/:key', (req, res) => {
    const key = req.params.key;

    // client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineFoodStore").collection("foodType");
        collection.find({key}).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents[0]);
            }
        });
        // client.close();
    });
});

//delete
//update
// post
app.post('/getfoodItemsByKey', (req, res) => {
    const key = req.params.key;
    const productKeys = req.body;
    console.log(productKeys);

    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineFoodStore").collection("foodType");
        collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        });
        // client.close();
    });
});

app.post('/addfoodItems', (req, res) => {
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineFoodStore").collection("foodType");
        collection.insert(product, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        });
        // client.close();
    });
});

app.post('/placeOrder', (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    console.log(orderDetails);
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineFoodStore").collection("orders");
        collection.insertOne(orderDetails, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        });
        // client.close();
    });
});

const port = process.env.PORT || 4200;
app.listen(port, () => console.log('Listenting to port 4200'));