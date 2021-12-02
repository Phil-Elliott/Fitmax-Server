const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

const database = {
  users: [
    {
      id: "123",
      name: "Phil",
      email: "phil@gmail.com",
      password: "apple",
      runs: [],
      joined: new Date(),
    },
    {
      id: "124",
      name: "Amy",
      email: "amy@gmail.com",
      password: "orange",
      runs: [],
      joined: new Date(),
    },
  ],
}

app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send(database.users)
})

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0])
  } else {
    res.status(400).json("error logging in")
  }
})

app.post("/register", (req, res) => {
  const { email, name, password } = req.body
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    runs: [],
    joined: new Date(),
  })
  res.json(database.users[database.users.length - 1])
})

app.put("/run", (req, res) => {
  const { id, runs } = req.body
  let found = false
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true
      user.runs = runs
      return res.json(user.runs)
    }
  })
  if (!found) {
    res.status(400).json("not foundfffff")
  }
})

app.listen(3001, () => {
  console.log("its running on port 3001")
})

/*
  1- Need a way to add runs 
  2- Need a way to delete runs 
*/
