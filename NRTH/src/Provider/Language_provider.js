import { Alert, ToastAndroid, I18nManager, Platform } from "react-native";
import { localStorage } from './localStorageProvider';
import AsyncStorage from "@react-native-community/async-storage";
import { config } from "./configProvider";

global.language_key = 1;
class Language_provider {

  language_get = async () => {
    var item = await AsyncStorage.getItem('language');
    console.log('check launguage option', item)
    if (item != null) {
      config.language = item;
    }
    console.log('language_key123', config.language)
  }

  language_set = (value) => {
    config.language = value;
    localStorage.setItemObject('language', value)
  }


  // Media option ///////////////////
  MediaCamera = ['Camera', ''];
  Mediagallery = ['Gallery', ''];
  cancelmedia = ['Cancel', ''];

  //common text this  application 


  //RUPESH CHANGES /////////////////////
  //common text this  application 
  appName = ["N R T H"]
  Grittxt = ['GRIT']
  Stamina = ['STAMINA']
  Resilence = ["RESlLENCE"]
  Logintxt = ['Log in']
  Signup = ['Sign Up']
  Successfully = ['Successfully']
  verifyToken = ['VerifyToken']



  // login  screen
  Welcomeback = ['Welcome back! Log in here:']

  EmailAddress = ['E-mail Address']
  Password = ['Password']
  Privacynotice = ['Privacy notice']
  Bysigningupyouare = ['By signing up you are agreeing to']
  ourtxt = ['our']
  Recoverpassword = ['Recover password']
  Sendmagiclink = ['Send magic link']
  TermsServices = ['Terms & Services ']
  and = ['and']
  PrivacyPolicy = ['Privacy Policy']

  //Sign up screen
  Signupandgetmoving = ['Sign up and get moving']
  NameSurname = ['Name Surname']
  Repeatpassword = ['Repeat Password']
  LogIn = ['Log In']

  // Recover Password Screen
  RecoverPasswordHere = ['Recover Password in here:']
  Submit = ['Submit']


  // +++++ Shubham Mahajan
  // +++++ Challenges configurator
  challengeConfigurator = ["CHALLENGE \n CONFIGURATOR"]
  selectLeveltxt = ["Select level"];
  selectOptiontxt = ["Select Option"];

  beginner = ["BEGINNER"];
  strength = ["Strength"];
  strengthCapitalTxt = ["STRENGTH"];
  cardio = ["Cardio"];
  elite = ["ELITE"];
  savage = ["SAVAGE"]

  // +++++ Challenges configurator - Strength
  setyourfirstexercise = ["Set your first exercise"];
  everydayFor = ["Everyday for"];
  days = ["Days"];
  completingThisActivity = ["Completing this activity \nwill earn you your 1st trophy"];
  addExercise = ["Add exercise"];

  // +++++ Challenges configurator - Cardio
  every = ["Every"]
  for = ["for"]

  // +++++ Exercise List - First One 
  exerciseList = ["EXERCISE LIST"]
  yourChallenges = ["Your challenges"]
  addAnotherChallenge = ["Add another challenge"]
  complete = ["Complete"]
  setStartingTime = ["Set starting time"]
  confirm = ["Confirm"]
  removeStartingTime = ["Remove starting time"]

  //  +++++ Daily Exercise List  
  yourDailyExercise = ["YOUR DAILY EXERCISE"]
  TodayIsTheDay = ["Today is the day to take it to the next level"]
  todayIsTheDayToTakeIt = ["Today is the day to take it to the next level"]
  yourActiveChallenges = ["Your active challenges"]
  clickOnTheBadgeToStart = ["Click on the badge to start the challenge, swipe left to delete."]
  delete = ["Delete"]
  editStartingTime = ["Edit starting time"]
  areYouSureYouWantToDeleteChallenge = ["Are you sure you want to delete this challenge?"]
  youCanAchieveYourBadgeInJust = ["You can achieve your badge in just"]
  yesIWantToDelete = ["Yes, I want to delete"]
  doNotDelete = ["Do not delete"]

  //  ++++++ Proflle Page 
  profile = ["PROFILE"]
  editProfile = ["edit profile"]
  MyBadges = ["My badges"]
  liveChallenges = ["LIVE CHALLENGES"]
  trophyCabinet = ["TROPHY CABINET"]
  logOut = ["Log Out"]

  //  ++++++ Edit Proflle Page 
  editProfileCapitalTxt = ["EDIT PROFILE"]
  nameSurname = ["Name Surname"]
  eMailAddress = ["E-mail Address"]
  Password = ["Password"]
  saveChanges = ["Save changes"]
  leaveWithoutSaving = ["Leave without saving"]

  // ++++++ Reset Password 
  NewPassword = ["New Password"]
  ConfirmPassword = ["Confirm Password"]



  //  ++++++ Start Challenge
  startChallenge = ["START CHALLENGE"]
  areYouReady = ["ARE YOU READY?"]
  startNow = ["Start now"]
  startWithoutVideo = ["Start without video"]
  nextChallengeCapitalTxt = ["NEXT CHALLENGE:"]
  pause = ["Pause"]

  //  ++++++ Start and Record
  startingIn = ["Starting in"]
  inProgress = ["In progress"]
  completeCapitalTxt = ["COMPLETE!"]
  addToGallery = ["Add to gallery"]
  minutes = ["minutes"]
  challengeRecords = ["CHALLENGE RECORDS"]
  start = ["Start"]
  end = ["End"]
  nextChallenge = ["Next challenge"]
  readySet = ["Ready, Set,"]
  _in = ["in"]
  backToChallenges = ["Back to challenges"]
  preferences = ["Preferences"]
  cancelRecoding = ["Cancel recording"]
  countdownTimer = ["Countdown timer"]
  defaultCamera = ["Default camera"]
  claimYourBadge = ["Claim your badge!"]
  youHaveEarnedYourNewBadge = ["YOU HAVE EARNED YOUR NEW BADGE!"]
  saveInProfile = ["Save in profile"]


  workoutCompletedForToday = ["WORKOUT COMPLETED FOR TODAY!"]
  yourAthleteBadgesAreOne = ["Your athlete badges are one step closer again"]
  seeYouTomorrow = ["SEE YOU TOMORROW!"]
  daysToachieve = ['Days to achieve your badges:']
  readyFor = ['Ready for tomorrow!']


//===================  Subscription Plan Screen ======
SelectSubscriptionPlan = ['Select Subscription Plan']

Subscribe = ['Subscribe']









  // ================================= Added By Rupesh Validation =================================
  // ================================= Login =================================
  emptyEmail = ['Please enter email address.']
  emailMaxLength = ['Email is too long.']
  validEmail = ['Email address is not correct, Please enter a valid email address.']
  emailNotRegistered = ['Entered email address not registered with us.']
  greaterThenZero =["Please enter value greater then zero."]
  greaterThenZeroDay =["Please enter value greater then zero."]
  greaterThen48 =["Please enter value greater then 48."]

  // ================================= Password =================================
  emptyPassword = ['Please enter your password.']
  passwordMaxLength = ['Password too long.']
  passBlank = ['Please enter password.']
  passwordMinLength = ['Password cannot be less than 8 characters.']
  passMaxLength = ['Password cannot be greater than 17 characters.']
  caseSensitivePass = ['Password must be case sensitive.']
  validPassword = ['Spaces not allowed in password.']
  passFormate = ['Password use atleast 8 characters long, one upper and lower case characters, numeric number and special character.']
  cPassBlank = ['Please enter repeat password.']
  cPassCharLess = ['Repeat password cannot be less than 8 characters.']
  cPassMaxLength = ['Repeat password cannot be greater than 17 characters.']
  cPassNotMatch = ['Passowrd and repeat password fields must be equal.']
  passNotFormate = ['Password must be at least 8 characters long, contain at least one number and special character and have a mixture of uppercase and lowercase letters.']
  emailPassNotCorrect = ['Entered email addres or password are not correct, Please try again.']
  emailPassNotCorrect1 = ['Entered email address and password are invaild.']
  inCorrectPass = ['Entered password are incorrect, Please Try again.']
  termsAndCondition = ['Please accept Terms & Conditions and Privacy Policy to continue.']
  Sign_In_or_Login_error_msg = ['Please enter the above fields.']

  // ================================= contact us =================================
  emptyFullName = ['Please enter full name.']
  fullNameMinLength = ['Full name is too short.']
  fullNameMaxLength = ['Please enter full name between 2 to 32 characters.']
  validName = ['Spaces not allowed in full name.']
  messageSend = ['Message sent successfully.']
  validMessage = ['Spaces not allowed in message.']
  ifNumAvailinName = ['Please enter vaild credentials, full name not only numeric.']
  emptyName = ['Please enter email address.']
  inCorrectEmail = ['Email address is not correct, Please enter valid email address.']
  alreadyUsedEmail = ['Entered email address already being in use.']

  // ================================= Level Configuratin =================================

  levelNotSelected = ['Please select Type.']
  excerciseNotSelect = ['Please select excercise.']

  // ================================= Add Excercise =================================

  chooseExcercise = ['Please choose an exercise.']

  // ================================= Add another challenge =================================

  // addAnotherChallenge = ['Please add another challengee.']

  // ================================= Complete =================================

  selectChallenge = ['Please select a challengee.']

  // ================================= Edit Profile =================================

  emptyProfileImage = ['Please select profile image.']
  emptyFullName = ['Please enter your full name.']
  nameMaxLength = ['Please enter a full name between 2 to 32 characters.']
  nameNumCheck = ['Please enter valid credentials, Your full name cannot contain numbers.']
  incorrectEmailAddress = ['Your email address is incorrect, Please enter a valid email address.']
  emailAlreadyInUse = ['This email address already being in use.']

  // ================================= App logout =================================

  logoutPress = ['Are you sure you want to log out?']

  // ================================= Delete Account =================================

  deleteAccoutValidation = ['Are you sure you want to delete your account?']











}
export const Lang_chg = new Language_provider();






