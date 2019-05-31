const moment = require('moment')

let name = __dirname.split('/')[__dirname.split('/').length - 1]
module.exports = {
    apps: [{
        name: name,
        script: './start.js',
        watch: ['src'],
        ignore_watch: ["node_modules", "logs", 'test'],
        merge_logs: false, //?
        "log_date_format": "YYYY-MM-DD HH:mm:ss",
        error_file: './logs/' + 'err.log',
        out_file: './logs/' + 'out.log',       // 正常日志文件
        env: {
            PORT: 5000,
            NODE_ENV: 'development'
        },
        env_production: {
            PORT: 5000,
            NODE_ENV: 'production'
        }
    }],

    deploy: {
        production: {
            user: 'node',
            host: '212.83.163.1',
            ref: 'origin/master',
            repo: 'git@github.com:repo.git',
            path: '/var/www/production',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};
