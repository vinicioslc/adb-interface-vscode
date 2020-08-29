# 🔌 ADB Interface for VSCode

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fvinicioslc%2Fadb-interface-vscode%2Fbadge%3Fref%3Dproduction&style=flat-square)](https://actions-badge.atrox.dev/vinicioslc/adb-interface-vscode/goto?ref=production)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/vinicioslc.adb-interface-vscode?style=flat-square)
![GitHub](https://img.shields.io/github/license/vinicioslc/adb-interface-vscode?style=flat-square)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/vinicioslc.adb-interface-vscode?style=flat-square)
![Visual Studio Marketplace Rating (Stars)](https://img.shields.io/visual-studio-marketplace/stars/vinicioslc.adb-interface-vscode?style=flat-square)
<a href="https://codeclimate.com/github/vinicioslc/adb-interface-vscode/maintainability">
<img src="https://api.codeclimate.com/v1/badges/b9fd814b1bdf974a1d16/maintainability" /></a>
<a href="https://ko-fi.com/vinicioslc" target="_blank"><img src="https://i.imgur.com/aV6DDA7.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important; box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" > </a>

<div style="text-align:center"><img src="https://raw.githubusercontent.com/vinicioslc/adb-interface-vscode/production/media/icon.png" width="200" /></div>


This simple ADB-Wrapper try makes easy connect to android devices over wifi, without console use, and do other things.

Chinese Guide [简体中文指南](https://www.jianshu.com/p/fb8eebc8a2c0)

You can help with
[Code](https://github.com/vinicioslc/adb-interface-vscode/issues)
or with
[Energy](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TKRZ7F4FV4QY4&source=url) everthing are welcome.


> ⚠️ ONLY TESTED IN WINDOWS (For while, you need have ADB Interface installed in your system)
## How to connect my phone via wifi

1.  First connect your device trough USB
2.  Run `ADB:📱 Disconnect from any devices`
3.  And run `ADB:📱 Reset connected devices port to :5555`
4.  And Then `ADB:📱 Connect to device IP` enter your device (settings > status > ip address) IP address and be fine

![status bar](https://raw.githubusercontent.com/vinicioslc/adb-interface-vscode/production/media/record1.gif)

## Implemented Commands

-   ADB:📱 Reset connected devices port to :5555 (Open current device port with `adb tcpip 5555`)
-   ADB:📱 Connect to device IP (need inform IP from device wanted `adb connect ${user_ip}:5555`)
-   ADB:📱 Disconnect from any devices (Disconnect ever device attached `adb disconnect`)
-   ADB:📱 Connect to device from List (Show an list from devices attached to connect)
-   ADB:🔥 Enable Firebase events debug mode (Run firebase events in debug mode)
-   ADB:🔥 Disable Firebase events debug mode (Run firebase events in debug mode)
-   ADB:⚠️ Kill ADB server (Kill ADB Server runing `adb kill-server`)

### Tests Health Summary by jest-badge-generator

![coverage-branches](https://raw.githubusercontent.com/vinicioslc/adb-interface-vscode/production/.badges/badge-branches.png)
![coverage-function](https://raw.githubusercontent.com/vinicioslc/adb-interface-vscode/production/.badges/badge-functions.png)
![coverage-lines](https://raw.githubusercontent.com/vinicioslc/adb-interface-vscode/production/.badges/badge-lines.png)
![coverage-statements](https://raw.githubusercontent.com/vinicioslc/adb-interface-vscode/production/.badges/badge-statements.png)
