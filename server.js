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

app.listen(3001, () => {
  console.log("its running on port 3001")
})

/*
  1) First entry ever doesnt show up 
    - Seems like refresh isnt running for that 1st entry 
    - maybe try learning more about promises 
  2) Fix deletions 
    - Only works for first 2 or 3 
    - Have to double click sometimes
    - try catching the error

    - I think it is working but it stops updating 
  3) Add goals 
    - Make a goals table 
      - email, distance, speed, calories 
      - grab at the beginning 
        - look into doing multiple fetches at once 
  4) Clean up the code and put in some notes 



  change onclick for daily to go back to main page and refresh runs which will cause the useEffect daily to get triggered
*/
