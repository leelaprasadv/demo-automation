# demo-automation
A demo automation test setup using wdio + mocha + imap

## Pre-requisites
- Install NodeJS LTS version (>=14.x)
- Docker Desktop / Docker CE installed.
- Install `npm i allure-commandline -g`

## Folder Structure

```
.
|-- Dockerfile
|-- LICENSE
|-- README.md
|-- config.js
|-- docker-compose.yml
|-- lib
|   `-- imap.email.js
|-- package-lock.json
|-- package.json
|-- run.sh
|-- report
|-- test
|   |-- pageobjects
|   |   |-- account.page.js
|   |   |-- cart.page.js
|   |   |-- login.page.js
|   |   |-- page.js
|   |   |-- products.page.js
|   |   `-- wishlist.page.js
|   |-- screenShots
|   |   |-- addtowishlist.png
|   |   |-- login.png
|   |   `-- openwishlist.png
|   `-- specs
|       `-- wishlist.spec.js
|-- wdio-docker.sh
`-- wdio.conf.js
```

## Steps

- Update the `.env` file with below details:

  | ENV Variable   | Description                        |
  |----------------|------------------------------------|
  | BASE_URL       | Base URL of the website            |
  | LOGIN_USERNAME | Login username for website         |
  | LOGIN_PASSWORD | Login user password for website    |
  | EMAIL_USER     | Email of the mailbox to connect to |
  | EMAIL_PASS     | Password of mailbox                |
  | EMAIL_HOST     | hostname of the email IMAP server  |
  | EMAIL_PORT     | port of the IMAP server            |

- run tests in local with following commands
  ```sh
  # for local run
  npm install # Install all packages
  bash run.sh
  ```

- run tests in docker containers
    ```sh
  # for docker run
  bash wdio-docker.sh
  ```

## Reporting

Once the execution is complete an allure report `index.html` will be generated inside `report/index.html` folder.