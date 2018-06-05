#!/bin/bash

cd static

git init

git remote add origin git@github.com:unitedstack/uskin.doc.git

git checkout -b gh-pages

git pull origin gh-pages
