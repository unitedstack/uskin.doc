#!/bin/bash

npm run build

cd static

git add .

git commit -m "update"

git push origin gh-pages
