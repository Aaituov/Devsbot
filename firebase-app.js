// Initialize Firebase configuration
const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",

};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Function to handle file upload to Firebase Storage
async function uploadLogo(file) {
  const storageRef = storage.ref();
  const logoRef = storageRef.child('devs.png');
  try {
    await logoRef.put(file);
    const logoUrl = await logoRef.getDownloadURL();
    return logoUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Function to handle user registration
async function registerUser(email, password, firstName, lastName, newsletter) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    await db.collection('users').doc(user.uid).set({
      email: email,
      firstName: firstName,
      lastName: lastName,
      newsletter: newsletter,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Function to handle Google sign-in
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    // Check if user exists in our database
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (!userDoc.exists) {
      // If new Google user, prompt for additional info
      // You'll need to implement this UI
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        firstName: '',  // To be collected via UI
        lastName: '',   // To be collected via UI
        newsletter: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

// Function to handle password reset
function resetPassword(email) {
  return auth.sendPasswordResetEmail(email);
}

// Function to analyze user story
function analyzeUserStory(input) {
  const words = input.toLowerCase().split(' ');
  const hasUserStoryStructure = input.includes('As a user') && 
                               input.includes('I want to') && 
                               input.includes('so that');
  
  let grade = '';
  
  if (!words.includes('user') || !words.includes('want') || !words.includes('so')) {
    grade = 'Your requirement is graded between 1-4 points';
  }
  
  if (words.length > 20) {
    grade = 'Your requirement is graded between 1-4 points. Your user story is too abstract';
  }
  
  if (!hasUserStoryStructure) {
    grade = 'Your requirement is graded between 3-5 points. Your user story does not follow user story structure';
  }
  
  if (hasUserStoryStructure) {
    grade = 'Your requirement is graded between 6-10 points';
  }
  
  // Check for abstract ideas (this is a simple implementation)
  if (words.some(word => ['system', 'solution', 'application', 'platform'].includes(word))) {
    grade += '\nYour input is non atomic';
  }
  
  return grade;
}

// Function to save user story analysis
async function saveUserStory(userId, input, output) {
  try {
    await db.collection('userStories').add({
      userId: userId,
      input: input,
      inputDate: firebase.firestore.FieldValue.serverTimestamp(),
      output: output,
      outputDate: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving user story:", error);
    throw error;
  }
}

// Function to get user's history
async function getUserHistory(userId) {
  try {
    const snapshot = await db.collection('userStories')
      .where('userId', '==', userId)
      .orderBy('inputDate', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user history:", error);
    throw error;
  }
}
