const PartsController = require("../api/controllers/PartsController");
const PartOrdersYController = require("../api/controllers/PartOrdersYController");

module.exports.routes = {
  "/": { view: "pages/homepage" },
  "GET /": PartsController.list,
  "/partsorder": { view: "pages/orderedparts" },
  "GET /partsorder": PartOrdersYController.list,
};
