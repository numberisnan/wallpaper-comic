# Wallpaper updater for Windows

This is a simple project written in JavaScript that updates your wallpaper every day to a daily comic strip! Enjoy 🖼🎁👍

<img src="README/desktop.PNG" width="700">

## Prerequisites

-  Node v8+ installed

## Run

#### To run manually

```
npm install
npm run 
```

#### To set to run on startup

1. Run `npm install`
2. Open Windows Task Scheduler and click 'Create Basic Task...'
3.  Name the task 'wallpaper-comic' and click next.
4. Select 'When I log on' for when you want the task to start. Click next.
5. Select 'Run a program' for the task to preform. Click next.
6. For 'Program/script', find `start.bat` and select that.
7. For 'Start in', put the location of the folder in which `start.bat` is located. Click next.
8. Click 'Finish'

## Roadmap

- [x] Download images from GoComics
- [x] Set images as wallpaper
- [x] Set to run on computer startup
