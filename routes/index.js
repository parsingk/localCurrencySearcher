const express = require('express');
const router = express.Router();
const db = require('./database');

/* GET home page. */
router.get('/', function(req, res, next) {

  return db.getConnection((err, conn) => {
    if(err) {
      console.error(err);
      return res.render('error', {"error" : {"code" : 500, "message" : "서버 점검중입니다.", "enquiry" : "문의 : whdvlf2006@gmail.com"}});
    }

    let sql = `SELECT * FROM notice ORDER BY idx`;

    conn.query(sql, (error, result, fields) => {
      conn.release();
      if(error) {
        console.error(error);
        return res.render('index', { data: [] });
      }

      return res.render('index', { data: result });
    });
  });
});

router.get('/data', (req, res, next) => {
  let query = req.query;

  let lat = query.lat;
  let lng = query.lng;
  let search = query.search;
  let type = query.type;

  return db.getConnection((err, conn) => {
    if(err) {
      console.error(err);
      return res.status(500).send({error : "Unexpected Server Error."});
    }

    if(!err) {
      let sql = '';
      if(search) {
        sql = `SELECT * FROM Place WHERE MATCH(name) AGAINST('${search}*' IN BOOLEAN MODE)`;

        conn.query(sql, (error, result, fields) => {
          conn.release();
          if(error) {
            console.error(error);
            return res.status(500).send({error : "잘못된 검색어 입니다."});
          }

          return res.send(result);
        });
      } else {
        sql = `CALL PROC_GET_STORES_BY_LOCATION(?,?,?)`;

        conn.query(sql, [lat, lng, type], (error, result, fields) => {
          conn.release();
          if(error) {
            console.error(error);
            return res.status(500).send({error : "Unexpected Server Error : -01924281"});
          }

          return res.send(result[0]);
        });
      }
    }
  });
});

module.exports = router;
