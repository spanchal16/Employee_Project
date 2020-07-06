module.exports = {
  // To display all parts
  list: function (req, res) {
    Parts.find({})
      .then(function (parts) {
        return res.view("pages/homepage", { parts: parts });
      })
      .catch(function (err) {
        return res.redirect("/notfound");
      });
  },

  //To create new part
  create: function (req, res) {
    Parts.create({
      id: req.body.txtpartid,
      partName: req.body.txtpartname,
      qoh: req.body.txtqoh,
    })
      .then(function () {
        return res.redirect("/");
      })
      .catch(function (err) {
        return res.redirect("/notfound");
      });
  },

  //To fetch existing part
  editpart: function (req, res) {
    Parts.findOne({
      id: req.params.partId,
    })
      .then(function (parts) {
        return res.view("pages/editpart", { parts: parts });
      })
      .catch(function (err) {
        return res.redirect("/notfound");
      });
  },

  //To update part
  update: function (req, res) {
    Parts.update(
      {
        id: req.body.txtpartid,
      },
      {
        partName: req.body.txtpartname,
        qoh: req.body.txtqoh,
      }
    )
      .then(function () {
        res.redirect("/");
      })
      .catch(function (err) {
        return res.redirect("/notfound");
      });
  },

  //To search part
  search: function (req, res) {
    Parts.findOne({
      id: req.body.txtpartid,
    })
      .then(function (parts) {
        if (!parts) {
          return res.view("pages/searchpart", { parts: null });
        } else {
          return res.view("pages/searchpart", { parts: parts });
        }
      })
      .catch(function (err) {
        return res.redirect("/notfound");
      });
  },
};
