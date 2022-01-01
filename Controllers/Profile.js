const handleProfile = (req, res, db) => {
  const { email, sport } = req.query
  db.select("*")
    .from(sport)
    .where({ email })
    .then((data) => {
      if (data.length) {
        res.json(data)
      } else {
        res.json([])
      }
    })
    .catch((err) => res.status(400).json("error getting user"))
}

module.exports = {
  handleProfile: handleProfile,
}
