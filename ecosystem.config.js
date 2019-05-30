module.exports = {
  apps: [{
    name          : 'koa2-mmall',
    script        : './start.js',
    instances     : 'max',
    out_file      : './out.log',
    error         : './error.log',
    log           : './combined.outerr.log',
    "watch"       : true,
    "ignore_watch": [
      "node_modules",
      "logs"
    ],
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
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
