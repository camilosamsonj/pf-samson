const admin = require('firebase-admin');
const serviceAccount = require('./key_service_account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const usersCollection = db.collection("users");
const studentsCollection = db.collection("students");
const coursesCollection = db.collection("courses");

async function uploadData() {
    try {
        const jsonData = require('./db.json');
        console.log("Contenido de db.json:", jsonData); // Verificar el contenido de db.json
        if (Array.isArray(jsonData)) {
            await Promise.all(
                jsonData.map(async data => {
                    await usersCollection.add(data);
                })
            );
            console.log("Datos cargados correctamente en Firestore.");
        } else {
            console.error("Error: El archivo db.json no contiene un array válido.");
        }
    } catch (error) {
        console.error("Error al cargar los datos a Firestore:", error);
    }
}

(async () => {
    await uploadData();
})();