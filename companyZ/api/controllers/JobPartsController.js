/**
 * JobPartsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const axios = require('axios')
module.exports = {
    list: function (req, res) {
        axios.get(
            "http://companyy-env.eba-2uu3usha.us-east-1.elasticbeanstalk.com/api/part/1"
          )
          .then(function (res) {
            console.log(res.data);
          });
      },

};

