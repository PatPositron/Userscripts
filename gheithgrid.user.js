// ==UserScript==
// @name         Gheith Grid Helper
// @namespace    https://github.com/PatPositron
// @version      0.4
// @description  adds a relative score column to all submissions, highlighting
// @author       pat
// @match        https://www.cs.utexas.edu/~gheith/cs*_*_p*.html
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @updateURL    https://raw.githubusercontent.com/PatPositron/Userscripts/master/gheithgrid.user.js
// ==/UserScript==

(function() {
  'use strict';

  function getSubmissions() {
    return $('tbody')
      .children('tr')
      .eq(2)
      .children()
      .eq(0)
      .children()
      .children()
      .children();
  }

  function promptForSha(subs) {
    let sha = prompt('Please enter your code sha');
    if (sha == null || sha.trim() == '') {
      return null;
    }

    for (let i = 0; i < subs.length; i++) {
      if (
        subs
          .eq(i)
          .children()[0]
          .innerText.includes(sha.trim())
      ) {
        subs.eq(i).css('background-color', 'lightgreen');
        return i;
      }
    }
    return null;
  }

  function findProf(subs) {
    for (let i = 0; i < subs.length; i++) {
      if (subs.eq(i).css('background-color') == 'rgb(255, 255, 0)') {
        return i;
      }
    }
    return null;
  }

  function scoreSubmission(sub) {
    let tests = sub.children();
    let score = 0;
    for (let i = 1; i < tests.length; i++) {
      if (tests[i].innerText == '.') {
        score++;
      }
      tests.eq(i).addClass('test-' + i);
    }
    return score;
  }

  function displayScores() {
    let subs = getSubmissions();
    let me = promptForSha(subs);
    let prof = findProf(subs);
    let profScore = prof == null ? 0 : scoreSubmission(subs.eq(prof));
    for (let i = 3; i < subs.length; i++) {
      if (i == prof) {
        subs.eq(i).append('<td style="float:right;font-family:monospace;font-size:1.3em;">' + profScore + '</td>');
      } else {
        let score = scoreSubmission(subs.eq(i)) - profScore;
        let color = prof == null || score == 0 ? 'yellow' : score > 0 ? 'lightgreen' : 'pink';
        let result = prof == null || score < 0 ? score : score > 0 ? '+' + score : 'ok';
        subs
          .eq(i)
          .append('<td style="float:right;font-family:monospace;font-size:1.3em;background-color:' + color + '">' + result + '</td>');
      }

      if (i != prof && i != me) {
        subs.eq(i).hover(
          function() {
            $(this).css('background-color', 'lightgray');
          },
          function() {
            $(this).css('background-color', '');
          }
        );
      }
    }

    let tests = subs.eq(3).children().length;
    for (let i = 1; i < tests - 1; i++) {
      $('.test-' + i).hover(
        function() {
          $('.test-' + i).css('background-color', 'lightgray');
        },
        function() {
          $('.test-' + i).css('background-color', '');
        }
      );
    }
  }

  displayScores();
})();
