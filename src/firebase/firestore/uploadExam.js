const admin = require('firebase-admin');
const fs = require('fs');

// Initialiser Firebase Admin med din service account nøkkel
const serviceAccount = require('../../../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Les inn exam1.json som inneholder spørsmålene dine
const examData = JSON.parse(fs.readFileSync('exam6.json', 'utf-8'));

async function uploadExam() {
  // Bruk examData.examId som dokument-ID i "exams"-samlingen
  const examRef = db.collection('exams').doc(examData.examId);

  // Sett opp dokumentet. Siden du ikke ønsker et ekstra title-felt, kan du eventuelt sette et tomt objekt:
  await examRef.set({});

  // Last opp spørsmålene som dokumenter i subcollectionen "questions"
  for (const question of examData.questions) {
    if (!question.questionText) {
      console.error('Spørsmål mangler questionText:', question);
      continue;
    }
    await examRef.collection('questions').add({
      questionText: question.questionText,
      options: question.options,
      correctChoice: question.correctChoice
    });
  }

  console.log(`Exam ${examData.examId} ble lastet opp!`);
}

uploadExam().catch(console.error);
