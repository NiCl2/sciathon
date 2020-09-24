// matching to MONGO database 
const API_URL = 'https://authentisci-api.herokuapp.com/api/v1/average?ad=';

const API_URL_ALL = 'https://authentisci-api.herokuapp.com/api/v1/all';

const API_REQUEST_URL = 'https://authentisci-api.herokuapp.com/api/v1/request';


Chart.pluginService.register({
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
      var ctx = chart.chart.ctx;
      var centerConfig = chart.config.options.elements.center;
      var centerSubConfig = chart.config.options.elements.centerSub;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var txtSub = centerSubConfig.text;
      var color = centerConfig.color || '#000';
      var maxFontSize = centerConfig.maxFontSize || 75;
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
      // Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      var minFontSize = centerConfig.minFontSize;
      var lineHeight = centerConfig.lineHeight || 25;
      var wrapText = false;

      if (minFontSize === undefined) {
        minFontSize = 20;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      ctx.fillText(txt, centerX, centerY);
      ctx.font = "15px " + fontStyle;
      ctx.fillText(txtSub, centerX, centerY + 40);
    }
  }
});

function drawDoughnut(inputData, n_txt) {
  var ctx = document.getElementById('chart').getContext('2d');
    if (inputData === null) {
        inputData = 0;
        var centerTxt = 'Article not yet scored.';
    } else {
      var centerTxt = inputData +'/10';
    }
    var ringColour;
    if(inputData < 4){
      ringColour = "#D6142E"
    } else if(inputData < 5){
      ringColour = "#F1B353"
    } else if(inputData === 5){
      ringColour = "#FFFF66"
    } else if(inputData < 8){
      ringColour = "#A7D366"
    } else{ // inputData>=8!!
      ringColour = "#4FA766"
    }
    var config = {
        type: 'doughnut',
        data: {
            labels: null,
            datasets: [{
            data: [inputData, 10-inputData],
            backgroundColor: [
                `${ringColour}`,
                "#d3d3d3"
            ]
            }]
        },
        options: {
            legend: {
              display: false
            },
            tooltips: {
              enabled: false
            },
            hover: {
              mode: null
            },
            cutoutPercentage: 90,
            elements: {

              center: {
                  text: centerTxt,
                  fontStyle: 'Arial',
                  sidePadding: 20,
                  minFontSize: 20,
                  lineHeight: 25
              },
              centerSub: {
                text: n_txt,
                fontColor: "#a6a6a6",
                minFontSize: 10,
                maxFontSize: 15
              }
            }
        }
    };
    var myChart = new Chart(ctx, config);
};

var submit_request = function(){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    if (!document.getElementById("sources").innerHTML == "") {
      alert("This website has a score already ;)");
      return;
    };
    var http = new XMLHttpRequest();
    http.open('POST', API_REQUEST_URL, true);
    var params = '{"url":"' +  url +'"}';
    http.setRequestHeader('Content-type', 'application/json');

    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            alert("Request submitted successfully!");
        }
        if (http.readyState == 4 && http.status != 200) {
          alert("Problem with submitting request :( Try again later...");
        };
    }
    console.log("Submit request");
    http.send(params);
  });
};

// links to our website
document.getElementById('clickme-signin').addEventListener('click', function(){
  chrome.tabs.create({url: 'https://orcid.org/oauth/authorize?client_id=APP-NPKDH3DEAO6YUP22&response_type=code&scope=/authenticate&redirect_uri=https://www.authentisci.com/rating'});
});
document.getElementById('clickme-request').addEventListener('click', function(){
  submit_request();
});

document.getElementById('clickme-about').addEventListener('click', function(){
  chrome.tabs.create({url: 'https://www.authentisci.com/about'});
});
document.getElementById('clickme-contact').addEventListener('click', function(){
  chrome.tabs.create({url: 'https://www.authentisci.com/contact'});
});

function dbGetAllUrls() {
  fetch(API_URL_ALL)
    .then(res => res.json())
    .then(data => {
      chrome.storage.local.set({ "scores_data" : data });
      d = new Date();
      chrome.storage.local.set({ "scores_date" : d.toDateString() });
    }).catch(err => {
      console.log(err);
      console.log("Error occured when trying to access the database.");
    });

};

function dbCheckUrls(url) {
  fetch(API_URL + url)
    .then(res => res.json())
    .then(data => {

      drawDoughnut(parseInt(data.score), 'Reviewed by ' + data.n + ' scientists');

      document.getElementById("sources").innerHTML = data.sources;
      document.getElementById("bias").innerHTML = data.bias;
      document.getElementById("clarity").innerHTML = data.clarity;

    }).catch(err => {

      drawDoughnut(null, 'Request below');
        
    });

};

function storageCheckUrls(url) {
  var gettingItem = chrome.storage.local.get('scores_data');
   gettingItem.then((result) => {
     //console.log(url);
     for (const ii in result['scores_data']) {
      //console.log('k' + result['scores_data'][ii].url);
      if (url == result['scores_data'][ii].url) {
        let tmp = result['scores_data'][ii];
        drawDoughnut(parseInt(tmp.score), 'Reviewed by ' + tmp.n + ' scientists');
        document.getElementById("sources").innerHTML = Math.round(tmp.sources*100)/100;
        document.getElementById("bias").innerHTML = Math.round(tmp.bias*100)/100;
        document.getElementById("clarity").innerHTML = Math.round(tmp.clarity*100)/100;
        return;
      }
     };
     drawDoughnut(null, 'Request below');
  }).catch(err => {
    drawDoughnut(null, 'Request below');
    console.log(err);
    console.log("Some error with comparing with <scores_data>")
  });
};

document.addEventListener('DOMContentLoaded', function () {

 chrome.tabs.query (
      { currentWindow: true, active: true },
      function(tabs) {
          var activeTab = tabs[0];
          var address = activeTab.url;
          
          dbCheckUrls(address);
          //storageCheckUrls(address);
      });
});


// ex content

var domainName = "";

var setCollapsibleEntries = function() {
	var coll = document.getElementsByClassName("collapsible");
	var ix;

	for (ix = 0; ix < coll.length; ix++) {
			coll[ix].addEventListener("click", function () {
					this.classList.toggle("active");
					var content = this.nextElementSibling;
					if (content.style.maxHeight) {
							content.style.maxHeight = null;
					}
					else {
							content.style.maxHeight = content.scrollHeight + "px";
					}
			});
	}
}

var getWebsiteInformation = function(){
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	    var url = tabs[0].url;

	    // REGEX TO FIND DOMAIN NAME
	    var domain = url.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
			var pageheadings = tabs[0].title.split("-", 2);
			var pagetitle = pageheadings[0];

			domainName = domain;
			document.getElementById("findTheTitle").innerHTML = pagetitle;
			document.getElementById("findTheDomain").innerHTML = domainName;

	});
}

var getWebsiteTitle = function(){
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var pagetitle = tabs[0].title;
		document.getElementById("findTheTitle").innerHTML = pagetitle;

});
}

var get_day_diff = function(d1, d2) {
  const diff_time = Math.abs(d1 - d2);
  const diff_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24));
  return diff_days;
}

var is_empty = function(obj){
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function update_records() {
  chrome.storage.local.get('scores_date', (result) => {
    if (is_empty(result)) {
      console.log("empty object...");
      dbGetAllUrls();
    };

    dd = new Date(result["scores_date"]);
    d_today = new Date();
    if (get_day_diff(d_today, dd) > 30) { //update every month
      dbGetAllUrls();
    }
  };
}

var init = function(){
  update_records();
	getWebsiteInformation();
	setCollapsibleEntries();
};

init();
