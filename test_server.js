const http = require('http');

console.log('🔧 Testing Code Editor Server...');

function testExecution(code, language) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ code, language });
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/execute',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    console.log(`✅ ${language.toUpperCase()} Test Result:`);
                    console.log('Success:', result.success);
                    console.log('Output:', result.output);
                    console.log('---');
                    resolve(result);
                } catch (e) {
                    console.log(`❌ ${language.toUpperCase()} Parse Error:`, e.message);
                    console.log('Raw response:', responseData);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`❌ ${language.toUpperCase()} Request Error:`, e.message);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    try {
        // Test JavaScript
        await testExecution('console.log("Hello from JavaScript!");', 'javascript');
        
        // Test Python
        await testExecution('print("Hello from Python!")', 'python');
        
        // Test Dart
        await testExecution('void main() { print("Hello from Dart!"); }', 'dart');
        
        console.log('🎉 All server tests completed!');
    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

runTests();
