
var json = [];
var admin = {};

var wishcardCont = document.querySelector(".wishcard-cont")
,   searchCont = document.querySelector(".search-cont")
,   searchClose = searchCont.querySelector(".search-close")
,   searchBox = document.getElementById("searchBox")
,   searchResult = document.querySelector(".search-result")
;

var defaultImage;

var storageRef = firebase.storage().ref();
var imagesRef = storageRef.child('images/default.jpg');


function fetchData() {

    firebase.database().ref('users').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            let childData = childSnapshot.val();
            childData.id = childSnapshot.key;
            json.push(childData);
        });

        showGallery(json, wishcardCont);
    });
}

function showGallery(json, parent) {

    for(let i = 0; i < json.length; i++) {

        let name = decodeURIComponent(json[i].name)
        ,   msg = decodeURIComponent(json[i].message)
        ,   photoPresent = json[i].photoPresent
        ,   view = json[i].viewPermission
        ,   theme = json[i].theme
        ;

        var user = firebase.auth().currentUser;

        let imageUrl;
        let wishcard = document.createElement("div");

        switch(theme) {
            case 2 :    wishcard.className = "wishcard blue-bg";
                        break;
    
            case 3 :    wishcard.className = "wishcard red-bg";
                        break;
    
            case 4 :    wishcard.className = "wishcard green-bg";
                        break;
    
            default :   wishcard.className = "wishcard pink-bg";
        }


        let photoCont = document.createElement("div");
        photoCont.className = "wisher-photo";
        let image = document.createElement("img");
        image.setAttribute("alt", "Photo");

        if(photoPresent && (view || user.uid === json[i].id || user.phoneNumber === admin.phone) ) {
            var photoRef = storageRef.child('images/' + json[i].id + '/userPhoto.jpg');

            photoRef.getDownloadURL().then(function(url) {
                image.src = url;
                imageUrl = url;
            }).catch(function(error) {
                imagesRef.getDownloadURL().then(function(url) {
                    image.src = url;
                    imageUrl = url;
                }).catch(function(error) {
                    console.error(error);
                });
            });
        }
        else {
            imagesRef.getDownloadURL().then(function(url) {
                image.src = url;
                imageUrl = url;
            }).catch(function(error) {
                console.error(error);
            });
        }

        photoCont.appendChild(image);
        wishcard.appendChild(photoCont);


        let msgCont = document.createElement("div");
        msgCont.className = "wisher-message";
        msgCont.textContent = msg;
        wishcard.appendChild(msgCont);


        let signature = document.createElement("div");
        signature.className = "wisher-signature";

        let leftDiv = document.createElement("div");
        let div1 = document.createElement("div");
        div1.className = "compliment";
        div1.textContent = "With Love,";
        let nameCont = document.createElement("div");
        nameCont.className = "wisher-name";
        nameCont.textContent = name;

        leftDiv.appendChild(div1);
        leftDiv.appendChild(nameCont);

        let viewButton = document.createElement("button");
        viewButton.textContent = "View";

        signature.appendChild(leftDiv);
        signature.appendChild(viewButton);

        wishcard.appendChild(signature);


        parent.appendChild(wishcard);

        viewButton.addEventListener("click", function() {
            showDialog(theme, name, msg, imageUrl);
        });
        
    }
}

searchBox.addEventListener("keyup", searchInAction);
searchClose.addEventListener("click", clearSearch);

function searchInAction(e) {
    if(searchBox.value == "") {
        clearSearch();
        return;
    }

    searchClose.classList.remove("hide");
    if(e.keyCode == 13) {
        showSearchResult();
    }
}

function showSearchResult() {
    var key = searchBox.value.toLowerCase();
    var newJson = [];
    for(let i = 0; i < json.length; i++) {
        let name = decodeURIComponent(json[i].name).toLowerCase();
        if(name.includes(key)) {
            newJson.push(json[i]);
        }
    }
    
    wishcardCont.classList.add("hide");
    searchResult.classList.remove("hide");

    if(newJson.length) {
        showGallery(newJson, searchResult);
    }
    else {
        searchResult.textContent = "No results found.";
    }
}

function clearSearch() {
    searchBox.value = "";
    searchClose.classList.add("hide");
    searchResult.innerHTML = "";
    searchResult.classList.add("hide");
    wishcardCont.classList.remove("hide");
}
