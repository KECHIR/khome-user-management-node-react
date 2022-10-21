
import { MongoClient } from 'mongodb';
import { mongoDbConfig } from './mongoDbConfig.js';

export function create() {

  const getDbCtxt = async () => {
    const dbName = process.env.MONGO_DB_NAME;
    const cnxStr = process.env.MONGO_DB_CONNECTION_STRING;
    const client = new MongoClient(cnxStr, mongoDbConfig);
    const connectDb = await client.connect();
    return { /* client,  */db: connectDb.db(dbName) };
  };

  return { getDbCtxt };
}