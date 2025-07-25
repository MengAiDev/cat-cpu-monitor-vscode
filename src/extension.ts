import * as vscode from 'vscode';
import * as os from 'os';
import * as child_process from 'child_process';

// Cat animation frames
const CAT_FRAMES = [
    '=^..^=',
    '=^o.o^=',
    '=^O.O^=',
    '=^o.o^=',
    '=^..^=',
    '=^ - ^='
];

// Get CPU usage
function getCpuUsage(): Promise<number> {
    return new Promise((resolve) => {
        const stats1 = getCpuInfo();
        setTimeout(() => {
            const stats2 = getCpuInfo();
            const idleDiff = stats2.idle - stats1.idle;
            const totalDiff = stats2.total - stats1.total;
            const usage = 100 - (idleDiff / totalDiff * 100);
            resolve(usage);
        }, 1000);
    });
}

function getCpuInfo() {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;
    
    for (const cpu of cpus) {
        for (const type in cpu.times) {
            total += (cpu.times as any)[type];
        }
        idle += cpu.times.idle;
    }
    
    return { idle, total };
}

// Get process list
function getTopProcesses(): Thenable<{ name: string; cpu: number }[]> {
    return new Promise((resolve) => {
        const platform = process.platform;
        let command = '';
        
        if (platform === 'win32') {
            command = 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -First 8 Name, CPU | Format-Table -AutoSize"';
        } else {
            command = 'ps -A -o %cpu,comm | sort -nr | head -n 8';
        }
        
        child_process.exec(command, (error, stdout) => {
            if (error) {
                vscode.window.showErrorMessage(`Failed to get process list: ${error.message}`);
                resolve([]);
                return;
            }
            
            const processes: { name: string; cpu: number }[] = [];
            const lines = stdout.trim().split('\n');
            
            // Skip header line
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                if (platform === 'win32') {
                    // Windows PowerShell output processing
                    const match = line.match(/(\S+)\s+([\d.]+)/);
                    if (match && match.length >= 3) {
                        processes.push({
                            name: match[1],
                            cpu: parseFloat(match[2])
                        });
                    }
                } else {
                    // Unix output processing
                    const match = line.match(/([\d.]+)\s+(.+)/);
                    if (match && match.length >= 3) {
                        processes.push({
                            name: match[2],
                            cpu: parseFloat(match[1])
                        });
                    }
                }
            }
            
            resolve(processes);
        });
    });
}

export function activate(context: vscode.ExtensionContext) {
    // Create status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '=^..^=';
    statusBarItem.tooltip = 'CPU Usage Monitor';
    statusBarItem.command = 'catCpuMonitor.showProcesses';
    statusBarItem.show();
    
    let animationIndex = 0;
    let animationSpeed = 1000; // 默认动画速度 (ms)
    let animationInterval: NodeJS.Timeout | null = null;
    
    // Update cat animation
    function updateCatAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
        }
        
        statusBarItem.text = CAT_FRAMES[animationIndex];
        animationIndex = (animationIndex + 1) % CAT_FRAMES.length;
        
        animationInterval = setInterval(() => {
            statusBarItem.text = CAT_FRAMES[animationIndex];
            animationIndex = (animationIndex + 1) % CAT_FRAMES.length;
        }, animationSpeed);
    }
    
    // Initial animation
    updateCatAnimation();
    
    // Periodically update CPU usage
    setInterval(async () => {
        try {
            const usage = await getCpuUsage();
            const roundedUsage = Math.round(usage * 10) / 10;
            
            // Adjust animation speed based on CPU usage
            // Higher CPU usage = faster animation
            if (usage < 20) {
                animationSpeed = 1000;
            } else if (usage < 40) {
                animationSpeed = 800;
            } else if (usage < 60) {
                animationSpeed = 600;
            } else if (usage < 80) {
                animationSpeed = 400;
            } else {
                animationSpeed = 200;
            }
            
            // Update status bar tooltip
            statusBarItem.tooltip = `CPU Usage: ${roundedUsage}%`;
            
            // Update animation
            updateCatAnimation();
        } catch (error) {
            console.error('Failed to get CPU usage:', error);
        }
    }, 5000);
    
    // Register command
    const showProcessesCommand = vscode.commands.registerCommand('catCpuMonitor.showProcesses', async () => {
        const processes = await getTopProcesses();
        
        if (processes.length === 0) {
            vscode.window.showInformationMessage('No process information found');
            return;
        }
        
        // Create Webview panel to show process info
        const panel = vscode.window.createWebviewPanel(
            'catCpuMonitor',
            'Top 8 CPU Processes',
            vscode.ViewColumn.One,
            {}
        );
        
        // Generate HTML content
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Top 8 CPU Processes</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                        padding: 20px;
                    }
                    h1 {
                        color: #ff7bac;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .process-list {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }
                    .process-item {
                        background: var(--vscode-sideBar-background);
                        border-radius: 8px;
                        padding: 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        transition: transform 0.2s;
                    }
                    .process-item:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }
                    .process-name {
                        font-weight: 600;
                        font-size: 14px;
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .process-cpu {
                        background: linear-gradient(90deg, #6fc3df, #ff7bac);
                        color: white;
                        border-radius: 12px;
                        padding: 4px 12px;
                        font-size: 13px;
                        font-weight: 600;
                        min-width: 70px;
                        text-align: center;
                    }
                    .cpu-bar {
                        height: 8px;
                        background: var(--vscode-editor-lineHighlightBorder);
                        border-radius: 4px;
                        margin-top: 8px;
                        overflow: hidden;
                    }
                    .cpu-bar-inner {
                        height: 100%;
                        background: linear-gradient(90deg, #6fc3df, #ff7bac);
                        border-radius: 4px;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 20px;
                    }
                    .cat-icon {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="cat-icon">=^..^=</div>
                        <h1>Top 8 CPU Processes</h1>
                    </div>
                    <div class="process-list">
        `;
        
        // Add process items
        processes.forEach(process => {
            html += `
                <div class="process-item">
                    <div class="process-name">${process.name}</div>
                    <div class="process-cpu">${process.cpu.toFixed(1)}%</div>
                </div>
                <div class="cpu-bar">
                    <div class="cpu-bar-inner" style="width: ${process.cpu}%"></div>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
            </body>
            </html>
        `;
        
        panel.webview.html = html;
    });
    
    context.subscriptions.push(statusBarItem, showProcessesCommand);
}

export function deactivate() {
    // Cleanup work
}
