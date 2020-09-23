// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBC54u6Xli9R0kTCp1qObSe1p78yE1LNeM",
  authDomain: "birthday-wishes-3005.firebaseapp.com",
  databaseURL: "https://birthday-wishes-3005.firebaseio.com",
  projectId: "birthday-wishes-3005",
  storageBucket: "birthday-wishes-3005.appspot.com",
  messagingSenderId: "1075538730481",
  appId: "1:1075538730481:web:b3bd5da4cc85ac7d163850"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        return true;
      },
      uiShown: function() {
        document.getElementById('loader').style.display = 'none';
      }
    },

    signInSuccessUrl: "home.html",

    signInOptions: [{
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: 'IN'
    }]
};

ui.start('#firebaseui-auth-container', uiConfig);


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    window.location = "home.html";
  }
});
