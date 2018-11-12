# jsdbclient

[![Build Status](https://travis-ci.org/modscleo4/jsdbclient.svg?branch=master)](https://travis-ci.org/modscleo4/jsdbclient)

JSDBClient is the official client for JSDB
https://github.com/modscleo4/jsdb

## Installation
To install JSDBClient from GitHub (latest build), just run
```
$ git clone https://github.com/modscleo4/jsdbclient
$ npm install jsdbclient
```

For stable releases, install from NPM
```
$ npm install @modscleo4/jsdbclient
```

## Run
After installed, you can run JSDBClient without -a and -p parameters, which will try to connect to your localhost
```
$ npx jsdbclient -d <database> -U <username> -P <password>
```

You can still connect o a different server
```
$ npx jsdbclient -a <host address> -p <host port> -d <database> -U <username> -P <password>
```