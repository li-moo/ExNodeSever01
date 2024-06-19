const mysql = require('mysql2'); //mysql 모듈 로드

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

  }
});

module.exports = db_connection;
