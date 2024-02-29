const conn = require("../utils/dbconn");

exports.userdash = (req, res) => {
  const user_id = ({ id } = req.params.id);

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

exports.admindash = (req, res) => {
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

exports.postSignUp = (req, res) => {
  const { email } = req.body;
  console.log(email);
  //const vals = [email, password];

  //check if email in db
  const emailcheckSQL = `SELECT reg_user.email FROM reg_user WHERE reg_user.email = ?`;

  //SQL for email check
  conn.query(emailcheckSQL, email, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      console.log(`Length = ${rows.length}`);
      if (rows.length > 0) {
        res.status(200);
        res.json({
          status: "success",
          message: `${rows.length} records retrieved so already registered`,
          result: rows,
        });
      } else {
        res.status(401);
        res.json({
          status: "failure",
          message: `Email not present therefore can be registered`,
        });
      }
    }
  });
};

exports.postRegUser = (req, res) => {
  //user will generate email and password
  //hashed in webapp and hash passed into API server
  const { email, hash } = req.body;
  console.log(email);
  console.log(hash);
  //https://stackoverflow.com/questions/18371339/how-to-retrieve-name-from-email-address
  const first_name = email.substring(0, email.lastIndexOf("@")); //really its the entire prefix
  const last_name = email.substring(email.lastIndexOf("@") + 1); //domain is more accurate
  console.log(first_name);
  console.log(last_name);
  const vals = [first_name, last_name, email, hash];

  //set region_id to 1 = UK
  //set user_id to 1 = user
  //SQL to insert new user into db
  const newuserSQL = `INSERT INTO reg_user 
   (user_id, first_name, last_name, email, password, user_type_id, region_id)
   VALUES (NULL, ?, ?, ?, ?, 1, 1)`;

  //need to adjust a user insertion not a check!
  conn.query(newuserSQL, vals, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: `something went wrong with the insert`,
      });
      return conn.rollback(() => {
        console.log("User insert error");
        throw err;
      });
    } else {
      res.status(201);
      res.json({
        status: "success",
        message: `Reg User ID ${rows.insertId} added`,
      });
    }
  });
};

//route for postUserCheck
exports.postUserCheck = (req, res) => {
  //receive email
  const { email } = req.body;
  const vals = [email];

  const getPasswordSQL = `SELECT password FROM reg_user
                          WHERE reg_user.email = ?`;

  conn.query(getPasswordSQL, vals, (err, result) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      console.log(`Length = ${result.length}`); //should be 1
      if (result.length > 0) {
        res.status(200);
        res.json({
          status: "success",
          message: `${result.length} records retrieved`,
          result: result, //return hashed password stored in db
        });
      } else {
        res.status(401);
        res.json({
          status: "failure",
          message: `Invalid user email - no associated password`,
        });
      }
    }
  });
};

//route for postLogin
exports.postLogin = (req, res) => {
  const { email } = req.body;
  console.log("this is the req.body");
  console.log(req.body);
  const vals = [email];
  console.log("this is the email");
  console.log(email);
  console.log("this is the vals");
  console.log(vals);
  const checkuserSQL = `SELECT user_id, first_name, role FROM reg_user 
      INNER JOIN user_type
      ON reg_user.user_type_id = user_type.user_type_id
      WHERE reg_user.email = ?`;

  conn.query(checkuserSQL, vals, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      console.log(`Length = ${rows.length}`);
      if (rows.length > 0) {
        res.status(200);
        res.json({
          status: "success",
          message: `${rows.length} records retrieved`,
          result: rows,
        });
      } else {
        res.status(401);
        res.json({
          status: "failure",
          message: `Invalid user credentials`,
        });
      }
    }
  });
};

exports.datavis = (req, res) => {
  const user_id = ({ id } = req.params.id);

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
        message: `${rows.length} records retrieved from datavis api path`,
        result: rows,
      });
    }
  });
};
