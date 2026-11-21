# Carpet Management System

A full-stack Carpet Management System designed to manage carpet sales, purchases, inventory, customers, suppliers, employees, and financial operations.

## Features

- **Carpet Management:** Manage carpet information, categories, and unique carpet codes.
- **Inventory Management:** Track stock quantities across different locations.
- **Sales Management:** Manage sales, sale details, returns, and invoices.
- **Purchase Management:** Record purchases and manage suppliers.
- **Customer Management:** Manage customer information and records.
- **Employee Management:** Manage employee information.
- **Financial Management:** Manage expenses, payments, currencies, and exchange rates.
- **Reports:** Generate financial and business reports.
- **Authentication & Authorization:** Secure login and role-based permissions.
- **Multilingual Support:** English, Persian (Dari), and Pashto.
- **Dark & Light Mode:** Support for different interface themes.

## Technologies Used

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS

## Project Structure

```text
Carpet-Management-System/
├── Back_End/
├── Front_End/
├── Database/
├── DOCS/
└── Start_Front_And_Back_End.bat
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mohammad-mohammadi00112/Carpet-Mnagement-System.git
```

2. Install backend dependencies:

```bash
cd Back_End
npm install
```

3. Install frontend dependencies:

```bash
cd ../Front_End
npm install
```

4. Configure the environment variables in the backend and frontend `.env` files.

5. Create the PostgreSQL database and execute the SQL files in the `Database` folder.

6. Start the backend and frontend using their respective start scripts.

## Security

- Environment variables are excluded from Git.
- Authentication and permission-based access control are implemented.

## Project Status

Under development.

## Author

**Mohammad Mohammadi**

GitHub: [mohammad-mohammadi00112](https://github.com/mohammad-mohammadi00112)
