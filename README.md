# Northcoders News API

## Project Aims ##
An example API which accesses application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

## Link To Hosted Project ##
https://smarticles.onrender.com/api/articles/

## Project Setup ##

To replicate this project:

Your database will be PSQL, and you will interact with it using node-postgres.

#### Creating .env files ####
You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the relevent database name for that environment. Please ensure that these .env files are .gitignored. 

This project requires several node dependicies listed in the package-lock.json/package.json files. After the env files are created run npm install.

#### Creating the databases ####
We'll have two databases in this project: one for development data, and another for simpler test data.
Seeding data is provided:
run setup.sql file to create the databases 
 `code(- psql -f ./db/setup.sql)`
run run-seed.js 
 `code(node ./db/seeds/run-seed.js)`

The developer database should be populated at the start.
The test database should be set up to reseed before each test is run.
