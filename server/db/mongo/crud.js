export function create(dbCtxt) {
  // colName : collection name 
  function col(colName) {
    return dbCtxt?.db?.collection(colName);
  }

  async function insert(colName, document) {
    return col(colName).insert(document);
  }

  async function insertOne(colName, document) {
    return col(colName).insertOne(document);
  }

  async function find(colName, query) {
    query = query || {};
    const data = await col(colName).find(query);
    return await data.toArray();
  }

  async function findOne(colName, query) {
    const data = await col(colName).findOne(query) || {};
    return data;
  }

  async function updateOne(colName, findQuery, updateQuery) {
    const data = await col(colName).updateOne(findQuery, updateQuery) || {};
    return data;
  }

  async function deleteMany(colName, query) {
    const data = await col(colName).deleteMany(query) || {};
    return data;
  }

  return { insert, find, findOne, insertOne, updateOne, deleteMany };
}