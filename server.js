const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require("knex")

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

app.delete("/delete/", (req, res) => {
  const { id } = req.query
  db("runs")
    .where({ id })
    .del()
    .then((res) => {
      res.json(id)
    })
    .catch((err) => res.status(404).json("error deleting run"))
})

app.get("/profile/", (req, res) => {
  const { email } = req.query
  db.select("*")
    .from("runs")
    .where({ email })
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
  const { email, distancenumber, lengthnumber, id, date } = req.body
  db("runs")
    .insert({
      email: email,
      id: id,
      distancenumber: distancenumber,
      lengthnumber: lengthnumber,
      date: date,
    })
    .catch((err) => res.status(400).json("unable to add data"))
})

app.post("/goals", (req, res) => {
  const { email, distance, calories, time } = req.body
  db.select("*")
    .from("goals")
    .where({ email })
    .then((data) => {
      if (data.length) {
        db("goals")
          .where({ email })
          .update({
            distance: distance,
            calories: calories,
            speed: time,
          })
          .then(res.json("updated"))
          .catch((err) => res.status(400).json("unable to update data"))
      } else {
        db("goals")
          .insert({
            email: email,
            distance: distance,
            calories: calories,
            speed: time,
          })
          .then(res.json("added"))
          .catch((err) => res.status(400).json("unable to add data"))
      }
    })
})

app.get("/goals/", (req, res) => {
  const { email } = req.query
  db.select("*")
    .from("goals")
    .where({ email })
    .then((data) => {
      if (data.length) {
        res.json(data)
      } else {
        res.status(400).json("goals not found")
      }
    })
    .catch((err) => res.status(400).json("error getting goals"))
})

app.listen(3001, () => {
  console.log("its running on port 3001")
})

/*
  3) Add goals 
    - Make a goals table 
      - email, distance, speed, calories 
      - same as adding a run but you are going to alter the table 
        - look into doing multiple fetches at once (promise all)

        can use an if statement in case they have one 
        if they have an entry then alter, if not then create new
  4) Clean up the code and put in some notes 
*/
