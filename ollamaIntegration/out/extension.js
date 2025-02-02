"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const ollama_1 = __importDefault(require("ollama"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ollamaIntegration" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('ollamaIntegration.start', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from ollamaIntegration!');
        const panel = vscode.window.createWebviewPanel('olLamaChat', 'olLama Chat', vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = getWebviewContent();
        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'chat') {
                const userPrompt = message.text;
                let responseText = '';
                try {
                    const message = { role: 'user', content: userPrompt };
                    const response = await ollama_1.default.chat({
                        model: 'deepseek-r1:14b',
                        messages: [message],
                        stream: true
                    });
                    for await (const part of response) {
                        //process.stdout.write(part.message.content);
                        responseText += part.message.content;
                        panel.webview.postMessage({
                            command: 'chatResponse',
                            text: responseText
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    });
    context.subscriptions.push(disposable);
}
function getWebviewContent() {
    return /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>olLama Chat</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background-color: #1e1e1e;
                color: #d4d4d4;
            }
            h1 {
                color: #61dafb;
            }
            .container {
                text-align: center;
                padding: 20px;
                border: 1px solid #333;
                border-radius: 8px;
                background-color: #252526;
                width: 90%;
                max-width: 600px;
            }
            input, button {
                padding: 10px;
                margin: 10px 0;
                border: none;
                border-radius: 4px;
                font-size: 1rem;
            }
            input {
                width: 80%;
            }
            button {
                background-color: #007acc;
                color: white;
                cursor: pointer;
            }
            button:hover {
                background-color: #005a9e;
            }
            .response {
                margin-top: 20px;
                font-size: 1.1rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>olLama Chat</h1>
            <p>Ask anything and get a response!</p>
            <input type="text" id="userInput" placeholder="Type your question here..." />
            <button id="askButton">Ask</button>
            <div class="response" id="responseContainer"></div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            const askButton = document.getElementById('askButton');
            const userInput = document.getElementById('userInput');
            const responseContainer = document.getElementById('responseContainer');

            askButton.addEventListener('click', () => {
                const text = userInput.value;//.trim();
                if (text) {
                    responseContainer.textContent = "Thinking...";
                    vscode.postMessage({command: 'chat', text});
                    // Simulate a response (replace this with actual API call logic)
                    //setTimeout(() => {
                    //    responseContainer.textContent = "You asked: " + question + ". Here's a simulated response.";
                    //}, 1500);
                } else {
                    responseContainer.textContent = "Please type a question first.";
                }
            });

            window.addEventListener('message', event => {
                const {command, text} = event.data;
                if(command === 'chatResponse'){
                    document.getElementById('responseContainer').innerText = text;
                }
            });
        </script>
    </body>
    </html>
    `;
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map