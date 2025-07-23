#   Multi-Language Web-Based IDE


# 🚀 Project Overview
This project is a sophisticated, web-based Code Editor that functions like a lightweight, multi-language Integrated Development Environment (IDE). Built from the ground up, it provides a seamless platform for developers to write, execute, and debug code in various programming languages directly from their web browser. Its responsive design and professional interface are modeled after popular desktop editors like VS Code.

# ✨ Core Features
The editor is packed with features designed to create a productive and intuitive coding experience:

Multi-Language Execution Engine: The core of the project is its ability to run code from numerous languages, including JavaScript, Python, Java, C++, C, Dart, Go, Ruby, and PHP.

Professional Syntax Highlighting: Integrates the powerful CodeMirror.js library to provide rich, language-aware syntax highlighting and a classic "monokai" theme.

Interactive File System: Users can create, save, and load files. The UI includes a file explorer sidebar and a multi-tab interface to manage multiple files simultaneously.

Real-time Output Console: A resizable and collapsible terminal at the bottom of the screen instantly displays program output, compilation results, and runtime errors.

Keyboard Shortcuts: Implements essential shortcuts like Ctrl+R for running code and Ctrl+S for saving files, enhancing user workflow.

Comprehensive Testing Suite: Includes multiple custom-built test scripts (test_server.js, comprehensive_test.js) to validate the backend's execution capabilities for each language.

# 🛠️ Technology Stack & Tools
This project leverages a modern, full-stack JavaScript architecture to deliver a robust and responsive user experience.

# Frontend Technologies
HTML5 & CSS3: For the core structure and a responsive, modern design.

JavaScript (ES6+): Powers all the client-side interactivity, event handling, and API communication.

CodeMirror.js: The industry-standard library used for implementing the in-browser code editor with syntax highlighting, line numbers, and bracket matching.

# Backend Technologies
Node.js: Used as the backend runtime environment to handle server-side logic and code execution.

Express.js: A minimal and flexible Node.js web application framework used to build the API endpoint for code execution.

Child Process Module: A core Node.js module used to securely spawn child processes that compile and execute user-submitted code in their respective language environments (e.g., python3, javac, g++).

# Development Tools
NPM (Node Package Manager): Used for managing project dependencies like Express.

Nodemon: A development utility that automatically restarts the server upon file changes, significantly speeding up the development cycle.
