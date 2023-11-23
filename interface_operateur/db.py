import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('.keys/roommapping-group-5-firebase-adminsdk-oycah-ca3f0c23d8.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()