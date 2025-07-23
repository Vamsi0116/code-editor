class CodeEditor {
    constructor() {
        this.editor = null;
        this.currentFile = 'main.js';
        this.files = {
            'main.js': {
                content: '// Welcome to CodeEditor!\n// Select a language and start coding\n\nconsole.log("Hello, World!");',
                language: 'javascript'
            }
        };
        console.log('🚀 CodeEditor initialized'); // Debug log
        this.init();
    }

    init() {
        this.initializeEditor();
        this.bindEvents();
        this.updateFileList();
        this.loadSampleCode();
        this.initializeResizer();
    }

    initializeEditor() {
        this.editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'monokai',
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            lineWrapping: true,
            extraKeys: {
                'Ctrl-S': () => this.saveFile(),
                'Ctrl-R': () => this.runCode(),
                'F5': () => this.runCode()
            }
        });

        this.editor.setValue(this.files[this.currentFile].content);
    }

    bindEvents() {
        // Language selection
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // Run button
        document.getElementById('runBtn').addEventListener('click', () => {
            this.runCode();
        });

        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveFile();
        });

        // Load button
        document.getElementById('loadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        // File input
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.loadFile(e.target.files[0]);
        });

        // New file button
        document.getElementById('newFileBtn').addEventListener('click', () => {
            this.createNewFile();
        });

        // Clear output
        document.getElementById('clearOutput').addEventListener('click', () => {
            this.clearOutput();
        });

        // Toggle output panel
        document.getElementById('toggleOutput').addEventListener('click', () => {
            this.toggleOutputPanel();
        });

        // Test button
        document.getElementById('testBtn').addEventListener('click', () => {
            this.runTest();
        });

        // Editor change event
        this.editor.on('change', () => {
            this.files[this.currentFile].content = this.editor.getValue();
        });
    }

    changeLanguage(language) {
        const modeMap = {
            'javascript': 'javascript',
            'python': 'python',
            'java': 'text/x-java',
            'cpp': 'text/x-c++src',
            'c': 'text/x-csrc',
            'dart': 'dart',
            'html': 'xml',
            'css': 'css',
            'php': 'php',
            'ruby': 'ruby',
            'go': 'go'
        };

        this.editor.setOption('mode', modeMap[language] || 'javascript');
        this.files[this.currentFile].language = language;
        
        // Update file extension
        const baseName = this.currentFile.split('.')[0];
        const extensionMap = {
            'javascript': 'js',
            'python': 'py',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'dart': 'dart',
            'html': 'html',
            'css': 'css',
            'php': 'php',
            'ruby': 'rb',
            'go': 'go'
        };
        
        const newFileName = `${baseName}.${extensionMap[language]}`;
        if (newFileName !== this.currentFile) {
            this.files[newFileName] = this.files[this.currentFile];
            delete this.files[this.currentFile];
            this.currentFile = newFileName;
            this.updateTabs();
            this.updateFileList();
        }
    }

    async runCode() {
        const code = this.editor.getValue();
        const language = this.files[this.currentFile].language;
        
        console.log(`Running ${language} code...`); // Debug log
        this.showOutput(`🚀 Running ${language} code...`, 'info');
        
        if (!code.trim()) {
            this.showOutput('❌ No code to execute. Please write some code first.', 'error');
            return;
        }
        
        try {
            let result;
            switch (language) {
                case 'javascript':
                    result = await this.runJavaScript(code);
                    break;
                case 'python':
                case 'java':
                case 'cpp':
                case 'c':
                case 'dart':
                case 'go':
                case 'ruby':
                case 'php':
                    result = await this.runServerSideCode(code, language);
                    break;
                case 'html':
                    result = this.runHTML(code);
                    break;
                case 'css':
                    result = this.runCSS(code);
                    break;
                default:
                    result = `❌ Language '${language}' is not supported yet.\nSupported languages: JavaScript, Python, Java, C++, C, Dart, Go, Ruby, PHP, HTML, CSS`;
            }
            
            this.showOutput(result, result.includes('❌') ? 'error' : 'success');
        } catch (error) {
            console.error('Run code error:', error); // Debug log
            this.showOutput(`❌ Execution Error:\n${error.message}`, 'error');
        }
    }

    async runJavaScript(code) {
        // Create a safe execution environment
        const originalConsole = console.log;
        let output = '';
        
        // Override console.log to capture output
        console.log = (...args) => {
            output += args.join(' ') + '\n';
        };
        
        try {
            // Use Function constructor for safer evaluation
            const func = new Function(code);
            const result = func();
            
            if (result !== undefined) {
                output += `Result: ${result}\n`;
            }
            
            return output || 'Code executed successfully (no output)';
        } catch (error) {
            throw new Error(error.message);
        } finally {
            // Restore original console.log
            console.log = originalConsole;
        }
    }

    async runPython(code) {
        // This is a simulation - in a real implementation, you'd need a Python interpreter
        // You could use Pyodide (Python in WebAssembly) or send to a backend server
        return `Python execution simulation:\n\nCode:\n${code}\n\nNote: For actual Python execution, you would need:\n1. Pyodide (Python in browser)\n2. Backend server with Python interpreter\n3. Docker container for sandboxed execution`;
    }

    async runServerSideCode(code, language) {
        try {
            console.log(`Executing ${language} code:`, code); // Debug log
            
            const response = await fetch('/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language })
            });

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Server response:', result); // Debug log
            
            if (result.error) {
                return `❌ Error:\n${result.output}`;
            }
            
            return `✅ ${language.toUpperCase()} Output:\n${result.output}`;
        } catch (error) {
            console.error('Execution error:', error); // Debug log
            // Fallback for when server is not running
            if (error.message.includes('fetch') || error.name === 'TypeError') {
                return `❌ Server Connection Error:\n\nThe backend server is not running or not accessible.\n\nTo fix this:\n1. Make sure the server is running: node simple_server.js\n2. Check if port 3000 is available\n3. Refresh the page\n\nError details: ${error.message}`;
            }
            return `❌ Execution Error:\n${error.message}`;
        }
    }

    runHTML(code) {
        // Create a preview window for HTML
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(code);
        previewWindow.document.close();
        return 'HTML code opened in new window';
    }

    runCSS(code) {
        return `CSS code:\n${code}\n\nNote: CSS needs to be applied to HTML elements to see effects.`;
    }

    showOutput(message, type = 'info') {
        const output = document.getElementById('output');
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = `[${timestamp}] ${message}\n`;
        
        console.log('Showing output:', formattedMessage); // Debug log
        
        const span = document.createElement('span');
        span.className = type;
        span.textContent = formattedMessage;
        
        output.appendChild(span);
        output.scrollTop = output.scrollHeight;
        
        // Make sure output panel is visible
        const outputPanel = document.querySelector('.output-panel');
        if (outputPanel.classList.contains('collapsed')) {
            this.toggleOutputPanel();
        }
    }

    clearOutput() {
        document.getElementById('output').innerHTML = '';
    }

    toggleOutputPanel() {
        const outputPanel = document.querySelector('.output-panel');
        const toggleBtn = document.getElementById('toggleOutput');
        const icon = toggleBtn.querySelector('i');
        
        outputPanel.classList.toggle('collapsed');
        toggleBtn.classList.toggle('collapsed');
        
        if (outputPanel.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-up';
            toggleBtn.title = 'Show Output Panel';
        } else {
            icon.className = 'fas fa-chevron-down';
            toggleBtn.title = 'Hide Output Panel';
        }
    }

    initializeResizer() {
        const outputPanel = document.querySelector('.output-panel');
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;

        const handleMouseDown = (e) => {
            if (e.target === outputPanel && e.offsetY <= 6) {
                isResizing = true;
                startY = e.clientY;
                startHeight = parseInt(document.defaultView.getComputedStyle(outputPanel).height, 10);
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                e.preventDefault();
            }
        };

        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const deltaY = startY - e.clientY;
            const newHeight = startHeight + deltaY;
            const minHeight = 150;
            const maxHeight = window.innerHeight * 0.6;
            
            if (newHeight >= minHeight && newHeight <= maxHeight) {
                outputPanel.style.height = newHeight + 'px';
            }
        };

        const handleMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        outputPanel.addEventListener('mousedown', handleMouseDown);
    }

    runTest() {
        console.log('🧪 Running test...');
        this.showOutput('🧪 Test button clicked!', 'info');
        this.showOutput('✅ Output system is working!', 'success');
        this.showOutput('🔧 Server connection test...', 'info');
        
        // Test server connection
        fetch('/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                code: 'console.log("Server test successful!");', 
                language: 'javascript' 
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                this.showOutput('✅ Server connection successful!', 'success');
                this.showOutput(`📤 Server output: ${result.output}`, 'success');
            } else {
                this.showOutput('❌ Server test failed', 'error');
            }
        })
        .catch(error => {
            this.showOutput(`❌ Server connection error: ${error.message}`, 'error');
        });
    }

    saveFile() {
        const content = this.editor.getValue();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = this.currentFile;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showOutput(`File saved: ${this.currentFile}`, 'success');
    }

    loadFile(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const fileName = file.name;
            
            // Detect language from file extension
            const extension = fileName.split('.').pop().toLowerCase();
            const languageMap = {
                'js': 'javascript',
                'py': 'python',
                'java': 'java',
                'cpp': 'cpp',
                'c': 'c',
                'dart': 'dart',
                'html': 'html',
                'css': 'css',
                'php': 'php',
                'rb': 'ruby',
                'go': 'go'
            };
            
            const language = languageMap[extension] || 'javascript';
            
            this.files[fileName] = {
                content: content,
                language: language
            };
            
            this.currentFile = fileName;
            this.editor.setValue(content);
            this.changeLanguage(language);
            document.getElementById('languageSelect').value = language;
            
            this.updateTabs();
            this.updateFileList();
            this.showOutput(`File loaded: ${fileName}`, 'success');
        };
        
        reader.readAsText(file);
    }

    createNewFile() {
        const fileName = prompt('Enter file name (with extension):');
        if (!fileName) return;
        
        this.files[fileName] = {
            content: '',
            language: 'javascript'
        };
        
        this.currentFile = fileName;
        this.editor.setValue('');
        this.updateTabs();
        this.updateFileList();
        this.showOutput(`New file created: ${fileName}`, 'success');
    }

    updateTabs() {
        const tabsContainer = document.querySelector('.editor-tabs');
        tabsContainer.innerHTML = '';
        
        Object.keys(this.files).forEach(fileName => {
            const tab = document.createElement('div');
            tab.className = `tab ${fileName === this.currentFile ? 'active' : ''}`;
            tab.dataset.file = fileName;
            
            tab.innerHTML = `
                <span>${fileName}</span>
                <i class="fas fa-times tab-close"></i>
            `;
            
            tab.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-close')) {
                    this.closeFile(fileName);
                } else {
                    this.switchFile(fileName);
                }
            });
            
            tabsContainer.appendChild(tab);
        });
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        
        Object.keys(this.files).forEach(fileName => {
            const fileItem = document.createElement('div');
            fileItem.className = `file-item ${fileName === this.currentFile ? 'active' : ''}`;
            fileItem.innerHTML = `
                <i class="fas fa-file-code"></i>
                <span>${fileName}</span>
            `;
            
            fileItem.addEventListener('click', () => {
                this.switchFile(fileName);
            });
            
            fileList.appendChild(fileItem);
        });
    }

    switchFile(fileName) {
        if (this.files[fileName]) {
            this.currentFile = fileName;
            this.editor.setValue(this.files[fileName].content);
            this.changeLanguage(this.files[fileName].language);
            document.getElementById('languageSelect').value = this.files[fileName].language;
            this.updateTabs();
            this.updateFileList();
        }
    }

    closeFile(fileName) {
        if (Object.keys(this.files).length === 1) {
            alert('Cannot close the last file');
            return;
        }
        
        delete this.files[fileName];
        
        if (fileName === this.currentFile) {
            const remainingFiles = Object.keys(this.files);
            this.switchFile(remainingFiles[0]);
        } else {
            this.updateTabs();
            this.updateFileList();
        }
    }

    loadSampleCode() {
        const samples = {
            'javascript': '// JavaScript Example\nconsole.log("Hello, JavaScript!");\n\n// Function example\nfunction greet(name) {\n    return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
            'python': '# Python Example\nprint("Hello, Python!")\n\n# Function example\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
            'dart': '// Dart Example\nvoid main() {\n  print("Hello, Dart!");\n  \n  // Function example\n  String greet(String name) {\n    return "Hello, $name!";\n  }\n  \n  print(greet("World"));\n  \n  // List example\n  var numbers = [1, 2, 3, 4, 5];\n  print("Numbers: $numbers");\n  \n  // Class example\n  var person = Person("Alice", 25);\n  person.introduce();\n}\n\nclass Person {\n  String name;\n  int age;\n  \n  Person(this.name, this.age);\n  \n  void introduce() {\n    print("Hi, I\'m $name and I\'m $age years old.");\n  }\n}',
            'html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello HTML</title>\n</head>\n<body>\n    <h1>Hello, HTML!</h1>\n    <p>This is a sample HTML page.</p>\n</body>\n</html>',
            'css': '/* CSS Example */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n    margin: 0;\n    padding: 20px;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}',
            'java': '// Java Example\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
            'cpp': '// C++ Example\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}'
        };

        // Add sample files
        Object.entries(samples).forEach(([lang, code]) => {
            const extension = {
                'javascript': 'js',
                'python': 'py',
                'dart': 'dart',
                'html': 'html',
                'css': 'css',
                'java': 'java',
                'cpp': 'cpp'
            }[lang];
            
            const fileName = `sample.${extension}`;
            this.files[fileName] = {
                content: code,
                language: lang
            };
        });

        this.updateFileList();
    }
}

// Initialize the editor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CodeEditor();
});
