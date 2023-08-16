# Northcoders News API

This is an Application Programming Interface (API) for accessing data of a news application, including articles, comments, topics and users, with some query options available.

[The hosted version](https://nc-news-api-8tl9.onrender.com/)
Note that the server will correctly display a 404 message for path `/`. Check `endpoints.json` for available paths to make a request to an existing endpoint.

Description
This is a back-end project built as part of the Northcoders Software Development Bootcamp course. This project covers various aspects of back-end development including creating a server, building RESTful API, using MVC architecture, retrieving data from database, writing integration tests，handling errors, and deploying the application to the cloud.
Technology used includes node-postgres, Express.js, PSQL, etc. During the process of development, I also exercised my version control skills using Git, especially in dealing with branches and resolving conflicts.

Instructions
Fork this repository
Clone your forked repository locally
Check package.json for available scripts

- Run `npm install` to install all the dependencies
- Run `npm run setup-dbs` to set up the databases
- Run `npm run seed` to seed local databases
- Run `npm test` to test the functionality of endpoints
- Remember to check out `.env-example` and create your own `.env.test` and `.env.developement` files with the correct database names for each environment (see `/db/setup.sql` for the database names).

Minimum versions of Node.js, and Postgres needed to run the project:

Credits
