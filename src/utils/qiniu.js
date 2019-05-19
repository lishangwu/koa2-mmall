/*
* @Author: Robin
* @Date: 2019-05-19 22:30:53
* @Last Modified by:   robin
* @Last Modified time: 
*/

'use strict';

const fs = require('fs')
const path = require('path')

const myconfig = {
    qiniu: {
        "bucket": "koa2-mmall",
        "video": "http://video.iblack7.com/",
        "AK": "KcWF_Fu_ZLqb_RmSSsIRLaScdMAsph5gDyNlZncD",
        "SK": "ZFcI0l4D6gMr_B4KwTdwLFuCtGopojJPOp7du6FD",
        //外链默认域名
        "ExternalLinkDefaultDomainName": 'http://' + 'prqz4fd85.bkt.clouddn.com/',
    }

}

var qiniu = require('qiniu')

var accessKey = myconfig.qiniu.AK;
var secretKey = myconfig.qiniu.SK;
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


var options = {
    scope: myconfig.qiniu.bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);


//自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
// var options = {
//     scope: bucket,
//     expires: 7200
// };
// var putPolicy = new qiniu.rs.PutPolicy(options);
// var uploadToken = putPolicy.uploadToken(mac);


// var keyToOverwrite = 'qiniu.mp4';
// var options = {
//   scope: bucket + ":" + keyToOverwrite
// }
// var putPolicy = new qiniu.rs.PutPolicy(options);
// var uploadToken=putPolicy.uploadToken(mac);




var config = new qiniu.conf.Config();

var localFile = path.resolve(__dirname, './qiniu.js');
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var key = 'qiniu-test.js';
// 文件上传
// formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
//     respBody, respInfo) {
//     if (respErr) {
//         throw respErr;
//     }

//     if (respInfo.statusCode == 200) {
//         console.log(respBody);
//     } else {
//         console.log(respInfo.statusCode);
//         console.log(respBody);
//     }
// });

const uploadFileToQiniu = function (myKey, myLocalFilePath) {
    return new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken, myKey, myLocalFilePath, putExtra, function (respErr,
            respBody, respInfo) {

            if (respErr) {
                return reject(respErr)
            }

            if (respInfo.statusCode == 200) {
                respBody.host = myconfig.qiniu.ExternalLinkDefaultDomainName
                resolve(respBody)
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
                return reject(respInfo)
            }
        });
    })
}

// ;(async ()=>{
//     key = key + Math.floor(Math.random()*100000)
//     localFile = path.resolve(__dirname, '../../upload/arr.png');
//     console.log(localFile);
//     let body = await uploadFileToQiniu(key, localFile)
//     console.log(body);
// })()
//{ hash: 'FpRnNVt5I_tX4AzxGa5b9L9XXkcK',
// key: 'qiniu-test.js844' }

const readableStreamUpload = function (key, readableStream) {
    return new Promise((resolve, reject) => {
        formUploader.putStream(uploadToken, key, readableStream, putExtra, function (respErr,
            respBody, respInfo) {
            if (respErr) {
                return reject(respErr)
            }

            if (respInfo.statusCode == 200) {
                respBody.host = myconfig.qiniu.ExternalLinkDefaultDomainName
                resolve(respBody)
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
                return reject(respInfo)
            }
        });
    })
};

// ; (async () => {
//     key = key + Math.floor(Math.random() * 100000)
//     localFile = path.resolve(__dirname, '../../upload/arr.png');
//     console.log(localFile);
//     let reader = fs.createReadStream(localFile)
//     let body = await readableStreamUpload(key, reader)
//     console.log(body);
// })()

module.exports = {
    uploadFileToQiniu,
    readableStreamUpload
}