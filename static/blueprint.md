FORMAT: 1A
HOST: https://www.thecolorapi.com

# The Color API Docs
- [About](https://www.thecolorapi.com/) The Color API
- Support is only an email away: [support@thecolorapi.com](mailto:support@thecolorapi.com?subject=The Color API)
- Created by [Josh Beckman](https://www.joshbeckman.org) to bring a little more color into this world.

---

__Note:__ All endpoints support JSONP with the `callback` query parameter.

# Group Colors

## Color Identification [/id{?hex,rgb,hsl,cmyk,format}]
Return available identifying information on the given color.

+ Parameters

    + hex (optional, string, `0047AB`) ... Valid hex code
    + rgb (optional, string, `0,71,171`) ... Valid rgb color, also `rgb(0,71,171)`
    + hsl (optional, string, `215,100%,34%`) ... Valid hsl color, also `hsl(215,100%,34%)`
    + cmyk (optional, string, `100,58,0,33`) ... Valid cmyk color, also `cmyk(100,58,0,33)`
    + format = `json` (optional, string, `html`) ... Return results as JSON(P), SVG or HTML page

        + Values
            + `json`
            + `html`
            + `svg`
    + w = `100` (optional, integer, `350`) ... Width of resulting image, only applicable on SVG format
    + w = `100` (optional, integer, `350`) ... Height of resulting image, only applicable on SVG format
    + named = `true` (optional, boolean, `false`) ... Whether to print the color names on resulting image, only applicable on SVG format

+ Model

    + Headers

            Content-Type: application/json

    + Body

            {
                "hex": {
                    "value": "#0047AB",
                    "clean": "0047AB"
                },
                "rgb": {
                    "fraction": {
                        "r": 0,
                        "g": 0.2784313725490196,
                        "b": 0.6705882352941176
                    },
                    "r": 0,
                    "g": 71,
                    "b": 171,
                    "value": "rgb(0, 71, 171)"
                },
                "hsl": {
                    "fraction": {
                        "h": 0.5974658869395711,
                        "s": 1,
                        "l": 0.3352941176470588
                    },
                    "h": 215,
                    "s": 100,
                    "l": 34,
                    "value": "hsl(215, 100%, 34%)"
                },
                "hsv": {
                    "fraction": {
                        "h": 0.5974658869395711,
                        "s": 1,
                        "v": 0.6705882352941176
                    },
                    "h": 215,
                    "s": 100,
                    "value": "hsv(215, 100%, 67%)",
                    "v": 67
                },
                "name": {
                    "value": "Cobalt",
                    "closest_named_hex": "#0047AB",
                    "exact_match_name": true,
                    "distance": 0
                },
                "cmyk": {
                    "fraction": {
                        "c": 1,
                        "m": 0.5847953216374269,
                        "y": 0,
                        "k": 0.3294117647058824
                    },
                    "value": "cmyk(100, 58, 0, 33)",
                    "c": 100,
                    "m": 58,
                    "y": 0,
                    "k": 33
                },
                "XYZ": {
                    "fraction": {
                        "X": 0.22060823529411763,
                        "Y": 0.2475505882352941,
                        "Z": 0.6705831372549019
                    },
                    "value": "XYZ(22, 25, 67)",
                    "X": 22,
                    "Y": 25,
                    "Z": 67
                },
                "image": {
                    "bare": "http://placehold.it/300x300.png/0047AB/000000",
                    "named": "http://placehold.it/300x300.png/0047AB/000000&text=Cobalt"
                },
                "contrast": {
                    "value": "#000000"
                },
                "_links": {
                    "self": {
                        "href": "/id?hex=0047AB"
                    }
                },
                "_embedded": {}
            }

### Get Color [GET]
Get information for a single color.

e.g.
```
/id?hex=24B1E0 || /id?rgb=rgb(0,71,171) || ...
```

+ Response 200

    [Color Identification][]

+ Response 400

    + Headers

            Content-Type: application/json

    + Body

            {
                "code": 400,
                "message": "The Color API doesn't understand what you mean. Please supply a query parameter of `rgb`, `hsl`, `cmyk` or `hex`.",
                "query": {},
                "params": [],
                "path": "/id",
                "example": "/id?hex=a674D3"
            }

# Group Schemes
Color schemes are multi-color combinations chosen according to color-wheel relationsships.

## Generate Scheme [/scheme{?hex,rgb,hsl,cmyk,format,mode,count}]
Return a generated scheme for the provided seed color and optional mode.

+ Parameters

    + hex (optional, string, `0047AB`) ... Valid hex code
    + rgb (optional, string, `0,71,171`) ... Valid rgb color, also `rgb(0,71,171)`
    + hsl (optional, string, `215,100%,34%`) ... Valid hsl color, also `hsl(215,100%,34%)`
    + cmyk (optional, string, `100,58,0,33`) ... Valid cmyk color, also `cmyk(100,58,0,33)`
    + format = `json` (optional, string, `html`) ... Return results as JSON(P), SVG or HTML page of results

        + Values
            + `json`
            + `html`
            + `svg`
    + mode = `monochrome` (optional, string, `analogic`) ... Define mode by which to generate the scheme from the seed color

        + Values
            + `monochrome`
            + `monochrome-dark`
            + `monochrome-light`
            + `analogic`
            + `complement`
            + `analogic-complement`
            + `triad`
            + `quad`
    + count = `5` (optional, integer, `6`) ... Number of colors to return
    + w = `100` (optional, integer, `350`) ... Width of resulting image, only applicable on SVG format
    + w = `100` (optional, integer, `350`) ... Height of resulting image, only applicable on SVG format
    + named = `true` (optional, boolean, `false`) ... Whether to print the color names on resulting image, only applicable on SVG format

+ Model

    + Headers

            Content-Type: application/json

    + Body

            {
                "mode": "monochrome",
                "count": "2",
                "colors": [
                    {
                        "hex": {
                            "value": "#01122A",
                            "clean": "01122A"
                        },
                        "rgb": {
                            "fraction": {
                                "r": 0.00392156862745098,
                                "g": 0.07058823529411765,
                                "b": 0.16470588235294117
                            },
                            "r": 1,
                            "g": 18,
                            "b": 42,
                            "value": "rgb(1, 18, 42)"
                        },
                        "hsl": {
                            "fraction": {
                                "h": 0.597560975609756,
                                "s": 0.9534883720930231,
                                "l": 0.08431372549019608
                            },
                            "h": 215,
                            "s": 95,
                            "l": 8,
                            "value": "hsl(215, 95%, 8%)"
                        },
                        "hsv": {
                            "fraction": {
                                "h": 0.597560975609756,
                                "s": 0.976190476190476,
                                "v": 0.16470588235294117
                            },
                            "value": "hsv(215, 98%, 16%)",
                            "h": 215,
                            "s": 98,
                            "v": 16
                        },
                        "name": {
                            "value": "Midnight",
                            "closest_named_hex": "#011635",
                            "exact_match_name": false,
                            "distance": 217
                        },
                        "cmyk": {
                            "fraction": {
                                "c": 0.9761904761904763,
                                "m": 0.5714285714285715,
                                "y": 0,
                                "k": 0.8352941176470589
                            },
                            "value": "cmyk(98, 57, 0, 84)",
                            "c": 98,
                            "m": 57,
                            "y": 0,
                            "k": 84
                        },
                        "XYZ": {
                            "fraction": {
                                "X": 0.056589019607843134,
                                "Y": 0.06321019607843137,
                                "Z": 0.1650427450980392
                            },
                            "value": "XYZ(6, 6, 17)",
                            "X": 6,
                            "Y": 6,
                            "Z": 17
                        },
                        "image": {
                            "bare": "http://placehold.it/300x300.png/01122A/FFFFFF",
                            "named": "http://placehold.it/300x300.png/01122A/FFFFFF&text=Midnight"
                        },
                        "contrast": {
                            "value": "#FFFFFF"
                        },
                        "_links": {
                            "self": {
                                "href": "/id?hex=01122A"
                            }
                        },
                        "_embedded": {}
                    },
                    {
                        "hex": {
                            "value": "#0247A9",
                            "clean": "0247A9"
                        },
                        "rgb": {
                            "fraction": {
                                "r": 0.00784313725490196,
                                "g": 0.2784313725490196,
                                "b": 0.6627450980392157
                            },
                            "r": 2,
                            "g": 71,
                            "b": 169,
                            "value": "rgb(2, 71, 169)"
                        },
                        "hsl": {
                            "fraction": {
                                "h": 0.5978043912175649,
                                "s": 0.976608187134503,
                                "l": 0.3352941176470588
                            },
                            "h": 215,
                            "s": 98,
                            "l": 34,
                            "value": "hsl(215, 98%, 34%)"
                        },
                        "hsv": {
                            "fraction": {
                                "h": 0.5978043912175649,
                                "s": 0.9881656804733728,
                                "v": 0.6627450980392157
                            },
                            "value": "hsv(215, 99%, 66%)",
                            "h": 215,
                            "s": 99,
                            "v": 66
                        },
                        "name": {
                            "value": "Cobalt",
                            "closest_named_hex": "#0047AB",
                            "exact_match_name": false,
                            "distance": 80
                        },
                        "cmyk": {
                            "fraction": {
                                "c": 0.9881656804733728,
                                "m": 0.5798816568047337,
                                "y": 0,
                                "k": 0.33725490196078434
                            },
                            "value": "cmyk(99, 58, 0, 34)",
                            "c": 99,
                            "m": 58,
                            "y": 0,
                            "k": 34
                        },
                        "XYZ": {
                            "fraction": {
                                "X": 0.2224270588235294,
                                "Y": 0.24865176470588235,
                                "Z": 0.6632796078431373
                            },
                            "value": "XYZ(22, 25, 66)",
                            "X": 22,
                            "Y": 25,
                            "Z": 66
                        },
                        "image": {
                            "bare": "http://placehold.it/300x300.png/0247A9/000000",
                            "named": "http://placehold.it/300x300.png/0247A9/000000&text=Cobalt"
                        },
                        "contrast": {
                            "value": "#000000"
                        },
                        "_links": {
                            "self": {
                                "href": "/id?hex=0247A9"
                            }
                        },
                        "_embedded": {}
                    }
                ],
                "seed": {
                    "hex": {
                        "value": "#0047AB",
                        "clean": "0047AB"
                    },
                    "rgb": {
                        "fraction": {
                            "r": 0,
                            "g": 0.2784313725490196,
                            "b": 0.6705882352941176
                        },
                        "r": 0,
                        "g": 71,
                        "b": 171,
                        "value": "rgb(0, 71, 171)"
                    },
                    "hsl": {
                        "fraction": {
                            "h": 0.5974658869395711,
                            "s": 1,
                            "l": 0.3352941176470588
                        },
                        "h": 215,
                        "s": 100,
                        "l": 34,
                        "value": "hsl(215, 100%, 34%)"
                    },
                    "hsv": {
                        "fraction": {
                            "h": 0.5974658869395711,
                            "s": 1,
                            "v": 0.6705882352941176
                        },
                        "value": "hsv(215, 100%, 67%)",
                        "h": 215,
                        "s": 100,
                        "v": 67
                    },
                    "name": {
                        "value": "Cobalt",
                        "closest_named_hex": "#0047AB",
                        "exact_match_name": true,
                        "distance": 0
                    },
                    "cmyk": {
                        "fraction": {
                            "c": 1,
                            "m": 0.5847953216374269,
                            "y": 0,
                            "k": 0.3294117647058824
                        },
                        "value": "cmyk(100, 58, 0, 33)",
                        "c": 100,
                        "m": 58,
                        "y": 0,
                        "k": 33
                    },
                    "XYZ": {
                        "fraction": {
                            "X": 0.22060823529411763,
                            "Y": 0.2475505882352941,
                            "Z": 0.6705831372549019
                        },
                        "value": "XYZ(22, 25, 67)",
                        "X": 22,
                        "Y": 25,
                        "Z": 67
                    },
                    "image": {
                        "bare": "http://placehold.it/300x300.png/0047AB/000000",
                        "named": "http://placehold.it/300x300.png/0047AB/000000&text=Cobalt"
                    },
                    "contrast": {
                        "value": "#000000"
                    },
                    "_links": {
                        "self": {
                            "href": "/id?hex=0047AB"
                        }
                    },
                    "_embedded": {}
                },
                "_links": {
                    "self": "/scheme?hex=0047AB&mode=monochrome&count=2",
                    "schemes": {
                        "monochrome": "/scheme?hex=0047AB&mode=monochrome&count=2",
                        "monochrome-dark": "/scheme?hex=0047AB&mode=monochrome-dark&count=2",
                        "monochrome-light": "/scheme?hex=0047AB&mode=monochrome-light&count=2",
                        "analogic": "/scheme?hex=0047AB&mode=analogic&count=2",
                        "complement": "/scheme?hex=0047AB&mode=complement&count=2",
                        "analogic-complement": "/scheme?hex=0047AB&mode=analogic-complement&count=2",
                        "triad": "/scheme?hex=0047AB&mode=triad&count=2",
                        "quad": "/scheme?hex=0047AB&mode=quad&count=2"
                    }
                },
                "_embedded": {}
            }

### Get Scheme [GET]
Get a color scheme for a given seed color.

e.g.
```
/scheme?hex=24B1E0&mode=triad&count=6 || /scheme?rgb=rgb(0,71,171) || ...
```

+ Response 200

    [Generate Scheme][]

+ Response 400

    + Headers

            Content-Type: application/json

    + Body

            {
                "code": 400,
                "message": "The Color API doesn't understand what you mean. Please supply a query parameter of `rgb`, `hsl`, `cmyk` or `hex`.",
                "query": {},
                "params": [],
                "path": "/scheme",
                "example": "/scheme?hex=FF0&mode=monochrome&count=5"
            }