from tkinter import *
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
import numpy as np
from matplotlib.figure import Figure
import tkinter.ttk as ttk
import matplotlib.pyplot as plt

from .mock import data

#Parametre pour l'affichage
NOMBRE_DE_PAQUET_AFFICHE = 35

class RadarTab:
    def __init__(self,tabControl):
        WIDTH = (tabControl.winfo_screenwidth()/2)#*0.0104166667
        HEIGHT = (tabControl.winfo_screenheight()-300)#*0.0104166667
        self.en_cours_execution = True
        s = ttk.Style()
        s.configure('new.TFrame', background='lightgray')
        #Set Frame and add to control bar
        self.tab = Frame(master=tabControl,bg='white')
        tabControl.add(self.tab, text="Radar")
        
        self.wrapper1 = LabelFrame(self.tab)
        self.wrapper2 = LabelFrame(self.tab)

        self.wrapper1.pack(side="left" ,fill="both",expand=TRUE,padx=10,pady=10)
        self.wrapper2.pack(side="left",fill="both",expand=TRUE,padx=10,pady=10)

        
        WIDTH = (tabControl.winfo_screenwidth()/2)
        HEIGHT = (tabControl.winfo_screenheight()-300)
        self.num = 0
        self.allx = []
        self.ally = []
        self.allconfiance =[]
        self.fig= Figure()
        self.ax = self.fig.add_subplot(projection = 'polar')
        self.ax.set_ylim(bottom=0,top=6000)
        self.canvas = FigureCanvasTkAgg(self.fig, master=self.wrapper1) 
        self.canvas_widget = self.canvas.get_tk_widget()
        self.canvas_widget.config(width=200,height=200)
        self.canvas_widget.pack(fill='both', expand=True)

        Button(self.wrapper2, text="Exemple", command= self.test).pack(fill="both",side="left",expand=True)

    def test(self):
        for i in data:
            self.actualisation_radar(i)
            plt.pause(0.001)

    def actualisation_radar(self,paquet):
        self.ax.clear()
        for i in paquet["dataPoints"]:
            self.allx.append(np.radians(i[1]))
            self.ally.append(i[0])
            self.allconfiance.append(i[2])
            if len(self.allx) >  NOMBRE_DE_PAQUET_AFFICHE*12:
                self.allx.pop(0)
                self.ally.pop(0)
                self.allconfiance.pop(0)
        self.ax.scatter(x =self.allx,y = self.ally,c= self.allconfiance, s=2.0,cmap="RdYlGn",vmin=120,vmax=250)
        self.ax.set_ylim(0,6000)
        self.canvas.draw()
        self.tab.update()
        
