//const express = require('express') //③번 단계에서 다운받았던 express 모듈을 가져온다.
//let fs = require('fs'); // 파일 로드 사용.
//const app = express() //가져온 express 모듈의 function을 이용해서 새로운 express 앱을 만든다. 🔥
//const port = 3000 //포트는 4000번 해도되고, 5000번 해도 된다. -> 이번엔 5000번 포트를 백 서버로 두겠다.

//app.get('/', (req, res) => { //express 앱(app)을 넣고, root directory에 오면, 
//  res.send('Hello World!') //"Hello World!" 를 출력되게 해준다.
//})

/*
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) //포트 5000번에서 이 앱을 실행한다.

app.get('/', function (req, res) { // 웹서버 기본주소로 접속 할 경우 실행 . ( 현재 설정은 localhost 에 3303 port 사용 : 127.0.0.1:3303 )
	let {userName}= req.query;
	console.log(userName);
fs.readFile('index.html', function (error, data) { // index.html 파일 로드 .
	console.log(data);
if (error) {
console.log(error);
} else {
res.writeHead(200, { 'Content-Type': 'text/html' }); // Head Type 설정 .
res.end(data,{name:'test'}); // 로드 html response .
}
});
});
*/



/*
 * redis test
 *
 */

/*

const redis = require('redis');

const client = redis.createClient();

//client.on('error', err => {
//    console.log('Error ' + err);
//});

app.get('/', function (req, res) { // 웹
	console.log('/ in');

	let number = null;

	client.get('adv_1', async (err, data) => { // check data from redis server 
	        if (err) console.error(err)
		else number = data
		number ++ ;

		client.set('adv_1', number, async (err, data) => {
	                if (err) console.error(err)
		});
	});
	
	

	console.log('/ out');
	res.send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 

*/






/*
 * socket.io test
 *
 */

const app = require('express')()
const http = require('http').createServer(app)
//const io = require('socket.io')(http)
const io = require('socket.io')(http, {cors: { origin:"*"}});
const axios = require('axios');

io.on('connection', function(socket){
    //socket.emit('fromServer', 'Welcome to my server.')


    socket.on('event', function(data){
	axios({
		method: "get", // 요청 방식
		url: "http://54.180.101.155/rewardWallet?walletId="+data.walletId+"&amount="+data.amount, // 요청 주소
		data: {
			id: "yoonjunho",
			name : "윤준호"
	  	} // 제공 데이터(body)
	}).then(function(result){
		console.log(result.data);
        	io.emit('fromServer', result.data);
	}).catch(function (err){
		console.error(err);
	})

    })

    socket.on('disconnect', function(){
        console.log('user out')
    })
})

http.listen(3000, function(){
    console.log('Listening on *:3000')
})

