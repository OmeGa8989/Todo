import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://adhyanaditya88_db_user:CtnsDMzr5AKW06lW@cluster0.qfebc9n.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
    try {
        console.log("Attempting to connect to MongoDB Atlas...");
        await client.connect();
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
        console.error("FAILURE: Could not connect to MongoDB Atlas.");
        console.error(e);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
