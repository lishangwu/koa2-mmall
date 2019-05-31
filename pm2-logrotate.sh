#!/bin/bash
pm2 set pm2-logrotate:max_size 1K #(1KB)
pm2 set pm2-logrotate:compress false #(compress logs when rotated)
pm2 set pm2-logrotate:rotateInterval '* * * 0 * *' #(force rotate every minute)

# chmod +x pm2-logrotate.sh