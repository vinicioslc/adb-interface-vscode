# ADB Wifi Code - Under construction

### Attention !! ONLY TESTED IN WINDOWS !! (For while, you must have ADB at your Enviroment Variables)

> 1k > Installs im so thankful who installed !! \o\o\o\o/o/o/o/

#### Help are welcome ;)

<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TKRZ7F4FV4QY4&source=url">![Donation will make this tree growth](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)</a>

An simple adb extesion that makes possible to connect to an device over wifi connection without console.

## ADB commands.

- ADB:📱 Reset connected devices port to :5555 (Open device port with `adb tcpip 5555`)
- ADB:📱 Connect to device IP (need inform IP from device wanted `adb connect ${user_ip}:5555`)
- ADB:📱 Disconnect from any devices (Disconnect ever device attached `adb disconnect`)
- ADB:📱 Connect to device from List (Show an list from devices attached to connect)
- ADB:🔥 Enable Firebase events debug mode (Run firebase events in debug mode)
- ADB:🔥 Disable Firebase events debug mode (Run firebase events in debug mode)
- ADB:⚠️ Kill ADB server (Kill ADB Server runing `adb kill-server`)

## How to connect my phone via wifi ?

1. First connect your device trough USB
2. Run `ADB:📱 Disconnect from any devices`
3. And run `ADB:📱 Reset connected devices port to :5555`
4. And Then `ADB:📱 Connect to device IP` enter your device (settings > status > ip address) IP address and be fine

![status bar](media/record1.gif)

# TODO

- [ ] easy test and mockable terminal interface
- [ ] unit tests in everywhere
- [ ] more easy architecture and easy to extend features
