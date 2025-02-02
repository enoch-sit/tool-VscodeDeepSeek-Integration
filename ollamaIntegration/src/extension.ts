// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ollama from 'ollama';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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
        const panel = vscode.window.createWebviewPanel(
   'olLamaChat',
   'olLama Chat',
   vscode.ViewColumn.One,
   {enableScripts:true}
  );
  panel.webview.html = getWebviewContent();
        panel.webview.onDidReceiveMessage(async (message:any)=>{
            if (message.command === 'chat'){
                const userPrompt = message.text;
                let responseText = '';
                try {
                    const message = { role: 'user', content: userPrompt };
                    const response = await ollama.chat({ 
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
                } catch (error) {
                    console.log(error);
                }
            }
        });
   
 });

 context.subscriptions.push(disposable);
}

function getWebviewContent(): string {
    return /* html */`
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
export function deactivate() {}
