import unittest
from unittest.mock import MagicMock
from tkinter import Tk, Button
import tkinter.ttk as ttk
from tabs.radarTab import RadarTab


class TestRadarTab(unittest.TestCase):
    def setUp(self):
        self.root = Tk()
        self.tab_control = ttk.Notebook(self.root)
        self.radar_tab = RadarTab(self.tab_control)

    def test_dsiplay(self):
        self.root.destroy()
        self.radar_tab.ax.clear()
        self.radar_tab.canvas.draw()
    
    def test_actualisation_radar(self):
        # Create a mock paquet with dataPoints
        mock_paquet = {"radarSpeed": 3602, "timestamp": 26467, "dataPoints": [[5742, 142.36, 210], [5680, 144.695, 210], [5680, 147.03, 51], [5851, 149.365, 58], [5680, 151.7, 93], [5183, 154.03499999999997, 54], [5043, 156.36999999999998, 84], [4888, 158.70499999999998, 129], [4966, 161.03999999999996, 155], [1473, 163.37499999999994, 218], [1458, 165.70999999999995, 236], [1458, 168.04499999999996, 239]]}

        # Mock the clear method of self.ax

        # Call the method to test
        self.radar_tab.ax.clear = MagicMock()
        self.radar_tab.canvas.draw = MagicMock()
        self.radar_tab.tab.update = MagicMock()
        self.radar_tab.actualisation_radar(mock_paquet)

        # Assertions
        self.radar_tab.ax.clear.assert_called_once()  # Ensure self.ax.clear() is called
        self.assertEqual(len(self.radar_tab.allx), len(mock_paquet["dataPoints"]))  # Ensure data is appended to self.allx
        self.assertEqual(len(self.radar_tab.ally), len(mock_paquet["dataPoints"]))  # Ensure data is appended to self.ally
        self.assertEqual(len(self.radar_tab.allconfiance), len(mock_paquet["dataPoints"]))  # Ensure data is appended to self.allconfiance
        self.radar_tab.canvas.draw.assert_called_once()  # Ensure self.canvas.draw() is called
        self.radar_tab.tab.update.assert_called_once()  # Ensure self.canvas.update() is called


if __name__ == '__main__':
    unittest.main()

