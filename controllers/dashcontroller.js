const conn = require("../utils/dbconn");

//route for getDash
exports.getDash = (req, res) => {
  //const vals = ({ user_id, role } = req.body);
  //console.log(vals);

  selectSQL = `SELECT * FROM  snapshot 
    INNER JOIN snapshot_emotion 
    ON snapshot.snapshot_id = snapshot_emotion.snapshot_id 
    INNER JOIN trigger_context 
    ON snapshot.trigger_id = trigger_context.trigger_id`;

  conn.query(selectSQL, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      res.status(200);
      res.json({
        status: "success",
        message: `${rows.length} records retrieved`,
        result: rows,
      });
    }
  });
};

//route for getEdit
exports.getEdit = (req, res) => {
  const { id } = req.params;

  const selectSQL = `SELECT * FROM  snapshot 
  INNER JOIN snapshot_emotion 
  ON snapshot.snapshot_id = snapshot_emotion.snapshot_id 
  INNER JOIN trigger_context 
  ON snapshot.trigger_id = trigger_context.trigger_id 
  WHERE snapshot.snapshot_id = ${id}`;

  conn.query(selectSQL, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      if (rows.length > 0) {
        res.status(200);
        res.json({
          status: "success",
          message: `Record ID ${id} retrieved`,
          result: rows,
        });
      } else {
        console.log(`Here`);
        res.status(404);

        res.json({
          status: "failure",
          message: `Invalid ID ${id}`,
        });
      }
    }
  });
};

//route for postEdit
exports.postEdit = (req, res) => {
  const snapshot_id = req.params.id;
  const trigger_description = req.body.context;
  const updateVals = [trigger_description, snapshot_id];

  const updateSQL = `UPDATE trigger_context 
    INNER JOIN snapshot ON trigger_context.trigger_id = snapshot.trigger_id
    SET  trigger_context.trigger_description = ?
    WHERE snapshot.snapshot_id = ?`;
  conn.query(updateSQL, updateVals, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      if (rows.affectedRows > 0) {
        res.status(200);
        res.json({
          status: "success",
          message: `Record ID ${snapshot_id} updated`,
        });
      } else {
        res.status(404);
        res.json({
          status: "failure",
          message: `Invalid ID ${snapshot_id}`,
        });
      }
    }
  });
};

//route for postDelete
exports.postDelete = (req, res) => {
  const snapshot_id = req.params.id;
  const deleteSQL1 = `DELETE FROM snapshot_emotion WHERE snapshot_id = ?`;
  const deleteSQL2 = `DELETE FROM snapshot WHERE snapshot_id = ?`;

  conn.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    //first delete
    conn.query(deleteSQL1, snapshot_id, (err, results1) => {
      if (err) {
        return conn.rollback(() => {
          console.log("Delete from snapshot table error: " + err);
          throw err;
        });
      }
      //second deletion
      conn.query(deleteSQL2, snapshot_id, function (err, results2) {
        if (err) {
          return conn.rollback(() => {
            console.log("Delete from snapshot_emotion table error: " + err);
            throw err;
          });
        }
        conn.commit((err) => {
          if (err) {
            res.status(500);
            res.json({
              status: "failure",
              message: err,
            });
          } else {
            if (results1.affectedRows > 0 && results2.affectedRows > 0) {
              res.status(200);
              res.json({
                status: "success",
                message: `Record ID ${snapshot_id} deleted`,
              });
            } else {
              res.status(404);
              res.json({
                status: "failure",
                message: `Invalid ID ${snapshot_id}`,
              });
            }
          }
        });
      });
    });
  });
};

//route for postAddsnap
exports.postAddsnap = (req, res) => {
  const data = req.body;
  const {
    happiness,
    sadness,
    anger,
    disgust,
    contempt,
    surprise,
    fear,
    context,
  } = req.body;

  //const user_id = req.session.user_id;
  const user_id = 2;
  const icon_id = 2;
  const image_url = "img_via_api.url";
  const trigger_vals = [context, icon_id];
  const date_added = new Date().toISOString().slice(0, 19).replace("T", " ");
  const snapshot_vals = [image_url, date_added, user_id];
  const vals = [
    1,
    parseInt(happiness),
    2,
    parseInt(sadness),
    3,
    parseInt(disgust),
    4,
    parseInt(contempt),
    5,
    parseInt(anger),
    6,
    parseInt(fear),
    7,
    parseInt(surprise),
  ];

  conn.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    //trigger_context insert
    var triggerSQLinsert = `INSERT INTO trigger_context (trigger_description, icon_id) 
        VALUES (?,?);`;
    conn.query(triggerSQLinsert, trigger_vals, (err, results) => {
      if (err) {
        return conn.rollback(() => {
          console.log("Trigger insert error");
          throw err;
        });
      } else {
        console.log(`Trigger_context ${results.insertId} added`);
      }

      //get auto incremented value from above insert
      var rowID = results.insertId;
      //snapshot insert
      var snapshotSQLinsert = `INSERT INTO snapshot (image_url, datetime, user_id, trigger_id) 
        VALUES (?,?,?,${rowID});`;
      conn.query(snapshotSQLinsert, snapshot_vals, (err, results) => {
        if (err) {
          return conn.rollback(() => {
            console.log("Snapshot insert error");
            throw err;
          });
        } else {
          console.log(`Snapshot ${results.insertId} added`);
        }
        //get auto incremented value from above insert
        var rowID2 = results.insertId;
        //snapshot_emotion inserts
        var snapshot_emotionSQLinsert = `INSERT INTO snapshot_emotion (snapshot_id, emotion_id, score) 
          VALUES (${rowID2},?,?), (${rowID2},?,?), (${rowID2},?,?), (${rowID2},?,?), 
          (${rowID2},?,?), (${rowID2},?,?), (${rowID2},?,?)`;

        conn.query(snapshot_emotionSQLinsert, vals, (err, results) => {
          if (err) {
            return conn.rollback(() => {
              console.log("Snap_Emotion insert error");
              throw err;
            });
          } else {
            //if successful commit
            conn.commit((err) => {
              if (err) {
                res.status(500);
                res.json({
                  status: "failure",
                  message: `Snapshot not inserted correctly`,
                });
              } else {
                res.status(201);
                res.json({
                  status: "success",
                  message: `Record ID ${results.insertId} added`,
                });
              }
            });
          }
        });
      });
    });
  });
};
