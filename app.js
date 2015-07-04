"use strict";
(function() {
  var startGroup = document.getElementById("startGroup");
  var startButton = document.getElementById("startButton");
  var languageSelector = new LanguageSelector(document.getElementById("language"), document.getElementById("locale"));

  var progressGroup = document.getElementById("progressGroup");
  var stopButton = document.getElementById("stopButton");
  var wordCountDiv = document.getElementById("wordCount");

  var recognizer = null;
  var wordCloud = new WordCloud(document.getElementById("wordCloudContainer"));

  var updateTick = null;
  var latestRecognition = null;
  var lastDrawnRecognition = null;

  startButton.addEventListener("click", function(e) {
    recognizer = new Recognizer({
      language: languageSelector.getLanguage(),
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

    startGroup.style.display = "none";
    progressGroup.style.display = "";
  });

  stopButton.addEventListener("click", function(e) {
    if (updateTick) {
      clearTimeout(updateTick);
    }
    recognizer.stopRecognition();
    recognizer = null;

    startGroup.style.display = "";
    progressGroup.style.display = "none";
  });

  function onUpdateFn(currentResult) {
    latestRecognition = currentResult;
    // Persist latest recognition
    localStorage.setItem("words", latestRecognition);
    wordCountDiv.innerText = currentResult.wordCount;
  }
})();
