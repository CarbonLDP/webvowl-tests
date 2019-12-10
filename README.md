# WebVOWL Test

This repo is mean to test the level of integration of the WebVOWL source code.

Original source code: [VisualDataWeb/WebVOWL](https://github.com/VisualDataWeb/WebVOWL)

## Structure

```text
┌── assets                              # Directory with the JS/CSS of the WebVOWL
│   ├── d3.min.js                       # D3.js library used for the graphics
│   └── webvowl.js                      # WebVOWL library JS bundled code
│   └── webvowl.css                     # WebVOWL library CSS bundled code
├── .gitignore                          # Ignore file for git
├── app.js                              # JS file with the code to run the WebVOWL library
├── ind-demo-vowl.json                  # JSON file with the VOWL description fo the industrial demo
├── index.html                          # HTML file with the minimum to run the test
└── README.MD                           # this
```

## Test

To run the test you need to run a server in the root directory of the project.
For example:

```shell script
python -m SimpleHTTPServer 8080
```

And then open `http://localhost:8080/` in any browser.
