const mysql = require('mysql2'); //mysql 모듈 로드
// git에 ..env파일 업로드 X
require('dotenv').config();

// const db_connection = mysql.createConnection({ //handshake connection
//   host: 'localhost',
//   port: '3306',
//   user: 'root',
//   password: '',
//   database: 'wannagym'
// });

const db_connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// db접속
db_connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database'); // 터미널에 뜬다면 성공

  }
});

module.exports = db_connection;
