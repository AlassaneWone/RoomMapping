#!/usr/bin/env python3

from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread
import serial
from lidarData import LidarData
import json

ser = serial.Serial(port='COM4',
                    baudrate=230400,
                    timeout=5.0,
                    bytesize=8,
                    parity='N',
                    stopbits=1)

def accept_connection():
    while True:
        client, client_address = SERVER.accept()
        print(f'{client_address} has connected')
        Thread(target=handle_connection, args=(client,)).start()

def handle_connection(client):
    while True:
        # print('waiting for msg')
        msg = client.recv(BUFSIZE)
        tmpString = ''
        ser.flushInput()
        b = ser.read()
        while int.from_bytes(b, 'big') != 0x54:
            b = ser.read()

        tmpString += b.hex() + " "
        for i in range(46):
            b = ser.read()
            tmpString += b.hex() + " "
        reply = json.dumps(LidarData(tmpString).dataPoints)
        client.send(bytes(reply,"utf8"))


BUFSIZE = 1024

SERVER = socket(AF_INET, SOCK_STREAM)
SERVER.bind(('192.168.68.62', 8000))

SERVER.listen(1)
print('waiting for connection')
ACCEPT_THREAD = Thread(target=accept_connection)
ACCEPT_THREAD.start()
ACCEPT_THREAD.join()
SERVER.close()