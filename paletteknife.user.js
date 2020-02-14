// ==UserScript==
// @name         PaletteKnife for p5 gradient
// @namespace    https://github.com/PatPositron
// @version      0.1
// @description
// @author       pat
// @match        http://soliton.vm.bytemark.co.uk/pub/cpt-city/*.png.index.html
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @updateURL    https://raw.githubusercontent.com/PatPositron/Userscripts/master/paletteknife.user.js
// ==/UserScript==

(function() {
  'use strict';

  let rGamma = 2.6;
  let gGamma = 2.2;
  let bGamma = 2.5;

  function adjustGamma(original, gamma) {
    let o = original / 255.0;
    let adj = Math.pow(o, gamma);
    let result = Math.floor(adj * 255.0);

    return original != 0 && result == 0 ? 1 : result;
  }

  ////////////////////////////

  let $mainTd = $('td.main');
  $mainTd.html(
    $mainTd.html() +
      '<button id="paletteknife">convert gradient</button>' +
      '<br>' +
      '<input id="palettegamma" type="checkbox" checked="true"/><label for="palettegamma">gamma</label>' +
      '<br>' +
      '<div id="palettepreview" style="width:340px;height:36px;border:1px solid black;"></div>' +
      '<br>' +
      '<textarea id="paletteresult" style="display:none;width:700px;height:700px;"></textarea>'
  );

  let $result = $('#paletteresult');
  let $gamma = $('#palettegamma');
  let $preview = $('#palettepreview');

  $('#paletteknife').click(function() {
    let gradient = document.location.href.match(/([^\/]+).png.index.html/)[1];

    $.get('../' + gradient + '.c3g', function(css) {
      let stops = [],
        cssStops = [];

      css.split('\n').forEach(line => {
        let nums = line.match(/([0-9]+), *([0-9]+), *([0-9]+)\) *([0-9.]+)/);
        if (!nums) {
          return;
        }

        let r = nums[1];
        let g = nums[2];
        let b = nums[3];

        if ($gamma.is(':checked')) {
          r = adjustGamma(nums[1], rGamma);
          g = adjustGamma(nums[2], gGamma);
          b = adjustGamma(nums[3], bGamma);
        }

        let location = Math.floor((nums[4] * 255.0) / 100.0);
        if (stops.length > 0 && stops[stops.length - 1][0] == location) {
          location++;
        }

        stops.push([location, r, g, b]);
        cssStops.push([r, g, b, nums[4]]);
      });

      let previewCss = 'linear-gradient(90deg,';
      previewCss += cssStops.map(s => 'rgb(' + s[0] + ',' + s[1] + ',' + s[2] + ') ' + s[3] + '%').join(',');
      previewCss += ")"
      $preview.css('background-image', previewCss);

      let output = '// ' + document.location.href + '\n';
      output +=
        '// converted with gammas (' +
        rGamma +
        ', ' +
        gGamma +
        ', ' +
        bGamma +
        ')\n';
      output += gradient + ' = new Gradient(g, [\n';
      output += stops.map(s => '  [' + s.join(', ') + ']').join(',\n');
      output += '\n]);';

      $result.text(output);
      $result.show();
    });
  });
})();
