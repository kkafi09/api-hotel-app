# Hotel Reservation API App

This is a RESTful API application built for hotel reservation management. The API allows clients to create, read, update, and delete (CRUD) reservation orders and their details.

## Technologies Used

The following technologies were used to build this project:

- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- Express.js: A web application framework for Node.js.
- Prisma ORM: An open-source database toolkit.
- MySQL: A popular open-source relational database management system.

## Getting Started

To get started with this project, you should follow these steps:

### Clone the repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/your-username/hotel-reservation-api.git
```

### Install Dependencies

Install the project's dependencies by running the following command:

```bash
yarn install
```

### Database Configuration

This project uses MySQL as the database management system. You will need to create a database and configure the connection string in the .env file.

Create a new file called .env at the root of the project, and add the following lines:

```bash
DATABASE_URL="mysql://<username>:<password>@<host>:<port>/<database_name>?schema=<schema_name>"
```

Make sure to replace the value in <> with your own values.

### Run Database Migrations

This project uses Prisma as the ORM. You will need to run the database migrations to create the tables in the database.

Run the following command to migrate the database:

```bash
npx prisma generate
npx prisma migrate dev
```

### Start the Server

To start the server, run the following command:

```bash
yarn start
```

## API Documentation

The API documentation can be found in the docs folder. You can open the index.html file in your browser to view the documentation.
API Endpoints

The API endpoints are listed below:

**'/api/v1/user'**
| Method | Endpoint | Description |
| :-------- | :------- | :-------------------------------- |
| GET | / | Get user auth |
| POST | /login | register user |
| POST | /register | login user |

**'/api/v1/order'**
| Method | Endpoint | Description |
| :-------- | :------- | :-------------------------------- |
| GET | / | Get all reservation orders |
| GET | /:id | Get a reservation order by ID |
| POST | / | Create a new reservation order |
| PUT | /:id | Update a reservation order |
| DELETE | /:id | Delete a reservation order |

**'/api/v1/room'**
| Method | Endpoint | Description |
| :-------- | :------- | :-------------------------------- |
| GET | / | Get all rooms |
| GET | /:id | Get room by ID |
| POST | / | Create a new room |
| PUT | /:id | Update a room |
| DELETE | /:id | Delete a room |

## Conclusion

This project provides a basic API application for hotel reservation management. You can build on top of this application to add more features and functionality.
