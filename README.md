# Northcoders News API

**This repository contains the backend for a news application.**

### [The hosted version](https://nc-news-api-8tl9.onrender.com/)

### Description
This project was developed as part of the Northcoders Software Development Bootcamp course, with a Test Driven Development(TDD) approach. It covers various aspects of back-end development, such as creating a server, building RESTful APIs, evaluating endpoints for CRUD operations, implementing MVC architecture, retrieving data from an SQL database, writing integration tests, handling errors, and deploying to the cloud. 

### Technology & versions used for developemnt
- Node.js: v20.2.0
- PostgreSQL (PSQL): v14.7
- Express.js
- node-postgres (library for interacting with PostgreSQL)
- etc.

Throughout the development process, version control was managed using Git. This included practices like branching and resolving merge conflicts.

### Instructions
1. **Fork and Clone:**
    - Fork this repository to your GitHub account.
    - Run the following command to clone your forked repository locally.
      ```
      git clone <your-forked-repo-url>
      ```
    - Navigate into the repository folder using `cd`.

2. **Install Dependencies:** Run the following command to install all the required dependencies
    ```
    npm install
    ```

3. **Database Setup:**
    - Check `package.json` for available scripts.
    - Run the following command to set up the databases.
      ```
      npm run setup-dbs
      ```
    - Use`.env-example` to create your own `.env.test` and `.env.developement` files with the correct database names for each environment (see `/db/setup.sql` for the database names).

4. **Seed the Databases:** Run the following command to seed the local databases
    ```
    npm run setup-dbs
    ```

5. **Run Tests:** Run the following command to test the functionality of endpoints
    ```
    npm test
    ```

6. **Start the server using:**
    ```
    npm start
    ```
    - By default, the server will currectly display a 404 message for the root path `/`. To explore available endpoints, refer to `/api`.

### Credits
The `db` folder, which includes the database setup, was provided as part of the project. The `checkExists` function in `utils.js` and its corresponding tests in `utils.test.js` were implemented by me.

### License
This project is licensed under the [MIT license](https://opensource.org/license/mit/).
