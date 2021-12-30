const handleGoals = (req, res, db) => {
  const { email, sport, distance, calories, time } = req.body
  db.select("*")
    .from("goals")
    .where({ email, sport })
    .then((data) => {
      if (data.length) {
        db("goals")
          .where({ email, sport })
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
            sport: sport,
            distance: distance,
            calories: calories,
            speed: time,
          })
          .then(res.json("added"))
          .catch((err) => res.status(400).json("unable to add data"))
      }
    })
}

module.exports = {
  handleGoals: handleGoals,
}
