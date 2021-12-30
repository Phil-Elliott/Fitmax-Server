const handleDelete = (req, res, db) => {
  const { sport, id } = req.query
  db(sport)
    .where({ id })
    .del()
    .then((res) => {
      res.json(id)
    })
    .catch((err) => res.status(404).json("error deleting run"))
}

module.exports = {
  handleDelete: handleDelete,
}
