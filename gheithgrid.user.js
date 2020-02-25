// ==UserScript==
// @name         Gheith Grid Helper
// @namespace    https://github.com/PatPositron
// @version      0.5
// @description  adds a relative score column to all submissions, highlighting
// @author       pat
// @match        https://www.cs.utexas.edu/~gheith/cs*_*_p*.html
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @updateURL    https://raw.githubusercontent.com/PatPositron/Userscripts/master/gheithgrid.user.js
// ==/UserScript==

(function () {
  'use strict';

  function getSubmissions() {
    return $('tbody').children('tr').eq(2).children().eq(0).children().children().children();
  }

  function promptForSha(subs) {
    let sha = prompt('Please enter your code sha');
    if (sha == null || sha.trim() == '') {
      return null;
    }

    for (let i = 3; i < subs.length; i++) {
      if (subs.eq(i).children()[0].innerText.includes(sha.trim())) {
        subs.eq(i).css('background-color', 'lightgreen');
        return i;
      }
    }
    return null;
  }

  function findProf(subs) {
    for (let i = 3; i < subs.length; i++) {
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
      subs.eq(i).append('<td style="float:right;font-family:monospace;font-size:1.3em;background-color:' + color + '">' + result + '</td>');
    }

    if (i != prof && i != me) {
      subs.eq(i).hover(
        function () {
          $(this).css('background-color', 'lightgray');
        },
        function () {
          if ($(this).attr('highlight') == undefined) {
            $(this).css('background-color', '');
          }
        }
      );

      subs.eq(i).click(function () {
        if ($(this).attr('highlight') == undefined) {
          $(this).attr('highlight', '');
        } else {
          $(this).attr('highlight', null);
        }
      });
    }
  }

  const tests = subs.eq(3).children();
  const tbody = subs.eq(3).parent()
  const performanceRow = '<tr>' + Array.from(tests).map((_, i) => '<td class="test-' + i + ' performance" style="font-family:monospace;font-size:1.3em;"></td>').join('') + '</tr>';
  subs.eq(2).after(performanceRow);
  tbody.append(performanceRow);
  tbody.parent().css('text-align', 'center');

  for (let i = 1; i < tests.length - 1; i++) {
    $('.test-' + i).hover(
      function () {
        if ($('.test-' + i).attr('badcase') == undefined) {
          $('.test-' + i).css('background-color', 'lightgray');
        }
      },
      function () {
        if ($('.test-' + i).attr('highlight') == undefined && $('.test-' + i).attr('badcase') == undefined) {
          $('.test-' + i).css('background-color', '');
        }
      }
    );

    $('.test-' + i).click(function () {
      if ($('.test-' + i).attr('highlight') == undefined) {
        $('.test-' + i).attr('highlight', '');
      } else {
        $('.test-' + i).attr('highlight', null);
      }
    });

    let performance = 0;
    for (let sub = 3; sub < subs.length; sub++) {
      if (subs.eq(sub).children()[i].innerText == '.') {
        performance++;
      }
    }
    $('.test-' + i + '.performance').text((performance < 10 ? '0' : '') + performance);

    if (performance == 0) {
      $('.test-' + i).css('background-color', 'pink');
      $('.test-' + i).attr('badcase', '');
    }
  }
})();
