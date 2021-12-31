const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require("knex")
const signin = require("./Controllers/Signin")
const register = require("./Controllers/Register")
const deleteE = require("./Controllers/Delete")
const profile = require("./Controllers/Profile")
const run = require("./Controllers/Run")
const goals = require("./Controllers/Goals")
const goalsData = require("./Controllers/GoalsData")

const db = knex({
  client: "postgres",
  connection: {
    host: "postgresql-asymmetrical-91866",
    user: "postgres",
    password: "1434",
    database: "fitmax",
  },
})

const app = express()

app.use(bodyParser.json())
app.use(cors())

// Used to signin
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt)
})

// Used to register
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt)
})

// Used to delete an excercise
app.delete("/delete/", (req, res) => {
  deleteE.handleDelete(req, res, db)
})

// Used to get excercise data
app.get("/profile/", (req, res) => {
  profile.handleProfile(req, res, db)
})

// Used to insert excercise data into database
app.put("/run", (req, res) => {
  run.handleRun(req, res, db)
})

// Used to insert goals data into database
app.post("/goals", (req, res) => {
  goals.handleGoals(req, res, db)
})

// Used to get goals data for the user
app.get("/goalsData/", (req, res) => {
  goalsData.handleGoalsData(req, res, db)
})

app.listen(process.env.PORT || 3000, () => {
  console.log("its running on ${process.env.PORT}")
})
