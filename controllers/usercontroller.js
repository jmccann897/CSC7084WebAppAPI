const conn = require("../utils/dbconn");


exports.userdash = (req, res) =>{
const user_id = { id } = req.params.id;

const getDashSQL = `SELECT * FROM  snapshot 
INNER JOIN snapshot_emotion 
ON snapshot.snapshot_id = snapshot_emotion.snapshot_id 
INNER JOIN trigger_context 
ON snapshot.trigger_id = trigger_context.trigger_id
WHERE snapshot.user_id = ${user_id}`;

conn.query(getDashSQL, (err, rows) => {
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

exports.admindash = (req, res) =>{
  const getDashSQL = `SELECT * FROM  snapshot 
  INNER JOIN snapshot_emotion 
  ON snapshot.snapshot_id = snapshot_emotion.snapshot_id 
  INNER JOIN trigger_context 
  ON snapshot.trigger_id = trigger_context.trigger_id`;
  
  conn.query(getDashSQL, (err, rows) => {
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

  //route for postLogin
exports.postLogin = (req, res) => {
    const { email, userpass } = req.body;
    const vals = [email, userpass];
    const checkuserSQL = `SELECT user_id, first_name, role FROM reg_user 
      INNER JOIN user_type
      ON reg_user.user_type_id = user_type.user_type_id
      WHERE reg_user.email = ? AND reg_user.password = ?`;
  
    conn.query(checkuserSQL, vals, (err, rows) => {
      if(err) { 
        res.status(500);
        res.json({
          status: 'failure',
          message: err
        });
      } else {
        console.log(`Length = ${rows.length}`);
        if(rows.length > 0){
          res.status(200);
          res.json({
            status: 'success',
            message: `${rows.length} records retrieved`,
            result: rows
          });
        } else {
          res.status(401);
          res.json({
            status: 'failure',
            message: `Invalid user credentials`
          });
        }
      }
    });
  };

  exports.datavis = (req, res) =>{

    const user_id = { id } = req.params.id;

    const getDataSQL = `SELECT datetime, emotion_id, score FROM  snapshot 
    INNER JOIN snapshot_emotion 
    ON snapshot.snapshot_id = snapshot_emotion.snapshot_id 
    INNER JOIN trigger_context 
    ON snapshot.trigger_id = trigger_context.trigger_id
    WHERE user_id = ${user_id}`;
    
    conn.query(getDataSQL, (err, rows) => {
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
  
 