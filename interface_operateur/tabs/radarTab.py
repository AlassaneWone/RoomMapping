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
from socket import AF_INET, socket, SOCK_STREAM
import json
from threading import Thread
import time
import datetime as dt

#Parametre pour l'affichage
NOMBRE_DE_PAQUET_AFFICHE = 35
MIN_CMAP = 0
MAX_CMAP = 250
TAILLE_POINTS = 5.0
TAILLE = 3000

class RadarTab:
    def __init__(self,tabControl):
        #Set Frame and add to control bar
        self.frame_0 = Frame(master=tabControl,bg='white')
        tabControl.add(self.frame_0, text="Radar")

        self.frame_1 = LabelFrame(self.frame_0,background= "#d1d1d1")
        self.frame_2 = LabelFrame(self.frame_0,background= "#d1d1d1" )

        self.frame_2_1 = LabelFrame(self.frame_2, bg='lightgray')
        self.frame_2_2 = LabelFrame(self.frame_2,height=100, bg = 'lightgray')
        self.frame_2_3 = LabelFrame(self.frame_2,height=100, bg = 'lightgray')
        self.frame_2_4 = LabelFrame(self.frame_2,height=100, bg = 'lightgray')

        self.frame_1.pack(side="left" ,fill="both",expand=TRUE,padx=10,pady=10)
        self.frame_2.pack(side="left",fill="both",expand=TRUE,padx=10,pady=10)
        self.frame_2_1.pack(side="top" ,fill="both",expand=TRUE,padx=10,pady=10)
        self.frame_2_2.pack(side="top",fill="x",expand=False,padx=10)
        self.frame_2_3.pack(side="top",fill="x",expand=False,padx=10)
        self.frame_2_4.pack(side="bottom",fill="x",expand=False,padx=10,pady=[0,10])

        self.all_x,self.all_y, self.all_confiance = [],[],[]
        self.en_cours_execution = False
        #self.connexion_websocket = websockets.connect('ws://192.168.137.1:8000')

        self.fig= Figure()
        self.fig_copy = self.fig
        self.axe = self.fig.add_subplot(projection = 'polar')
        self.axe.set_ylim(bottom=0,top=TAILLE)
        
        self.canvas = FigureCanvasTkAgg(self.fig, master=self.frame_1)
        self.canvas_widget = self.canvas.get_tk_widget()
        self.canvas_widget.config(width=200,height=200)
        self.canvas_widget.pack(fill='both', expand=True,padx=10,pady=10)

        # Create the colormap
        self.custom_cmap = colors.LinearSegmentedColormap('CustomCmap',{
            'red':   [(0.0, 0.70, 0.70), (1.0, 0.17, 0.17)],
            'green': [(0.0, 0.16, 0.16), (1.0, 0.70, 0.70)],
            'blue':  [(0.0, 0.16, 0.16), (1.0, 0.17, 0.17)]
            }, N=256)
        self.mappable = cm.ScalarMappable(norm=colors.Normalize(MIN_CMAP, MAX_CMAP), cmap=self.custom_cmap)
        self.colorbar = self.fig.colorbar(self.mappable, ax=self.axe, orientation='horizontal', pad=0.1,shrink=1, aspect=30,label="Confiance", ticks=[0,125, 250])

        self.label_1 = Label(self.frame_2_1,text="La distance ,l'angle " )
        self.label_1.pack(expand=True)

        self.label_activation_radar = Label(self.frame_2_2, text="Désactiver", background="#E93030", font= "#000000")
        self.label_activation_radar.pack(fill="both",side="left",expand=True)
        Button(self.frame_2_3, text="Activer", command= self.activer_radar).pack(fill="both",side="left",expand=True)
        Button(self.frame_2_3, text="Désactiver", command= self.desactiver_radar).pack(fill="both",side="left",expand=True)
        Button(self.frame_2_3, text="Clear", command= self.clear_radar).pack(fill="both",side="left",expand=True)
        Button(self.frame_2_4,text="Enregistrer", command=self.enregistrer_image).pack(fill="both",side="top",expand=True)

        Scale(self.frame_2_4,from_=1000,to=12000, orient=HORIZONTAL,resolution=1000,command=self.actualiser_radar_size,variable=TAILLE,label="Echelle du radar:").pack(fill="both",side="bottom",expand=True)
        self.axe.tick_params(axis='y', labelsize=TAILLE)
        self.client_socket = socket(AF_INET, SOCK_STREAM)
        self.client_socket.connect(('192.168.137.80', 8000))

        self.last_time = dt.datetime.today().timestamp()
        self.diffs = []

# Actualiser la taille du radar en fonction du Scale
    def actualiser_radar_size(self,valeur):
        self.radar_size = int(valeur)
        if(self.radar_size>6000):
            self.axe.set_rgrids(np.arange(0, self.radar_size, 3000))
        elif(self.radar_size>4000):
            self.axe.set_rgrids(np.arange(0, self.radar_size, 2000))
        elif(self.radar_size>0):
            self.axe.set_rgrids(np.arange(0, self.radar_size, 1000))
        else:
            raise ValueError
        self.axe.set_ylim(0,self.radar_size)
        self.canvas.draw()

# Enregistrer une image du radar
    def enregistrer_image(self):
        figure = self.fig_copy
        file_path = filedialog.asksaveasfilename(defaultextension=".png", filetypes=[("Fichiers PNG", "*.png")])
        if not file_path:
            return
        figure.savefig(file_path, format="png",dpi=500)
        print("Enregistrer")

# Actualisation des données du radar
    def actualisation_radar(self,paquet):
        # plt.pause(0.0001)
        if self.en_cours_execution == True:
            self.axe.clear()
            for i in paquet:
                self.label_1 .configure(text="La distance " +str(int(i[1])) +", l'angle " +str(int(i[0])))
                self.all_x.append(np.radians(i[1]))
                self.all_y.append(i[0])
                self.all_confiance.append(i[2])
                if len(self.all_x) >  NOMBRE_DE_PAQUET_AFFICHE*12:
                    self.all_x.pop(0)
                    self.all_y.pop(0)
                    self.all_confiance.pop(0)
            self.axe.scatter(x =self.all_x,y = self.all_y,c= self.all_confiance, s=TAILLE_POINTS,cmap=self.custom_cmap,vmin=MIN_CMAP,vmax=MAX_CMAP)
            self.update_display()

# Partie Websocket
    def receive_packets(self):
        while True:
            try:
                self.client_socket.send(bytes('gimme', "utf8"))
                msg = self.client_socket.recv(1024).decode("utf8")
                self.actualisation_radar(json.loads(msg))
                new_time = dt.datetime.today().timestamp()
                self.diffs.append(new_time - self.last_time)
                self.last_time = new_time

                # Clip the list
                if len(self.diffs) > 10:
                    self.diffs = self.diffs[-10:]

                print(f'{(len(self.diffs) / sum(self.diffs))*12} points per second')
            except Exception as e:
                print(e)
                break


# Partie activation et désactivition du radar
    def desactiver_radar(self):
        self.en_cours_execution = False
        self.label_activation_radar.config(text="Désactiver", background="#E93030", font= "#000000")
        self.axe.scatter(x =self.all_x,y = self.all_y,c= self.all_confiance, s=TAILLE_POINTS,cmap=self.custom_cmap,vmin=MIN_CMAP,vmax=MAX_CMAP)
        self.update_display()

    def activer_radar(self):
        self.en_cours_execution = True
        self.label_activation_radar.config(text="Activer",background="#49CC1F", font= "#000000")
        Thread(target=self.receive_packets).start()
        self.update_display()

    def clear_radar(self):
        self.all_x, self.all_y, self.all_confiance = [],[],[]
        self.axe.clear()
        self.update_display()

#Update du display
    def update_display(self):
        self.axe.set_ylim(0,TAILLE)
        self.canvas.draw()
        self.frame_0.update()

