# GaborShop

This project is an e-commerce website that uses Laravel for the back-end REST API, React for the front-end single-page application (SPA), and MySQL as the database.

## Description

The project is a fully functional web application that allows users to perform CRUD operations on a database of items. The application includes a user authentication system, allowing users to create an account, log in, and perform actions that require authentication.

The back-end of the application is built using Laravel, a PHP framework for building web applications. The front-end of the application is built using React, a JavaScript library for building user interfaces, and Vite to bundle the assets and jsx. The application's data is stored in MySQL, a relational database management system.

## Prerequisites

To run the application, you will need the following software installed:

- [PHP 8.0.2](https://www.php.net/manual/en/install.php)
- [Composer 2.4.3](https://getcomposer.org/)
- [Node.js 18.12.0](https://nodejs.org/en/)
- [npm 8.19.2](https://www.npmjs.com/)
- [MySQL](https://dev.mysql.com/downloads/)

## Installation

1. Clone the project to your local machine:

`git clone https://github.com/kissurda93/webshop.git`

2. Install the back-end dependencies:

```bash
cd rootFolder
composer install
```

3. Configure the database connection in the `.env` file:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=<databasename>
DB_USERNAME=<username>
DB_PASSWORD=<password>
```

4. Run the database migrations:

`php artisan migrate`

5. Seed the database:

`php artisan db:seed`

6. Start the backend-localhost:

`php artisan serve`

7. Install the front-end dependencies:

```bash
cd ../gaborshop
npm install
```

8. Start the frontend-localhost:

`npm run dev`

## Usage

The migrated users password is "testuser". You can use a migrated user email and password to signing in or you can signup with your own data.

The admin panel you can reach via "/admin-login" endpoint. The migrated admins password is "testadmin". You can use a migrated admin email and password to login.

## Development

To contribute to the project, follow these steps:

1. Fork the project on GitHub.

2. Make your changes and commit them to a new branch.

3. Create a pull request on the original repository.

## Credits

This project was created by Gábor Jőrös.
