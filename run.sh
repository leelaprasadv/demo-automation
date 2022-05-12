#!/bin/sh
rm -rf allure-results report
npm run wdio && allure generate ./allure-results -o ./report --clean
