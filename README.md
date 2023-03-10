# remote-packet-sniffer

A web application for sniffing packets of a remote network, with the help of a python program running on the remote device. Developed using React, NodeJS, ExpressJS, MongoDB and Scapy. Let's the user monitor packet data and view other analytics.

## Sniffing Packets
![gif](https://user-images.githubusercontent.com/87132174/221401530-c7b0c01b-f478-45d5-8492-785f0b0ddb63.gif)

## Packet 
![image](https://user-images.githubusercontent.com/87132174/221401639-a578751e-5b1c-46d1-92b2-ccfa446041f6.png)

## Getting Started 

- Insert the MongoDB URI in packetSniffer/packetSniffer.py and backend/app.js 

- Run the python file located in packetSniffer, on the remote device after installing the requried packages

  ```console 
  pip install pymongo
  pip install scapy
  python packetSniffer.py
  ```
- Install NpCap if on Windows

- Navigate to backend, install dependencies, and start the server

  ```console 
  npm install
  npm run dev
  ```
- Navigate to frontend, install dependencies, start the react app and view the sniffed packets on your device

  ```console 
  npm install
  npm run start
  ```
