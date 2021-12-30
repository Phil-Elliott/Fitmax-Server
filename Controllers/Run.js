const handleRun = (req, res, db) => {
  const { sport, email, distancenumber, lengthnumber, id, date } = req.body
  db(sport)
    .insert({
      email: email,
      id: id,
      distancenumber: distancenumber,
      lengthnumber: lengthnumber,
      date: date,
    })
    .then(res.json("added"))
    .catch((err) => res.status(400).json("unable to add data"))
}

module.exports = {
  handleRun: handleRun,
}
