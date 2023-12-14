# from dataStreamTest import client as Client
# from lidarData import LidarData
# import serial
# import time
#
# ser = serial.Serial(port='COM4',
#                     baudrate=230400,
#                     timeout=5.0,
#                     bytesize=8,
#                     parity='N',
#                     stopbits=1)
#
# client = Client(HOST='172.31.17.62')
#
# try:
#     while True:
#         tmpString = ''
#         b = ser.read()
#         tmpInt = int.from_bytes(b, 'big')
#         if tmpInt == 0x54:
#             tmpString += b.hex() + " "
#             for i in range(46):
#                 b = ser.read()
#                 tmpString += b.hex() + " "
#             client.send_message(LidarData(tmpString).attributes_to_dict())
# except KeyboardInterrupt:
#     pass
#
# client.cleanup()

#!/usr/bin/env python
#
# import socket
#
#
# TCP_IP = '16.170.234.22'
# TCP_PORT = 8000
# BUFFER_SIZE = 1024
# MESSAGE = "Hello, World!"
#
# s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# s.connect((TCP_IP, TCP_PORT))
# s.send(bytes(MESSAGE, 'utf-8'))
# data = s.recv(BUFFER_SIZE)
# s.close()
#
# print ("received data:", data)
