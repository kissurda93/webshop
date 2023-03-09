# Project Name

This project is a web application that uses Laravel for the back-end REST API, React for the front-end single-page application (SPA), and MySQL as the database.

## Description

The project is a fully functional web application that allows users to perform CRUD operations on a database of items. The application includes a user authentication system, allowing users to create an account, log in, and perform actions that require authentication.

The back-end of the application is built using Laravel, a PHP framework for building web applications. The front-end of the application is built using React, a JavaScript library for building user interfaces. The application's data is stored in MySQL, a relational database management system.

## Prerequisites

To run the application, you will need the following software installed:

- [PHP](https://www.php.net/manual/en/install.php)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/en/)
- [MySQL](https://dev.mysql.com/downloads/)

## Installation

1. Clone the project to your local machine:

git clone https://github.com/<username>/<projectname>.git

2. Install the back-end dependencies:

cd backend
composer install

3. Configure the database connection in the `.env` file:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=<databasename>
DB_USERNAME=<username>
DB_PASSWORD=<password>

4. Run the database migrations:

php artisan migrate

5. Seed the database:

php artisan db:seed

6. Install the front-end dependencies:

cd ../frontend
npm install

7. Start the application:

npm start

## Usage

The web application allows users to perform CRUD operations on a database of items. The application is fully functional and can be used to create, read, update, and delete items.

## Development

To contribute to the project, follow these steps:

1. Fork the project on GitHub.

2. Make your changes and commit them to a new branch.

3. Create a pull request on the original repository.

## Credits

This project was created by Gábor Jőrös.
