const http = require('http');

console.log('🚀 Code Editor - Comprehensive Language Test');
console.log('='.repeat(50));

const tests = [
    {
        name: 'JavaScript',
        language: 'javascript',
        code: `
console.log("✅ JavaScript is working!");
console.log("Math: 15 + 25 =", 15 + 25);
console.log("Array:", [1, 2, 3, 4, 5]);
console.log("Date:", new Date().toLocaleString());

function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
console.log("Factorial of 5:", factorial(5));
        `
    },
    {
        name: 'Python',
        language: 'python',
        code: `
print("✅ Python is working!")
print("Math: 15 + 25 =", 15 + 25)
print("List:", [1, 2, 3, 4, 5])

import datetime
print("Date:", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)

print("Factorial of 5:", factorial(5))

# List comprehension
squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)
        `
    },
    {
        name: 'Dart',
        language: 'dart',
        code: `
void main() {
  print("✅ Dart is working!");
  print("Math: 15 + 25 = \${15 + 25}");
  print("List: \${[1, 2, 3, 4, 5]}");
  print("Date: \${DateTime.now()}");
  
  print("Factorial of 5: \${factorial(5)}");
  
  // Class example
  var person = Person("Alice", 25);
  person.introduce();
  
  // Map example
  var colors = {"red": "#FF0000", "green": "#00FF00", "blue": "#0000FF"};
  print("Colors: \$colors");
}

int factorial(int n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

class Person {
  String name;
  int age;
  
  Person(this.name, this.age);
  
  void introduce() {
    print("Hi, I'm \$name and I'm \$age years old.");
  }
}
        `
    }
];

async function executeCode(code, language) {
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
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    for (const test of tests) {
        console.log(`\n🔄 Testing ${test.name}...`);
        console.log('-'.repeat(30));
        
        try {
            const result = await executeCode(test.code, test.language);
            
            if (result.success) {
                console.log(`✅ ${test.name} executed successfully!`);
                console.log('📤 Output:');
                console.log(result.output);
            } else {
                console.log(`❌ ${test.name} failed:`);
                console.log(result.output);
            }
        } catch (error) {
            console.log(`❌ ${test.name} error:`, error.message);
        }
        
        // Wait a bit between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('='.repeat(50));
    process.exit(0);
}

runTests();
