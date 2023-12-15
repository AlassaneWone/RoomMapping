from tkinter import *
import tkinter.ttk as ttk
from PIL import Image, ImageTk  # Utilisé pour afficher des images


class HomeTab:
    def __init__(self, tabControl):

        self.frame_0 = Frame(master=tabControl,bg='white')
        tabControl.add(self.frame_0, text="Home")

        
        self.frame_1 = Frame(self.frame_0,background= "#d1d1d1")
        self.frame_2 = Frame(self.frame_0,background= "#d1d1d1" )

        self.frame_2_1 = Frame(self.frame_2, bg='#FFFFFF')
        self.frame_2_2 = Frame(self.frame_2,height=100, bg = '#FFFFFF')
        self.frame_2_3 = Frame(self.frame_2,height=100, bg = '#FFFFFF')

        self.frame_1.pack(side="left" ,fill="both",expand=TRUE,padx=10,pady=10)
        self.frame_2.pack(side="left",fill="both",expand=TRUE,padx=10,pady=10)
        self.frame_2_1.pack(side="top" ,fill="both",expand=TRUE,padx=10,pady=10)
        self.frame_2_2.pack(side="top",fill="x",expand=False,padx=10)
        self.frame_2_3.pack(side="bottom",fill="x",expand=False,padx=10,pady=[0,10])
        
        self.label_1 = Label(self.frame_1, text="Bonjour")
        self.label_1.pack(padx=10,pady=10)
        


