/**
 * JobPartsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const axios = require('axios')
let userAuthenticated = false;

async function checkValues(partReq) {
  let orderSuccess = true;
  for (let partR of partReq) {

    await axios.get(
      "http://companyy-env.eba-2uu3usha.us-east-1.elasticbeanstalk.com/api/part/" + partR.partId
    )
      .then(function (parts) {
        console.log("From Company Y : " + parts.data.qoh);
        console.log("From Company X : " + partR.qty);
        let quantY = parseInt(parts.data.qoh, 10);
        let quantX = parseInt(partR.qty, 10);
        let sub = quantY - quantX;
        console.log("Diff:" + "" + sub)
        if (quantY - quantX < 0) {
          orderSuccess = false;
        }
      });
  }
  return orderSuccess;
}

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
/*
  authenticateUI: function (req, res) {
    userAuthenticated = false;
    if (req.params.jobName === undefined) {
      res.redirect('..');
    }
    let jName = req.params.jobName;
    return res.redirect("pages/authenticateUser/"+jName);
  },
*/
  err: function (req, res) {
  //  let jName = req.params.jobName;
    return res.view("pages/authError");
  },

  authenticate: async function (req, res) {
    let uName = req.body.username;

    //Validate here and return the view orderResults with jName and set userAuthenticated = true if credentials are correct
    //When valid
    //return res.redirect("/orderResults?jobName=job1&userId=1");
    
     // let jName = req.params.jobName;
      //Validate here and return the view orderResults with jName and set userAuthenticated = true if credentials are correct
      console.log("queryiiingggg");
      
      try {
        console.log("queryiiingggg");
        await sails.sendNativeQuery(`Select * from userAuthentication where userId = '${req.body.username}' AND password =  '${req.body.password}'`
        , function(err,result){
          console.log(req.body.username);
          console.log(req.body.password);
          if(err){
            console.log(err);
            res.send({
              code:"404",
              message:"Wrong id and password"
              
              })
          }
  
          else{
            console.log("ssss");
            finalLength = result["rows"].length;
            if(finalLength <= 0 ){
              console.log("Not vslid user");
              return res.send("Not valid");
            }
            else{
              return res.redirect("/orderResults?jobName=jName&userId=req.body.username");
            }
            
          }
        }
        
        
        );
      }
      catch (err) {
        console.log(err);
      }
      
    
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
        let partReq = [];


        //Check if fulfilled order exists already
        const sqlSelect = "SELECT * FROM jobParts WHERE jobName = '" + req.query.jobName + "' AND userId = '"
          + req.query.userId + "'" + " AND result = 'success'";

        await sails.sendNativeQuery(sqlSelect, async function (err, results) {
          var length = results["rows"].length;
          if (length != 0) {
            let msg = "OOPS! Looks like you already have ordered the job once!"
            return res.view("pages/orderResults", { msg });
          }
        });
        //Get all the parts and quantity required and store it as json array
        await axios.get(
          "https://a6-companyx.azurewebsites.net/api/getOneJobp/" + req.query.jobName
        )
          .then(function (jobs) {
            jobs.data.forEach(function (job) {
              partReq.push(job);
            })
          });

        // Iterate over that JSON array to make individual requests for quantity on hand of that part the moment it is less break
        let orderSuccess = await checkValues(partReq);
        console.log("Order Result: " + orderSuccess)

        //Get date and time
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

        let timeCurrent = hours + ":" + minutes + ":" + seconds

        let re = "failure";
        if (orderSuccess) {
          re = "success";
        }

        //Update Z table
        for (let partR of partReq) {
          let vals = "values('" + partR.partId + "'," + "'" + req.query.jobName + "'," + "'" + req.query.userId + "'," +
            "'" + partR.qty + "'," + "'" + dateCurrent + "'," + "'" + timeCurrent + "'," + "'" + re
            + "')";
          let sqlInsert = "insert into jobParts " + vals;
          try {
            await sails.sendNativeQuery(sqlInsert);
          }
          catch (err) {
            console.log(err);
          }
        }

        //If order success notify x,yand redirect

        if (orderSuccess) {
          console.log("Added to db");
          let partMod = [];
          //For Y table updating individual parts
          //Fetching modified parts
          for (let partR of partReq) {

            await axios.get(
              "http://companyy-env.eba-2uu3usha.us-east-1.elasticbeanstalk.com/api/part/" + partR.partId
            )
              .then(function (parts) {
                let quantY = parseInt(parts.data.qoh, 10);
                let quantX = parseInt(partR.qty, 10);
                let sub = quantY - quantX;
                let dt = {
                  partId: partR.partId,
                  qoh: sub
                }
                partMod.push(dt);
              });

          }
          //Updating parts using y end Point
          for (let pm of partMod) {
            await axios.post(
              "http://companyy-env.eba-2uu3usha.us-east-1.elasticbeanstalk.com/api/editpart?partid=" + pm.partId + "&qoh=" + pm.qoh

            )
              .then(function (parts) {
              });
          }

          //Updating partOrders table
          //Company Y
          for (let partR of partReq) {
            await axios.post(
              "http://companyy-env.eba-2uu3usha.us-east-1.elasticbeanstalk.com/api/addorders?jobname="+req.query.jobName+"&partid="+partR.partId
              +"&userid="+req.query.userId+"&qty="+partR.qty
            )
              .then(function (res) {
               // console.log(res);
              })
              .catch(function (error) {
               // console.log(error);
              });
          }

          //Company X
          for (let partR of partReq) {
           await axios({
              method: 'post',
              url: "https://a6-companyx.azurewebsites.net//api/savePartOrders",
              headers: {}, 
              data: {
                partId: partR.partId,
                jobName: req.query.jobName,
                userId: req.query.userId,
                qty: partR.qty
              }
            });
           /* await axios.post(
              "https://a6-companyx.azurewebsites.net//api/savePartOrders"
            //  "http://companyy-env.eba-2uu3usha.us-east-1.elasticbeanstalk.com/api/addorders?jobname="+req.query.jobName+"&partid="+partR.partId
            //  +"&userid="+req.query.userId+"&qty="+partR.qty
            )
              .then(function (res) {
               // console.log(res);
              })
              .catch(function (error) {
               // console.log(error);
              }); */

          }

          let msg = "Congrats! Your Order Has been placed Successfully!"
          return res.view("pages/orderResults", { msg });

        }
        else {
          
          let msg = "OOPS! Looks like we are out of stock! We are working hard to stock our inventory again! Please visit again in some days!"
          return res.view("pages/orderResults", { msg });
        }
      }
    }
    else {
      let jName = req.params.jobName;
      return res.redirect("/authenticateUser/" + jName);
    }
  },
};