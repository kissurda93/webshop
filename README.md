# GaborShop

A fictitious webshop. Which was made for learning purposes only. Powered by Laravel, React and MySQL stack. I hope that installing and using the project will not cause any difficulties. Feel free to sending a pullrequest or to open an issue!

## Prerequisites

To run the application, you will need the following software installed (preferably the latest versions):

- Composer
- Node.js
- npm
- PHP
- MySQL

## Installation

1. Clone the project to your local machine:

`git clone https://github.com/kissurda93/webshop.git`

2. Install the back-end dependencies:

```bash
cd rootFolder
composer install
```

3. Create a copy from the ".env.example" file and rename it to ".env". Then open it and change the MySQL database and smtp credentials:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="gaborshop@gmail.com"
```

4. Run the database migrations and seeders:

`php artisan migrate:fresh --seed`

6. Start the backend dev server:

`php artisan serve`

7. Start the backend schedule worker:

`php artisan schedule:work`

8. Install the front-end dependencies:

```bash
cd ../gaborshop
npm install
```

8. Start the frontend dev server:

`npm run dev`

9. Open the frontend servers localhost in your browser:

## Usage

User Test account credentials:

- Email: test@email.com
- Password: testuser (every migrated users password)

Admin Test account credentials (on "/admin-login" endpoint):

- Email: test@email.com
- Password: testadmin (every migrated admins password)

## License

MIT
