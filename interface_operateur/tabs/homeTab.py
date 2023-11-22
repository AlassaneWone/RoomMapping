from tkinter import *
from tkinter.ttk import *
from PIL import Image, ImageTk  # Utilisé pour afficher des images


class HomeTab:
    def __init__(self, tabControl):
        self.tab = Frame(tabControl)
        tabControl.add(self.tab, text="Home")

        self.label = Label(self.tab, text="It is the Home Page").pack()


