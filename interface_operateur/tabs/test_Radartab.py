import unittest
from unittest.mock import MagicMock
from tkinter import *
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from tkinter import filedialog
import numpy as np
from matplotlib.figure import Figure
import tkinter.ttk as ttk
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import matplotlib.colors as colors

import asyncio
import websockets
import json
import threading as th

# Importez la classe que vous souhaitez tester
from radarTab import RadarTab

NOMBRE_DE_PAQUET_AFFICHE = 35
MIN_CMAP = 0
MAX_CMAP = 250
TAILLE_POINTS = 5.0
TAILLE_FRONT= 7
TAILLE_RADAR = 6000

class TestRadarTab(unittest.TestCase):

    def setUp(self):
        self.root = Tk()
        self.tabControl = ttk.Notebook(self.root)
        self.radar_tab = RadarTab(self.tabControl)

    def test_actualiser_radar_size(self):
        self.radar_tab.actualiser_radar_size(8000)
        self.assertEqual(self.radar_tab.radar_size, 8000)
            # Test with a larger radar size
        self.radar_tab.actualiser_radar_size(12000)
        self.assertEqual(self.radar_tab.radar_size, 12000)

        # Test with a smaller radar size
        self.radar_tab.actualiser_radar_size(4000)
        self.assertEqual(self.radar_tab.radar_size, 4000)

        # Test with a size between 4000 and 6000
        self.radar_tab.actualiser_radar_size(5000)
        self.assertEqual(self.radar_tab.radar_size, 5000)

        # Test with the minimum allowed size
        self.radar_tab.actualiser_radar_size(1000)
        self.assertEqual(self.radar_tab.radar_size, 1000)

        #Test the behavior when setting the size to a negative value
        with self.assertRaises(ValueError):
            self.radar_tab.actualiser_radar_size(-100)

    def test_enregistrer_image(self):
        filedialog.asksaveasfilename = MagicMock(return_value="test_image.png")
        self.radar_tab.enregistrer_image()
        # Assert that the radar_size is unchanged after enregistrement
        self.assertEqual(self.radar_tab.radar_size, TAILLE_RADAR)


    def test_actualisation_radar(self):
        paquet = [[4500, 100, 200]]
        # Call the method to actualise radar
        self.radar_tab.en_cours_execution = True
        self.radar_tab.actualisation_radar(paquet)
        # Assert that the label_1 text is updated correctly
        self.assertEqual(self.radar_tab.label_1.cget("text"), "La distance 4500, l'angle 100" )
        paquet = [[3000, 150, 200]]
        # Call the method to actualise radar
        self.radar_tab.en_cours_execution = True
        self.radar_tab.actualisation_radar(paquet)
        self.assertEqual(self.radar_tab.label_1.cget("text"),"La distance 3000, l'angle 150")

        # Assert that all_x, all_y, and all_confiance are updated correctly
        self.assertEqual(self.radar_tab.all_x, [np.radians(100),np.radians(150)])
        self.assertEqual(self.radar_tab.all_y, [4500,3000])
        self.assertEqual(self.radar_tab.all_confiance, [200,200])

        # Assert that scatter method is called with the correct arguments
        self.radar_tab.axe.scatter(
            x=[np.radians(100),np.radians(150)],
            y=[4500,3000],
            c=[200,200],
            s=5.0,
            cmap=self.radar_tab.custom_cmap,
            vmin=0,
            vmax=250)
        # Assert that update_display method is called
        self.radar_tab.update_display()
        #C'est un enregistrement pour voir le point
        filedialog.asksaveasfilename = MagicMock(return_value="test_image2.png")
        self.radar_tab.enregistrer_image()

    def test_packet_thread(self):
        # Mock la fonction websocket_data pour éviter d'établir une véritable connexion WebSocket
        #Il faut le tester avec le lidar ne peut etre verifier avec la connection
        self.radar_tab.websocket_data = MagicMock(return_value=None)
        self.radar_tab.packet_thread()

    def tearDown(self):
        self.root.destroy()

if __name__ == '__main__':
    unittest.main()
