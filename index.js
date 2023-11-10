const express = require('express') //③번 단계에서 다운받았던 express 모듈을 가져온다.
const app = express() //가져온 express 모듈의 function을 이용해서 새로운 express 앱을 만든다.
const port = 4000 // 백 포트번호 공식문서는 3000번인데 4000번으로 하겠음

app.get('/', (req, res) => { //express 앱(app)을 넣고, root directory에 오면,
  res.send('Hello World!') //"Hello World!" 를 출력되게 해준다.
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) //포트 4000번에서 이 앱을 실행한다.