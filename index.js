const wallpaper = require("wallpaper");
const fs = require("fs");
const rp = require("request-promise-native");
const request = require("request");
const { parse } = require("node-html-parser");
const sharp = require("sharp");
const config = require("./config");
const { convert } = require("easyimage")

const dateString = (function createForamttedDate() {
    const date = new Date();
    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
})();
const imageName = "wallpapers/" + dateString.replace(/\//g, "-") + ".gif";
const imageConvertedName = imageName.replace(/\.gif/g, ".jpeg")
const resizedImageName = imageName.replace(/\.\w*/g, "_resized.jpeg");

(async function main() {
    console.log("Requesting image url ...");
    const parsedPage = parse(await rp("https://www.gocomics.com/garfield/" + dateString)
        .catch(err => {
            console.log("Request failed\n", err);
            setTimeout(main, config.settings.requestRetryRate);
        })
    );

    const imgUrl = parsedPage.querySelector(".item-comic-image img").rawAttrs.split(/ src=/)[1].replace(/"/g, "");

    console.log("Requesting image ...");
    await new Promise(function (resolve) { //From https://github.com/request/request-promise/issues/90
        request.get(imgUrl).on('response', function (response) {
            response.pause();
            resolve(response);
        });
    }).then(async function (response) {
        var stream = response.pipe(fs.createWriteStream(imageName));
        console.log("Writing to disk ...")
        await new Promise(function (resolve, reject) {
            stream.on('close', () => resolve())
            stream.on('error', () => reject())
        })
    }).catch(err => {
        console.log("Request failed\n", err);
        setTimeout(main, config.settings.requestRetryRate);
    });

    console.log("Converting image ...")
    await convert({
        src: imageName,
        dst: imageConvertedName
    });

    console.log("Resizing image ...");
    await sharp(imageConvertedName)
        .resize(config.settings.screenResolution[0], config.settings.screenResolution[1], { fit: "contain" })
        .toFile(resizedImageName);

    console.log("Setting wallpaper ...");
    await wallpaper.set(resizedImageName);

    // Use Bufffers instead of fs
    console.log("Deleting extra images ...");
    fs.unlinkSync(imageName);
})()
    .then(() => {
        console.log("Done!");
        process.exit();
    })
    .catch(console.log);
