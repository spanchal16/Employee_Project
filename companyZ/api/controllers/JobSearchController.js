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
        jobs.data.forEach(function (job) {
          console.log(job);
        }),
          console.log(jobs.data);
        return res.view("pages/homepage", { jobs: jobs });
      });

  },

  search: function (req, res) {
    let jName = req.body.txtjobname;
    axios.get(
      "https://a6-companyx.azurewebsites.net/api/getOneJobp/" + jName
    )
      .then(function (jobs) {
        jobs.data.forEach(function (job) {
          console.log(job);
        }),
          console.log(jobs.data);
        return res.view("pages/searchjob", { jobs: jobs });
      });

  },

   view: async function (req, res) {
    let jName = req.params.jobName;
    let date_time = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    // current year
    let year = date_time.getFullYear();

    // current hours
    let hours = date_time.getHours();

    // current minutes
    let minutes = date_time.getMinutes();

    // current seconds
    let seconds = date_time.getSeconds();

    let dateCurrent = year + "-" + month + "-" + date

    // prints date in YYYY-MM-DD format
    console.log(dateCurrent);
    let timeCurrent = hours + ":" + minutes + ":" + seconds
    
    console.log(timeCurrent);
    let vals = "values('"+jName+"',"+"'"+dateCurrent+"',"+"'"+timeCurrent+"')";
    let sqlInsert = "insert into search "+ vals;
    //const sqlInsert = "INSERT INTO search VALUES ('" + jName + "', " + dateCurrent + ", " + timeCurrent + ")";
    try {
      await sails.sendNativeQuery(sqlInsert);
    }
    catch (err) {
      console.log(err);
    }
    axios.get(
      "https://a6-companyx.azurewebsites.net/api/getOneJobp/" + jName
    )
      .then(function (jobs) {
        jobs.data.forEach(function (job) {
          console.log(job);
        }),
          console.log(jobs.data);
        return res.view("pages/viewJob", { jobs: jobs });
      });

  },


};