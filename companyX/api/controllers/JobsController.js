function showError(code, message, res) {
    let error = {
        code: code,
        message: message
    }
    res.view("pages/error", { error: error });
}

function showErrorPart(partId, res){
    let code = "400";
    let message = "partId: " + partId + " does not exist.";
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
                res.view("pages/jobs/viewData", { jobs: jobs })
            }
        });
    },
    // GET ONE BY ID
    viewDataByID: async function (req, res) {
        const jobName = req.param('jobName');
        const partId = parseInt(req.param('partId'));
        const sqlSelectOne = "SELECT * FROM jobs WHERE jobName = '" + jobName + "' AND partId = " + partId;

        await sails.sendNativeQuery(sqlSelectOne, function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length == 0) {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partId: " + partId + " do not exist, can't retrieve data.";
                showError(code, message, res);
            } else {
                var job = {};
                for (let [key, value] of Object.entries(rawResult.rows)) {
                    for (let [k, v] of Object.entries(value)) {
                        job[k] = v;
                    }
                }
                res.view("pages/jobs/viewDataByID", { job: job });
            }
        });
    },
    // ADD DATA
    addData: async function (req, res) {
        const jobName = req.body.jobName;
        const partId = parseInt(req.body.partId);
        const qty = parseInt(req.body.qty);

        const sqlSelectOne = "SELECT * FROM jobs WHERE jobName = '" + jobName + "' AND partId = " + partId;
        await sails.sendNativeQuery(sqlSelectOne, async function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length != 0) {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partId: " + partId + " already exist, can't add data";
                showError(code, message, res);
            } else {
                const sqlInsert = "INSERT INTO jobs VALUES ('" + jobName + "', " + partId + ", " + qty + ")";
                try {
                    await sails.sendNativeQuery(sqlInsert);
                    res.redirect("/jobs/viewData");
                } catch (err) {
                    showErrorPart(partId, res);
                    //throw err;
                }
            }
        });
    },
    // UPDATE DATA
    updateData: function (req, res) {
        const jobName = req.body.jobName;
        const partId = parseInt(req.body.partId);
        const qty = parseInt(req.body.qty);

        const sqlSelectOne = "SELECT * FROM jobs WHERE jobName = '" + jobName + "' AND partId = " + partId;
        sails.sendNativeQuery(sqlSelectOne, async function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length != 0) {
                const sqlUpdate = "UPDATE jobs SET qty = " + qty + " WHERE jobName = '" + jobName + "' AND partId = " + partId;
                await sails.sendNativeQuery(sqlUpdate);
                res.redirect("/jobs/viewData");

            } else {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partId: " + partId + " do not exist, can't update data";
                showError(code, message, res);
            }
        });
    },
    // DELETE DATA
    deleteData: function (req, res) {
        const jobName = req.body.jobName;
        const partId = parseInt(req.body.partId);

        const sqlSelectOne = "SELECT * FROM jobs WHERE jobName = '" + jobName + "' AND partId = " + partId;
        sails.sendNativeQuery(sqlSelectOne, async function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length != 0) {
                const sqlDelete = "DELETE FROM jobs WHERE jobName = '" + jobName + "' AND partId = " + partId;
                await sails.sendNativeQuery(sqlDelete);
                res.redirect("/jobs/viewData");
            } else {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partId: " + partId + " do not exist, can't delete data";
                showError(code, message, res);
            }
        });
    },

    getAllJobs: async function(req, res){
		
		const sql = `SELECT * FROM jobs`;
		
		try {
			var data = await sails.sendNativeQuery(sql);
		} catch (err) {
			switch (err.name) {
				case 'UsageError': return res.badRequest(err);
				//default: throw err;
			}	
		}
		
		//sails.log("Job data: ", data);
		sails.log(data.rows);
		return res.json(data.rows);
	},

	getDiffJobs: async function(req, res){
		
		const sql = `SELECT distinct jobName from jobs order by jobName`;
		
		try {
			var data = await sails.sendNativeQuery(sql);
		} catch (err) {
			switch (err.name) {
				case 'UsageError': return res.badRequest(err);
				//default: throw err;
			}	
		}
		
		sails.log(data.rows);
		return res.json(data.rows);
	},

	getOneJobp: async function(req, res){
		//const where =`jobName = $1 and partId = ?`;
		const where =`jobName = $1`;
		const sql = `SELECT * FROM jobs WHERE ` + where;
		let values= [req.params.jobName];

		try {
			var data = await sails.sendNativeQuery(sql, values);
		} catch (err) {
			switch (err.name) {
				case 'UsageError': return res.badRequest(err);
				//default: throw err;
			}	
		}
		
		sails.log(data.rows);
		return res.json(data.rows);
	},
	
	getOneJob: async function(req, res){
		console.log(req.body);
		//const where =`jobName = $1 and partId = ?`;
		const where =`jobName = $1`;
		const sql = `SELECT * FROM jobs WHERE ` + where;
		let values= [req.body.jobName];

		try {
			var data = await sails.sendNativeQuery(sql, values);
		} catch (err) {
			switch (err.name) {
				case 'UsageError': return res.badRequest(err);
				//default: throw err;
			}	
		}
		
		sails.log(data.rows);
		return res.json(data.rows);
	},
}