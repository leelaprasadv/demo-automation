#!/bin/sh

docker-compose build

docker-compose up --abort-on-container-exit --exit-code-from test-container

docker-compose down