
var parseQueryColors = function (q){
  var hsl = {h:null,s:null,l:null},
    rgb = {r:null,g:null,b:null},
    cmyk = {c:null,m:null,y:null,k:null},
    hsv = {h:null,s:null,v:null},
    hex = q.hex ? q.hex : null;
  return {
    hsl:  maybeSplitParen(q.hsl, hsl),
    rgb:  maybeSplitParen(q.rgb, rgb),
    cmyk: maybeSplitParen(q.cmyk, cmyk),
    hsv:  maybeSplitParen(q.hsv, hsv),
    hex:  hex
  };
  function maybeSplitParen(str, obj){
    if(str){
      var s = str.split('('),
        k = Object.keys(obj);
      if(s.length > 1){
        s = s[1].split(')')[0].split(',');
      } else {
        s = s[0].split(',');
      }
      for (var i = 0; i < s.length; i++) {
        if(s[i].split('.').length > 1){
          obj[k[i]] = parseFloat(s[i]);
          obj.is_fraction = true;
        } else{
          obj[k[i]] = parseInt(s[i], 10);
        }
      }
    }
    return obj;
  }
}

var getRandomHex = function () {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

var parseUnknownType = function (input){
  var hex = (input.substring(0,1) == '#' || input.length == 3 || input.length == 6) ? input : null,
    cmyk = input.substring(0,4).toLowerCase() == 'cmyk' ? input : null,
    hsl = input.substring(0,3).toLowerCase() == 'hsl' ? input : null,
    hsv = input.substring(0,3).toLowerCase() == 'hsv' ? input : null,
    rgb = input.substring(0,3).toLowerCase() == 'rgb' ? input : null;
  return parseQueryColors({
    hex: hex,
    cmyk: cmyk,
    hsl: hsl,
    rgb: rgb,
    hsv: hsv
  });
};

exports.parseUnknownType = parseUnknownType;
exports.getRandomHex = getRandomHex;
exports.parseQueryColors = parseQueryColors;