# 🔌 ADB Interface for VSCode

<div style="text-align:center">

<img src="https://raw.githubusercontent.com/vinicioslc/adb-interface-vscode/main/media/icon.png" width="200" />

</div>

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fvinicioslc%2Fadb-interface-vscode%2Fbadge%3Fref%3Dmain&style=flat-square)](https://actions-badge.atrox.dev/vinicioslc/adb-interface-vscode/goto?ref=main) ![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/vinicioslc.adb-interface-vscode?style=flat-square) ![GitHub](https://img.shields.io/github/license/vinicioslc/adb-interface-vscode?style=flat-square) ![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/vinicioslc.adb-interface-vscode?style=flat-square) ![Visual Studio Marketplace Rating (Stars)](https://img.shields.io/visual-studio-marketplace/stars/vinicioslc.adb-interface-vscode?style=flat-square)
<a href="https://codeclimate.com/github/vinicioslc/adb-interface-vscode/maintainability">

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=vinicioslc_adb-interface-vscode&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=vinicioslc_adb-interface-vscode) [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=vinicioslc_adb-interface-vscode&metric=ncloc)](https://sonarcloud.io/dashboard?id=vinicioslc_adb-interface-vscode) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=vinicioslc_adb-interface-vscode&metric=bugs)](https://sonarcloud.io/dashboard?id=vinicioslc_adb-interface-vscode) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=vinicioslc_adb-interface-vscode&metric=security_rating)](https://sonarcloud.io/dashboard?id=vinicioslc_adb-interface-vscode)

This simple ADB wrapper try to makes easy connect to android devices over wifi, without console use, and do other things.

Chinese Guide [简体中文指南](https://www.jianshu.com/p/fb8eebc8a2c0)

You can help with [Code](https://github.com/vinicioslc/adb-interface-vscode/issues) or with [Energy](https://www.paypal.com/cgi-bin/webscr?cmd=\_s-xclick&hosted_button_id=TKRZ7F4FV4QY4&source=url) everthing are welcome ;)

<a href='https://ko-fi.com/K3K424BR8' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

> ⚠️ ONLY TESTED IN WINDOWS (For while, you need have ADB Interface installed in your system)

<div style="text-align:center">

![status bar](https://raw.githubusercontent.com/vinicioslc/adb-interface-vscode/main/media/record1.gif)

</div>

## Attach ADB to an Device via WIFI

1.  First connect your device trough USB
2.  Run `ADB:📱 Disconnect from any devices`
3.  And run `ADB:📱 Reset connected devices port to :5555`
4.  And Then `ADB:📱 Connect to device IP` enter your device (settings > status > ip address) IP address and be fine

<div style="text-align:center">

![status bar](/media/install_apk_demo.gif)

</div>

## Installing APK files throught ADB

1. Pick apk file with command `ADB:📱 Pick .APK file and install `
2. Allow ADB install on device screen
3. Wait until copy de file and icon appear
4. Now you can run the APP

# Table of contents

<!--ts-->

-   [🔌 ADB Interface for VSCode](#-adb-interface-for-vscode)
-   📱 Demo GIFs
    -   [Attach ADB to an Device via WIFI](#attach-adb-to-an-device-via-wifi)
    -   [Installing APK files throught ADB](#installing-apk-files-throught-adb)
-   [Table of contents](#table-of-contents)
-   [Commands Available](#commands-available)
-   [How it works](#how-it-works)
    -   [ADB location resolution strategy](#adb-location-resolution)
-   [Tests](#tests)

      <!--te-->

## Commands Available

-   ADB:📱 Reset connected devices port to :5555 (Open current device port with (equivalent `adb tcpip 5555`))
-   ADB:📱 Connect to device IP (Need type the IP from device (equivalent `adb connect ${your ip}:5555`))
-   ADB:📱 Disconnect from any devices (Disconnect ever device attached (equivalent `adb disconnect`))
-   ADB:📱 Connect to device from List (Show an list from devices attached to connect (equivalent `adb devices`))
-   ADB:📱 Pick .APK file and install (Install on current active device (Will prompt user on Android Screen))
-   ADB:📱 Setup custom ADB location (Configure location of ADB)
-   ADB:📱 Remove custom ADB location (Clear custom ADB location)
-   ADB:🔥 Enable Firebase events debug mode (Run firebase events in debug mode)
-   ADB:🔥 Disable Firebase events debug mode (Run firebase events in debug mode)
-   ADB:⚠️ Kill ADB server (Kill ADB Server runing (equivalent `adb kill-server`))

# How it works

## ADB location resolution

By default the extension is looking for ADB in the following locations:

-   Linux - `$HOME/Android/Sdk`
-   MacOS - `$HOME/Library/Android/sdk/platform-tools`
-   Windows - `%USERPROFILE%\AppData\Local\Android\Sdk\platform-tools` (if the `%USERPROFILE%` environment variable is not defined the path to the profile directory of the current user will be used as the starting point)

The extension will resolve the ADB location each time an ADB command is executed.

The ADB location can be customized using the `Setup custom ADB location` command. The custom ADB location can be cleared using the `Remove custom ADB location` command.

# Tests

All done with [Jest](https://jestjs.io/) you can read more about [here.](https://jestjs.io/docs/en/getting-started.html)

We need help to incrase test coverage report, if you can learn, send a pull request !

> How to run tests:

```bash
➥ npm run test
```

> You can also use the project alias that watch file changes while developing:

```bash
➥ npm run test:watch
```
