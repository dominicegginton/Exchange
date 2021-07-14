# Exchange

> A dynamic website built with `Koa` allowing users to exchange items

**Exchange was built as a univeristy project, I have now archive this as I no longer plan to provide support and updates**

## Contents

1. [Assignment Question](#Assignment-Question)
1. [Getting Started](#Getting-Started)

## Assignment Question

Users should be able to login and post a list of items they want to exchange:
Packages: sharp, nodemailer.

### Basic

A simple website to share details of items to be swapped.

1. ✅ Without logging in visitors can view the items (thumbnail and description) that users want to swap.
2. ✅ When logged in they can create their own list of items to swap, this should include:
    1. Short description.
    2. Uploaded photo.
    3. List of the items they are looking to swap for.
3. ✅ When logged in, a user can click on an item to see a page that shows:
    1. The item details
    2. The details of the user wanting to swap
    3. The list of items they want to swap for.

### Intermediate

This step adds features that improve the site's GDPR compliance.

1. ✅ The item details page should not display any personally-identifiable details such as the user's name or email address or profile picture.
2. ✅ The details page should display a dropdown list containing the items the viewing user want to swap.
3. ✅ Clicking on the 'make an offer' should automatically send an email (without using the email client) that contains:
    1. The details of the person making the offer.
    2. The item they want.
    3. The item they are willing to swap.

### Advanced

The final step is to build an auto-suggestion feature to make it easier for the users to find someone willing to swap.

1. ✅ The site should include a full-text search for items people are looking for.
2. ✅ Users should create the list of items they want to swap for by choosing from a dropdown list and clicking an 'add' button. If the item is not in the list they can enter it manually.
3. ✅ The system should analyse the items the person wants, compare it to the items people want to swap and automatically suggest the swaps by sending out an automatic email to both parties.
4. ✅ Each item the person wants to swap should have a 'suggested swaps' link that takes them to a page that suggests who might be willing to swap and for what, including pictures.
5. ✅ This should include the 'make an offer' button

## Getting Started

### Prerequisites

- [node.js](https://nodejs.org/)
- [docker](https://www.docker.com/)

### Getting the Codebase

``` bash
git clone https://github.coventry.ac.uk/340CT-1920SEPJAN/eggintod.git Exchange
cd Exchange
npm i
```

### Environment Variables

`Exchange` depends on environment variables for storing sensitive information for connecting to databases and SMPT servers. A example `.env.example` file has been provided, to use it simply copy it to `.env`.

``` bash
cp .env.example .env
```

### Running Exchange

#### Docker Compose

The simplest way to run exchange is to use `docker-compose`.

``` bash
docker-compose up --build -d
```

To stop `Exchange` simply use `docker-compose` again to bring down the containers.

``` bash
docker-compose down
```

Removing the volumes created by `docker-compose` is easy with the `-v` argument.

``` bash
docker-compose down -v
```

#### Locally (Development)

To run `Exchange` locally with [nodemon](https://github.com/remy/nodemon/) on your development machine use the provided shell script to spin up the required databases in docker containers along with corresponding data volumes, after `ctrl-c` is pressed to stop the node.js server, the shell script will remove the docker containers.

``` bash
npm run start:dev
```

To remove the data volumes, along with the `/data` folder used to hold item images and user avatars run the shell script to clean the development environment.

``` bash
npm run clean:dev
```

### Running Tests

#### Unit Tests

``` bash
npm test
```

#### Acceptance Tests

``` bash
npm run acceptance
```

#### Linter

``` bash
npm run linter
```

#### Dependency Check

``` bash
npm run npm-check
```
