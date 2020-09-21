const form = document.querySelector('#score_form');

const API_ADD_URL = 'https://authentisci-api.herokuapp.com/api/v1/add';

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let formdata = new FormData(form);

    const http = new XMLHttpRequest();
    http.open('POST', API_ADD_URL, true);

    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    var object = {};
    formdata.forEach((value, key) => {object[key] = value});
    var jsondata = JSON.stringify(object);
    console.log(jsondata)

    for (const kk in object) {
        if (object[kk] == "") {
            alert("All values need to be filled");
            return;
        }
    };
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            alert("Score submitted successfully!");
        }
        if (http.readyState == 4 && http.status != 200) {
          alert("Problem with submitting score :( Try again later...");
        };
    }

    http.onload = () => {
        console.log(http.responseText);
    };

    http.send(jsondata);
    
});

document.addEventListener('DOMContentLoaded', function () {
    browser.tabs.query (
         { currentWindow: true, active: true },
         function(tabs) {
             var activeTab = tabs[0];
             document.getElementById("url").value = activeTab.url;
         });
   });