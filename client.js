const net = require('net');

let client = new net.Socket();

let address = "";
let port = 0;
let db = "";

for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "-d") {
        db = process.argv[i + 1];
    } else if (process.argv[i] === "-a") {
        address = process.argv[i + 1];
    } else if (process.argv[i] === "-p") {
        port = parseInt(process.argv[i + 1]);
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

let stdin = process.openStdin();

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
    client.write('db ' + db); // Send DB to server
    console.log('Connected to ' + address + ':' + port + ", DB " + db);
});

client.on('data', function (data) {
    try {
        let output = JSON.parse(data.toLocaleString());
        output.forEach(o => {
            console.log(o);
        });
    } catch (e) {
        console.log(data.toLocaleString());
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
