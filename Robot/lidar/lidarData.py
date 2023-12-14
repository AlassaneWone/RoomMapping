# import crc8\


class LidarData:
    """
    Extract information from LD06 packets

    Attributes:
        radarSpeed (int): angular velocity of the lidar. Measured in degrees per second.
        startAngle (int): angle the first data point is measured at. Measured in degrees.
        endAngle (int): angle the last data point is measured at. Measured in degrees.
        angleStep (int): the difference in angle between each data point. Measured in degrees.
        timestamp (int): the time at which the packet was sent relative to the start of operation. Measured in ms.
            It's max value is 30'000 at which point it resets
        crc (int): cyclic redundancy check. (Checksum for all previous data to verify data integrity)
        dataPoints (list of tupples) : a list of the 12 measurements in the packet
            each tupple is arranged as such : (distance in mm, angle in degree, confidence)
    """
    startCharacter = 0x54

    def verify_integrity(self):
        if len(self.dataPacket) != 47:
            ''' dataPacket expected to be a string of 47 bytes following the structure
                    defined on page 5 of ./Robot/Documentation/Communication Protocol.pdf'''
            raise Exception("data packet not the right length")

    def arrange_data(self):
        self.radarSpeed = int((self.dataPacket[3]+self.dataPacket[2]), 16)
        self.startAngle = int((self.dataPacket[5]+self.dataPacket[4]), 16)/100
        self.endAngle = int((self.dataPacket[-4]+self.dataPacket[-5]), 16)/100
        self.timestamp = int((self.dataPacket[-3]+self.dataPacket[-2]), 16)
        self.crc = self.dataPacket[-1]

        if self.endAngle - self.startAngle > 0:
            self.angleStep = float(self.endAngle - self.startAngle) / (12)
        else:
            self.angleStep = float((self.endAngle + 360) - self.startAngle) / (12)

        for i in range(6, 42, 3):
            self.dataPoints.append((int((self.dataPacket[i+1]+self.dataPacket[i]), 16), self.startAngle
                                    + (self.angleStep * (i-6)), int(self.dataPacket[i+2], 16)))

    def __init__(self, dataPacket):
        self.radarSpeed = None
        self.startAngle = None
        self.endAngle = None
        self.angleStep = None
        self.dataPoints = []
        self.timestamp = None
        self.crc = None
        self.dataPacket = dataPacket.split()

        self.verify_integrity()
        self.arrange_data()

    def attributes_to_dict(self):
        return {
            'radarSpeed': self.radarSpeed,
            'timestamp' : self.timestamp,
            'dataPoints' : self.dataPoints
        }

if __name__ == '__main__':
    testData = """54 2C 68 08 AB 7E E0 00 E4 DC 00 E2 D9 00 E5 D5 00 E3 D3 00 E4 D0 00 E9 CD 00 E4 CA 00 E2 C7 00 E9 C5 00 E5 C2 00 E5 C0 00 E5 BE 82 3A 1A 50"""
    l = LidarData(testData)

    print()

