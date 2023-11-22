from tkinter import *
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
import numpy as np
from matplotlib.figure import Figure
import tkinter.ttk as ttk
import matplotlib.pyplot as plt

from .mock import data

#Parametre pour l'affichage
NOMBRE_DE_PAQUET_AFFICHE = 1000

class RadarTab:
    def __init__(self,tabControl):
        WIDTH = (tabControl.winfo_screenwidth()/2)
        HEIGHT = (tabControl.winfo_screenheight()-300)
        self.en_cours_execution = True
        s = ttk.Style()
        s.configure('new.TFrame', background='lightgray')
        #Set Frame and add to control bar
        self.tab = Frame(master=tabControl,bg='white')
        tabControl.add(self.tab, text="Radar")
        
        self.wrapper1 = LabelFrame(self.tab,background= "#74092e")
        self.wrapper2 = LabelFrame(self.tab,background= "#74992e" )

        self.wrapper21 = LabelFrame(self.wrapper2, bg='lightgray')
        self.wrapper22 = LabelFrame(self.wrapper2,height=100, bg = 'lightgray')




        self.wrapper1.pack(side="left" ,fill="both",expand=TRUE,padx=10,pady=10)
        self.wrapper2.pack(side="left",fill="both",expand=TRUE,padx=10,pady=10)
        self.wrapper21.pack(side="top" ,fill="both",expand=TRUE,padx=10,pady=10)
        self.wrapper22.pack(side="bottom",fill="x",expand=False,padx=10,pady=10)
        
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
        self.canvas_widget.pack(fill='both', expand=True,padx=10,pady=10)

        self.label1 = Label(self.wrapper21,text="La distance ,l'angle " )
        self.label1.pack(expand=True)
        Button(self.wrapper22, text="Activer", command= self.activer_radar).pack(fill="both",side="left",expand=True)
        Button(self.wrapper22, text="Désactiver", command= self.desactiver_radar).pack(fill="both",side="left",expand=True)
        Button(self.wrapper22, text="Clear", command= self.clear_radar).pack(fill="both",side="left",expand=True)
    

    def clear_radar(self):
        self.allx, self.ally, self.allconfiance = [],[],[]
        self.ax.clear()
        self.ax.set_ylim(0,6000)
        self.canvas.draw()
        self.tab.update()

    def desactiver_radar(self):
        self.en_cours_execution = False
        self.ax.scatter(x =self.allx,y = self.ally,c= self.allconfiance, s=2.0,cmap="RdYlGn",vmin=120,vmax=250)
        self.ax.set_ylim(0,6000)
        self.canvas.draw()
        self.tab.update()
    
    def activer_radar(self):
        self.en_cours_execution = True
        self.test()
        self.ax.set_ylim(0,6000)
        self.canvas.draw()
        self.tab.update()

    def test(self):
            for i in data:
                if self.en_cours_execution == False:
                    break
                self.actualisation_radar(i)
                plt.pause(0.001)

    def actualisation_radar(self,paquet):
            self.ax.clear()
            for i in paquet["dataPoints"]:
                self.label1 .configure(text="La distance " +str(int(i[1])) +", l'angle " +str(int(i[0])))
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