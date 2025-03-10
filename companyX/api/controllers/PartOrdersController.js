function showError(code, message, res) {
    let error = {
        code: code,
        message: message
    }
    res.view("pages/error", { error: error });
}

// function showErrorJobPart(jobName, partId, res) {
//     let code = "400";
//     let message = "jobName: " + jobName + " or partId: " + partId + " does not exist.";
//     showError(code, message, res);
// }

module.exports = {
    // GET ALL
    viewData: function (req, res) {
        const sqlSelectAll = `SELECT * FROM partOrdersX`
        sails.sendNativeQuery(sqlSelectAll, function (err, rawResult) {
            let orders = [];
            for (let [key, value] of Object.entries(rawResult.rows)) {
                let order = {};
                for (let [k, v] of Object.entries(value)) {
                    order[k] = v;
                }
                orders.push(order);
            }
            if (!orders) {
                res.send("Cannot find anything to show!")
            }
            if (orders) {
                res.view("pages/partOrders/viewData", { orders: orders })
            }
        });
    },
    // GET ONE BY ID
    viewDataByID: async function (req, res) {
        const jobName = req.param('jobName');
        const partId = parseInt(req.param('partId'));
        const userId = parseInt(req.param('userId'));
        const sqlSelectOne = `SELECT * FROM partOrdersX WHERE jobName = $1 AND partId = $2 AND userId = $3`;

        await sails.sendNativeQuery(sqlSelectOne, [jobName, partId, userId], function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length == 0) {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partId: " + partId + " with " + "userId: " + userId + " do not exist, can't retrieve data.";
                showError(code, message, res);
            } else {
                var order = {};
                for (let [key, value] of Object.entries(rawResult.rows)) {
                    for (let [k, v] of Object.entries(value)) {
                        order[k] = v;
                    }
                }
                res.view("pages/partOrders/viewDataByID", { order: order });
            }
        });
    },

    // ADD DATA
    savePartOrders: async function (req, res) {
        console.log(req.body);
        const partId = parseInt(req.body.partId);
        const jobName = req.body.jobName;
        const userId = parseInt(req.body.userId);
        const qty = parseInt(req.body.qty);

        const sqlSelectOne = `SELECT * FROM partOrdersX WHERE jobName = $1 AND partId = $2 AND userId = $3`;
        await sails.sendNativeQuery(sqlSelectOne, [jobName, partId, userId], async function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length != 0) {
                sails.log("jobName: " + jobName + " with " + "partId: " + partId + "userId: " + userId + " already exist, can't add data");
                return res.json({status: 'unsuccess'});
            } else {
                const sqlInsert = `INSERT INTO partOrdersX VALUES ($1, $2, $3, $4)`;
                try {
                    await sails.sendNativeQuery(sqlInsert, [jobName, partId, userId, qty]);
                    sails.log("row added to partOrdersX");
                    return res.json({status: 'success'});

                } catch (err) {
                    sails.log("not able to add row to partOrdersX");
                    return res.json({status: 'unsuccess'});
                    //showErrorPart(partId, res);
                    //throw err;
                }
            }
        });
    }

    // ADD DATA
    // addData: async function (req, res) {
    //     const jobName = req.body.jobName;
    //     const partId = parseInt(req.body.partId);
    //     const userId = parseInt(req.body.userId);
    //     const qty = parseInt(req.body.qty);

    //     const sqlSelectOne = `SELECT * FROM partOrdersX WHERE jobName = $1 AND partId = $2 AND userId = $3`;
    //     await sails.sendNativeQuery(sqlSelectOne, [jobName, partId, userId], async function (err, rawResult) {
    //         var length = rawResult.rows.length;
    //         if (length != 0) {
    //             let code = "400";
    //             let message = "jobName: " + jobName + " with " + "partId: " + partId + " with userId: " + userId + " already exist, can't add data";
    //             showError(code, message, res);
    //         } else {
    //             const sqlInsert = `INSERT INTO partOrdersX VALUES ($1, $2, $3, $4)`;
    //             try {
    //                 await sails.sendNativeQuery(sqlInsert, [jobName, partId, userId, qty]);
    //                 res.redirect("/partOrders/viewData");
    //             } catch (err) {
    //                 showErrorJobPart(jobName, partId, res);
    //                 throw err;
    //             }
    //         }
    //     });
    // },
    // UPDATE DATA
    // updateData: function (req, res) {
    //     const jobName = req.body.jobName;
    //     const partId = parseInt(req.body.partId);
    //     const userId = parseInt(req.body.userId);
    //     const qty = parseInt(req.body.qty);

    //     const sqlSelectOne = `SELECT * FROM partOrdersX WHERE jobName = $1 AND partId = $2 AND userId = $3`;
    //     sails.sendNativeQuery(sqlSelectOne, [jobName, partId, userId], async function (err, rawResult) {
    //         var length = rawResult.rows.length;
    //         if (length != 0) {
    //             const sqlUpdate = `UPDATE partOrdersX SET qty = $1 WHERE jobName = $2 AND partId = $3 AND userId = $4`;
    //             await sails.sendNativeQuery(sqlUpdate, [qty, jobName, partId, userId]);
    //             res.redirect("/partOrders/viewData");

    //         } else {
    //             let code = "400";
    //             let message = "jobName: " + jobName + " with partId: " + partId + " with userId: " + userId + " do not exist, can't update data";
    //             showError(code, message, res);
    //         }
    //     });
    // },
    // DELETE DATA
    // deleteData: function (req, res) {
    //     const jobName = req.body.jobName;
    //     const partId = parseInt(req.body.partId);
    //     const userId = parseInt(req.body.userId);

    //     const sqlSelectOne = `SELECT * FROM partOrdersX WHERE jobName = $1 AND partId = $2 AND userId = $3`;
    //     sails.sendNativeQuery(sqlSelectOne, [jobName, partId, userId], async function (err, rawResult) {
    //         var length = rawResult.rows.length;
    //         if (length != 0) {
    //             const sqlDelete = `DELETE FROM partOrdersX WHERE jobName = $1 AND partId = $2 AND userId = $3`;
    //             await sails.sendNativeQuery(sqlDelete, [jobName, partId, userId]);
    //             res.redirect("/partOrders/viewData");
    //         } else {
    //             let code = "400";
    //             let message = "jobName: " + jobName + " with " + "partId: " + partId + " with userId: " + userId + " do not exist, can't delete data";
    //             showError(code, message, res);
    //         }
    //     });
    // }
}