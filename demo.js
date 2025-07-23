// Demo script to show code execution working
console.log("=== Code Editor Demo ===");
console.log("Testing different programming languages...\n");

// JavaScript example
console.log("1. JavaScript Output:");
console.log("Hello from JavaScript!");
console.log("Math calculation: 10 + 5 =", 10 + 5);
console.log("Current timestamp:", new Date().toISOString());

// Array operations
const numbers = [1, 2, 3, 4, 5];
console.log("Array sum:", numbers.reduce((a, b) => a + b, 0));

// Function example
function greet(name) {
    return `Hello, ${name}! Welcome to the Code Editor.`;
}

console.log(greet("Developer"));

// Object example
const person = {
    name: "Alice",
    age: 30,
    city: "New York"
};

console.log("Person info:", JSON.stringify(person, null, 2));
