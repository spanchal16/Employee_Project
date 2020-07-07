module.exports = {
  //To display all orders
  list: function (req, res) {
    PartOrdersY.find({})
      .then(function (partOrders) {
        return res.view("pages/orderedparts", { partOrders: partOrders });
      })
      .catch(function (err) {
        return res.view("error", { err: err });
      });
  },

  //Add new parts ordered using (API)
  addList: function (req, res) {
    const url = require("url");
    const custom_url = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );
    console.log(custom_url);
    const search_param = custom_url.searchParams;
    if (JSON.stringify(req.query) === "{}") {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else if (
      search_param.has("jobname") === false ||
      search_param.has("partid") === false ||
      search_param.has("userid") === false ||
      search_param.has("qty") === false
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else if (
      req.query.jobname === "" ||
      req.query.partid === "" ||
      req.query.userid === "" ||
      req.query.qty === ""
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else {
      PartOrdersY.create({
        id: req.query.jobname,
        partId: req.query.partid,
        userId: req.query.userid,
        qty: req.query.qty,
      })
        .then(function () {
          return res.ok();
        })
        .catch(function (err) {
          return res.send(500, { error: `Something Went Wrong!\n${err}` });
        });
    }
  },
};
