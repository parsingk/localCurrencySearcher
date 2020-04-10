const express = require('express');
const router = express.Router();
const db = require('./database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { data: 'Express' });
});

router.get('/data', function(req, res, next) {
  let query = req.query;

  let lat = query.lat;
  let lng = query.lng;
  let search = query.search;
  let type = query.type;
  let range = 1000;

  db.getConnection((err, conn) => {
    if(!err) {
      let sql = '';
      if(search) {
        sql = `SELECT * FROM Place WHERE name LIKE '%${search}%'`;
      } else if(type) {
        sql = `SELECT * FROM Place WHERE ST_DISTANCE_SPHERE(POINT(${lng}, ${lat}), geo_location) < ${range} AND type = ${type}`;
      } else {
        sql = `SELECT * FROM Place WHERE ST_DISTANCE_SPHERE(POINT(${lng}, ${lat}), geo_location) < ${range}`;
      }

      conn.query(sql, (error, result, fields) => {
        if(error) {
          console.log(error);
          return res.render('error');
        }

        return res.send(result);
      });
    }
    conn.release();
  });
});

module.exports = router;
