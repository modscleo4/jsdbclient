const net = require('net');

let client = new net.Socket();
let stdin = process.openStdin();

let address = "localhost";
let port = 6637;
let db = "jsdb";

let user = "jsdbadmin";
let password = "";

for (let i = 0; i < process.argv.length; i++) {
    try {
        if (process.argv[i] === "-d") {
            db = process.argv[i + 1];
        } else if (process.argv[i] === "-a") {
            address = process.argv[i + 1];
        } else if (process.argv[i] === "-p") {
            port = parseInt(process.argv[i + 1]);
        } else if (process.argv[i] === "-U") {
            user = process.argv[i + 1];
        } else if (process.argv[i] === "-P") {
            password = process.argv[i + 1];
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

stdin.addListener("data", function (d) {
    d = d.toLocaleString().trim();
    if (d[0] === ".") {
        // Client internal command
        d = d.slice(1);
        if (d === "exit") {
            closeServer();
        } else {
            console.error("Unrecognized command");
        }
    } else {
        client.write(d);
    }
});

client.connect(port, address, function () {
    let credentials = JSON.stringify({'username': user, 'password': password});
    client.write('credentials: ' + credentials);
});

client.on('data', function (data) {
    data = data.toLocaleString();
    if (data.toUpperCase().includes("AUTHOK")) {
        client.write('db ' + db); // Send DB to server
        console.log('Connected to ' + address + ':' + port + ", DB " + db);
        return;
    }

    try {
        if (data.toUpperCase().includes("AUTHERR")) {
            throw new Error(data);
        }

        let output = JSON.parse(data);
        output.forEach(o => {
            if (o['code'] === 0) {
                console.log(o['data']);
            } else {
                throw new Error("ERR: " + o['message']);
            }
        });
    } catch (e) {
        console.error(e.message);
    }

});

function closeServer() {
    console.log('Connection closed');
    client.destroy();
    stdin.removeAllListeners('data');
    process.exit();
}

client.on('close', function () {
    closeServer();
});

client.on('error', function (err) {
    if (err.code === 'ECONNREFUSED') {
        console.error('Connection refused. Is server running on ' + address + ":" + port + "?");
        process.exit();
    } else if (err.code === 'ECONNRESET') {
        console.error('Connection reset. Maybe the server is no longer running on ' + address + ":" + port);
        process.exit();
    } else {
        console.error(err.message);
    }
});
