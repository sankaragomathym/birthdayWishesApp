
var form = document.sendWish
,   messageCont = document.querySelector("textarea")
,   charCountSpan = document.getElementById("charCountSpan")
,   viewPermissionCont = document.getElementById("viewPermissionCont")
,   previewBtn = document.getElementById("previewButton")
;

let charCounter = 0;
let name, msg, photoPresent, view, theme;


var storageRef = firebase.storage().ref();
var imagesRef = storageRef.child('images/default.jpg');



messageCont.addEventListener("change", countChar);
messageCont.addEventListener("keyup", countChar);
photoUpload.addEventListener("change", showPermission);
previewBtn.addEventListener("click", preview);
form.addEventListener("submit", submitForm);


function countChar() {
    charCountSpan.textContent = messageCont.textLength;
}

function showPermission() {
    if(form.photoUpload.value != "") {
        viewPermissionCont.classList.remove("hide");
    }
    else {
        viewPermissionCont.classList.add("hide");
    }
}

function validateForm() {

    var isValid = true;
  
    var els = [form.name, form.wishMessage];
  
    for(var i = 0; i < 2; i++) {
  
      if(els[i].value == "") {
        els[i].classList.add("error");
        els[i].placeholder = "Required";
        isValid = false;

        //scroll to show error
        document.documentElement.scrollTop = form.offsetTop;
  
        els[i].addEventListener("focus", removeError, false);
      }
    }
  
    return isValid;
}
  
function removeError(event) {
    var el = event.target;
    el.placeholder = el.getAttribute("data-text");
    el.classList.remove("error");
    el.removeEventListener("focus", removeError);
}

function getTheme() {
    for(var i = 0; i < form.theme.length; i++) {
        if(form.theme[i].checked) {
            return (i+1);
        }
    }
}

function submitForm(e) {
    e.preventDefault();

    name = encodeURIComponent(form.name.value);
    msg = encodeURIComponent(form.wishMessage.value);
    photoPresent = form.photoUpload.files.length ? true : false;
    view = photoPresent ? form.viewPermission[1].checked : false;
    theme = getTheme();

    if(validateForm()) {
        showProgress();

        if(photoPresent) {
            uploadPhoto(form.photoUpload.files[0]);
        }
        else {
            saveWishes(name, msg, theme, photoPresent, view);
        }
    }
   
}

function preview() {

    if(validateForm()) {

        if (form.photoUpload.files && form.photoUpload.files[0]) {

            var reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector(".dialog img").src = e.target.result;
            }    
            reader.readAsDataURL(form.photoUpload.files[0]); // convert to base64 string
        }
        else {
            imagesRef.getDownloadURL().then(function(url) {
                document.querySelector(".dialog img").src = url;
            }).catch(function(error) {
                console.error(error);
            });
        }

        theme = getTheme();
        showDialog(theme, form.name.value, form.wishMessage.value);
    }
}


function uploadPhoto(file) {

    var metadata = {
        contentType: 'image/jpeg'
    };

    var user = firebase.auth().currentUser;

    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child('images/' + user.uid + '/userPhoto.jpg').put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {

        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById("progressPerc").textContent = "(" + parseInt(progress) + "% completed)";

        console.log('Upload is ' + progress + '% done');

        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }

    }, function(error) {

        switch (error.code) {
            case 'storage/unauthorized':
                console.log("User doesn't have permission to access the object");
                break;

            case 'storage/canceled':
                console.log("User canceled the upload");
                break;

            case 'storage/unknown':
                console.log("Unknown error occurred, inspect error.serverResponse");
                break;
        }

    }, function() {
        console.log("uploaded");

        name = encodeURIComponent(form.name.value);
        msg = encodeURIComponent(form.wishMessage.value);
        view = form.viewPermission[1].checked;
        theme = getTheme();

        saveWishes(name, msg, theme, true, view);
        
    });
}


//save to db
function saveWishes(name, message, theme, photoPresent, view) {
    var user = firebase.auth().currentUser;

    firebase.database().ref('users/' + user.uid).set({
        name: name,
        message: message,
        theme: theme,
        photoPresent: photoPresent,
        viewPermission: view

    }).then(function() {
        
        closeDialog();
        window.location = "home.html";

    }).catch(function(error) {
        console.error(error);
    });
}
