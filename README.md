# cat-cpu-monitor-vscode README / 猫猫CPU监控VS Code扩展 说明文档

```
                 _                                                                        _   _                  
   ___    __ _  | |_            ___   _ __    _   _           _ __ ___     ___    _ __   (_) | |_    ___    _ __ 
  / __|  / _` | | __|  _____   / __| | '_ \  | | | |  _____  | '_ ` _ \   / _ \  | '_ \  | | | __|  / _ \  | '__|
 | (__  | (_| | | |_  |_____| | (__  | |_) | | |_| | |_____| | | | | | | | (_) | | | | | | | | |_  | (_) | | |   
  \___|  \__,_|  \__|          \___| | .__/   \__,_|         |_| |_| |_|  \___/  |_| |_| |_|  \__|  \___/  |_|   
                                     |_|                                                                         
```


This is the README for extension "cat-cpu-monitor-vscode". 
这是VS Code扩展"cat-cpu-monitor-vscode"的说明文档。

See it on dev.to: https://dev.to/mengaidev/meet-your-new-coding-companion-cat-cpu-monitor-for-vs-code-7o6
在dev.to上查看：https://dev.to/mengaidev/meet-your-new-coding-companion-cat-cpu-monitor-for-vs-code-7o6

## Features / 功能特性

- 🐱 **Animated Cat Status Bar** / **动画猫猫状态栏**
  - Displays cute cat animations in VS Code status bar
  - 在VS Code状态栏显示可爱的猫猫动画
  - Animation speed changes based on CPU usage (faster when CPU usage is high)
  - 动画速度根据CPU使用率变化（CPU使用率高时动画更快）

- 📊 **Real-time CPU Monitoring** / **实时CPU监控**
  - Shows current CPU usage in status bar tooltip
  - 在状态栏提示中显示当前CPU使用率
  - Updates every 5 seconds
  - 每5秒更新一次

- 🔝 **Top Processes Viewer** / **进程查看器**
  - Click status bar icon to view top 8 CPU-consuming processes
  - 点击状态栏图标可查看CPU占用最高的8个进程
  - Supports Windows (PowerShell) and Linux/macOS (ps command)
  - 支持Windows(PowerShell)和Linux/macOS(ps命令)

- 🎨 **Beautiful Process Visualization** / **美观的进程可视化**
  - Colorful gradient bars show CPU usage percentage
  - 彩色渐变条显示CPU使用百分比
  - Clean, modern interface matching VS Code theme
  - 简洁现代的界面，匹配VS Code主题

![Demo Screenshot](https://github.com/MengAiDev/cat-cpu-monitor-vscode/blob/main/images/demo.png)
![Process Viewer](https://github.com/MengAiDev/cat-cpu-monitor-vscode/raw/main/images/image.png)

## Requirements / 系统要求

Test on Ubuntu. No system requirements

## Extension Settings / 扩展设置

This extension contributes the following settings:

本扩展提供以下设置：

* `catCpuMonitor.animationSpeed.base`: Base animation speed in milliseconds (default: 1000)
* `catCpuMonitor.animationSpeed.base`: 基础动画速度(毫秒，默认: 1000)
* `catCpuMonitor.updateInterval`: How often to check CPU usage in seconds (default: 5)
* `catCpuMonitor.updateInterval`: CPU使用率检查间隔(秒，默认: 5)

## Known Issues / 已知问题

None

## Release Notes / 版本说明

1. v1.0.0 First Release (Basic feature OK)
2. v1.0.1 Add icon

