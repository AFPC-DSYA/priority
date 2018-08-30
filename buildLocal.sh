#!/bin/bash
yarn run build:local;
rm ~/priority/recent_commit.txt
rm ~/priority/version.txt
git log -n 1 --oneline > ~/priority/recent_commit.txt
git tag -n1 > ~/priority/version.txt 
rm -r ~/priority/dist/data;
rm ~/priority/dist/static/*.png;
cd ~/priorityLocal/ 
cp -r ~/priority/dist/* .
cp ~/priority/version.txt .
git add . ;
git commit -F ~/priority/recent_commit.txt;
git push origin master;
