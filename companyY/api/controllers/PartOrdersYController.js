module.exports = {
  //To display all orders
  list: function (req, res) {
    PartOrdersY.find({})
      .then(function (partOrders) {
        return res.view("pages/orderedparts", { partOrders: partOrders });
      })
      .catch(function (err) {
        return res.redirect("/notfound");
      });
  },
};
