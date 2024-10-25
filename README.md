# Devsbot v.101
Step 1.1. Requirements for code:
The authentication should be performed via email or google account. We should ask the user's name and last name. There are two of types: non authenticated and authenticated.

The front end page should indicate users history of inputs and results.
Input should be in the form of form to collect the user's string (text).

Step 1.3. Main page.
Registration page should greet all types of users with the words “Dear dev, my aim is to help you build any software product with better user requirements. Your data is safely and securely stores in Google Cloud servers in accordance with GDPR policy. Good luck. If you have any inquiries feel free to reachout to hi@devs.kz.
Top part of the index.html should contain devs.png logo as a background logo for the main page
Bottom part of the index.html page should contain the wording “Proudly made in the hear of Central Asia - Almaty city. 2024 by Askar Aituov and Clause AI for KBTU. Copyright and trademark protected.

Step 1.4. Upon registration users should be asked whether they consent to receive email newsletter with updates or not.

Authorization page should include a “forget password” feature. If the user forgot the password user should be able to reset the password. News password reset action steps should be emailed to the user.

Step 1.5. The following items should be collected from user after user authentication and stores in the database:
User ID
User email
User name
User last name
User’s input date
User’s input text
System’s output date
System’s output text.
Indication whether user consent to receive email newsletter with updates or not

Step 1.6. The system should analyze the user story in the form of “As a user [text] I want to [text], so that [text].
The system should greet each user with a word “Hi Devs, what will you be designing today?”
The system should show the authenticated user’s history of outputs. For non authenticated users it should say “please login if you want to start working with devs.bot. and see your output history”
If authorized  user input text. Then the output should be shown to authorized user. The output should contain the following:
If the user story from user’s input does not contain words [user, want, so that] then system output “Your requirement is graded between 1-4 points”.
If user’s input is more than 20 words output should be ““Your requirement is graded between 1-4 points You user story is too abstract”
If user’s input has no words “As a user, I want to, so that” output should be ““Your requirement is graded between 3-5 points. Your user story does not follow user story structure”
If input contain too abstract ideas output should be “Your input is non atomic”
If user’s input has words “As a user, I want to, so that” output should be ““Your requirement is graded between 6-10 points”.


