# elections-app

Software Studio Web-Team Project

## Installation

-Node.js should be installed. Get Node.js [here](https://nodejs.org/en/download/)
-Navigate to a directory of your choice using a CLI and run the following commands in order:

    git clone https://github.com/iTranscend/elections-app.git
    cd elections-app
    npm install

### Set up Database

    - Install XAMPP
    - Start XAMPP Apache server and MySQL
    - Navigate to localhost/phpmyadmin
    - Create a new database named "elections-app"

After creating the database go back to the project and run:

    knex migrate:latest

This will update your database to the config of mine

Next, run the seed file(s):

    knex seed:run

This will populate your tables with necessary default application data like user roles config

### Run the application

On MacOS or Linux, run this command:

    DEBUG=myapp:* npm start

On Windows, run this command:

    set DEBUG=myapp:* & npm start

Then load <http://localhost:3000/> in your browser to access the app.

## License

MIT
