import asyncio
import websockets
import serial
import json
from lidarData import LidarData

# create handler for each connection
ser = serial.Serial(port='/dev/ttyUSB0',
                    baudrate=230400,
                    timeout=5.0,
                    bytesize=8,
                    parity='N',
                    stopbits=1)


async def handler(websocket, path):
    while True:
        data = await websocket.recv()
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

        await websocket.send(reply)


start_server = websockets.serve(handler, "192.168.141.142", 8000)

asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever()