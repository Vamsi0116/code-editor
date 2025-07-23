# Code Editor - Multi-Language IDE

A web-based code editor similar to VSCode that supports multiple programming languages with syntax highlighting and code execution capabilities.

## Features

- **Multi-Language Support**: JavaScript, Python, Java, C++, C, Dart, HTML, CSS, PHP, Ruby, Go
- **Syntax Highlighting**: Powered by CodeMirror with Monokai theme
- **Code Execution**: Run code directly in the browser or via backend server
- **File Management**: Create, save, load, and manage multiple files
- **Tabbed Interface**: Work with multiple files simultaneously
- **Real-time Output**: See execution results and errors instantly
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Option 1: Frontend Only (Limited Execution)
1. Open `index.html` in your web browser
2. Start coding! JavaScript will run in the browser

### Option 2: Full Backend Support (Recommended)
1. Install Node.js (version 14 or higher)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser and go to `http://localhost:3000`

## Supported Languages

### Frontend Execution (Browser)
- **JavaScript**: Full execution support
- **HTML**: Opens in new window
- **CSS**: Code preview

### Backend Execution (Server Required)
- **Python**: Requires Python 3 installed
- **Java**: Requires JDK installed
- **C++**: Requires g++ compiler
- **C**: Requires gcc compiler
- **Dart**: Requires Dart SDK installed
- **Go**: Requires Go runtime
- **Ruby**: Requires Ruby interpreter
- **PHP**: Requires PHP interpreter

## Installation Requirements

### For Backend Language Support:

#### Python
```bash
# Ubuntu/Debian
sudo apt install python3

# macOS
brew install python3

# Windows
# Download from python.org
```

#### Java
```bash
# Ubuntu/Debian
sudo apt install default-jdk

# macOS
brew install openjdk

# Windows
# Download from oracle.com or adoptopenjdk.net
```

#### C/C++
```bash
# Ubuntu/Debian
sudo apt install build-essential

# macOS
xcode-select --install

# Windows
# Install MinGW or Visual Studio
```

#### Dart
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install apt-transport-https
wget -qO- https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
wget -qO- https://storage.googleapis.com/download.dartlang.org/linux/debian/dart_stable.list | sudo tee /etc/apt/sources.list.d/dart_stable.list
sudo apt-get update
sudo apt-get install dart

# macOS
brew tap dart-lang/dart
brew install dart

# Windows
# Download from https://dart.dev/get-dart
```

#### Go
```bash
# Ubuntu/Debian
sudo apt install golang-go

# macOS
brew install go

# Windows
# Download from golang.org
```

#### Ruby
```bash
# Ubuntu/Debian
sudo apt install ruby

# macOS
brew install ruby

# Windows
# Download from ruby-lang.org
```

#### PHP
```bash
# Ubuntu/Debian
sudo apt install php

# macOS
brew install php

# Windows
# Download from php.net
```

## Usage

### Basic Operations
1. **Select Language**: Use the dropdown to choose your programming language
2. **Write Code**: Type in the editor with syntax highlighting
3. **Run Code**: Click the "Run" button or press Ctrl+R
4. **Save File**: Click "Save" or press Ctrl+S
5. **Load File**: Click "Load" to open existing files

### File Management
- **New File**: Click the "New File" button in the sidebar
- **Switch Files**: Click on file names in the sidebar or tabs
- **Close Files**: Click the X on file tabs

### Keyboard Shortcuts
- `Ctrl+S`: Save current file
- `Ctrl+R` or `F5`: Run code
- `Ctrl+/`: Toggle line comment (CodeMirror feature)

## Project Structure

```
editor/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # Frontend JavaScript
├── server.js           # Backend Node.js server
├── package.json        # Node.js dependencies
├── README.md           # This file
├── temp/               # Temporary files (auto-created)
└── user_files/         # Saved user files (auto-created)
```

## API Endpoints

### POST /execute
Execute code in specified language
```json
{
  "code": "console.log('Hello World');",
  "language": "javascript"
}
```

### POST /save-file
Save file to server
```json
{
  "filename": "example.js",
  "content": "console.log('Hello');"
}
```

### GET /load-file/:filename
Load file from server

### GET /list-files
Get list of saved files

## Security Considerations

⚠️ **Important**: This editor executes code on your system. For production use:

1. **Sandboxing**: Implement proper code sandboxing
2. **Input Validation**: Validate all user inputs
3. **Resource Limits**: Set execution time and memory limits
4. **File System Protection**: Restrict file system access
5. **Network Isolation**: Limit network access for executed code

## Customization

### Adding New Languages
1. Add language option to `languageSelect` in `index.html`
2. Add mode mapping in `script.js` `changeLanguage()` method
3. Add execution logic in `server.js` `executeCode()` function
4. Include appropriate CodeMirror mode files

### Themes
Change the CodeMirror theme by:
1. Including new theme CSS file
2. Updating the theme option in `initializeEditor()`

### Extensions
The editor can be extended with:
- Auto-completion
- Error highlighting
- Code formatting
- Git integration
- Plugin system

## Troubleshooting

### Common Issues

1. **Code not executing**: Ensure required language runtime is installed
2. **Server not starting**: Check if port 3000 is available
3. **File not saving**: Check write permissions in project directory
4. **Syntax highlighting not working**: Ensure CodeMirror mode files are loaded

### Error Messages
- `Language not supported`: Add language support in server.js
- `Execution timeout`: Code took too long to execute (10s limit)
- `File not found`: Check file path and permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify for your projects.

## Future Enhancements

- [ ] Auto-completion and IntelliSense
- [ ] Debugger integration
- [ ] Git version control
- [ ] Plugin system
- [ ] Collaborative editing
- [ ] Docker integration for sandboxing
- [ ] More language support
- [ ] Code formatting tools
- [ ] Terminal integration
- [ ] Project management features
