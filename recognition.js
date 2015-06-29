"use strict";
var Recognizer = function(options) {
  let finalTranscript = "";
  let wordCount = 0;
  let finalWordLookup = {};
  let recognition = setUpRecognition();

  let defaultOptions = {
    language: "en-US",
    onUpdate: function() {}
  }

  options = merge(options, defaultOptions);

  this.startRecognition = startRecognitionImpl;
  this.stopRecognition = stopRecognitionImpl;

  function stopRecognitionImpl() {
    recognition.stop();
  }

  function startRecognitionImpl() {

    recognition.onstart = function(event) {
      console.log("onstart", event);
    }
    recognition.onresult = function(event) {
      let interimTranscript = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          addFinalTranscript(event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      // include interims too!
      let interimWords = interimTranscript.split(" ");
      let totalWordCount = wordCount;
      var totalWordLookup = merge({}, finalWordLookup); // make copy;
      interimWords.forEach(function(iw) {
        if(iw === "") { return; }
        totalWordLookup[iw] = totalWordLookup[iw] || 0;
        totalWordLookup[iw]++;
        totalWordCount++;
      });

      options.onUpdate({
        wordLookup: totalWordLookup,
        finalTranscript: finalTranscript,
        interimTranscript: interimTranscript,
        wordCount: totalWordCount
      });
    }
    recognition.onerror = function(event) {
      console.log("onerror", event);
    }
    recognition.onend = function(event) {
      console.log("onend", event);
    }
    recognition.start();
  }

  function addFinalTranscript(string) {
    finalTranscript += string;
    let words = string.split(" ");

    words.forEach(function(el, i) {
      if(el === "") { return; }
      finalWordLookup[el] = finalWordLookup[el] || 0;
      finalWordLookup[el]++;
      wordCount++;
    });
  }

  function setUpRecognition() {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = options.language;
    recognition.interimResults = true;
    return recognition;
  }

  function merge(o1, o2) {
    Object.keys(o2).forEach(function (k) {
      let v = o2[k];
      if (typeof o1[k] === "undefined") {
        o1[k] = v;
      }
    });
    return o1;
  }
};
