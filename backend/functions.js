const { ObjectId } = require("mongodb");
const { getMongoCollection } = require("./db");

async function insertReceita(receita) {
  const receitaDB = await getMongoCollection("receitas");
  const data = await receitaDB.insertOne(receita);
  return data;
}

async function consultReceitas() {
  const receitaDB = await getMongoCollection("receitas");
  const data = await receitaDB.find().toArray();
  return data;
}

async function deleteSpecificReceita(nome) {
  const receitaDB = await getMongoCollection("receitas");
  const name = await receitaDB.deleteOne({ nome: nome });
  return name;
}

module.exports = {
  insertReceita,
  consultReceitas,
  deleteSpecificReceita,
};
