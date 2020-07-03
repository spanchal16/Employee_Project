module.exports.datastores = {
  default: {
    adapter: require('sails-mysql'),
    url: 'mysql://root:password@localhost:3306/cloud',
  }
};
