# JSDBClient

[![Build Status](https://travis-ci.org/modscleo4/jsdbclient.svg?branch=master)](https://travis-ci.org/modscleo4/jsdbclient)

JSDBClient is the official client for [JSDB](https://github.com/modscleo4/jsdb)

## Installation
To install JSDBClient from GitHub (latest build), just run
```
$ git clone https://github.com/modscleo4/jsdbclient
$ npm install -g jsdbclient
```
Or
```
$ npm install -g modscleo4/jsdbclient
```

For stable releases, install from NPM
```
$ npm install -g @modscleo4/jsdbclient
```

## Run
After installed, you can run JSDBClient just typing
```
$ jsdbclient [-a address] [-p port] [-d database] [-U username] [-P password] [--pingTest] [-t]
```

| Command        | Description                                  |
| -------------- | -------------------------------------------- |
| -h, --help     | Displays this table                          |
| -d, --database | The database to connect (default: jsdb)      |
| -a, --address  | Server IP address (default: localhost)       |
| -p, --port     | Server port (default: 6637)                  |
| -U, --user     | User to connect (default: jsdbadmin)     |
| -P, --password | User password                                |
| --pingTest     | Tests the ping against the server            |
| -t             | The amount of ping tests to run (default: 4) |

## Issues and suggestions
Use the <a href="https://github.com/modscleo4/jsdbclient/issues">Issues page</a> to send bug reports and suggestions for new features

## Contributing
Feel free to fork and send <a href="https://github.com/modscleo4/jsdbclient/pulls">Pull Requests</a> to JSDB Server and Client projects, I'll love to see new contributions for these projects!
