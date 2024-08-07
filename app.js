const firebaseConfig = {
  apiKey: "AIzaSyB5ZuGD61nas_hqm7SjY_N5LIljZtrKOu0",
  authDomain: "devsbot-a5afc.firebaseapp.com",
  projectId: "devsbot-a5afc",
  storageBucket: "devsbot-a5afc.appspot.com",
  messagingSenderId: "954087903869",
  appId: "1:954087903869:web:3d39b015d7c6a31c86d714",
  measurementId: "G-XWZ602QD6G"
};


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById('googleSignIn').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

document.getElementById('emailSignInForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password);
});

auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    document.getElementById('auth').style.display = 'none';
    document.getElementById('inputForm').style.display = 'block';
  } else {
    // No user is signed in
    document.getElementById('auth').style.display = 'block';
    document.getElementById('inputForm').style.display = 'none';
  }
});

document.getElementById('submitInput').addEventListener('click', () => {
  const user = auth.currentUser;
  const userInput = document.getElementById('userStoryInput').value;

  const output = analyzeUserStory(userInput);

  db.collection('userStories').add({
    userId: user.uid,
    userEmail: user.email,
    userName: user.displayName.split(' ')[0],
    userLastName: user.displayName.split(' ')[1],
    inputDate: new Date(),
    inputText: userInput,
    outputDate: new Date(),
    outputText: output
  });
});

function analyzeUserStory(userStory) {
  if (userStory.split(' ').length > 20) {
    return 'Your user story is too abstract';
  }
  if (!userStory.includes('As a user') || !userStory.includes('I want to') || !userStory.includes('so that')) {
    return 'Your user story does not follow user story structure';
  }
  // Add more logic for non-atomic checks
  return 'Your input is non-atomic';
}

auth.onAuthStateChanged(user => {
  if (user) {
    db.collection('userStories').where('userId', '==', user.uid).orderBy('inputDate', 'desc').onSnapshot(snapshot => {
      document.getElementById('history').innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const entry = document.createElement('div');
        entry.innerHTML = `
          <p>Input Date: ${data.inputDate.toDate()}</p>
          <p>Input: ${data.inputText}</p>
          <p>Output Date: ${data.outputDate.toDate()}</p>
          <p>Output: ${data.outputText}</p>
        `;
        document.getElementById('history').appendChild(entry);
      });
    });
  }
});
