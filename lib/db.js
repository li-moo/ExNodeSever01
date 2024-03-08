// const express = require('express');
// const mysql = require('mysql2'); //mysql 모듈 로

// const app = express();
// const port = 4000;

// const db_connection = mysql.createConnection({
//   host: 'localhost',
//   port: '3306',
//   user: 'root',
//   password: '',
//   database: 'wannagym'
// });

// db_connection.connect(); // db접속

// console.log("db.js입니다");

// app.get('/members', (req, res) => {
//   db_connection.query('USE wannagym', (useErr) => {
//     if (useErr) {
//       console.error('스키마 설정 오류: ' + useErr);
//       res.status(500).send('Internal Server Error');
//       return;
//     }

//     console.log('wannagym 스키마를 사용하도록 설정되었습니다.');

//     // 멤버 테이블에서 데이터 조회하는 예시 쿼리
//     db_connection.query('SELECT * FROM member', (queryErr, results, fields) => {
//       if (queryErr) {
//         console.error('쿼리 실행 오류: ' + queryErr);
//         res.status(500).send('Internal Server Error');
//         return;
//       }

//       console.log('조회된 데이터:', results);

//       db_connection.connection.query('SELECT * from member', (error, rows, fields) => {
//         if (error) throw error;
//         console.log('User info is: ', rows);
//       });

//       // // HTML 테이블 형식으로 데이터를 렌더링
//       // const tableHtml = `
//       //   <table border="1">
//       //     <tr>
//       //       <th>ID</th>
//       //       <th>Name</th>
//       //       <!-- 추가 필요한 컬럼들에 따라 th를 추가 -->
//       //     </tr>
//       //     ${results.map(row => `
//       //       <tr>
//       //         <td>${row.id}</td>
//       //         <td>${row.member_name}</td>
//       //         <td>${row.birth}</td>
//       //       </tr>
//       //     `).join('')}
//       //   </table>
//       // `;

//       // 클라이언트에게 HTML 응답 전송
//       res.send(tableHtml);

//       // 모든 작업이 완료되면 연결 종료
//       db_connection.end();


//     });
//   });
// });

// app.listen(port, () => {
//   console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
// });



///
const mysql = require('mysql2'); //mysql 모듈 로

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
    console.log('Connected to database');
  }
});
module.exports = db_connection;


db_connection.end();
