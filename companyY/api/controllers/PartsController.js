module.exports = {
  list: function (req, res) {
    Parts.find({}).exec(function (err, parts) {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      res.view("pages/homepage", { parts: parts });
    });
  },
};
