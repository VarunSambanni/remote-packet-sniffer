import scapy.all as scapy  # NpCap installed on Windows to support Scapy
from scapy.layers import http
from scapy.layers.inet import IP, ICMP
import time
from datetime import datetime
import pymongo

MONGO_URI = 'mongodb+srv://adminUser:12345@remote-packet-sniffer.polt4sw.mongodb.net/?retryWrites=true&w=majority'
INTERVAL = 1
global packetDataCol, countsCol
times = [0, 0]
counts = [0, 0, 0, 0, 0] # [TCP, UDP, IP, IPv6, net_count]


def get_packet_layers(packet):
    counter = 0
    while True:
        layer = packet.getlayer(counter)
        if layer is None:
            break
        yield layer
        counter += 1


def sniffing(interface, filter): # '*' --> No filter
    if filter == '*':
        scapy.sniff(iface=interface, store=False, prn=process_packet) 
    else : 
        scapy.sniff(iface=interface, store=False, prn=process_packet, filter=filter)


def process_packet(packet):
    if times[0] == 0: # Start timer when first packet processed
        times[0] = time.time() 
    packetData = ""
    packetInfo = ""
    layers = [] 
    for layer in get_packet_layers(packet): 
        layers.append(layer.name) 
    print(layers)
    packetInfo = str(packet)
    packetData = packet.show(dump=True)

    if 'TCP' in layers: 
        counts[0] += 1
    if 'UDP' in layers : 
        counts[1] += 1
    if 'IP' in layers: 
        counts[2] += 1 
    if 'IPv6' in layers: 
        counts[3] += 1

    counts[4] += 1
    times[1] = time.time()

    packetDataCol.insert_one({"layers" : layers, "timeStamp": datetime.now().strftime("%d/%m/%Y %H:%M:%S") , "packet" : packetInfo, "data": packetData}) 
    countsCol.insert_one({"counts" : counts, "time": int(times[1]-times[0])})
    time.sleep(INTERVAL)
    ''' 
    if 'IP' in layers:   
        if packet[IP].version == 4 : 
            packet.show() ; 
            print("Version : ",packet[IP].version)
    print('------------------------------------------------------------------------------------------------')
    ''' 
    return 
    if packet.haslayer(http.HTTPRequest):
        
        print(packet)
        print(packet.show())
        host = packet[http.HTTPRequest].Host 
        path = packet[http.HTTPRequest].Path

        print('------------------------------------------------------------------------------------------------')


if __name__ == "__main__":
    print("***************************** Sniffing packets *****************************") 

    myclient = pymongo.MongoClient(MONGO_URI)
    packetsDB = myclient["packets"]
    packetDataCol = packetsDB['packets']
    countsCol = packetsDB['counts']
    sniffing('Wi-Fi', filter='*') # Interface : Wifi
