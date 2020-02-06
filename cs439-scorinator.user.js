// ==UserScript==
// @name         CS 439 Scorinator
// @namespace    https://github.com/PatPositron
// @version      0.2
// @description  adds a relative score column to all submissions
// @author       pat
// @match        https://www.cs.utexas.edu/~gheith/cs439_*_p*.html
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @updateURL    https://raw.githubusercontent.com/PatPositron/Userscripts/master/cs439-scorinator.user.js
// ==/UserScript==

(function() {
    'use strict';

    function getSubmissions() {
        return $('tbody').children('tr').eq(2).children().eq(0).children().children().children();
    }

    function promptForSha(subs) {
        let sha = prompt("Please enter your code sha").trim();
        if (sha == null || sha == "") {
            return;
        }

        for (let i = 0; i < subs.length; ++i) {
            if (subs.eq(i).children()[0].innerText.includes(sha)) {
                subs.eq(i).css("background-color", "#e6f3ff");
                break;
            }
        }
    }

    function findProf(subs) {
        for (let i = 0; i < subs.length; ++i) {
            if (subs.eq(i).css("background-color") == "rgb(255, 255, 0)") {
                return i;
            }
        }
        return null;
    }

    function scoreSubmission(sub) {
        let cols = sub.children();
        let score = 0;
        for (let i = 1; i < cols.length; i++) {
            if (cols[i].innerText == '.') {
                score++;
            }
        }
        return score;
    }

    function displayScores(subs) {
        let prof = findProf(subs);
        let profScore = scoreSubmission(subs.eq(prof));
        for (let i = 3; i < subs.length; i++) {
            if (i == prof) {
                subs.eq(i).append("<td style=\"float:right;font-family:monospace;font-size:1.3em;\">" + profScore + "</td>");
            } else {
                let score = scoreSubmission(subs.eq(i)) - profScore;
                subs.eq(i).append("<td style=\"float:right;font-family:monospace;font-size:1.3em;background-color:" + (score > 0 ? "lightgreen" : score < 0 ? "pink" : "yellow") + "\">" + (score > 0 ? "+" + score : score < 0 ? score : "ok") + "</td>");
            }
        }
    }

    let subs = getSubmissions();
    promptForSha(subs);
    displayScores(subs);
})();