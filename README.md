# jsdbclient
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
After installed, you can run JSDBClient without parameters, which will try to connect to your localhost
```
$ npm jsdbclient
```

You can still connect o a different server
```
$ npx jsdbclient -a <host address> -p <host port> -d <database>
```