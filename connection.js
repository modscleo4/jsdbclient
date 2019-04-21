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

const net = require('net');

module.exports = class Connection {
    constructor(connectionString, pingTest = false, t = 4) {
        if (typeof connectionString === 'string' && typeof pingTest === 'boolean' && typeof t === 'number') {
            this.host = connectionString.replace(/.*Host: ([^;]*);.*/mi, '$1');
            this.port = connectionString.replace(/.*Port: ([^;]*);.*/mi, '$1');
            this.db = connectionString.replace(/.*Database: ([^;]*);.*/mi, '$1');
            this.user = connectionString.replace(/.*User Id: ([^;]*);.*/mi, '$1');
            this.password = connectionString.replace(/.*Password: ([^;]*);.*/mi, '$1');

            this.client = new net.Socket();
            this.pingTest = pingTest;

            this.client.on('data', data => {
                data = data.toLocaleString().trim();
                if (data.toUpperCase().includes("AUTHOK")) {
                    this.send(`NOPERF;USE ${this.db};`); // Send DB to server
                }
            });

            this.open();
        } else {
            throw new Error('Invalid type');
        }
    }

    open() {
        this.client.connect(this.port, this.host, () => {
            if (!this.pingTest) {
                let credentials = JSON.stringify({'username': this.user, 'password': this.password});
                this.send(`credentials: ${credentials}`);
            } else {
                this.time = performance.now();
                this.send("PING");
            }
        });
    }

    close() {
        this.client.destroy();
    }

    send(sql) {
        this.client.write(sql);
    }
};