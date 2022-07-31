// ESP8266 in Station Mode serving ArduCAM feed on an asynchronous web server
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>
#include <Wire.h>
#include <SPI.h>
#include <ArduCAM.h>
#include "memorysaver.h"

#if (!defined ESP8266)
#error Select ESP8266 in boards manager
#endif

#if (!defined OV2640_MINI_2MP_PLUS)
#error Select OV2640_MINI_2MP_PLUS in memorysaver.h
#endif

const int CS = 16;
const char *ssid = "ssid";
const char *password = "pw";
static IPAddress ip(192, 168, 1, 203);
static IPAddress gateway(192, 168, 1, 1);
static IPAddress subnet(255, 255, 255, 0);


AsyncWebServer server(80);
ArduCAM myCAM(OV2640, CS);


void setup() {
  Serial.begin(115200);
  // connect to home wifi network
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
  Serial.println(ssid);
  WiFi.config(ip, gateway, subnet);
  Serial.print("WIFI_STA | ");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  // set up Arducam
  uint8_t vid, pid, temp;
  Wire.begin();
  pinMode(CS, OUTPUT);
  digitalWrite(CS, HIGH);
  SPI.begin();
  myCAM.write_reg(0x07, 0x80);
  delay(100);
  myCAM.write_reg(0x07, 0x00);
  delay(100);
  while(1){
    myCAM.write_reg(ARDUCHIP_TEST1, 0x55);
    temp = myCAM.read_reg(ARDUCHIP_TEST1);
    if (temp != 0x55) {
      Serial.println("SPI error");
      delay(1000);
      continue;
    }
    else {
      Serial.println("SPI OK");
      break;
    }
  }
  while(1){
    myCAM.wrSensorReg8_8(0xff, 0x01);
    myCAM.rdSensorReg8_8(OV2640_CHIPID_HIGH, &vid);
    myCAM.rdSensorReg8_8(OV2640_CHIPID_LOW, &pid);
    if ((vid != 0x26) && ((pid != 0x41) || (pid != 0x42))) {
      Serial.println("OV2640 not found");
      continue;
    }
    else {
      Serial.println("OV2640 found");
      break;
    }
  }
  myCAM.set_format(JPEG);
  myCAM.InitCAM();
  myCAM.OV2640_set_JPEG_size(OV2640_320x240);
  myCAM.clear_fifo_flag();

  // set up file system
  if (!LittleFS.begin()){
    Serial.println("LittleFS Error");
    return;
  }
  
  // ===================SERVER REQUEST HANDLERS==================
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    //request->send(200, "text/plain", "hello world");
    request->send(LittleFS, "/index.html", "text/html");
  });

  server.on("/capture", HTTP_GET, [](AsyncWebServerRequest *request){
    myCAM.clear_fifo_flag();
    myCAM.start_capture();
    while(!myCAM.get_bit(ARDUCHIP_TRIG, CAP_DONE_MASK));
    size_t fifo_length = myCAM.read_fifo_length();
    myCAM.CS_LOW();
    myCAM.set_fifo_burst();
    
    const size_t max = (ESP.getFreeHeap()/3) & 0xFFE0;
    AsyncWebServerResponse *response = request->beginChunkedResponse("image/jpeg",
    [=](uint8_t *buffer, size_t maxLen, size_t index) -> size_t
    {
      size_t length = fifo_length - index;
      length = std::min({length, maxLen, max});
      if (length > 0){
        uint8_t fifo_data[length] = {};
        SPI.transferBytes(0x00, &fifo_data[0], length);
        memcpy_P(buffer, &fifo_data[0], length);
      }
      else {
        myCAM.CS_HIGH();
      }
      return length;
    });
    request->send(response);
  });

  server.on("/stream", HTTP_GET, [](AsyncWebServerRequest *request){
    //figure out how to stream video.
  });

  server.onNotFound([](AsyncWebServerRequest *request) {
    if (LittleFS.exists(request->url())){
      request->send(LittleFS, request->url());
    }
    else {
      request->send(404);
    }
  });
// ===================END SERVER REQUEST HANDLERS==================


  server.begin();
}


void loop() {

}