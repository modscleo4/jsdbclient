/**
 * Copyright 2019 Dhiego Casssiano Fogaça Barbosa

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 *     http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @file This file manages the connection with JSDB server
 *
 * @author Dhiego Cassiano Fogaça Barbosa <modscleo4@outlook.com>
 * */

'use strict';

const uriParser = require('./uriParser');
const net = require('net');

class Connection {
    #host;
    #port;
    #db;
    #user;
    #password;
    #client;

    constructor(connectionString) {
        if (typeof connectionString !== 'string') {
            throw new TypeError('connectionString is not string.');
        }

        const params = uriParser(connectionString);
        this.#host = params.host;
        this.#port = params.port || 6637;
        this.#db = params.db || 'jsdb';
        this.#user = params.user || require("os").userInfo().username;
        this.#password = params.password;

        this.#client = new net.Socket();
    }

    get host() {
        return this.#host;
    }

    get port() {
        return this.#port;
    }

    get db() {
        return this.#db;
    }

    get user() {
        return this.#user;
    }

    get client() {
        return this.#client;
    }

    open() {
        this.client.connect(this.port, this.host, () => {
            const credentials = JSON.stringify({database: this.db, username: this.user, password: this.#password});
            this.send(`${credentials}`);
        });
    }

    close() {
        this.client.destroy();
    }

    send(sql) {
        this.client.write(sql);
    }
}

module.exports = Connection;