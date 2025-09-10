import { MongoClient } from "mongodb";

// 连接 URL 和数据库名称
const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_BD_NAME;

const client = new MongoClient(url);
const db = client.db(dbName);
export {
    db
};