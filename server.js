const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require("knex")
const { CommandCompleteMessage } = require("pg-protocol/dist/messages")

const db = knex({
  client: "postgres",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "1434",
    database: "fitmax",
  },
})

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0])
          })
          .catch((err) => res.status(400).json("unable to get user"))
      } else {
        res.status(400).json("wrong credentials")
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"))
})

app.post("/register", (req, res) => {
  const { email, name, password } = req.body
  const hash = bcrypt.hashSync(password)
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  }).catch((err) => res.status(400).json("Unable to register"))
})
/*
start with all of the runs from each user (link this to the sheet)
delete runs when you press the x on bottomrightcorner (use if statements in /run)
*/

app.get("/profile/:id", (req, res) => {
  const { id } = req.params
  db.select("*")
    .from("runs")
    .where({ id })
    .then((data) => {
      if (data.length) {
        res.json(data)
      } else {
        res.status(400).json("not found")
      }
    })
    .catch((err) => res.status(400).json("error getting user"))
})

app.put("/run", (req, res) => {
  const { email, distancenumber, lengthnumber, id, joined } = req.body
  db("runs")
    .insert({
      email: email,
      id: id,
      distancenumber: distancenumber,
      lengthnumber: lengthnumber,
      date: joined,
    })
    .catch((err) => res.status(400).json("unable to add data"))
})

app.listen(3001, () => {
  console.log("its running on port 3001")
})
