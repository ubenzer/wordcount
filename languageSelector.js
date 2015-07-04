"use strict";
(function() {
  // https://github.com/GoogleChrome/webplatform-samples/blob/master/webspeechdemo/webspeechdemo.html#L137
  let availableLanguages = // It is amazing that we can't get this list through API
    [['Afrikaans',       ['af-ZA']],
     ['Bahasa Indonesia',['id-ID']],
     ['Bahasa Melayu',   ['ms-MY']],
     ['Català',          ['ca-ES']],
     ['Čeština',         ['cs-CZ']],
     ['Deutsch',         ['de-DE']],
     ['English',         ['en-AU', 'Australia'],
                         ['en-CA', 'Canada'],
                         ['en-IN', 'India'],
                         ['en-NZ', 'New Zealand'],
                         ['en-ZA', 'South Africa'],
                         ['en-GB', 'United Kingdom'],
                         ['en-US', 'United States']],
     ['Español',         ['es-AR', 'Argentina'],
                         ['es-BO', 'Bolivia'],
                         ['es-CL', 'Chile'],
                         ['es-CO', 'Colombia'],
                         ['es-CR', 'Costa Rica'],
                         ['es-EC', 'Ecuador'],
                         ['es-SV', 'El Salvador'],
                         ['es-ES', 'España'],
                         ['es-US', 'Estados Unidos'],
                         ['es-GT', 'Guatemala'],
                         ['es-HN', 'Honduras'],
                         ['es-MX', 'México'],
                         ['es-NI', 'Nicaragua'],
                         ['es-PA', 'Panamá'],
                         ['es-PY', 'Paraguay'],
                         ['es-PE', 'Perú'],
                         ['es-PR', 'Puerto Rico'],
                         ['es-DO', 'República Dominicana'],
                         ['es-UY', 'Uruguay'],
                         ['es-VE', 'Venezuela']],
     ['Euskara',         ['eu-ES']],
     ['Français',        ['fr-FR']],
     ['Galego',          ['gl-ES']],
     ['Hrvatski',        ['hr_HR']],
     ['IsiZulu',         ['zu-ZA']],
     ['Íslenska',        ['is-IS']],
     ['Italiano',        ['it-IT', 'Italia'],
                         ['it-CH', 'Svizzera']],
     ['Magyar',          ['hu-HU']],
     ['Nederlands',      ['nl-NL']],
     ['Norsk bokmål',    ['nb-NO']],
     ['Polski',          ['pl-PL']],
     ['Português',       ['pt-BR', 'Brasil'],
                         ['pt-PT', 'Portugal']],
     ['Română',          ['ro-RO']],
     ['Slovenčina',      ['sk-SK']],
     ['Suomi',           ['fi-FI']],
     ['Svenska',         ['sv-SE']],
     ['Türkçe',          ['tr-TR']],
     ['български',       ['bg-BG']],
     ['Pусский',         ['ru-RU']],
     ['Српски',          ['sr-RS']],
     ['한국어',            ['ko-KR']],
     ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                         ['cmn-Hans-HK', '普通话 (香港)'],
                         ['cmn-Hant-TW', '中文 (台灣)'],
                         ['yue-Hant-HK', '粵語 (香港)']],
     ['日本語',           ['ja-JP']],
     ['Lingua latīna',   ['la']]];

  window.LanguageSelector = LanguageSelector;
  function LanguageSelector(languageSelect, localeSelect) {
    let currentLanguage = null;

    for (let i = 0; i < availableLanguages.length; i++) {
      languageSelect.options[i] = new Option(availableLanguages[i][0], i);
    }
    languageSelect.selectedIndex = 6;
    initLocaleSelect();
    localeSelect.selectedIndex = 5;
    selectLocale();
    languageSelect.addEventListener("change", initLocaleSelect);
    localeSelect.addEventListener("change", selectLocale);

    this.getLanguage = function() { return currentLanguage; }

    function initLocaleSelect() {
      localeSelect.options.length = 0;
      if (availableLanguages[languageSelect.selectedIndex].length === 2) {
        localeSelect.style.display = "none";
        currentLanguage = availableLanguages[languageSelect.selectedIndex][1][0];
        return;
      }

      localeSelect.style.display = "inline";

      for (let j = 1; j < availableLanguages[languageSelect.selectedIndex].length; j++) {
        localeSelect.options[j-1] = new Option(availableLanguages[languageSelect.selectedIndex][j][1], j);
      }
      localeSelect.selectedIndex = 0;
      selectLocale();
    }

    function selectLocale() {
      currentLanguage = availableLanguages[languageSelect.selectedIndex][localeSelect.selectedIndex+1][0];
    }
  }
})();
