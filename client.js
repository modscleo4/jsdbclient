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
 * @file This is the main script of JSDB client
 *
 * @author Dhiego Cassiano Fogaça Barbosa <modscleo4@outlook.com>
 * */

const Connection = require('./connection');
const {
    performance
} = require('perf_hooks');

let stdin = process.openStdin();

let address = "localhost";
let port = 6637;

let db = "jsdb";
let user = "jsdbadmin";
let password = "";

let pingTest = false;
let t = 4;
let T = 0;

for (let i = 0; i < process.argv.length; i++) {
    try {
        if (process.argv[i] === "-d" || process.argv[i] === "--database") {
            db = process.argv[i + 1];
        } else if (process.argv[i] === "-a" || process.argv[i] === "--address") {
            address = process.argv[i + 1];
        } else if (process.argv[i] === "-p" || process.argv[i] === "--port") {
            port = parseInt(process.argv[i + 1]);
        } else if (process.argv[i] === "-U" || process.argv[i] === "--user") {
            user = process.argv[i + 1];
        } else if (process.argv[i] === "-P" || process.argv[i] === "--password") {
            password = process.argv[i + 1];
        } else if (process.argv[i] === "--pingTest") {
            pingTest = true;
        } else if (process.argv[i] === "-t") {
            t = parseInt(process.argv[i + 1]);
        }
    } catch (e) {
        console.error(e.message);
    }

}

if (db === "") {
    db = "jsdb";
}

if (address === "") {
    address = "localhost";
}

if (port === 0) {
    port = 6637;
}

if (!pingTest) {
    stdin.addListener("data", function (d) {
        d = d.toLocaleString().trim();
        if (d[0] === ".") {
            // Client internal command
            d = d.slice(1);
            if (d === "exit") {
                connection.close();
            } else if (d === "help") {
                let commands = [
                    {
                        "command": ".help",
                        "description": "Display all the commands."
                    },

                    {
                        "command": ".exit",
                        "description": "Closes the connection."
                    }
                ];
                console.table(commands);
            } else {
                console.error(`Unrecognized command: ${d}`);
            }

            process.stdout.write("SQL> ");
        } else {
            connection.send(d);
        }
    });
}

let connectionString = `Host: ${address}; Port: ${port}; Database: ${db}; User Id: ${user}; Password: ${password};`;
let connection = new Connection(connectionString, pingTest, t);

connection.client.on('data', data => {
    data = data.toLocaleString().trim();
    if (data.toUpperCase().includes("AUTHOK")) {
        console.log(`Connected to ${address}:${port}.`);
        return;
    } else if (data.toUpperCase().includes("PONG")) {
        connection.time = performance.now() - connection.time;
        console.log(`Time: ${time} ms.`);

        T++;

        if (T < t || t === 0) {
            connection.time = performance.now();
            connection.send("PING");
        } else if (T === t) {
            closeServer();
        }
        return;
    }

    try {
        if (data.toUpperCase().includes("AUTHERR")) {
            throw new Error(data);
        }

        let o = JSON.parse(data);
        let t = 0;
        if (o['code'] === 0) {
            if (typeof o['data'] === "object") {
                console.table(o['data']);
            } else {
                console.log(o['data']);
            }
        } else {
            throw new Error(`ERR: ${o['message']}`);
        }

        if (o['time'] !== 'NOTIME') {
            t = o['time'];
        }

        if (t !== 0) {
            console.log(`SQL statement executed in ${t} ms.`);
        }
    } catch (e) {
        console.error(e.message);
    }

    if (!data.includes("AUTHOK") && !data.includes("PONG")) {
        process.stdout.write("SQL> ");
    }
});

function closeServer() {
    console.log('Connection closed');
    connection.close();
    stdin.removeAllListeners('data');
    process.exit();
}

connection.client.on('close', () => {
    closeServer();
});

connection.client.on('error', err => {
    if (err.code === 'ECONNREFUSED') {
        console.error(`Connection refused. Is server running on ${address}:${port}?`);
        process.exit();
    } else if (err.code === 'ECONNRESET') {
        console.error(`Connection reset. Maybe the server is no longer running on ${address}:${port}`);
        process.exit();
    } else if (err.code === 'ENOTFOUND') {
        console.error(`Server at '${address}' not found. Is the server address correct?`);
        process.exit();
    } else {
        console.error(err.message);
    }
});