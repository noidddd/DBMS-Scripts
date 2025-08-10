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
    const db = client.db("sample_mflix");

    const result = await measureQueryTime("Delete", async () => {
      return db.collection("users").deleteOne(
        { name: "John Wick" });
    });

    console.log(result);
  } finally {
    await client.close();
  }
}

run().catch(console.error);