var colored = require('../lib/colored')
  , schemer;

exports.getScheme = function(mode, count, seed){
  var c = {
    mode: mode,
    count: count,
    colors: [],
    seed: seed,
    image: {
      bare: 'https://www.thecolorapi.com/scheme?format=svg&named=false&hex=' + seed.hex.clean + '&mode=' + mode + '&count=' + count,
      named: 'https://www.thecolorapi.com/scheme?format=svg&hex=' + seed.hex.clean + '&mode=' + mode + '&count=' + count
    },
    _links:{
      self: '/scheme?hex=' + seed.hex.clean + '&mode=' + mode + '&count=' + count,
      schemes: {
        monochrome: '/scheme?hex=' + seed.hex.clean + '&mode=monochrome&count=' + count,
        "monochrome-dark": '/scheme?hex=' + seed.hex.clean + '&mode=monochrome-dark&count=' + count,
        "monochrome-light": '/scheme?hex=' + seed.hex.clean + '&mode=monochrome-light&count=' + count,
        analogic: '/scheme?hex=' + seed.hex.clean + '&mode=analogic&count=' + count,
        complement: '/scheme?hex=' + seed.hex.clean + '&mode=complement&count=' + count,
        "analogic-complement": '/scheme?hex=' + seed.hex.clean + '&mode=analogic-complement&count=' + count,
        triad: '/scheme?hex=' + seed.hex.clean + '&mode=triad&count=' + count,
        quad: '/scheme?hex=' + seed.hex.clean + '&mode=quad&count=' + count
      }
    },
    _embedded: {}
  }, a, colors = [];
  for (var i = count - 1; i >= 0; i--) {
    colors.push(seed);
  }
  c.colors = schemer.scheme.generate(mode, colors, seed);
  return c;
}

// Adapted from https://github.com/Zaku-eu/colourco.de/
exports.methods = schemer = {
  bounds: {
    hex: {
      r: {
        min: 0,
        max: 1,
        f: 255
      },
      g: {
        min: 0,
        max: 1,
        f: 255
      },
      b: {
        min: 0,
        max: 1,
        f: 255
      }
    },
    rgb: {
      r: {
        min: 0,
        max: 1,
        f: 255
      },
      g: {
        min: 0,
        max: 1,
        f: 255
      },
      b: {
        min: 0,
        max: 1,
        f: 255
      }
    },
    hsl: {
      h: {
        min: 0,
        max: 1,
        f: 360
      },
      s: {
        min: 0,
        max: 1,
        f: 100
      },
      l: {
        min: 0,
        max: 1,
        f: 100
      }
    },
    hsv: {
      h: {
        min: 0,
        max: 1,
        f: 360
      },
      s: {
        min: 0,
        max: 1,
        f: 100
      },
      v: {
        min: 0,
        max: 1,
        f: 100
      }
    },
    cmy: {
      c: {
        min: 0,
        max: 1,
        f: 100
      },
      m: {
        min: 0,
        max: 1,
        f: 100
      },
      y: {
        min: 0,
        max: 1,
        f: 100
      }
    },
    cmyk: {
      c: {
        min: 0,
        max: 1,
        f: 100
      },
      m: {
        min: 0,
        max: 1,
        f: 100
      },
      y: {
        min: 0,
        max: 1,
        f: 100
      },
      k: {
        min: 0,
        max: 1,
        f: 100
      }
    },
    XYZ: {
      X: {
        min: 0,
        max: 0.95047,
        f: 100
      },
      Y: {
        min: 0,
        max: 1.00000,
        f: 100
      },
      Z: {
        min: 0,
        max: 1.08883,
        f: 100
      }
    },
    Yxy: {
      Y: {
        min: 0,
        max: 1,
        f: 100
      },
      x: {
        min: 0,
        max: 1,
        f: 100
      },
      y: {
        min: 0,
        max: 1,
        f: 100
      }
    },
    lab: {
      l: {
        min: 0,
        max: 1,
        f: 100
      },
      a: {
        min: -1,
        max: 1,
        f: 100
      },
      b: {
        min: -1,
        max: 1,
        f: 100
      }
    },
    validate: function(type, values, factorize) {
      var b, key, result, _ref;
      if (factorize == null) {
        factorize = false;
      }
      result = {};
      _ref = schemer.bounds[type];
      for (key in _ref) {
        b = _ref[key];
        if (factorize === true) {
          result[key] = Math.max(b.min * b.f, Math.min(b.max * b.f, Math.round(values[key] * b.f)));
        } else {
          result[key] = Math.max(b.min, Math.min(b.max, values[key]));
        }
      }
      return result;
    }
  },
  base: {
    "rgb-to-rgb": function(values) {
      return schemer.bounds.validate("rgb", values);
    },
    "hex-to-rgb": function(values) {
      return schemer.bounds.validate("rgb", values);
    },
    "rgb-to-hex": function(values) {
      return schemer.bounds.validate("rgb", values);
    },
    "rgb-to-fgc": function(values) {
      var m, rgb;
      rgb = schemer.bounds.validate("rgb", values);
      m = 96 / 255;
      if (Math.max(rgb.r, rgb.g, rgb.b) > 1 - m) {
        m *= -1;
      }
      return schemer.bounds.validate("rgb", {
        r: rgb.r + m,
        g: rgb.g + m,
        b: rgb.b + m
      });
    },
    "hsl-to-rgb": function(values) {
      var C, H, X, b, g, hsl, m, r;
      values.h = values.h % 1;
      hsl = schemer.bounds.validate("hsl", values);
      H = hsl.h * 6.0;
      C = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
      X = C * (1 - Math.abs(H % 2 - 1));
      r = g = b = 0;
      if (((0 <= H && H < 1)) || ((5 <= H && H < 6))) {
        r = C;
      }
      if (((1 <= H && H < 2)) || ((4 <= H && H < 5))) {
        r = X;
      }
      if ((1 <= H && H < 3)) {
        g = C;
      }
      if (((0 <= H && H < 1)) || ((3 <= H && H < 4))) {
        g = X;
      }
      if ((3 <= H && H < 5)) {
        b = C;
      }
      if (((2 <= H && H < 3)) || ((5 <= H && H < 6))) {
        b = X;
      }
      m = hsl.l - 0.5 * C;
      return schemer.bounds.validate("rgb", {
        r: r + m,
        g: g + m,
        b: b + m
      });
    },
    "rgb-to-hsl": function(values) {
      var a, d, d2, db, dg, dr, h, l, rgb, s, z;
      rgb = schemer.bounds.validate("rgb", values);
      a = Math.min(rgb.r, rgb.g, rgb.b);
      z = Math.max(rgb.r, rgb.g, rgb.b);
      d = z - a;
      l = (z + a) / 2;
      h = s = 0;
      if (d > 0) {
        s = d / (l < 0.5 ? z + a : 2 - z - a);
        d2 = d / 2;
        dr = (((z - rgb.r) / 6) + d2) / d;
        dg = (((z - rgb.g) / 6) + d2) / d;
        db = (((z - rgb.b) / 6) + d2) / d;
        if (rgb.r === z) {
          h = (0 / 3) + db - dg;
        } else if (rgb.g === z) {
          h = (1 / 3) + dr - db;
        } else if (rgb.b === z) {
          h = (2 / 3) + dg - dr;
        }
        if (h < 0) {
          h += 1;
        }
        if (h >= 1) {
          h -= 1;
        }
      }
      return schemer.bounds.validate("hsl", {
        h: h,
        s: s,
        l: l
      });
    },
    "hsv-to-rgb": function(values) {
      var H, b, g, hsv, r, v1, v2, v3, vi;
      values.h = values.h % 1;
      hsv = schemer.bounds.validate("hsv", values);
      r = g = b = hsv.v;
      if (hsv.s > 0) {
        H = hsv.h * 6;
        vi = Math.round(H);
        v1 = hsv.v * (1 - hsv.s);
        v2 = hsv.v * (1 - hsv.s * (H - vi));
        v3 = hsv.v * (1 - hsv.s * (1 - (H - vi)));
        if (((0 <= H && H < 1)) || ((5 <= H && H < 6))) {
          r = hsv.v;
        }
        if ((2 <= H && H < 4)) {
          r = v1;
        }
        if ((1 <= H && H < 2)) {
          r = v2;
        }
        if ((4 <= H && H < 5)) {
          r = v3;
        }
        if ((1 <= H && H < 3)) {
          g = hsv.v;
        }
        if ((4 <= H && H < 6)) {
          g = v1;
        }
        if ((3 <= H && H < 4)) {
          g = v2;
        }
        if ((0 <= H && H < 1)) {
          g = v3;
        }
        if ((3 <= H && H < 5)) {
          b = hsv.v;
        }
        if ((0 <= H && H < 2)) {
          b = v1;
        }
        if ((5 <= H && H < 6)) {
          b = v2;
        }
        if ((2 <= H && H < 3)) {
          b = v3;
        }
      }
      return schemer.bounds.validate("rgb", {
        r: r,
        g: g,
        b: b
      });
    },
    "rgb-to-hsv": function(values) {
      var a, d, d2, db, dg, dr, h, rgb, s, v, z;
      rgb = schemer.bounds.validate("rgb", values);
      a = Math.min(rgb.r, rgb.g, rgb.b);
      z = Math.max(rgb.r, rgb.g, rgb.b);
      d = z - a;
      v = z;
      h = s = 0;
      if (d > 0) {
        s = d / z;
        d2 = d / 2;
        dr = (((z - rgb.r) / 6) + d2) / d;
        dg = (((z - rgb.g) / 6) + d2) / d;
        db = (((z - rgb.b) / 6) + d2) / d;
        if (rgb.r === z) {
          h = (0 / 3) + db - dg;
        } else if (rgb.g === z) {
          h = (1 / 3) + dr - db;
        } else if (rgb.b === z) {
          h = (2 / 3) + dg - dr;
        }
        if (h < 0) {
          h += 1;
        }
        if (h >= 1) {
          h -= 1;
        }
      }
      return schemer.bounds.validate("hsv", {
        h: h,
        s: s,
        v: v
      });
    },
    "cmy-to-rgb": function(values) {
      var b, cmy, g, r;
      cmy = schemer.bounds.validate("cmy", values);
      r = 1 - cmy.c;
      g = 1 - cmy.m;
      b = 1 - cmy.y;
      return schemer.bounds.validate("rgb", {
        r: r,
        g: g,
        b: b
      });
    },
    "rgb-to-cmy": function(values) {
      var c, m, rgb, y;
      rgb = schemer.bounds.validate("rgb", values);
      c = 1 - rgb.r;
      m = 1 - rgb.g;
      y = 1 - rgb.b;
      return schemer.bounds.validate("cmy", {
        c: c,
        m: m,
        y: y
      });
    },
    "cmyk-to-rgb": function(values) {
      var c, cmyk, m, y;
      cmyk = schemer.bounds.validate("cmyk", values);
      c = cmyk.c * (1 - cmyk.k) + cmyk.k;
      m = cmyk.m * (1 - cmyk.k) + cmyk.k;
      y = cmyk.y * (1 - cmyk.k) + cmyk.k;
      return schemer.base["cmy-to-rgb"]({
        c: c,
        m: m,
        y: y
      });
    },
    "rgb-to-cmyk": function(values) {
      var c, cmy, k, m, y;
      cmy = schemer.base["rgb-to-cmy"](values);
      k = Math.min(1, cmy.c, cmy.m, cmy.y);
      c = cmy.c;
      m = cmy.m;
      y = cmy.y;
      if (k > 0.997) {
        c = 0;
      }
      if (k > 0.997) {
        m = 0;
      }
      if (k > 0.997) {
        y = 0;
      }
      if (k > 0.003) {
        c = (cmy.c - k) / (1 - k);
      }
      if (k > 0.003) {
        m = (cmy.m - k) / (1 - k);
      }
      if (k > 0.003) {
        y = (cmy.y - k) / (1 - k);
      }
      return schemer.bounds.validate("cmyk", {
        c: c,
        m: m,
        y: y,
        k: k
      });
    },
    "XYZ-to-rgb": function(values) {
      var XYZ, b, g, r;
      XYZ = schemer.bounds.validate("XYZ", values);
      r = XYZ.X * 3.2406 + XYZ.Y * -1.5372 + XYZ.Z * -0.4986;
      g = XYZ.X * -0.9689 + XYZ.Y * 1.8758 + XYZ.Z * 0.0415;
      b = XYZ.X * 0.0557 + XYZ.Y * -0.2040 + XYZ.Z * 1.0570;
      r = r > 0.0031308 ? 1.055 * (r ^ (1 / 2.4)) - 0.055 : 12.92 * r;
      g = g > 0.0031308 ? 1.055 * (g ^ (1 / 2.4)) - 0.055 : 12.92 * g;
      b = b > 0.0031308 ? 1.055 * (b ^ (1 / 2.4)) - 0.055 : 12.92 * b;
      return schemer.bounds.validate("rgb", {
        r: r,
        g: g,
        b: b
      });
    },
    "rgb-to-XYZ": function(values) {
      var X, Y, Z, b, g, r, rgb;
      rgb = schemer.bounds.validate("rgb", values);
      r = rgb.r > 0.04045 ? ((rgb.r + 0.055) / 1.055) ^ 2.4 : rgb.r / 12.92;
      g = rgb.g > 0.04045 ? ((rgb.g + 0.055) / 1.055) ^ 2.4 : rgb.g / 12.92;
      b = rgb.b > 0.04045 ? ((rgb.b + 0.055) / 1.055) ^ 2.4 : rgb.b / 12.92;
      X = rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805;
      Y = rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722;
      Z = rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505;
      return schemer.bounds.validate("XYZ", {
        X: X,
        Y: Y,
        Z: Z
      });
    },
    "Yxy-to-rgb": function(values) {
      var X, Y, Yxy, Z;
      Yxy = schemer.bounds.validate("Yxy", values);
      X = Yxy.x * (Yxy.Y / Yxy.y);
      Y = Yxy.Y;
      Z = (1 - Yxy.x - Yxy.y) * (Yxy.Y / Yxy.y);
      return schemer.base["XYZ-to-rgb"]({
        X: X,
        Y: Y,
        Z: Z
      });
    },
    "rgb-to-Yxy": function(values) {
      var XYZ, rgb, x, y, _ref, _ref1;
      rgb = schemer.bounds.validate("rgb", values);
      XYZ = schemer.base["rgb-to-XYZ"](rgb);
      x = y = 1;
      if (!(((XYZ.X === (_ref1 = XYZ.Y) && _ref1 === (_ref = XYZ.Z)) && _ref === 0))) {
        x = XYZ.X / (XYZ.X + XYZ.Y + XYZ.Z);
        y = XYZ.Y / (XYZ.X + XYZ.Y + XYZ.Z);
      }
      return schemer.bounds.validate("Yxy", {
        Y: XYZ.Y,
        x: x,
        y: y
      });
    },
    "lab-to-rgb": function(values) {
      var X, Y, Z, lab;
      lab = schemer.bounds.validate("lab", values);
      Y = (lab.l + 16) / 116;
      X = lab.a / 500 + Y;
      Z = Y - lab.b / 200;
      X = X ^ 3 > 0.008856 ? X ^ 3 : (X - 16 / 116) / 7.787;
      Z = Z ^ 3 > 0.008856 ? Z ^ 3 : (Z - 16 / 116) / 7.787;
      Y = Y ^ 3 > 0.008856 ? Y ^ 3 : (Y - 16 / 116) / 7.787;
      X *= schemer.bounds.XYZ.X;
      Y *= schemer.bounds.XYZ.Y;
      Z *= schemer.bounds.XYZ.Z;
      return schemer.base["XYZ-to-rgb"]({
        X: X,
        Y: Y,
        Z: Z
      });
    },
    "rgb-to-lab": function(values) {
      var X, XYZ, Y, Z, a, b, l, rgb;
      rgb = schemer.bounds.validate("rgb", values);
      XYZ = schemer.base["rgb-to-XYZ"](values);
      X = XYZ.X / schemer.bounds.XYZ.X;
      Y = XYZ.Y / schemer.bounds.XYZ.Y;
      Z = XYZ.Z / schemer.bounds.XYZ.Z;
      X = X > 0.008856 ? X ^ (1 / 3) : (7.787 * X) + (16 / 116);
      Y = Y > 0.008856 ? Y ^ (1 / 3) : (7.787 * Y) + (16 / 116);
      Z = Z > 0.008856 ? Z ^ (1 / 3) : (7.787 * Z) + (16 / 116);
      l = (116 * Y) - 16;
      a = 500 * (X - Y);
      b = 200 * (Y - Z);
      return schemer.bounds.validate("lab", {
        l: l,
        a: a,
        b: b
      });
    }
  },
  stringlify: {
    tags: function(tag, str) {
      var ct, ot;
      ot = ct = "";
      if ((tag != null) && tag.length > 0) {
        ot = "<" + tag + ">";
      }
      if ((tag != null) && tag.length > 0) {
        ct = "</" + tag + ">";
      }
      return str.replace(/\[/g, ot).replace(/\]/g, ct);
    },
    rgb: function(values, tag) {
      var rgb;
      if (tag == null) {
        tag = null;
      }
      rgb = schemer.bounds.validate("rgb", values, true);
      return schemer.stringlify.tags(tag, "rgb([" + rgb.r + "], [" + rgb.g + "], [" + rgb.b + "])");
    },
    hex: function(values, tag) {
      var b, g, hex, r;
      if (tag == null) {
        tag = null;
      }
      hex = schemer.bounds.validate("rgb", values, true);
      r = hex.r.toString(16);
      g = hex.g.toString(16);
      b = hex.b.toString(16);
      if (hex.r < 16) {
        r = "0" + r;
      }
      if (hex.g < 16) {
        g = "0" + g;
      }
      if (hex.b < 16) {
        b = "0" + b;
      }
      return schemer.stringlify.tags(tag, "#[" + r + "][" + g + "][" + b + "]");
    },
    fgc: function(values, tag) {
      var fgc;
      if (tag == null) {
        tag = null;
      }
      fgc = schemer.bounds.validate("rgb", values, true);
      return schemer.stringlify.tags(tag, "rgb([" + fgc.r + "], [" + fgc.g + "], [" + fgc.b + "])");
    },
    hsl: function(values, tag) {
      var hsl;
      if (tag == null) {
        tag = null;
      }
      hsl = schemer.bounds.validate("hsl", values, true);
      return schemer.stringlify.tags(tag, "hsl([" + hsl.h + "], [" + hsl.s + "]%, [" + hsl.l + "]%)");
    },
    hsv: function(values, tag) {
      var hsv;
      if (tag == null) {
        tag = null;
      }
      hsv = schemer.bounds.validate("hsv", values, true);
      return schemer.stringlify.tags(tag, "hsv([" + hsv.h + "], [" + hsv.s + "]%, [" + hsv.v + "]%)");
    },
    cmy: function(values, tag) {
      var cmy;
      if (tag == null) {
        tag = null;
      }
      cmy = schemer.bounds.validate("cmy", values, true);
      return schemer.stringlify.tags(tag, "cmy([" + cmy.c + "], [" + cmy.m + "], [" + cmy.y + "])");
    },
    cmyk: function(values, tag) {
      var cmyk;
      if (tag == null) {
        tag = null;
      }
      cmyk = schemer.bounds.validate("cmyk", values, true);
      return schemer.stringlify.tags(tag, "cmyk([" + cmyk.c + "], [" + cmyk.m + "], [" + cmyk.y + "], [" + cmyk.k + "])");
    },
    XYZ: function(values, tag) {
      var XYZ;
      if (tag == null) {
        tag = null;
      }
      XYZ = schemer.bounds.validate("XYZ", values, true);
      return schemer.stringlify.tags(tag, "XYZ([" + XYZ.X + "], [" + XYZ.Y + "], [" + XYZ.Z + "])");
    },
    Yxy: function(values, tag) {
      var Yxy;
      if (tag == null) {
        tag = null;
      }
      Yxy = schemer.bounds.validate("Yxy", values, true);
      return schemer.stringlify.tags(tag, "Yxy([" + Yxy.Y + "]%, [" + Yxy.x + "]%, [" + Yxy.y + "]%)");
    },
    lab: function(values, tag) {
      var lab;
      if (tag == null) {
        tag = null;
      }
      lab = schemer.bounds.validate("lab", values, true);
      return schemer.stringlify.tags(tag, "lab([" + lab.l + "], [" + lab.a + "], [" + lab.b + "])");
    }
  },
  scheme: {
    "monochrome": [
      {
        ratio: 1,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.1;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed;
          }
        }
      }
    ],
    "monochrome-light": [
      {
        ratio: 0.4,
        h: {
          "mode": "fixed",
          origin: function(value, seed) {
            return 0;
          }
        },
        s: {
          "mode": "fixed",
          origin: function(value, seed) {
            return 0;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed;
          }
        }
      }, {
        ratio: 0.6,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.1;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed;
          }
        }
      }
    ],
    "monochrome-dark": [
      {
        ratio: 0.6,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.1;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed;
          }
        }
      }, {
        ratio: 0.4,
        h: {
          "mode": "fixed",
          origin: function(value, seed) {
            return 0;
          }
        },
        s: {
          "mode": "fixed",
          origin: function(value, seed) {
            return 0;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed;
          }
        }
      }
    ],
    "analogic": [
      {
        ratio: 1,
        h: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.5;
          }
        },
        s: {
          "mode": "global",
          origin: function(value, seed) {
            return value + seed * 0.1;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.1;
          }
        }
      }
    ],
    "complement": [
      {
        ratio: 0.4,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value + 0.5;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        }
      }, {
        ratio: 0.6,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        }
      }
    ],
    "analogic-complement": [
      {
        ratio: 0.4,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value + 0.5;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.5;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.5;
          }
        }
      }, {
        ratio: 0.6,
        h: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.75;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.1;
          }
        },
        l: {
          "mode": "global",
          origin: function(value, seed) {
            return value + seed * 0.1;
          }
        }
      }
    ],
    "triad": [
      {
        ratio: 0.25,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value + 0.33;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        }
      }, {
        ratio: 0.25,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value - 0.33;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        }
      }, {
        ratio: 0.5,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        }
      }
    ],
    "quad": [
      {
        ratio: 0.20,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value + 0.25;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        }
      }, {
        ratio: 0.20,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value + 0.5;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        }
      }, {
        ratio: 0.20,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value - 0.25;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        }
      }, {
        ratio: 0.40,
        h: {
          "mode": "global",
          origin: function(value, seed) {
            return value;
          }
        },
        s: {
          "mode": "single",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        },
        l: {
          "mode": "uniform",
          origin: function(value, seed) {
            return value + seed * 0.25;
          }
        }
      }
    ],
    "generate": function(mode, colors, color) {
      var clr, color, colorCount, colorIndex, colorWeight, colors, counts, group, groupIndex, h, hSeed, hsl, l, lMaxSeed, lMinSeed, lSeed, maxRatio, maxRatioIndex, ratio, ratioIndex, ratios, s, sMaxSeed, sMinSeed, sSeed, scheme, seed, seedStep, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref;
      colors = colors ||  [
          {h:  0, s: 0.5, l: 0.3},
          {h: .1, s: 0.5, l: 0.3},
          {h: .2, s: 0.5, l: 0.3},
          {h: .3, s: 0.5, l: 0.3},
          {h: .4, s: 0.5, l: 0.3}
        ];
      color = color || {h: .185, s: .50, l: .49};
      scheme = schemer.scheme[mode];
      ratios = [];
      counts = [];
      for (groupIndex = _i = 0, _len = scheme.length; _i < _len; groupIndex = ++_i) {
        group = scheme[groupIndex];
        ratios.push(group.ratio);
        counts.push(0);
      }
      colorWeight = 1 / colors.length;
      for (colorIndex = _j = 0, _len1 = colors.length; _j < _len1; colorIndex = ++_j) {
        clr = colors[colorIndex];
        maxRatio = -1;
        maxRatioIndex = -1;
        for (ratioIndex = _k = 0, _len2 = ratios.length; _k < _len2; ratioIndex = ++_k) {
          ratio = ratios[ratioIndex];
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxRatioIndex = ratioIndex;
          }
        }
        ratios[maxRatioIndex] -= colorWeight;
        counts[maxRatioIndex] += 1;
      }
      seed = 0.5;
      seedStep = seed / colors.length;
      hSeed = 0;
      sMaxSeed = Math.min(1, color.hsl.fraction.s + seed / 2);
      sMinSeed = Math.max(0, sMaxSeed - seed);
      sSeed = sMinSeed - color.hsl.fraction.s;
      lMaxSeed = Math.min(1, color.hsl.fraction.l + seed / 2);
      lMinSeed = Math.max(0, lMaxSeed - seed);
      lSeed = lMinSeed - color.hsl.fraction.l;
      colorIndex = 0;
      for (groupIndex = _l = 0, _len3 = scheme.length; _l < _len3; groupIndex = ++_l) {
        group = scheme[groupIndex];
        for (colorCount = _m = 1, _ref = counts[groupIndex]; 1 <= _ref ? _m <= _ref : _m >= _ref; colorCount = 1 <= _ref ? ++_m : --_m) {
          h = group.h.origin(color.hsl.fraction.h, hSeed);
          if (h < 0) {
            h += 1;
          }
          if (h > 1) {
            h -= 1;
          }
          hSeed += seedStep;
          s = group.s.origin(color.hsl.fraction.s, sSeed);
          sSeed += seedStep;
          l = group.l.origin(color.hsl.fraction.l, lSeed);
          lSeed += seedStep;
          hsl = schemer.bounds.validate("hsl", {
            h: h,
            s: s,
            l: l
          });
          hsl.is_fraction = true;
          colors[colorIndex] = colored.colorMe({hsl: hsl, rgb:{}, hex: null, cmyk: {}});
          colorIndex += 1;
        }
      }
      return colors;
    }
  },
  convert: function(srcType, targetType, values) {
    if (srcType === targetType) {
      return schemer.bounds.validate(srcType, values);
    }
    return schemer.base["rgb-to-" + targetType](schemer.base["" + srcType + "-to-rgb"](values));
  }
};