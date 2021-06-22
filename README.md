Jpeg convertor
=============

Project to create a tool able to convert and compress images in the browser !

This is powered by <a style="background-image: https://webassembly.org/css/webassembly.svg; width:100; heigt:50" href="https://webassembly.org"></a>

<a href="https://webassembly.org" target="_blank"><img src="http://webassembly.org/css/webassembly.svg" height="48" width="100" ></a> 

<br>

# Prerequisite

To build this project on linux, you will need a package called "libncurses5".

## On debian-based distros:

```
sudo apt install libncurses5
```

## On arch-based distros:

```
sudo pacman -S ncurses
sudo ln -s /usr/lib/libtinfo.so.6 /usr/lib/libtinfo.so.5
```


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
npm run serve
```
It will start a local server


# Usage:

You can use this tool to select multiple images from your local computer, set a quality for all of them,
and convert them all at once !

The result will be stored in a `jpeg-result.zip`


# Inspiration

They are really good tool out there, like [squoosh](https://squoosh.app/).

Personnally, I tried to do everything from scratch with the webassembly, I used the [c stb headers](https://github.com/nothings/stb) for image manipulation.
