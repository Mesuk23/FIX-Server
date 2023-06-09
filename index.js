const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()




app.use(cors());
app.use(express.json());




// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     console.log(authHeader)
//     if (!authHeader) {
//         return res.status(401).send({ message: 'unauthorized user' })
//     }
//     const token = authHeader.split(' ')[1]
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'unauthorized user' })
//         }
//         req.decoded = decoded;
//         next();
//     })
// }



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xfjdabp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('mobile-services').collection('services');
        const reviewCollection = client.db('mobile-services').collection('reviews');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        app.get('/allServices', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })


        // app.post('/jwt', (req, res) => {
        //     const user = req.body;
        //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
        //     res.send({ token });
        // })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })


        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await serviceCollection.findOne(query);
            res.send(review);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            // const decoded = req.decoded;

            // if (decoded.email !== req.query.email) {
            //     res.status(403).send({ message: 'unauthorized access' })
            // }
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/service-reviews', async (req, res) => {
            let query = {};
            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updatedreview = req.body;
            console.log(updatedreview)

        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('API is running');
});



app.listen(port, () => console.log(`API is running on ${port}`))