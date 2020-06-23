

Chart.pluginService.register({
      beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
          var ctx = chart.chart.ctx;
          var centerConfig = chart.config.options.elements.center;
          var fontStyle = centerConfig.fontStyle || 'Arial';
          var txt = centerConfig.text;
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

          if (!wrapText) {
            ctx.fillText(txt, centerX, centerY);
            return;
          }

          var words = txt.split(' ');
          var line = '';
          var lines = [];

          // Break words up into multiple lines if necessary
          for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > elementWidth && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }

          // Move the center up depending on line height and number of lines
          centerY -= (lines.length / 2) * lineHeight;

          for (var n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
          }
          //Draw text in center
          ctx.fillText(line, centerX, centerY);
        }
      }
    });

function drawDoughnut(inputData) {
  var ctx = document.getElementById('chart').getContext('2d');
    if (inputData === null)
        inputData = Math.floor(Math.random()*10);
    var config = {
        type: 'doughnut',
        data: {
            labels: [" ", " "],
            datasets: [{
            data: [inputData, 10-inputData],
            backgroundColor: [
                "#902A90",
                "#808080"
            ],
            hoverBackgroundColor: [
                "#902A90",
                "#808080"
            ]
            }]
        },
        options: {
            legend: {
                display: false
            },
            elements: {
            center: {
                text: inputData +'/10',
                fontStyle: 'Arial', 
                sidePadding: 20, 
                minFontSize: 25, 
                lineHeight: 25 
            }
            }
        }
    };
    var myChart = new Chart(ctx, config);
};

// links to our website
document.getElementById('clickme-signin').addEventListener('click', function(){
    console.log("[Clicked button] Sign-In");
    chrome.tabs.create({url: 'https://orcid.org/oauth/authorize?client_id=APP-NPKDH3DEAO6YUP22&response_type=code&scope=/authenticate&redirect_uri=https://www.authentisci.com/rating'});
});
document.getElementById('clickme-request').addEventListener('click', function(){
    console.log("[Clicked button] Request Score");
});
document.getElementById('clickme-about').addEventListener('click', function(){
    console.log("[Clicked button] About");
    chrome.tabs.create({url: 'https://www.authentisci.com/about'});
});
document.getElementById('clickme-contact').addEventListener('click', function(){
  console.log("[Clicked button] Contact");
  chrome.tabs.create({url: 'https://www.authentisci.com/contact'});
});

function compareUrl(key, url){
  if (url.includes(key)) {
      return 1;
  } else {
      return 0;
  }
}

function regCheckUrls(url, webData) {
  // The info.js should be sorted from the most specific to the least specific.

  for (const key in webData.webData) {
      comp = compareUrl(key, url);
      if (comp === 1) {
          return key;
      }
  }
  return 0;
  
};

document.addEventListener('DOMContentLoaded', function () {

 chrome.tabs.query (
      { currentWindow: true, active: true }, 
      function(tabs) {
          var activeTab = tabs[0];
          var address = activeTab.url;
          chrome.storage.local.get(['webData'], function(webData){
            var newAddress = regCheckUrls(address, webData);
            if (newAddress === 0) {
              document.getElementById("unscored").innerHTML = "Article not yet scored. Request below."
          } else {
            var entry = webData.webData[newAddress];

              drawDoughnut(parseInt(entry.score));
              
              document.getElementById("sources").innerHTML = entry.sources;
              document.getElementById("bias").innerHTML = entry.bias;
              document.getElementById("clarity").innerHTML = entry.clarity;
              document.getElementById("n_ratings").innerHTML = entry.n_ratings;
          }

          })        
          
      });
});

