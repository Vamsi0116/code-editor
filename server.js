const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Temporary directory for code execution
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

// Code execution endpoint
app.post('/execute', (req, res) => {
    const { code, language } = req.body;
    
    if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required' });
    }

    executeCode(code, language)
        .then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});

async function executeCode(code, language) {
    const timestamp = Date.now();
    let filename, command;

    try {
        switch (language) {
            case 'javascript':
                filename = `temp_${timestamp}.js`;
                fs.writeFileSync(path.join(TEMP_DIR, filename), code);
                command = `node ${path.join(TEMP_DIR, filename)}`;
                break;

            case 'python':
                filename = `temp_${timestamp}.py`;
                fs.writeFileSync(path.join(TEMP_DIR, filename), code);
                command = `python3 ${path.join(TEMP_DIR, filename)}`;
                break;

            case 'dart':
                filename = `temp_${timestamp}.dart`;
                fs.writeFileSync(path.join(TEMP_DIR, filename), code);
                command = `dart ${path.join(TEMP_DIR, filename)}`;
                break;

            case 'java':
                const className = extractJavaClassName(code) || 'Main';
                filename = `${className}.java`;
                fs.writeFileSync(path.join(TEMP_DIR, filename), code);
                command = `cd ${TEMP_DIR} && javac ${filename} && java ${className}`;
                break;

            case 'cpp':
                filename = `temp_${timestamp}.cpp`;
                const executable = `temp_${timestamp}`;
                fs.writeFileSync(path.join(TEMP_DIR, filename), code);
                command = `cd ${TEMP_DIR} && g++ ${filename} -o ${executable} && ./${executable}`;
                break;

            case 'c':
                filename = `temp_${timestamp}.c`;
                const cExecutable = `temp_${timestamp}`;
                fs.writeFileSync(path.join(TEMP_DIR, filename), code);
                command = `cd ${TEMP_DIR} && gcc ${filename} -o ${cExecutable} && ./${cExecutable}`;
                break;

            case 'go':
                filename = `temp_${timestamp}.go`;
                fs.writeFileSync(path.join(TEMP_DIR, filename), code);
                command = `cd ${TEMP_DIR} && go run ${filename}`;
                break;

            case 'ruby':
                filename = `temp_${timestamp}.rb`;
                fs.writeFileSync(path.join(TEMP_DIR, filename), code);
                command = `ruby ${path.join(TEMP_DIR, filename)}`;
                break;

            case 'php':
                filename = `temp_${timestamp}.php`;
                fs.writeFileSync(path.join(TEMP_DIR, filename), code);
                command = `php ${path.join(TEMP_DIR, filename)}`;
                break;

            default:
                throw new Error(`Unsupported language: ${language}`);
        }

        return new Promise((resolve, reject) => {
            exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                // Clean up temporary files
                try {
                    if (fs.existsSync(path.join(TEMP_DIR, filename))) {
                        fs.unlinkSync(path.join(TEMP_DIR, filename));
                    }
                    // Clean up compiled files
                    if (language === 'java') {
                        const classFile = filename.replace('.java', '.class');
                        if (fs.existsSync(path.join(TEMP_DIR, classFile))) {
                            fs.unlinkSync(path.join(TEMP_DIR, classFile));
                        }
                    }
                    if (language === 'cpp' || language === 'c') {
                        const execFile = path.join(TEMP_DIR, `temp_${timestamp}`);
                        if (fs.existsSync(execFile)) {
                            fs.unlinkSync(execFile);
                        }
                    }
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }

                if (error) {
                    resolve({
                        success: false,
                        output: stderr || error.message,
                        error: true
                    });
                } else {
                    resolve({
                        success: true,
                        output: stdout || 'Code executed successfully (no output)',
                        error: false
                    });
                }
            });
        });

    } catch (error) {
        throw new Error(`Execution setup failed: ${error.message}`);
    }
}

function extractJavaClassName(code) {
    const match = code.match(/public\s+class\s+(\w+)/);
    return match ? match[1] : null;
}

// File operations endpoints
app.post('/save-file', (req, res) => {
    const { filename, content } = req.body;
    
    if (!filename || content === undefined) {
        return res.status(400).json({ error: 'Filename and content are required' });
    }

    try {
        const filePath = path.join(__dirname, 'user_files', filename);
        const dir = path.dirname(filePath);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, content);
        res.json({ success: true, message: `File ${filename} saved successfully` });
    } catch (error) {
        res.status(500).json({ error: `Failed to save file: ${error.message}` });
    }
});

app.get('/load-file/:filename', (req, res) => {
    const { filename } = req.params;
    
    try {
        const filePath = path.join(__dirname, 'user_files', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        res.json({ success: true, content });
    } catch (error) {
        res.status(500).json({ error: `Failed to load file: ${error.message}` });
    }
});

app.get('/list-files', (req, res) => {
    try {
        const userFilesDir = path.join(__dirname, 'user_files');
        
        if (!fs.existsSync(userFilesDir)) {
            return res.json({ files: [] });
        }
        
        const files = fs.readdirSync(userFilesDir);
        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: `Failed to list files: ${error.message}` });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Code Editor Server is running' });
});

app.listen(PORT, () => {
    console.log(`Code Editor Server running on http://localhost:${PORT}`);
    console.log('Supported languages: JavaScript, Python, Java, C++, C, Dart, Go, Ruby, PHP');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    
    // Clean up temp directory
    if (fs.existsSync(TEMP_DIR)) {
        const files = fs.readdirSync(TEMP_DIR);
        files.forEach(file => {
            fs.unlinkSync(path.join(TEMP_DIR, file));
        });
        fs.rmdirSync(TEMP_DIR);
    }
    
    process.exit(0);
});
