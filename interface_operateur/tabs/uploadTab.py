import os
from tkinter import *
from tkinter.ttk import *
from tkinter import filedialog
from tkcalendar import DateEntry
from tkinter import messagebox
from PIL import Image, ImageTk
import boto3
from dotenv import load_dotenv

#Needs to change
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('././keys/roommapping-group-5-firebase-adminsdk-oycah-ca3f0c23d8.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()
#Needs to change

load_dotenv()

bucket_name = "roommappingbucket"
region = "eu-north-1"
access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")


class UploadTab:
    def __init__(self, tabControl):
        self.tab = Frame(master=tabControl)
        tabControl.add(self.tab, text="Upload")

        self.wrapper1 = LabelFrame(self.tab, text="Form")
        self.wrapper2 = LabelFrame(self.tab, text="Image Display")
        self.wrapper1.pack(side="left", fill="both", expand=TRUE, padx=10, pady=10)
        self.wrapper2.pack(side="left", fill="both", expand=TRUE, padx=10, pady=10)

        self.nom_label = Label(self.wrapper1, text="Nom:")
        self.nom_label.grid(row=0, column=0, padx=5, pady=5, sticky="e")
        self.nom_entry = Entry(self.wrapper1)
        self.nom_entry.grid(row=0, column=1, padx=5, pady=5)

        self.lieu_label = Label(self.wrapper1, text="Lieu:")
        self.lieu_label.grid(row=1, column=0, padx=5, pady=5, sticky="e")
        self.lieu_entry = Entry(self.wrapper1)
        self.lieu_entry.grid(row=1, column=1, padx=5, pady=5)

        self.mail_label = Label(self.wrapper1, text="Mail:")
        self.mail_label.grid(row=2, column=0, padx=5, pady=5, sticky="e")
        self.mail_entry = Entry(self.wrapper1)
        self.mail_entry.grid(row=2, column=1, padx=5, pady=5)

        self.date_label = Label(self.wrapper1, text="Date:")
        self.date_label.grid(row=3, column=0, padx=5, pady=5, sticky="e")
        self.date_entry = DateEntry(self.wrapper1)
        self.date_entry.grid(row=3, column=1, padx=5, pady=5)

        self.upload_button = Button(self.wrapper1, text="Upload Image", command=self.upload_image)
        self.upload_button.grid(row=4, columnspan=2, pady=10)

        self.image_label = Label(self.wrapper2)
        self.image_label.pack(side=RIGHT, padx=10)

    def upload_image(self):
        file_path = filedialog.askopenfilename(title="Select a map",
                                               filetypes=[("Image files", "*.png;*.jpg;*.jpeg")])

        if file_path:
            image = Image.open(file_path)
            image.thumbnail((150, 150))
            photo = ImageTk.PhotoImage(image)
            self.image_label.config(image=photo)
            self.image_label.image = photo

            nom = self.nom_entry.get()
            lieu = self.lieu_entry.get()
            mail = self.mail_entry.get()
            date = self.date_entry.get()

            if self.validate_fields(nom, lieu, date, mail):
                user_id = self.get_user_id(mail)
                if user_id:
                    self.upload_to_s3(file_path)
                    self.upload_to_firestore(nom, lieu, date, file_path, mail)

            return mail

    def validate_fields(self, nom, lieu, date, mail):
        if not nom or not lieu or not date or not mail:
            messagebox.showerror("Champs manquants", "Veuillez remplir tous les champs.")
            return False
        return True

    def get_user_id(self, mail):
        users_collection = db.collection('users')
        query = users_collection.where('email', '==', mail)
        results = query.get()

        for doc in results:
            user_id = doc.id
            print(f'Found user with email: {mail}, userId: {user_id}')
            return user_id

        print(f'No user found with email: {mail}')
        return None

    def upload_to_s3(self, file_path):
        s3 = boto3.client('s3', aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key)
        file_name = file_path.split("/")[-1]
        s3.upload_file(file_path, bucket_name, file_name)

        object_url = f"https://roommappingbucket.s3.eu-north-1.amazonaws.com/{file_name}"
        print(object_url)

        return object_url

    def upload_to_firestore(self, nom, lieu, date, file_path, mail):
        users_collection = db.collection('users')
        user_id = self.get_user_id(mail)

        if not user_id:
            print(f'No user found with email: {mail}')
            return

        users_collection.document(user_id).collection("maps").add({
            'nom': nom,
            'lieu': lieu,
            'date': date,
            'url': file_path
        })

        print("Document added to user")
