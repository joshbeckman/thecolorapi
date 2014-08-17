var fs = require('fs')
  , named = JSON.parse(fs.readFileSync('./static/colorNames.json')).colors
  , colorMe
  , hexCheck
  , hexToHSL
  , hexToRGB
  , RGBToHSL
  , HSLToRGB
  , RGBToHex
  , nearestNamedHex
  , schemer = require('../lib/schemer');

exports.colorMe = colorMe = function (arg){
  var c = {
    hex: {},
    rgb: {fraction:{}},
    hsl: {},
    hsv: {},
    name: {},
    cmyk: {},
    XYZ: {},
    image: {},
    contrast: {},
    _links:{},
    _embedded: {}
  }, a;
  if(arg.rgb.r || 0==arg.rgb.r){
    return fromRGB(arg.rgb);
  }
  if(arg.hex){
    return fromHex(arg.hex);
  }
  if(arg.hsl.h){
    if(arg.hsl.is_fraction){
      a = schemer.methods.base['hsl-to-rgb'](arg.hsl);
    } else {
      a = schemer.methods.base['hsl-to-rgb']({
        h: arg.hsl.h/360,
        s: arg.hsl.s/100,
        l: arg.hsl.l/100
      });
    }
    a.is_fraction = true;
    return fromRGB(a);
  }
  if(arg.cmyk.c){
    if(arg.cmyk.is_fraction){
      a = schemer.methods.base['cmyk-to-rgb'](arg.cmyk);
    } else {
      a = schemer.methods.base['cmyk-to-rgb']({
        c: arg.cmyk.c/100,
        m: arg.cmyk.m/100,
        y: arg.cmyk.y/100,
        k: arg.cmyk.k/100
      });
    }
    a.is_fraction = true;
    return fromRGB(a);
  }
  function fromRGB(rgb){
    if(!rgb.is_fraction){
      return fromHex(RGBToHex([rgb.r,rgb.g,rgb.b]));
    } else {
      return fromHex(schemer.methods.stringlify.hex(rgb));
    }
  }
  function fromHex(hex){
    c.hex.value = hexCheck(hex);
    var r = hexToRGB(c.hex.value, false),
      n = nearestNamedHex(c.hex.value);
    c.rgb.r = r[0];
    c.rgb.g = r[1];
    c.rgb.b = r[2];
    c.rgb.fraction.r = r[0]/255;
    c.rgb.fraction.g = r[1]/255;
    c.rgb.fraction.b = r[2]/255;
    c.rgb.value = schemer.methods.stringlify.rgb(c.rgb.fraction, null);
    r = schemer.methods.base["rgb-to-hsl"](c.rgb.fraction);
    c.hsl.fraction = r;
    c.hsl.h = Math.round(r.h*360);
    c.hsl.s = Math.round(r.s*100);
    c.hsl.l = Math.round(r.l*100);
    c.hsl.value = schemer.methods.stringlify.hsl(c.hsl.fraction, null);
    r = schemer.methods.base["rgb-to-hsv"](c.rgb.fraction);
    c.hsv.fraction = r;
    c.hsv.value = schemer.methods.stringlify.hsv(c.hsv.fraction, null);
    c.hsv.h = Math.round(r.h*360);
    c.hsv.s = Math.round(r.s*100);
    c.hsv.v = Math.round(r.v*100);
    r = schemer.methods.base["rgb-to-XYZ"](c.rgb.fraction);
    c.XYZ.fraction = r;
    c.XYZ.value = schemer.methods.stringlify.XYZ(c.XYZ.fraction, null);
    c.XYZ.X = Math.round(r.X*100);
    c.XYZ.Y = Math.round(r.Y*100);
    c.XYZ.Z = Math.round(r.Z*100);
    r = schemer.methods.base["rgb-to-cmyk"](c.rgb.fraction);
    c.cmyk.fraction = r;
    c.cmyk.value = schemer.methods.stringlify.cmyk(c.cmyk.fraction, null);
    c.cmyk.c = Math.round(r.c*100);
    c.cmyk.m = Math.round(r.m*100);
    c.cmyk.y = Math.round(r.y*100);
    c.cmyk.k = Math.round(r.k*100);
    c.name.value = n[1];
    c.name.closest_named_hex = n[0];
    c.name.exact_match_name = n[2];
    c.name.distance = n[3];
    c.hex.clean = c.hex.value.substring(1);
    var textColor = c.hsv.fraction.v < 0.5 ? '/FFFFFF' : '/000000'
    c.contrast.value = '#' + textColor.substring(1);
    c.image.bare = "http://placehold.it/300x300.png/" + c.hex.clean + textColor;
    c.image.named = "http://placehold.it/300x300.png/" + c.hex.clean + textColor + "&text=" + c.name.value.split(' ').join('+');
    c._links.self = {
      href: '/id?hex=' + c.hex.clean
    };
    return c;
  }
};

exports.hexCheck = hexCheck = function (color) {
  color = color.toUpperCase();
  if(color.length < 3 || color.length > 7)
    return "#000000";
  if(color.length % 3 == 0)
    color = "#" + color;
  if(color.length == 4)
    color = "#" + color.substr(1, 1) + color.substr(1, 1) + color.substr(2, 1) + color.substr(2, 1) + color.substr(3, 1) + color.substr(3, 1);
  return color;
};

exports.RGBToHex = RGBToHex = function(arr) {
  return "#" + componentToHex(arr[0]) + componentToHex(arr[1]) + componentToHex(arr[2]);
}
  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
exports.hexToRGB = hexToRGB = function (color, frac) {
  if(frac){
    return [parseInt('0x' + color.substring(1, 3))/255, parseInt('0x' + color.substring(3, 5))/255,  parseInt('0x' + color.substring(5, 7))/255];
  } else{
    return [parseInt('0x' + color.substring(1, 3)), parseInt('0x' + color.substring(3, 5)),  parseInt('0x' + color.substring(5, 7))];
  }
};

exports.hexToHSL = hexToHSL= function (color) {
  var rgb = [parseInt('0x' + color.substring(1, 3)) / 255, parseInt('0x' + color.substring(3, 5)) / 255, parseInt('0x' + color.substring(5, 7)) / 255];
  var min, max, delta, h, s, l;
  var r = rgb[0], g = rgb[1], b = rgb[2];

  min = Math.min(r, Math.min(g, b));
  max = Math.max(r, Math.max(g, b));
  delta = max - min;
  l = (min + max) / 2;

  s = 0;
  if(l > 0 && l < 1)
    s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));

  h = 0;
  if(delta > 0)
  {
    if (max == r && max != g) h += (g - b) / delta;
    if (max == g && max != b) h += (2 + (b - r) / delta);
    if (max == b && max != r) h += (4 + (r - g) / delta);
    h /= 6;
  }
  return [parseInt(h * 255), parseInt(s * 255), parseInt(l * 255)];
};

exports.RGBToHSL = RGBToHSL = function (rgb) {
  var min, max, delta, h, s, l;
  var r = rgb[0], g = rgb[1], b = rgb[2];
  min = Math.min(r, Math.min(g, b));
  max = Math.max(r, Math.max(g, b));
  delta = max - min;
  l = (min + max) / 2;
  s = 0;
  if (l > 0 && l < 1) {
    s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
  }
  h = 0;
  if (delta > 0) {
    if (max == r && max != g) h += (g - b) / delta;
    if (max == g && max != b) h += (2 + (b - r) / delta);
    if (max == b && max != r) h += (4 + (r - g) / delta);
    h /= 6;
  }
  return [h, s, l];
};

exports.HSLToRGB = HSLToRGB= function (hsl) {
  var m1, m2, r, g, b;
  var h = hsl[0], s = hsl[1], l = hsl[2];
  m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
  m1 = l * 2 - m2;
  return [hueToRGB(m1, m2, h+0.33333),
      hueToRGB(m1, m2, h),
      hueToRGB(m1, m2, h-0.33333)];
  function hueToRGB(m1, m2, h) {
    h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
    if (h * 2 < 1) return m2;
    if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
    return m1;
  }
};

// Adopted from http://chir.ag/projects/ntc 
// accepts [hexColor]
// returns [closestHexValue, name, boolIndicatingExactMatch]
exports.nearestNamedHex = nearestNamedHex = function (color) {
  color = hexCheck(color);
  var rgb = hexToRGB(color);
  var r = rgb[0], g = rgb[1], b = rgb[2];
  var hsl = hexToHSL(color);
  var h = hsl[0], s = hsl[1], l = hsl[2];
  var ndf1 = 0; ndf2 = 0; ndf = 0;
  var cl = -1, df = -1;
  for(var i = 0; i < named.length; i++)
  {
    if(color == "#" + named[i].hex)
      return ["#" + named[i].hex, named[i].name, true, 0];
    ndf1 = Math.pow(r - named[i].r, 2) + Math.pow(g - named[i].g, 2) + Math.pow(b - named[i].b, 2);
    ndf2 = Math.pow(h - named[i].h, 2) + Math.pow(s - named[i].s, 2) + Math.pow(l - named[i].l, 2);
    ndf = ndf1 + ndf2 * 2;
    if(df < 0 || df > ndf)
    {
      df = ndf;
      cl = i;
    }
  }
  return (cl < 0 ? ["#000000", "Invalid Color: " + color, false, 0] : ["#" + named[cl].hex, named[cl].name, false, df]);
};

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}