#!/bin/sh
if [ "$NODE_ENV" = "development" ]; then
    npm install --from-lock-file
    npm run start:dev
elif [ "$NODE_ENV" = "test" ]; then
    npm run test
else
    npm run build
    npm start
fi
