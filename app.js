"use strict";
(function() {
  var startButton = document.getElementById("startButton");
  var stopButton = document.getElementById("stopButton");
  var recognizer = null;

  startButton.onclick = function(e) {
    recognizer = new Recognizer();
    recognizer.startRecognition();
  }

  stopButton.onclick = function(e) {
    recognizer.stopRecognition();
    recognizer = null;
  }

})();
var Recognizer = function() {
  let finalTranscript = "";
  let wordCount = 0;
  let wordLookup = {};
  let recognition = setUpRecognition();

  this.startRecognition = startRecognitionImpl;
  this.stopRecognition = stopRecognitionImpl;

  function stopRecognitionImpl() {
    recognition.stop();
  }

  function startRecognitionImpl() {
    recognition.lang = "tr-TR"; // TODO needs to be parametric
    recognition.onstart = function(event) {
      console.log("onstart", event);
    }
    recognition.onresult = function(event) {
      console.log("onresult", event);
      let interimTranscript = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          addFinalTranscript(event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      console.info(interimTranscript);
      console.log(finalTranscript);
      console.warn(wordCount + interimTranscript.split(" ").length);
    }
    recognition.onerror = function(event) {
      console.log("onerror", event);
    }
    recognition.onend = function(event) {
      console.log("onend", event);
      console.log(finalTranscript)
      console.log(wordCount);
      console.log(wordLookup);
    }
    recognition.start();
  }

  function addFinalTranscript(word) {
    finalTranscript += word;
    let words = word.split(" ");
    let newCount = words.length;
    wordCount += newCount;

    words.forEach(function(el, i) {
      wordLookup[el] = wordLookup[el] || 0;
      wordLookup[el]++;
    });
  }

  function setUpRecognition() {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    return recognition;
  }
};
