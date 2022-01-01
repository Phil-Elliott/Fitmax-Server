const handleGoalsData = (req, res, db) => {
  const { email, sport } = req.query
  db.select("*")
    .from("goals")
    .where({ email, sport })
    .then((data) => {
      if (data.length) {
        res.json(data)
      } else {
        res.json([])
      }
    })
    .catch((err) => res.status(400).json("error getting goals"))
}

module.exports = {
  handleGoalsData: handleGoalsData,
}
