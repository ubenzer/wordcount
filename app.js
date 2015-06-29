"use strict";
(function() {
  var startButton = document.getElementById("startButton");
  var stopButton = document.getElementById("stopButton");
  var recognizer = null;
  var wordCloud = new WordCloud(document.getElementById("wordCloudContainer"));

  var updateTick = null;
  var latestRecognition = null;
  var lastDrawnRecognition = null;

  startButton.onclick = function(e) {
    recognizer = new Recognizer({
      language: "tr-TR",
      onUpdate: onUpdateFn
    });
    recognizer.startRecognition();
    updateTick = setInterval(function() {
      if (latestRecognition !== null &&
          (lastDrawnRecognition === null ||
           lastDrawnRecognition.finalTranscript + lastDrawnRecognition.interimTranscript !==
           latestRecognition.finalTranscript + latestRecognition.interimTranscript)
          ) {
            wordCloud.draw(latestRecognition.wordLookup);
            lastDrawnRecognition = latestRecognition;
      }
    }, 500);
  }

  stopButton.onclick = function(e) {
    if (updateTick) {
      clearTimeout(updateTick);
    }
    recognizer.stopRecognition();
    recognizer = null;
  }

  function onUpdateFn(currentResult) {
    latestRecognition = currentResult;
    stopButton.innerText = currentResult.wordCount;
  }

  function WordCloud(container) {
    var fill = d3.scale.category20();
    var drawRoot = d3.select(container)
      .append("svg")
        .attr("width", container.clientWidth)
        .attr("height", container.clientHeight)
      .append("g")
        .attr("transform", "translate(" + container.clientWidth / 2 + "," + container.clientHeight / 2 + ")");

    this.draw = draw;

    function draw(wordsObj) {
      let words = [];
      Object.keys(wordsObj).map(function(k) {
        let v = wordsObj[k];
        words.push({
          text: k,
          count: v
        });
      });

      normalizeFontSizes(words);

      var layout = d3.layout.cloud()
        .size([container.clientWidth, container.clientHeight])
        .words(words)
        .padding(10)
        .rotate(function() { return 0; })
        //.rotate(function() { return getRandomInt(-60, 60); })
        .font("Impact")
        .fontSize(function(d) { return d.fontSize; })
        .on("end", internalDraw.bind(this, words));
      layout.start();
    }

    function internalDraw(words) {
      let drawData = drawRoot
        .selectAll("text")
          .data(words)

       drawData
          .enter()
          .append("text")
          .text(function(d) { return d.text; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .style("opacity", 0)
          .attr("text-anchor", "middle");

       drawData
       .transition()
       .duration(500)
        .style("opacity", 1)
        .style("font-size", function(d) { return d.fontSize + "px"; })
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        });

        drawData.exit()
          .transition()
          .duration(250)
          .style("opacity", 0)
          .remove();

    }

    function normalizeFontSizes(arrayOfWords) {
      let min = 0;
      let max = 0;
      arrayOfWords.forEach(function(word) {
        if (min === 0 || word.count < min) {
          min = word.count;
        }
        if (max < word.count) {
          max = word.count;
        }
      });

      let linearScale = d3.scale.linear().domain([min, max]).range([15, Math.min(container.clientWidth, container.clientHeight) / 4]);

      arrayOfWords.forEach(function(k) {
        k.fontSize = linearScale(k.count);
        console.debug(k);
      });
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }
})();
