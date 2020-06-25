# elections-app

Software Studio Web-Team Project

## Pre-requisites

Node.js should be installed. Get Node.js [here](https://nodejs.org/en/download/)

## Installation

    git clone https://github.com/iTranscend/elections-app.git
    cd elections-app
    npm install

### Set up Database

    - Install XAMPP
    - Start XAMPP Apache server and MySQL
    - Navigate to localhost/phpmyadmin
    - Create a new database named "elections-app"

After creating the database go back to the project and run

    knex migrate:latest

This will update your database to the config of mine

### Run the application

On MacOS or Linux, run this command:

    DEBUG=myapp:* npm start

On Windows, run this command:

    set DEBUG=myapp:* & npm start

Then load <http://localhost:3000/> in your browser to access the app.

## License

MIT
