const express = require('express');
const router = express.Router();
const db = require('./database');

/* GET home page. */
router.get('/', function(req, res, next) {

  return db.getConnection((err, conn) => {
    if(err) {
      console.log(err);
      return res.render('error');
    }

    let sql = `SELECT * FROM notice ORDER BY idx`;

    conn.query(sql, (error, result, fields) => {
      conn.release();
      if(error) {
        console.log(error);
        return res.render('index', { data: [] });
      }

      return res.render('index', { data: result });
    });
  });
});

router.get('/data', function(req, res, next) {
  let query = req.query;

  let lat = query.lat;
  let lng = query.lng;
  let search = query.search;
  let type = query.type;

  return db.getConnection((err, conn) => {
    if(err) {
      console.log(err);
      return res.render('error');
    }

    if(!err) {
      let sql = '';
      if(search) {
        sql = `SELECT * FROM Place WHERE MATCH(name) AGAINST('${search}*' IN BOOLEAN MODE)`;

        conn.query(sql, (error, result, fields) => {
          conn.release();
          if(error) {
            console.log(error);
            return res.render('error');
          }

          return res.send(result);
        });
      } else {
        sql = `CALL PROC_GET_STORES_BY_LOCATION(?,?,?)`;

        conn.query(sql, [lat, lng, type], (error, result, fields) => {
          conn.release();
          if(error) {
            console.log(error);
            return res.render('error');
          }

          return res.send(result[0]);
        });
      }

    }
  });
});

module.exports = router;
