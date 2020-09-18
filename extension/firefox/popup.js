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

// links to our website
document.getElementById('clickme-signin').addEventListener('click', function(){
  browser.tabs.create({url: 'https://orcid.org/oauth/authorize?client_id=APP-NPKDH3DEAO6YUP22&response_type=code&scope=/authenticate&redirect_uri=https://www.authentisci.com/rating'});
});
document.getElementById('clickme-request').addEventListener('click', function(){
  
});
document.getElementById('clickme-about').addEventListener('click', function(){
  browser.tabs.create({url: 'https://www.authentisci.com/about'});
});
document.getElementById('clickme-contact').addEventListener('click', function(){
  browser.tabs.create({url: 'https://www.authentisci.com/contact'});
});

// matching to MONGO database 
const API_URL = 'https://authentisci-api.herokuapp.com/api/v1/average?ad=';

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

document.addEventListener('DOMContentLoaded', function () {

 browser.tabs.query (
      { currentWindow: true, active: true },
      function(tabs) {
          var activeTab = tabs[0];
          var address = activeTab.url;
          
          dbCheckUrls(address);

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
	browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
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
	browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var pagetitle = tabs[0].title;
		document.getElementById("findTheTitle").innerHTML = pagetitle;

});
}

var init = function(){
	getWebsiteInformation();
	setCollapsibleEntries();
};

init();
