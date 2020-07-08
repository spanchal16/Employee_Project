/**
 * JobPartsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const axios = require('axios')
let userAuthenticated = false;
module.exports = {

  list: function (req, res) {
    userAuthenticated = false;
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
    userAuthenticated = false;
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
    userAuthenticated = false;

    if (req.params.jobName === undefined) {
      res.redirect('..');
    }

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
    let vals = "values('" + jName + "'," + "'" + dateCurrent + "'," + "'" + timeCurrent + "')";
    let sqlInsert = "insert into search " + vals;
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

  authenticateUI: function (req, res) {
    userAuthenticated = false;
    if (req.params.jobName === undefined) {
      res.redirect('..');
    }
    let jName = req.params.jobName;
    return res.view("pages/authenticateUser", { jName });
  },

  authenticate: function (req, res) {
    let jName = req.params.jobName;
    //Validate here and return the view orderResults with jName and set userAuthenticated = true if credentials are correct
    //When valid
    //return res.redirect("/orderResults?jobName=job1&userId=1");
  },

  checkOrder: async function (req, res) {
    userAuthenticated = true;

    if (userAuthenticated) {
      const url = require("url");
      const custom_url = new URL(
        req.protocol + "://" + req.get("host") + req.originalUrl
      );
      console.log(custom_url);
      const search_param = custom_url.searchParams;
      if (JSON.stringify(req.query) === "{}") {
        res.redirect('..');
      }
      else if (
        search_param.has("jobName") === false ||
        search_param.has("userId") === false
      ) {
        res.redirect('..');
      }
      else if (
        req.query.jobName === "" ||
        req.query.userId === "") {
        res.redirect('..');
      }
      else {
        //DODODODODOOD

        //Check if fulfilled order exists already
        const sqlSelect = "SELECT * FROM jobParts WHERE jobName = '" + req.query.jobName + "' AND userId = '" 
        + req.query.userId +"'"+ " AND result = 'success'";
        
        await sails.sendNativeQuery(sqlSelect, async function (err, results) {
          var length = results["rows"].length;
          if (length != 0) {
            let orderFailed = "Your already ordered this job once"
            res.send(orderFailed);
          } 
        });
        //Get all the parts and quantity required and store it as json array
        axios.get(
          "https://a6-companyx.azurewebsites.net/api/getOneJobp/" + req.query.jobName
        )
          .then(function (jobs) {
            jobs.data.forEach(function (job) {
              
            })
          });

        // Iterate over that JSON array to make individual requests for quantity on hand of that part the moment it is less break
        
        //If order success notify x,y,z and redirect

        //If order failed, notify just z db and redirect to home

      }
    }
    else {
      let jName = req.params.jobName;
      return res.redirect("/authenticateUser/" + jName);
    }
  },
};