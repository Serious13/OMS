import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config({path:'./.env'})

const connectionUrl : string = process.env?.DB_CONN_STRING ? process.env.DB_CONN_STRING : ""
const dbName : string = process.env.DB_NAME = process.env?.DB_NAME ? process.env.DB_NAME : ""
const dbColl : string= process.env.DB_COL = process.env?.DB_COL ? process.env.DB_COL : ""
let mongoServer : any

const client : mongoDB.MongoClient = new mongoDB.MongoClient(connectionUrl)

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

export async function createUser(user: {}) : Promise<any> {
    try {
        const db = client.db(dbName)
        const coll = db.collection(dbColl)
        const result = await coll.insertOne(user)
        console.log(`connected to database: ${dbName} and document was inserted with the _id: ${result.insertedId}`)
        return result.insertedId.toString()
    }
    catch(e) {
        return e
    }
    finally {
        //await client.close()
    }
}

export async function findProductByName(name : string) : Promise<any>  {
    try {
        const db = client.db(dbName)
        const coll = db.collection("products")
        const result  = await coll.findOne({"name": name})
        console.log(`connected to database: ${dbName} and document was inserted with the _id: ${result}`)
        return result?.productId ? result.productId : ""
    }
    catch(e) {
        return e
    }
    finally {
        //await client.close()
    }
}
