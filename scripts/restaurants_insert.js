import { MongoClient } from "mongodb";

const uri = "<connection-string>";
const client = new MongoClient(uri);

async function measureQueryTime(label, fn) {
  const start = process.hrtime();
  const result = await fn();
  const end = process.hrtime(start);
  const timeTakenMs = (end[0] * 1000 + end[1] / 1e6).toFixed(3);
  console.log(`${label} took ${timeTakenMs} ms`);
  return result;
}

async function run() {
  try {
    await client.connect();
    const db = client.db("sample_restaurants");

    const result = await measureQueryTime("Insert", async () => {
      return db.collection("restaurants").insertOne({
        address: {
          building: "234",
          coord: [-73.95, 40.75],
          street: "Example Street",
          zipcode: "10001"
        },
        borough: "Manhattan",
        cuisine: "Italian",
        grades: [
          { date: new Date(), grade: "A", score: 10 }
        ],
        name: "Dominos",
        restaurant_id: "44444444"
      });
    });

    console.log(result);
  } finally {
    await client.close();
  }
}

run().catch(console.error);