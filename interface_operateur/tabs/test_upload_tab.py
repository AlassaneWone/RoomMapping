import unittest
from tkinter.ttk import Notebook
from unittest.mock import patch, Mock
from google.cloud.firestore_v1 import FieldFilter
from uploadTab import UploadTab
from dotenv import load_dotenv

load_dotenv()

# Configuration Firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def initialize_firebase_app():
    if not firebase_admin._apps:
        # Si elle n'est pas initialisée, alors seulement l'initialiser
        cred = credentials.Certificate('././keys/roommapping-group-5-firebase-adminsdk-oycah-ca3f0c23d8.json')
        app = firebase_admin.initialize_app(cred)
    return firestore.client()

class TestUploadTab(unittest.TestCase):
    def setUp(self):
        # Initialisation de la classe UploadTab
        self.tabControl = Notebook()
        self.upload_tab = UploadTab(self.tabControl)
        self.firestore_client = initialize_firebase_app()

    def test_validate_fields(self):
        # Cas où tous les champs sont remplis
        result = self.upload_tab.validate_fields('Nom', 'Lieu', '2023-01-01', 'test@mail.com')
        self.assertTrue(result)

        # Cas où un champ est manquant
        result = self.upload_tab.validate_fields('', 'Lieu', '2023-01-01', 'test@mail.com')
        self.assertFalse(result)

    @patch('uploadTab.messagebox.showerror')
    def test_upload_image_missing_fields(self, mock_showerror):
        # Appel de la méthode à tester avec des champs manquants
        self.upload_tab.upload_image()

        # Assertion pour vérifier que la boîte de dialogue d'erreur a été appelée
        mock_showerror.assert_called_once_with("Champs manquants", "Veuillez remplir tous les champs.")

    @patch('uploadTab.boto3.client')
    def test_upload_to_firestore(self, mock_boto3_client):
        # Assurez-vous que cet utilisateur existe dans Firestore
        user_email = 'fake@gmail.com'

        # Appel de la méthode à tester
        self.upload_tab.upload_to_firestore('Nom', 'Lieu', '2023-01-01', 'fake_file_path', user_email)

        # Accéder à Firestore pour vérifier les données
        users_collection = self.firestore_client.collection('users')
        query = users_collection.where('email', '==', user_email)
        results = query.get()

        # Vérifier que l'utilisateur existe
        self.assertTrue(len(results) > 0)

        # Récupérer l'ID de l'utilisateur
        user_id = results[0].id

        # Accéder à la collection "maps" pour vérifier les données ajoutées
        maps_collection = users_collection.document(user_id).collection('maps')
        query_maps = maps_collection.where(filter=FieldFilter('nom', '==', 'Nom'))\
            .where(filter=FieldFilter('lieu', '==', 'Lieu')).where(filter=FieldFilter('date', '==', '2023-01-01'))
        results_maps = query_maps.get()

        # Vérifier que la carte a été ajoutée
        self.assertTrue(len(results_maps) > 0)

        # Vérifier les détails de la carte ajoutée
        map_data = results_maps[0].to_dict()
        self.assertEqual(map_data['nom'], 'Nom')
        self.assertEqual(map_data['lieu'], 'Lieu')
        self.assertEqual(map_data['date'], '2023-01-01')


if __name__ == '__main__':
    unittest.main()