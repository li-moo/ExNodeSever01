const mysql = require('mysql2'); //mysql 모듈 로
// const express = require('express'); //express
// const app = express();

// app.use(express.json());

const db_connection = mysql.createConnection({ //handshake connection
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'wannagym'
});

// db접속
db_connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database'); // 터미널에 뜬다면 성공

    // // 데이터 추출 쿼리 
    // db_connection.query('SELECT * FROM member', (err, results, fields) => {
    //   if (err) {
    //     console.error('Error fetching data:', err);
    //   } else {
    //     console.log('Fetched data:', results); //JSON 형식으로 출력
    //     // 
    //   }
    //   // db 연결 종료
    //   db_connection.end();
    // });

  }
});

module.exports = db_connection;
