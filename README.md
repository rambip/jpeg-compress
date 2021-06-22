Jpeg convertor
=============

Project to create a tool able to convert and compress images in the browser !

This is powered by ![](https://webassembly.org/css/webassembly.svg)


# Installation

```bash
git clone https://github.com/rambip/jpeg-compress
cd jpeg-compress
npm install
npm run build
```

Then, you will have a website ready to deploy inside `jpeg-compress/build` !
If you want to test it in your browser, just run:

```
npm test
```
It will start a local server


# Usage:

You can use this tool to select multiple images from your local computer, set a quality for all of them,
and convert them all at once !

The result will be stored in a `jpeg-result.zip`


# Inspiration

They are really good tool out there, like [squoosh](https://squoosh.app/).

Personnally, I tried to do everything from scratch with the webassembly, I used the [c stb headers](https://github.com/nothings/stb) for image manipulation.
