/*
  CONFIGURACIÓN OPCIONAL DE FIREBASE FIRESTORE
  --------------------------------------------
  Si no pegas tu configuración, la página funciona igual, pero las respuestas
  solo se muestran durante la sesión (no se comparten ni se guardan).

  PASOS:
  1. Entra a https://console.firebase.google.com y crea un proyecto.
  2. Agrega una "app web" (ícono </>) y copia el objeto firebaseConfig.
  3. Pégalo abajo reemplazando los valores de ejemplo.
  4. En "Firestore Database", crea la base de datos (modo producción).
  5. En la pestaña "Reglas", pega las reglas de abajo y publícalas.

  REGLAS RECOMENDADAS (solo permiten crear y leer respuestas anónimas):

  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /respuestas/{doc} {
        allow read: if true;
        allow create: if request.resource.data.keys().hasOnly(['obraId', 'emociones', 'creado'])
          && request.resource.data.obraId is string
          && request.resource.data.emociones is list
          && request.resource.data.emociones.size() > 0
          && request.resource.data.emociones.size() <= 10
          && request.resource.data.creado == request.time;
        allow update, delete: if false;
      }
    }
  }
*/

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// 1) Pega aquí la configuración de TU proyecto Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyBfWo4TOLwPoytQYR0jhK4Iq2bPF08xLhk",
  authDomain: "cuadro-de-emociones.firebaseapp.com",
  projectId: "cuadro-de-emociones",
  storageBucket: "cuadro-de-emociones.firebasestorage.app",
  messagingSenderId: "1095951132845",
  appId: "1:1095951132845:web:0be065cffcbe71a2d97e24"
};

const CONFIGURADO = !firebaseConfig.apiKey.startsWith('TU_');
const db = CONFIGURADO ? getFirestore(initializeApp(firebaseConfig)) : null;

export const isFirebaseReady = () => CONFIGURADO;

/** Guarda una respuesta anónima: { obraId, emociones: [...], creado }. */
export async function saveResponse(obraId, emociones) {
  if (!CONFIGURADO) throw new Error('Firebase no está configurado');
  await addDoc(collection(db, 'respuestas'), {
    obraId,
    emociones,
    creado: serverTimestamp()
  });
}

/**
 * Escucha en tiempo real las respuestas de una obra.
 * callback(conteo, total): conteo = { emocionId: cantidadDeVisitantes }
 * Devuelve la función para dejar de escuchar.
 */
export function subscribeResults(obraId, callback) {
  const q = query(collection(db, 'respuestas'), where('obraId', '==', obraId));
  return onSnapshot(q, (snapshot) => {
    const conteo = {};
    let total = 0;
    snapshot.forEach((doc) => {
      total++;
      (doc.data().emociones || []).forEach((e) => {
        conteo[e] = (conteo[e] || 0) + 1;
      });
    });
    callback(conteo, total);
  }, (err) => console.error('Error al leer resultados:', err));
}
