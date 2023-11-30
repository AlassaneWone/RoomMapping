from tkinter import *
from tkinter.ttk import *

# Tabs
from tabs.exampleTab import ExampleTab
from tabs.radarTab import RadarTab
from tabs.homeTab import HomeTab
from tabs.uploadTab import UploadTab


def donothing():
    pass


root = Tk()
root.title("Interface opérateur")

width = root.winfo_screenwidth()
height = root.winfo_screenheight()
# root.geometry("%dx%d" % (width, height))
root.geometry("600x600")



tabControl = Notebook(root)
home = HomeTab(tabControl)
radar = RadarTab(tabControl)
example = ExampleTab(tabControl)
upload = UploadTab(tabControl)
tabControl.pack(expand=1, fill="both")


# Créer un menu en haut
menubar = Menu(root)
root.config(menu=menubar)

filemenu = Menu(menubar, tearoff=0)
menubar.add_cascade(label="File", menu=filemenu)
filemenu.add_command(label="New", command=donothing)
filemenu.add_command(label="Open", command=donothing)
filemenu.add_command(label="Save", command=donothing)
filemenu.add_command(label="Save as...", command=donothing)
filemenu.add_command(label="Close", command=donothing)

filemenu.add_separator()
filemenu.add_command(label="Exit", command=root.quit)


editmenu = Menu(menubar, tearoff=0)
menubar.add_cascade(label="Edit", menu=editmenu)
editmenu.add_command(label="Undo", command=donothing)
editmenu.add_separator()
editmenu.add_command(label="Cut", command=donothing)
editmenu.add_command(label="Copy", command=donothing)
editmenu.add_command(label="Paste", command=donothing)
editmenu.add_command(label="Delete", command=donothing)
editmenu.add_command(label="Select All", command=donothing)


helpmenu = Menu(menubar, tearoff=0)
menubar.add_cascade(label="Help", menu=helpmenu)
helpmenu.add_command(label="Help Index", command=donothing)
helpmenu.add_command(label="About...", command=donothing)


root.mainloop()
