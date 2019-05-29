var http = require('http');
var https = require('https')
const { URL } = require('url');

var querystring = require('querystring');

function type(o) {
    return Object.prototype.toString.call(o).slice(8, -1)
}

function get(opt) {
    let options,hp = http
    if (type(opt) === 'Object') {
        options = {
            hostname: opt.host || 'localhost',
            port: opt.port || 5000,
            path: opt.path || '',
            method: 'GET'
        }
    }else if(type(opt) === 'String'){
        options = opt
        const myURL = new URL(options);
        if(myURL.protocol === 'https:'){
            hp = https
        }
    }
    return new Promise((resolve, reject) => {
        let req = hp.request(options, res => {
            res.setEncoding('utf8');
            let d = ''
            res.on('data', function (chunk) {
                d += (chunk)
            });
            res.on('end', function () {
                resolve(d.toString())
            });
        })
        req.on('error', e => {
            reject(e)
        })
        req.end()
    })
}


function post(opt) {
    return new Promise((resolve, reject) => {
    
        const postData = querystring.stringify(opt.data);

        const options = {
            hostname: opt.host || 'localhost',
            port: opt.port || 5000,
            path: opt.path || '/user/login.do',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            },
        };

        const req = https.request(options, (res) => {
            // console.log(`状态码: ${res.statusCode}`);
            // console.log(`响应头: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            let data = ''
            res.on('data', (chunk) => {
                // console.log(`响应主体: ${chunk}`);
                data += chunk
            });
            res.on('end', () => {
                // console.log('响应中已无数据');
                resolve(data.toString())
            });
        });

        req.on('error', (e) => {
            // console.error(`请求遇到问题: ${e.message}`);
            reject(e)
        });

        // 将数据写入请求主体。
        req.write(postData);
        req.end();
    })
}



// ; (async () => {
//     var options = {
//         host: '47.93.97.5',
//         port: 3001,
//         path: '/api/word/t?word=error',
//         method: 'GET'
//     };
//     // let url = 'http://47.93.97.5:3001/api/word/t?word=data'
//     let res = await get(options)
//     // let res = await post({
//     //     host: 'localhost',
//     //     prot: '5000',
//     //     path: '/user/login.do',
//     //     data: {username: 'aa', password: 'qq'}
//     // })
//     console.log(res);
// })()

module.exports = {
    get, post
}