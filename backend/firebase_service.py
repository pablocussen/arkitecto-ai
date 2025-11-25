import firebase_admin as fb_admin
from firebase_admin import credentials, auth, firestore
import os
import json
from dotenv import load_dotenv

load_dotenv()

db = None
_initialized = False

def _initialize():
    global db, _initialized
    if _initialized:
        return

    try:
        # Check if already initialized
        fb_admin.get_app()
        _initialized = True
    except ValueError:
        # Not initialized, try to initialize
        cred = None

        # Option 1: JSON credentials from environment variable
        creds_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
        if creds_json:
            try:
                creds_dict = json.loads(creds_json)
                cred = credentials.Certificate(creds_dict)
                print("✅ Firebase credentials loaded from environment variable")
            except Exception as e:
                print(f"⚠️ Error parsing credentials JSON: {e}")

        # Option 2: File path
        if not cred:
            cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if cred_path and os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                print("✅ Firebase credentials loaded from file")

        # Initialize with credentials or try default
        if cred:
            fb_admin.initialize_app(cred)
            _initialized = True
        else:
            # Try default credentials (for cloud environments)
            try:
                fb_admin.initialize_app()
                _initialized = True
            except Exception as e:
                print(f"⚠️ Firebase not initialized: {e}")
                return

    try:
        db = firestore.client()
    except Exception as e:
        print(f"⚠️ Firestore client error: {e}")

def get_db():
    _initialize()
    if db is None:
        raise Exception("Firebase Firestore not available")
    return db

def get_auth():
    _initialize()
    return auth
