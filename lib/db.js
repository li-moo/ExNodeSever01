// var mysql = require('mysql2');
// var connection = mysql.createConnection({
//   host: 'localhost',
//   port: '3306',
//   user: 'root',
//   password: 'root',
//   database: 'node_test'
// });

// connection.connect((connectErr) => {
//   if (connectErr) {
//     console.error('MySQL 연결 오류: ' + connectErr);
//     return;
//   }

//   console.log('MySQL에 성공적으로 연결되었습니다.');

//   // "wannagym" 스키마를 사용하도록 설정
//   connection.query('USE wannagym', (useErr) => {
//     if (useErr) {
//       console.error('스키마 설정 오류: ' + useErr);
//       connection.end(); // 오류 발생 시 연결 종료
//       return;
//     }

//     console.log('wannagym 스키마를 사용하도록 설정되었습니다.');

//     // SELECT 쿼리 실행
//     connection.query('SELECT 1 + 1 AS solution', (queryErr, results, fields) => {
//       if (queryErr) {
//         console.error('쿼리 실행 오류: ' + queryErr);
//         connection.end(); // 오류 발생 시 연결 종료
//         return;
//       }

//       console.log('The solution is: ', results[0].solution);

//       // 모든 작업이 완료되면 연결 종료
//       connection.end();
//     });
//   });
// });

const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 4000;

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'node_test'
});

app.get('/members', (req, res) => {
  connection.query('USE wannagym', (useErr) => {
    if (useErr) {
      console.error('스키마 설정 오류: ' + useErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('wannagym 스키마를 사용하도록 설정되었습니다.');

    // 멤버 테이블에서 데이터 조회하는 예시 쿼리
    connection.query('SELECT * FROM member', (queryErr, results, fields) => {
      if (queryErr) {
        console.error('쿼리 실행 오류: ' + queryErr);
        res.status(500).send('Internal Server Error');
        return;
      }

      console.log('조회된 데이터:', results);

      connection.query('SELECT * from member', (error, rows, fields) => {
        if (error) throw error;
        console.log('User info is: ', rows);
      });

      // HTML 테이블 형식으로 데이터를 렌더링
      const tableHtml = `
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <!-- 추가 필요한 컬럼들에 따라 th를 추가 -->
          </tr>
          ${results.map(row => `
            <tr>
              <td>${row.id}</td>
              <td>${row.member_name}</td>
              <td>${row.birth}</td>
            </tr>
          `).join('')}
        </table>
      `;

      // 클라이언트에게 HTML 응답 전송
      res.send(tableHtml);

      // 모든 작업이 완료되면 연결 종료
      connection.end();


    });
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});