# Firebase Setup Instructions

To use Arkitecto AI with user authentication and database features, you need to create a Firebase project.

Follow these steps:

1.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click on "Add project".
    *   Follow the on-screen instructions to create a new project.

2.  **Enable Authentication:**
    *   In the Firebase Console, go to the "Authentication" section.
    *   Click on the "Sign-in method" tab.
    *   Enable the "Google" and "Email/Password" sign-in providers.

3.  **Enable Firestore:**
    *   In the Firebase Console, go to the "Firestore Database" section.
    *   Click on "Create database".
    *   Start in "test mode" for now. We will add security rules later.

4.  **Get Frontend Configuration:**
    *   In the Firebase Console, go to your Project settings.
    *   In the "General" tab, scroll down to "Your apps".
    *   Click on the web icon (`</>`) to create a new web app.
    *   Give it a name (e.g., "Arkitecto Frontend").
    *   You will be given a `firebaseConfig` object.
    *   Copy this object into a new file `frontend/src/services/firebaseConfig.ts`. You can use `frontend/src/services/firebaseConfig.ts.example` as a template.

5.  **Get Backend Configuration (Service Account):**
    *   In the Firebase Console, go to your Project settings.
    *   Go to the "Service accounts" tab.
    *   Click on "Generate new private key".
    *   This will download a JSON file.
    *   **IMPORTANT:** Treat this file as a secret. Do not commit it to Git.
    *   Rename the downloaded file to `serviceAccountKey.json` and place it in the `backend` directory.
    *   Update your `backend/.env` file to have a line like this:
        `GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json`

Once you have completed these steps, the application will be able to connect to Firebase.
