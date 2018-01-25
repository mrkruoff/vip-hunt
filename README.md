# Intro
This repo is a project by Mark Ruoff and Howard Chen.

It is an VIP-style RTS for the OSU Capstone project (Winter 2018).

# Installation Requirements
NodeJs, Typescript 2.0 compiler, npm

# Installation instructions
Once this repo has been cloned to the local computer, install the required dependencies using
'npm install --save'. Then use a server command like the node package 'http-server' to serve 
'/dist/html' on a local port like localhost:8080.

# Commands from this directory (and others, potentially)
* npm test - project command to generate a test report that is stored in the ./coverage folder
* npm run lint - command to run linting on all files in the ./src/ directory and its subdirectories
npm run build - compiles all Typescript files into Javascript
* npm run build:watch - compiles all Typescript files into Javascript and watches the Typescript files for changes -- if any are detected, they are re-compiled.
* npm run serve:watch - serves the dist files using the node script 'dist/js/server.js'
* npm run serve:test - serves the dist files using the 'http-server' command. Only runs the game WITHOUT the client-server save/load/new-game/etc functions

# Directory and File Structure
Current directory
* tsconfig.json - sets config options for the Typescript compiler
* tslint.json - sets of configuration of the Typescript linter
* coverage - stores files generated by 'npm test' command
* package.json - package configuration file for node and npm
* package-lock.json - version locking for packages
* tests - store tests written for mocha/chai/sinon
* src - source files for project (.ts files mostly)
* dist - directoy for distributable files (used directly in the final game)
* public - directory for storing visual and audio assets

# References
See https://github.com/Microsoft/TypeScript-Node-Starter/blob/master/package.json
for info on the setup of the scripts in package.json.

See https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/ for more info on using npm scripts as build tools instead of gulp
