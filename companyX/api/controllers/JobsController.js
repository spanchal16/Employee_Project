function showError(code, message, res) {
    let error = {
        code: code,
        message: message
    }
    res.view("\\pages\\error", { error: error });
}

function showErrorPart(partID, res){
    let code = "400";
    let message = "partID: " + partID + " does not exist.";
    showError(code, message, res);
}

module.exports = {
    // GET ALL
    viewData: function (req, res) {
        const sqlSelectAll = "SELECT * FROM jobs"
        sails.sendNativeQuery(sqlSelectAll, function (err, rawResult) {
            let jobs = [];
            for (let [key, value] of Object.entries(rawResult.rows)) {
                let job = {};
                for (let [k, v] of Object.entries(value)) {
                    job[k] = v;
                }
                jobs.push(job);
            }
            if (!jobs) {
                res.send("Cannot find anything to show!")
            }
            if (jobs) {
                res.view("\\pages\\jobs\\viewData", { jobs: jobs })
            }
        });
    },
    // GET ONE BY ID
    viewDataByID: async function (req, res) {
        const jobName = req.param('jobName');
        const partID = parseInt(req.param('partID'));
        const sqlSelectOne = "SELECT * FROM jobs WHERE jobName = '" + jobName + "' AND partID = " + partID;

        await sails.sendNativeQuery(sqlSelectOne, function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length == 0) {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partID: " + partID + " do not exist, can't retrieve data.";
                showError(code, message, res);
            } else {
                var job = {};
                for (let [key, value] of Object.entries(rawResult.rows)) {
                    for (let [k, v] of Object.entries(value)) {
                        job[k] = v;
                    }
                }
                res.view("\\pages\\jobs\\viewDataByID", { job: job });
            }
        });
    },
    // ADD DATA
    addData: async function (req, res) {
        const jobName = req.body.jobName;
        const partID = parseInt(req.body.partID);
        const qty = parseInt(req.body.qty);

        const sqlSelectOne = "SELECT * FROM jobs WHERE jobName = '" + jobName + "' AND partID = " + partID;
        await sails.sendNativeQuery(sqlSelectOne, async function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length != 0) {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partID: " + partID + " already exist, can't add data";
                showError(code, message, res);
            } else {
                const sqlInsert = "INSERT INTO jobs VALUES ('" + jobName + "', " + partID + ", " + qty + ")";
                try {
                    await sails.sendNativeQuery(sqlInsert);
                    res.redirect("/jobs/viewData");
                } catch (err) {
                    showErrorPart(partID, res);
                    throw err;
                }
            }
        });
    },
    // UPDATE DATA
    updateData: function (req, res) {
        const jobName = req.body.jobName;
        const partID = parseInt(req.body.partID);
        const qty = parseInt(req.body.qty);

        const sqlSelectOne = "SELECT * FROM jobs WHERE jobName = '" + jobName + "' AND partID = " + partID;
        sails.sendNativeQuery(sqlSelectOne, async function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length != 0) {
                const sqlUpdate = "UPDATE jobs SET qty = " + qty + " WHERE jobName = '" + jobName + "' AND partID = " + partID;
                await sails.sendNativeQuery(sqlUpdate);
                res.redirect("/jobs/viewData");

            } else {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partID: " + partID + " do not exist, can't update data";
                showError(code, message, res);
            }
        });
    },
    // DELETE DATA
    deleteData: function (req, res) {
        const jobName = req.body.jobName;
        const partID = parseInt(req.body.partID);

        const sqlSelectOne = "SELECT * FROM jobs WHERE jobName = '" + jobName + "' AND partID = " + partID;
        sails.sendNativeQuery(sqlSelectOne, async function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length != 0) {
                const sqlDelete = "DELETE FROM jobs WHERE jobName = '" + jobName + "' AND partID = " + partID;
                await sails.sendNativeQuery(sqlDelete);
                res.redirect("/jobs/viewData");
            } else {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partID: " + partID + " do not exist, can't delete data";
                showError(code, message, res);
            }
        });
    }
}