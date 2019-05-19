import { ServerResponse, Const, TokenCache } from '../common'
import { MD5Util, UUID, qiniu, qiniuStream } from '../utils'

const R = require('ramda')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')

export class FileService {

    async upload2(file){
        // const file = ctx.request.files.myfile; // 获取上传文件
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        let filePath = path.join(__dirname, '../../upload') + `/${file.name}`

        console.log(filePath);
        console.log('/Users/robin/GitHub/koa2-mmall/upload/arr.png')
        ///Users/robin/GitHub/koa2-mmall/upload/arr.png
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);

        let key = Date.now() + file.name
        filePath = '/Users/robin/GitHub/koa2-mmall/upload/arr.png'
        let qiniuResult = await qiniu( key, filePath)
        if(qiniuResult.key){

            return ServerResponse.createBySuccess(qiniuResult.host + qiniuResult.key)
        }else{
            return ServerResponse.createByErrorMessage('上传失败')
        }
    }

    async upload(file){
        const reader = fs.createReadStream(file.path);
        let key = Date.now() + file.name
        let qiniuResult = await qiniuStream( key, reader)
        if(qiniuResult.key){
            return ServerResponse.createBySuccess(qiniuResult.host + qiniuResult.key)
        }else{
            return ServerResponse.createByErrorMessage('上传失败')
        }
    }

}