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



var main = document.querySelector(".main")
,   loader = document.getElementById("pageLoader")
,   header = document.querySelector("header")
,   wishForm = document.getElementById("wishForm")
,   gallery = document.getElementById("gallery")
,   dialogOverlay = document.querySelector(".dialog-overlay")
,   closeBtn = dialogOverlay.querySelector(".close")
,   singleWishCard = document.getElementById("singleWishCard")
,   progressBar = document.getElementById("progressBar")
,   cardCont = singleWishCard.querySelector(".card-cont")
,   wisherPhoto = cardCont.querySelector(".wisher-photo")
,   wisherMessage = cardCont.querySelector(".wisher-message")
,   wisherName = cardCont.querySelector(".wisher-name")
;

var admin = {};

firebase.database().ref('admin').once('value', function(snapshot) {
    admin = snapshot.val();
    //console.log("name: " + admin.name + "\nPhone: " + admin.phone); 
});

firebase.auth().onAuthStateChanged(user => {

    var user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('users/' + user.uid).once("value", snapshot => {
          if(snapshot.exists() || user.phoneNumber == admin.phone) {
              main.classList.remove("yellow-bg");
              main.classList.add("black-bg");
              header.classList.remove("hide");
              gallery.classList.remove("hide");
              fetchData();
              loader.classList.add("hide");
          }
          else {
              main.classList.remove("black-bg", "hide");
              main.classList.add("yellow-bg");
              header.classList.remove("hide");
              wishForm.classList.remove("hide");
              loader.classList.add("hide");
          }
      });
    }
    else {
        window.location = "index.html";
    }
});


//show single wish card in dialog
function showDialog(wisherTheme, wName, wMessage, imageUrl) {

    switch(wisherTheme) {
        case 2 :    cardCont.className = "card-cont blue-bg";
                    break;

        case 3 :    cardCont.className = "card-cont red-bg";
                    break;

        case 4 :    cardCont.className = "card-cont green-bg";
                    break;

        default :   cardCont.className = "card-cont pink-bg";
    }

    wisherMessage.textContent = wMessage;
    wisherName.textContent = wName;
    
    if(imageUrl) {
        wisherPhoto.querySelector("img").src = imageUrl;
    }

    document.body.classList.add("no-scroll");
    dialogOverlay.classList.remove("hide");
    singleWishCard.classList.remove("hide");
    closeBtn.classList.remove("hide");

    document.addEventListener("keydown", function(e) {
        if(e.keyCode == 27) {
            closeDialog();
        }
    });
}


function showProgress() {
    document.body.classList.add("no-scroll");
    dialogOverlay.classList.remove("hide");
    progressBar.classList.remove("hide");
    closeBtn.classList.add("hide");
}

closeBtn.addEventListener("click", closeDialog);

//close dialog
function closeDialog() {
    dialogOverlay.classList.add("hide");
    singleWishCard.classList.add("hide");
    document.body.classList.remove("no-scroll");
}


document.getElementById("signOut").addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    firebase.auth().signOut();
    window.location = "index.html";
});
