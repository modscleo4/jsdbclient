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
 * @file This is the main script of JSDBClient
 *
 * @author Dhiego Cassiano Fogaça Barbosa <modscleo4@outlook.com>
 * */

'use strict';

const {config} = require('./config');
const Connection = require('./lib/Connection');

const {performance} = require('perf_hooks');

const connectionString = `jsdb://${config.connection.user}:${config.connection.user}@${config.connection.address}:${config.connection.port}/${config.connection.database}?encode=utf-8`;
const connection = new Connection(connectionString);

if (config.ping.pingTest) {
    let T = 0;
    let time;

    const client = new (require('net')).Socket();

    client.connect(config.connection.port, config.connection.host, () => {
        time = performance.now();
        client.write(`PING`);
    });

    client.on('data', data => {
        data = data.toLocaleString().trim();

        if (data.toUpperCase().includes('PONG')) {
            time = performance.now() - time;
            console.log(`Time: ${time.toFixed(0)} ms.`);

            T++;

            if (T < config.ping.t || config.ping.t === 0) {
                time = performance.now();
                client.write('PING');
            } else if (T === config.ping.t) {
                client.destroy();
                process.stdin.removeAllListeners();
                process.exit(0);
            }
        }
    });
} else {
    process.stdin.pause();

    process.stdin.addListener('resume', () => {
        setTimeout(() => {
            process.stdout.write("SQL> ");
        }, 25);
    });

    process.stdin.addListener('data', d => {
        process.stdin.pause();

        d = d.toLocaleString().trim();
        if (d.startsWith('.')) {
            d = d.slice(1);

            switch (d) {
                case 'exit':
                    connection.close();
                    break;

                case 'help':
                    console.log('.help                  \tDisplays this table');
                    console.log('.exit                  \tCloses the connection');
                    break;

                default:
                    console.error(`Unrecognized command: ${d}`);
                    break;
            }

            process.stdin.resume();
        } else {
            connection.send(d);
        }
    });

    connection.open();
}

connection.client.on('data', data => {
    data = data.toLocaleString().trim();
    if (data.toUpperCase().includes('AUTHOK')) {
        console.log(`Connected to ${config.connection.address}:${config.connection.port}, Database ${config.connection.database}.`);
        process.stdin.resume();
        return;
    }

    try {
        if (data.toUpperCase().includes("AUTHERR")) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error(data);
        }

        let o = JSON.parse(data);
        let t = 0;
        if (o.code !== 0) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error(`ERR: ${o.message}`);
        }

        if (typeof o.data === 'object') {
            console.table(o.data);
        } else {
            console.log(o.data);
        }

        if (o.time !== 'NOTIME') {
            t = o.time.toFixed(1);
        }

        if (t !== 0) {
            console.log(`Statement executed in ${t} ms.`);
        }
    } catch (e) {
        console.error(e.message);
    } finally {
        process.stdin.resume();
    }
});

function closeServer() {
    console.log('Connection closed');
    connection.close();
    process.stdin.removeAllListeners('data');
    process.exit();
}

connection.client.on('close', () => {
    closeServer();
});

connection.client.on('error', err => {
    switch (err.code) {
        case 'ECONNREFUSED':
            console.error(`Connection refused. Is server running on ${config.connection.address}:${config.connection.port}?`);
            process.exit();
            break;

        case 'ECONNRESET':
            console.error(`Connection reset. Maybe the server is no longer running on ${config.connection.address}:${config.connection.port}`);
            process.exit();
            break;

        case 'ENOTFOUND':
            console.error(`Server at '${config.connection.address}' not found. Is the server address correct?`);
            process.exit();
            break;

        default:
            console.error(err.message);
            break;
    }
});
