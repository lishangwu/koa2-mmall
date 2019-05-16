#!/bin/bash
./node_modules/.bin/sequelize-auto -o "./db/models" -d mytest -h localhost -u root -p 3306 -x rootroot -e mysql
