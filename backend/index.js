const express = require("express");
const { getMongoCollection } = require("./db");
const { ObjectId } = require("mongodb");
const {
  insertReceita,
  consultReceitas,
  consultSpecificReceita,
  consultSpecificType,
  deleteSpecificReceita,
} = require("./functions");

const PORT = process.env.PORT ?? 3050;

const app = express();
app.use(express.json());

app.listen(PORT, () =>
  console.log(`Server is Listening http://localhost:${PORT}`)
);

async function authorize(req, res, next) {
  const token = req.header("authorization");
  const users = await getMongoCollection("users");
  const usersList = await users.find().toArray();
  const user = usersList.find((ele) => ele._id == token);

  if (ObjectId.isValid(token) && user) {
    return next();
  }
  return res.sendStatus(401);
}

//get user
app.get("/api/receitas/user", async (req, res) => {
  const token = req.header("authorization");
  const users = await getMongoCollection("users");
  const usersList = await users.find().toArray();
  const user = usersList.find((ele) => ele._id == token);
  try {
    if (ObjectId.isValid(token) && user) {
      return res.status(200).json(user);
    }
    return res.sendStatus(404);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/receitas", authorize, async (req, res) => {
  let same;
  const receita = req.body;

  const receitasTodas = await consultReceitas();

  try {
    receitasTodas.map((ele) => {
      if (ele.nome === receita.nome) {
        same = true;
      } else {
        same = false;
      }
    });

    if (!same) {
      const insert = await insertReceita(receita);
      return res.status(200).json(receita);
    } else {
      return res.status(400).json("Já existe uma receita com esse nome.");
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/receitas", async (req, res) => {
  try {
    const allReceitas = await consultReceitas();
    return res.status(200).json(allReceitas);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/receitas/receitaEspecifica/:name", async (req, res) => {
  const nomeDaReceita = req.params.name;
  const specificReceita = await consultSpecificReceita(nomeDaReceita);
  try {
    return res.status(200).json(specificReceita);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/receitas/tipos/:tipo", async (req, res) => {
  const tipoDaReceita = req.params.tipo;
  const specificType = await consultSpecificType(tipoDaReceita);
  try {
    return res.status(200).json(specificType);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/receitas/receitaEspecifica/:name", async (req, res) => {
  const nomeDaReceita = req.params.name;
  const receitasTodas = await consultReceitas();

  const token = req.header("authorization");
  const users = await getMongoCollection("users");
  const usersList = await users.find().toArray();
  const user = usersList.find((ele) => ele._id == token);
  try {
    receitasTodas.map((ele) => {
      if (ele.nome === nomeDaReceita && user.admin) {
        same = true;
      } else {
        same = false;
      }
    });

    if (same) {
      const specificReceita = await deleteSpecificReceita(nomeDaReceita);
      return res.status(200).json({ receitaApagada: nomeDaReceita });
    } else {
      return res
        .status(400)
        .json(
          "Não existe uma receita com esse nome || Não tens autorização para apagar"
        );
    }
  } catch (error) {
    console.log(error);
  }
});

//Sign Up
app.post("/api/users", async (req, res) => {
  const users = await getMongoCollection("users");
  const usersList = await users.find().toArray();
  console.log(usersList);
  const { name, email, password, confirmPassword } = req.body;
  const names = usersList.map((ele) => ele.name);
  const emails = usersList.map((ele) => ele.email);
  try {
    if (
      !names.includes(name) &&
      !emails.includes(email) &&
      password === confirmPassword
    ) {
      const data = await users.insertOne({
        name,
        email,
        password,
        admin: false,
      });

      const token = data.insertedId;

      return res.status(200).json({ data, token });
    }
    return res.status(400).json("User Already Exists.");
  } catch (error) {
    console.log(error);
  }
});

//login
app.post("/api/receitas/sessions", async (req, res) => {
  const users = await getMongoCollection("users");
  const sessions = await getMongoCollection("sessions");
  const usersList = await users.find().toArray();
  try {
    const { email, password } = req.body;
    const user = await usersList.find((ele) => ele.email === email);

    if (email === user.email && password === user.password) {
      const session = await sessions.insertOne({
        token: user._id,
        name: user.name,
      });
      return res.status(200).json({ token: user._id });
    }
    return res.sendStatus(400);
  } catch (error) {
    console.log(error);
  }
});
