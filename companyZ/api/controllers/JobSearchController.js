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
            "https://a6-companyx.azurewebsites.net/api/getDiffJobs"
          )
          .then(function (jobs) {
            jobs.data.forEach(function(job){
              console.log(job);
            }),
            console.log(jobs.data);
            return res.view("pages/homepage", { jobs: jobs });
          });
  
      },

      search: function (req, res) {
        let jName = req.body.txtjobname;
        axios.get(
            "https://a6-companyx.azurewebsites.net/api/getOneJobp/"+jName
          )
          .then(function (jobs) {
            jobs.data.forEach(function(job){
              console.log(job);
            }),
            console.log(jobs.data);
            return res.view("pages/searchjob", { jobs: jobs });
          });
  
      },
};