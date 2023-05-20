import scapy.all as scapy  
from scapy.layers import http
from scapy.layers.inet import IP, ICMP
import time
from datetime import datetime
import pymongo

MONGO_URI = 'mongodb+srv://adminUser:12345@remote-packet-sniffer.polt4sw.mongodb.net/packets?retryWrites=true&w=majority'
INTERVAL = 0 # Gap between packets being added to the database
global packetDataCol, countsCol
times = [0, 0] # global variable, 0-> Start time, 1-> End time  
counts = [0, 0, 0, 0, 0] # [TCP, UDP, IP, IPv6, net_count] global variable 


def get_packet_layers(packet):
    counter = 0
    while True:
        layer = packet.getlayer(counter)
        if layer is None:
            break
        yield layer
        counter += 1


def sniffing(interface, filter): # '*' --> No filter, sniff all packets, prn -> Every packet I sniff 'prn' packet 
    if filter == '*':
        scapy.sniff(iface=interface, store=False, prn=process_packet, count=100)  # count -> Max. no. of packets to sniff 
    else : 
        scapy.sniff(iface=interface, store=False, prn=process_packet, filter=filter, count=100) 


def process_packet(packet):
    if times[0] == 0: # Start timer when first packet processed, times[0] -> START TIME 
        times[0] = time.time() 
    layers = [] 
    for layer in get_packet_layers(packet): # Returns a list of layers
        layers.append(layer.name) 
    print(layers)
    packetInfo = str(packet) # Title of the packet 
    packetData = packet.show(dump=True) # Detailed info of the packet, dump = True, prints to standard O/P file 

    if 'TCP' in layers: 
        counts[0] += 1
    if 'UDP' in layers : 
        counts[1] += 1
    if 'IP' in layers: 
        counts[2] += 1 
    if 'IPv6' in layers: 
        counts[3] += 1

    counts[4] += 1 # Net packet count ++ 
    times[1] = time.time() # END TIME 

    packetDataCol.insert_one({"layers" : layers, "timeStamp": datetime.now().strftime("%d/%m/%Y %H:%M:%S") , "packet" : packetInfo, "data": packetData}) 
    countsCol.insert_one({"counts" : counts, "time": int(times[1]-times[0])})
    time.sleep(INTERVAL)
    return 
    


if __name__ == "__main__":
    print("***************************** Sniffing packets *****************************") 

    myclient = pymongo.MongoClient(MONGO_URI)
    packetsDB = myclient["packets"]
    packetDataCol = packetsDB['packets'] # Packets collection accessed 
    countsCol = packetsDB['counts'] # countsCol collection accessed 
    sniffing('Wi-Fi', filter='*') # Interface : Wifi
