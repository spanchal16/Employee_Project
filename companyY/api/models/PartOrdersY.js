module.exports = {
  attributes: {
    id: { type: "string", columnName: "jobName", required: true },
    partId: { type: "number", required: true },
    userId: { type: "number", required: true },
    qty: { type: "number", required: true },
  },
  tableName: "partOrdersY",
};
