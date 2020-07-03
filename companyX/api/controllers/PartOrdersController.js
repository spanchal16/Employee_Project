function showError(code, message, res) {
    let error = {
        code: code,
        message: message
    }
    res.view("\\pages\\error", { error: error });
}

// function showErrorJobPart(jobName, partID, res) {
//     let code = "400";
//     let message = "jobName: " + jobName + " or partID: " + partID + " does not exist.";
//     showError(code, message, res);
// }

module.exports = {
    // GET ALL
    viewData: function (req, res) {
        const sqlSelectAll = "SELECT * FROM partOrders"
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
                res.view("\\pages\\partOrders\\viewData", { orders: orders })
            }
        });
    },
    // GET ONE BY ID
    viewDataByID: async function (req, res) {
        const jobName = req.param('jobName');
        const partID = parseInt(req.param('partID'));
        const userID = parseInt(req.param('userID'));
        const sqlSelectOne = "SELECT * FROM partOrders WHERE jobName = '" + jobName + "' AND partID = " + partID + " AND userID = " + userID;

        await sails.sendNativeQuery(sqlSelectOne, function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length == 0) {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partID: " + partID + " with " + "userID: " + userID + " do not exist, can't retrieve data.";
                showError(code, message, res);
            } else {
                var order = {};
                for (let [key, value] of Object.entries(rawResult.rows)) {
                    for (let [k, v] of Object.entries(value)) {
                        order[k] = v;
                    }
                }
                res.view("\\pages\\partOrders\\viewDataByID", { order: order });
            }
        });
    },
    // ADD DATA
    // addData: async function (req, res) {
    //     const jobName = req.body.jobName;
    //     const partID = parseInt(req.body.partID);
    //     const userID = parseInt(req.body.userID);
    //     const qty = parseInt(req.body.qty);

    //     const sqlSelectOne = "SELECT * FROM partOrders WHERE jobName = '" + jobName + "' AND partID = " + partID + " AND userID = " + userID;
    //     await sails.sendNativeQuery(sqlSelectOne, async function (err, rawResult) {
    //         var length = rawResult.rows.length;
    //         if (length != 0) {
    //             let code = "400";
    //             let message = "jobName: " + jobName + " with " + "partID: " + partID + " with userID: " + userID + " already exist, can't add data";
    //             showError(code, message, res);
    //         } else {
    //             const sqlInsert = "INSERT INTO partOrders VALUES ('" + jobName + "', " + partID + ", " + userID + ", " + qty + ")";
    //             try {
    //                 await sails.sendNativeQuery(sqlInsert);
    //                 res.redirect("/partOrders/viewData");
    //             } catch (err) {
    //                 showErrorJobPart(jobName, partID, res);
    //                 throw err;
    //             }
    //         }
    //     });
    // },
    // UPDATE DATA
    // updateData: function (req, res) {
    //     const jobName = req.body.jobName;
    //     const partID = parseInt(req.body.partID);
    //     const userID = parseInt(req.body.userID);
    //     const qty = parseInt(req.body.qty);

    //     const sqlSelectOne = "SELECT * FROM partOrders WHERE jobName = '" + jobName + "' AND partID = " + partID + " AND userID = " + userID;
    //     sails.sendNativeQuery(sqlSelectOne, async function (err, rawResult) {
    //         var length = rawResult.rows.length;
    //         if (length != 0) {
    //             const sqlUpdate = "UPDATE partOrders SET qty = " + qty + " WHERE jobName = '" + jobName + "' AND partID = " + partID + " AND userID = " + userID;;
    //             await sails.sendNativeQuery(sqlUpdate);
    //             res.redirect("/partOrders/viewData");

    //         } else {
    //             let code = "400";
    //             let message = "jobName: " + jobName + " with partID: " + partID + " with userID: " + userID + " do not exist, can't update data";
    //             showError(code, message, res);
    //         }
    //     });
    // },
    // DELETE DATA
    // deleteData: function (req, res) {
    //     const jobName = req.body.jobName;
    //     const partID = parseInt(req.body.partID);
    //     const userID = parseInt(req.body.userID);

    //     const sqlSelectOne = "SELECT * FROM partOrders WHERE jobName = '" + jobName + "' AND partID = " + partID + " AND userID = " + userID;
    //     sails.sendNativeQuery(sqlSelectOne, async function (err, rawResult) {
    //         var length = rawResult.rows.length;
    //         if (length != 0) {
    //             const sqlDelete = "DELETE FROM partOrders WHERE jobName = '" + jobName + "' AND partID = " + partID + " AND userID = " + userID;
    //             await sails.sendNativeQuery(sqlDelete);
    //             res.redirect("/partOrders/viewData");
    //         } else {
    //             let code = "400";
    //             let message = "jobName: " + jobName + " with " + "partID: " + partID + " with userID: " + userID + " do not exist, can't delete data";
    //             showError(code, message, res);
    //         }
    //     });
    // }
}