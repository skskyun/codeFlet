const nunjucks = require('nunjucks');
const express = require('express');
const path = require('path');

const app = express();
app.set('view engine', 'html');
app.use(express.static(__dirname+'/images'));

nunjucks.configure('template', {
    autoescape: true,
    express: app
});

const redis = require('redis');
/*
const redisInfo = {
	host : '127.0.0.1',
	port : 6379,
	db : 0,
	password : 'HS12#$'
};
const client = redis.createClient(redisInfo);
*/
const client = redis.createClient();

// template를 인식하고 사용하겠다
// autoescape는 보안상 true
// express : app는 사용할 주체
//넌적스 공식문서에 있는 코드 
// template를 인식하고 사용하겠다
// autoescape는 보안상 true (false일 경우 html 태그 허용, DBD 공격 가능)
// express : app, 사용할 객체 지정
// watch: true 옵션을 사용하면 HTML파일이 변경될 때 템플릿 엔진 다시 렌더링


app.get('/', (req, res) => {
//	let {userName}= req.query;
    res.render('index.html', { 
//    res.render(path.join(__dirname, './html', 'index.html'), { 
        // error : __dirname + '/test.html'
        // error : path.join(__dirname, 'test.html')
        // complete : path.join(__dirname, 'template', 'test.html')
        // complete : test.html or ./test.html
//        name : userName
    });
});

app.get('/advertisement', (req, res) => {
    	let {advNumber, userName}= req.query;
    	console.log('advNumber: ' + advNumber +', userName: '+ userName);

	let number = null;
	//조회수 업데이트
        client.get('adv_1', async (err, data) => {
                if (err) console.error(err)
                else number = data
                number ++ ;

                client.set('adv_1', number, async (err, data) => {
                        if (err) console.error(err)
                });

		console.log("조회수:"+number);

	        res.render('adv'+advNumber+'.html', {
	                name : userName,
	                viewCount : number,
			advNumber : advNumber
	        });

        });

});

app.get('/rewardWallet', (req, res) => {
	let {walletId, amount} = req.query;
	let result = {}
	let number = null;

	result.walletId = walletId;

	client.get(walletId, async (err, data) => {
                if (err) console.error(err)
                else number = Number(data)

		console.log('walletId: '+ walletId +' / before balance: '+ number);
		result.beforeBalance = number;

                number += Number(amount);

		console.log('walletId: '+ walletId +' / after balance: '+ number);

                client.set(walletId, number, async (err, data) => {
                        if (err) console.error(err)
                });

		result.afterBalance = number;
		res.send(result);
        });

});

app.listen(80);
