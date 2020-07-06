const PartsController = require("../api/controllers/PartsController");
const PartOrdersYController = require("../api/controllers/PartOrdersYController");

module.exports.routes = {
  "/": { view: "pages/homepage" },
  "GET /": PartsController.list,

  "/partsorder": { view: "pages/orderedparts" },
  "GET /partsorder": PartOrdersYController.list,

  "GET /addpart": { view: "pages/addpart" },
  "POST /addpart": PartsController.create,

  "GET /editpart/:partId": PartsController.editpart,
  "POST /editpart": PartsController.update,

  "GET /searchpart": { view: "pages/searchpart" },
  "POST /searchpart": PartsController.search,

  "GET /notfound": { view: "pages/notfound" },
};
