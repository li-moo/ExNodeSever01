const express = require('express') //③번 단계에서 다운받았던 express 모듈을 가져온다.
const app = express() //가져온 express 모듈의 function을 이용해서 새로운 express 앱을 만든다.
const port = 4000 // 백 포트번호 공식문서는 3000번인데 4000번으로 하겠음
const db = require('./lib/db');
const bodyParser = require('body-parser');
// const corsOptions = {
//     origin: 'http://localhost:3000', // 클라이언트의 주소
//     methods: ['GET', 'POST'], // 사용할 HTTP 메서드
//     allowedHeaders: ['Content-Type', 'Authorization'], // 허용하는 헤더
//   };
//   app.use(cors(corsOptions));

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(bodyParser.json());

app.use(cors(corsOptions));

// db.connect(); //db에서 query 처리할 때 사용
// app.get('/', (req, res) => { //express 앱(app)을 넣고, root directory에 오면,
//   res.send('LEE.SEL nodeServer Hello World!') //"LEE.SEL nodeServer Hello World!!" 를 출력되게 해준다.
//   // 하나의 응답만 가능하다
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) //포트 4000번에서 이 앱을 실행한다.

app.get("/member", (req, res) => {
    const memberNumber = req.query.member_number;

    // const query = `
    //     SELECT member.name, member.member_number, member.member_img, member.car_number, 
    //         membership_period.first_membership_period, membership_period.second_membership_period,
    //         parking.is_parking
    //     FROM member
    //     LEFT JOIN membership_list ON member.member_number = membership_list.member_number
    //     LEFT JOIN membership_period ON member.member_number = membership_period.member_number
    //     LEFT JOIN parking ON member.car_number = parking.car_number
    //     WHERE member.member_number = ?
    //     ORDER BY membership_period.id DESC
    //     LIMIT 1
    // `;
    const query = `
    SELECT 
        member.name, 
        member.member_number, 
        member.member_img, 
        member.car_number, 
        membership_period.first_membership_period, 
        membership_period.second_membership_period,
        parking.is_parking,
        attendance.in_time
    FROM member
    LEFT JOIN membership_list ON member.member_number = membership_list.member_number
    LEFT JOIN membership_period ON member.member_number = membership_period.member_number
    LEFT JOIN parking ON member.car_number = parking.car_number
    LEFT JOIN attendance ON member.member_number = attendance.member_number
    WHERE member.member_number = ?
    ORDER BY membership_period.id DESC
    LIMIT 1
`;

    db.query(query, [memberNumber], (err, result) => {
        if (err) {
            console.error('member data error:', err);
            res.status(500).send('내부 서버 오류');
        } else {
            if (result.length === 0) {
                res.status(404).send('해당하는 회원이 없습니다.');
            } else {
                res.json(result[0]);
                console.log('member data:', result[0]);
            }
        }
    });
});


app.post('/attendance', (req, res) => {
    const { member_number } = req.body;
    const today = new Date().toISOString().slice(0, 10); // YY-MM-DD 형식의 오늘 날짜
    const in_time = new Date().toISOString().slice(11, 19); // HH:MM:SS 형식의 현재 시간
    const out_time = null; // 아직 출석 종료 시간을 모름 null.
    const in_progress = true; // 정기권이 진행 중인가
    const query = `
        INSERT INTO attendance (member_number, today, in_time, out_time, in_progress)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [member_number, today, in_time, out_time, in_progress], (err, result) => {
        if (err) {
            console.error('데이터 삽입 중 오류 발생:', err);
            res.status(500).json({ error: '데이터 삽입 중 에러' });
        } else {
            res.status(201).json({ id: result.insertId, message: '데이터 삽입 성공' });
        }
    });
});

app.post('/parking', (req, res) => {
    const { car_number, member_number, out_time, parking_time } = req.body;
    const parkingQuery = `
        INSERT INTO parking (car_number, member_number, out_time, parking_time)
        VALUES (?, ?, ?, ?)
    `;

    const attendanceQuery = `
    UPDATE attendance
    SET out_time = ?
    WHERE member_number = ?
    AND out_time IS NULL
    ORDER BY id DESC LIMIT 1;
    `;

    // 트랜잭션
    db.beginTransaction((err) => {
        if (err) {
        return res.status(500).json({ error: '트랜잭션 시작 중 에러' });
        }

        db.query(parkingQuery, [car_number, member_number, out_time, parking_time], (err, result) => {
        if (err) {
            return db.rollback(() => {
            console.error('parking 테이블에 데이터 삽입 중 에러', err);
            res.status(500).json({ error: 'parking 테이블에 데이터 삽입 중 에러 ' });
            });
        } // 만약 parkingQuery만 실행되고 attanceQuery가 실행안된다하더라도
            // 롤백을 잘못된 데이터가 저장되지 않는다.

            // [out_time, member_number] 둘의 순서가 봐꼈을 때, 오류는 안났지만 데이터가 들어가진않았다
            // .set으로 out_time
        db.query(attendanceQuery, [out_time, member_number], (err, result) => {
            if (err) {
            return db.rollback(() => {
                console.error('attendance 테이블에 데이터 삽입 중 에러', err);
                res.status(500).json({ error: 'attendance 테이블에 데이터 삽입 중 에러' });
                console.log(result);
            });
            }

            // 트랜잭션 커밋
            db.commit((err) => {
            if (err) {
                return db.rollback(() => {
                console.error('트랜잭션 커밋 중 에러:', err);
                res.status(500).json({ error: '트랜잭션 커밋 중 에러' });
                });
            }
            res.status(201).json({ message: '데이터 삽입 성공' });
            });
        });
        });
    });
});

app.post('/exit', (req, res) => {
    const { member_number, out_time} = req.body;

    const attendanceQuery = `
    UPDATE attendance
    SET out_time = ?
    WHERE member_number = ?
    AND out_time IS NULL
    ORDER BY id DESC LIMIT 1;
    `;

    db.query(attendanceQuery, [out_time, member_number], (err, result) => {
        if (err) {
            console.error('데이터 삽입 중 오류 발생:', err);
            res.status(500).json({ error: '데이터 삽입 중 에러' });
        } else {
            res.status(201).json({ id: result.insertId, message: '데이터 삽입 성공' });
        }
    });  
});

// 실행 node.index.js -> 서버 실행
// npm nodemon 업데이트 될때마다 node index.js를 실

