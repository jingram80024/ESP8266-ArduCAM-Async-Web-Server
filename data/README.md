# ESP8266-12E and ArduCAM Async Web Server

Hardware

[![](https://img.shields.io/badge/espressif-E7352C?style=for-the-badge&logo=espressif&logoColor=white)](https://www.espressif.com/en/products/socs/esp8266)
[![](https://raw.githubusercontent.com/jingram80024/ESP8266-ArduCAM-Async-Web-Server/main/data/arducam_md_badge.svg)](https://www.arducam.com/docs/spi-cameras-for-arduino/introduction/)

Languages

![](https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white) [![](https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white)](https://www.arduino.cc/reference/en/) ![](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)

An Asynchronous ESP8266-12E HTTP and WebSocket Server that serves ArduCAM camera module captured images when requested by client. Webpage files are stored and managed using LittleFS and PlatformIO VS Code extension. Front end template "Count - Particles" by styleshout was used as a starting point for developing the front end.

## Table of contents
- [ESP8266 and ArduCAM Async Web Server](#esp8266-and-arducam-async-web-server)
    - [Table of contents](#table-of-contents)
    - [Libraries](#libraries)
    - [Developer Tools](#developer-tools)

## Libraries

[<Arduino.h>](https://github.com/esp8266/Arduino/blob/master/cores/esp8266/Arduino.h) Main include file for Arduino SDK

[<ESP8266WiFi.h>](https://arduino-esp8266.readthedocs.io/en/latest/esp8266wifi/readme.html) ESP8266 Wifi support

[<ESPAsyncWebServer.h>](https://github.com/me-no-dev/ESPAsyncWebServer) Async HTTP and WebSocket Server for ESP8266 Arduino

[<ESPAsyncTCP.h>](https://github.com/me-no-dev/ESPAsyncTCP) This is a fully asynchronous TCP library, aimed at enabling trouble-free, multi-connection network environment for Espressif's ESP8266 MCUs.

This library is the base for [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)

[<ArduCAM.h>](https://github.com/ArduCAM/Arduino) This is a opensource library for taking high resolution still images and short video clip on Arduino based platforms using ArduCAM's camera modules.

["memorysaver.h"](https://github.com/ArduCAM/Arduino) Header file that defines the model type of ArduCAM module. This web server uses the OV2640_MINI_2MP_PLUS model.

[<LittleFS.h>](https://github.com/littlefs-project/littlefs) A little fail-safe filesystem designed for microcontrollers.

[<Wire.h>](https://www.arduino.cc/reference/en/language/functions/communication/wire/) Arduino library that allows you to communicate with I2C/TWI devices.

[<SPI.h>](https://www.arduino.cc/reference/en/language/functions/communication/spi/) This Arduino library allows you to communicate with SPI devices, with the Arduino as the controller device.

## Developer Tools / References

[Visual Studio Code](https://code.visualstudio.com/) was used for development and testing in conjunction with the [PlatformIO](http://platformio.org) open source ecosystem for IoT development with full support for developing Espressif ESP8266/ESP32 implementations. PlatformIO provides a convenient method for uploading file systems to ESP8266/ESP32, as well as convenient library dependency management.

[styleshout](https://technext.github.io/count/)'s Count landing page template with Particles background was used as a starting point for the front end web development.

[Inkscape](https://inkscape.org/) was used to create vector scalable graphics displayed on the web server.

[GIMP](https://www.gimp.org/) (GNU Image Manipulation Program) was used to create some of the images displayed on the web server.

[favicon.cc](https://www.favicon.cc/) was used to create the ArduCAM logo favicon.ico

[Simon Willison](https://github.com/simonw)'s [Render Markdown](https://til.simonwillison.net/tools/render-markdown) implementing GitHub's [Markdown API](https://docs.github.com/en/rest/markdown) was used. The javascript handling the call to the GitHub Markdown API was altered and used in this project's main.js file.

## Hardware

ESP8266-12E NodeMCU development board v1.0

ArduCAM OV2640 Mini 2MP Plus camera module

Wiring:

| ESP | ArduCAM |
|-----|---------|
| D0  |  CS     |
| D7  |  MOSI   |
| D6  |  MISO   |
| D5  |  SCK    |
| GND |  GND    |
| 3V3 |  VCC    |
| D2  |  SDA    |
| D1  |  SCL    |

