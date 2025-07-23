const http = require('http');

// Test JavaScript execution
const testData = JSON.stringify({
    code: 'console.log("Hello from JavaScript!");\nconsole.log("Math result:", 5 + 3);\nconsole.log("Current time:", new Date().toLocaleString());',
    language: 'javascript'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/execute',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
    }
};

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('JavaScript Test Result:');
        console.log(JSON.parse(data));
        
        // Test Python execution
        testPython();
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(testData);
req.end();

function testPython() {
    const pythonData = JSON.stringify({
        code: 'print("Hello from Python!")\nprint("Math result:", 5 + 3)\nimport datetime\nprint("Current time:", datetime.datetime.now())',
        language: 'python'
    });

    const pythonOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/execute',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(pythonData)
        }
    };

    const pythonReq = http.request(pythonOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('\nPython Test Result:');
            console.log(JSON.parse(data));
            
            // Test Dart execution
            testDart();
        });
    });

    pythonReq.on('error', (e) => {
        console.error(`Problem with Python request: ${e.message}`);
    });

    pythonReq.write(pythonData);
    pythonReq.end();
}

function testDart() {
    const dartData = JSON.stringify({
        code: 'void main() {\n  print("Hello from Dart!");\n  print("Math result: ${5 + 3}");\n  print("Current time: ${DateTime.now()}");\n}',
        language: 'dart'
    });

    const dartOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/execute',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dartData)
        }
    };

    const dartReq = http.request(dartOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('\nDart Test Result:');
            console.log(JSON.parse(data));
            process.exit(0);
        });
    });

    dartReq.on('error', (e) => {
        console.error(`Problem with Dart request: ${e.message}`);
    });

    dartReq.write(dartData);
    dartReq.end();
}
