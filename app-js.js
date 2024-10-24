// DOM Elements
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const mainSection = document.getElementById('main-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const storyForm = document.getElementById('story-form');
const historyList = document.getElementById('history-list');
const analysisResult = document.getElementById('analysis-result');

// Navigation functions
document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Authentication
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        loginForm.reset();
    } catch (error) {
        alert(error.message);
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const newsletterConsent = document.getElementById('newsletter-consent').checked;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(userCredential.user.uid).set({
            firstName,
            lastName,
            email,
            newsletterConsent,
            createdAt: new Date()
        });
        registerForm.reset();
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('google-login').addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        // Check if user exists in our database
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            // Create new user document
            await db.collection('users').doc(user.uid).set({
                firstName: user.displayName.split(' ')[0],
                lastName: user.displayName.split(' ')[1] || '',
                email: user.email,
                newsletterConsent: false,
                createdAt: new Date()
            });
        }
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('forgot-password').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = prompt('Please enter your email address:');
    if (email) {
        try {
            await auth.sendPasswordResetEmail(email);
            alert('Password reset email sent! Please check your inbox.');
        } catch (error) {
            alert(error.message);
        }
    }
});

// User story analysis
function analyzeUserStory(story) {
    const hasStructure = story.toLowerCase().includes('as a user') && 
                        story.toLowerCase().includes('i want to') && 
                        story.toLowerCase().includes('so that');
    const wordCount = story.split(' ').length;
    
    if (!hasStructure) {
        return {
            grade: '3-5',
            message: 'Your requirement is graded between 3-5 points. Your user story does not follow user story structure'
        };
    }
    
    if (wordCount > 20) {
        return {
            grade: '1-4',
            message: 'Your requirement is graded between 1-4 points. Your user story is too abstract'
        };
    }
    
    return {
        grade: '6-10',
        message: 'Your requirement is graded between 6-10 points'
    };
}

storyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const story = document.getElementById('user-story').value;
    const analysis = analyzeUserStory(story);
    
    try {
        const user = auth.currentUser;
        if (user) {
            // Save to database
            await db.collection('userStories').add({
                userId: user.uid,
                inputText: story,
                inputDate: new Date(),
                outputText: analysis.message,
                outputDate: new Date()
            });
            
            // Display result
            analysisResult.textContent = analysis.message;
            
            // Refresh history
            loadUserHistory();
            storyForm.reset();
        }
    } catch (error) {
        alert(error.message);
    }
});

// Load user history
async function loadUserHistory() {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        const snapshot = await db.collection('userStories')
            .where('userId', '==', user.uid)
            .orderBy('inputDate', 'desc')
            .get();
        
        historyList.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <p><strong>Input:</strong> ${data.inputText}</p>
                <p><strong>Analysis:</strong> ${data.outputText}</p>
                <p><small>Date: ${data.inputDate.toDate().toLocaleString()}</small></p>
            `;
            historyList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Auth state observer
auth.onAuthStateChanged(user => {
    if (user) {
        loginSection.classList.add('hidden');
        registerSection.classList.add('hidden');
        mainSection.classList.remove('hidden');
        loadUserHistory();
    } else {
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
        mainSection.classList.add('hidden');
    }
});
