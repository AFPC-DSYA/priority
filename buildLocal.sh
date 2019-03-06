#!/bin/bash
#begin by resetting local build repo working directory to last commit state
git -C ~/priorityLocal reset --hard;
#pull to sync with remote
git -C ~/priorityLocal pull origin master
#build
yarn run build:local;
#get most recent commit and current branch
lastCommitHash=$(git rev-parse --short HEAD)
lastCommit=$(git log -n 1 --oneline)
branchName=$(git rev-parse --abbrev-ref HEAD)
version=$(git describe --tags)
#push code to github (webpack places build files in correct location)
git -C ~/priorityLocal add .
git -C ~/priorityLocal commit -m "${version} Push on: `(date "+%F %T")` from ${lastCommitHash} on branch ${branchName}" -m "Built version of: ${lastCommit}";
git -C ~/priorityLocal push origin master;

