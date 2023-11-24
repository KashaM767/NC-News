# Northcoders News API

## Project Aims ##
An example API which accesses application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

## Link To Hosted Project ##
https://smarticles.onrender.com/api/articles/

## Project Setup ##

To replicate this project:

Your database will be PSQL, this will be interacted with using node-postgres.

#### Creating .env files ####
You will need to create two .env files for your project: .env.test and .env.development. 
- Into .env.test add PGDATABASE=nc_news_test
- Into .env.development add PGDATABASE=nc_news

__Please ensure that .env files are .gitignored__

This project requires several node dependicies listed in the package-lock.json/package.json files. After the env files are created run __npm install__.

#### Creating the databases ####
We'll have two databases in this project: one for development data, and another for simpler test data.
Seeding data is provided:
- run setup.sql file to create the databases 
- run run-seed.js 

The developer database should be populated at the start.
The test database should be set up to reseed before each test is run.

#### Running Tests ####
This project uses jest, jest-sorted and supertest for testing. 
Packages will be installed as dev dependencies as part of the initial setup of this project.

<p>Tests can be run by running npm t seed.</p>

#### Minimum Versions Needed ####
This project requires:
- 8.11.3 and upwards for postgres.
- 6.0.0 and upwards for node.