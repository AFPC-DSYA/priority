#!/bin/bash
yarn run build;
rm -r ./dist/data;
rm ./dist/static/js/*.map;
rm ./dist/static/*.png;
cd ./dist;
git add . ;
git commit -m "`(date +%F%T)`";
git push origin master;