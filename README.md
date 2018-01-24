# Intro
This repo is a project by Mark Ruoff, Lucile Behmer, and Howard Chen.

It is an VIP-style RTS for the OSU Capstone project (Winter 2018).

# Installation Requirements
NodeJs, Typescript 2.0 compiler, npm

# Installation instructions
Once this repo has been cloned to the local computer, install the required dependencies using
'npm install --save'. Then use a server command like the node package 'http-server' to serve 
'index.html' on a local port like localhost:8080.

# Commands from this directory (and others, potentially)
* npm test - project command to generate a test report that is stored in the ./coverage folder
* npm run lint - command to run linting on all files in the ./src/ directory and its subdirectories
* npm run build:watch - compiles all Typescript files into Javascript and watches the Typescript files for changes -- if any are detected, they are re-compiled.

# Directory and File Structure
Current directory
* tsconfig.json - sets config options for the Typescript compiler
* inversify.config.ts - sets up Inversion of Control container
* tslint.json - sets of configuration of the Typescript linter
* coverage - stores files generated by 'npm test' command
* package.json - package configuration file for node and npm
* package.json.lock - version locking for packages
* tests - store tests written for mocha/chai/sinon
* src - source files for project
