module.exports = {
  list: function (req, res) {
    PartOrdersY.find({}).exec(function (err, partOrders) {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      res.view("pages/orderedparts", { partOrders: partOrders });
    });
  },
};
