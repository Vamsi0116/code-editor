const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const url = require('url');

const PORT = 3000;

// Temporary directory for code execution
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'POST' && pathname === '/execute') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const { code, language } = JSON.parse(body);
                const result = await executeCode(code, language);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    } else if (req.method === 'GET') {
        // Serve static files
        let filePath = pathname === '/' ? '/index.html' : pathname;
        filePath = path.join(__dirname, filePath);

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error: ' + error.code);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
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

server.listen(PORT, () => {
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
