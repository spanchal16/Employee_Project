module.exports = {
  attributes: {
    id: { type: "number", columnName: "partId", required: true },
    partName: { type: "string", required: true },
    qty: { type: "number", required: true },
  },
};
