const fs = require("fs");
const md = require("markdown-it")({
  html: true,
  typographer: true,
});
const puppeteer = require("puppeteer");

const readme = fs.readFileSync("./readme.md", "utf-8");
let lines = readme.split(/(\r|\n)/);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  let page = await browser.newPage();
  await page.setViewport({
    width: 1440,
    height: 900,
  });

  let output = [
    `
    <html>
        <head>
            <title>Awesome Illustrations</title>
            <meta name="description" content="A curated list of awesome illustrations & tools ✨.">

            <!-- Google / Search Engine Tags -->
            <meta itemprop="name" content="MrPeker/awesome-illustrations">
            <meta itemprop="description" content="A curated list of awesome illustrations & tools ✨.">
            <meta itemprop="image" content="https://repository-images.githubusercontent.com/263197559/fdfcac00-940a-11ea-9c15-839e1e475b1a">

            <!-- Facebook Meta Tags -->
            <meta property="og:url" content="https://awesome-illustrations.now.sh">
            <meta property="og:type" content="website">
            <meta property="og:title" content="MrPeker/awesome-illustrations">
            <meta property="og:description" content="A curated list of awesome illustrations & tools ✨.">
            <meta property="og:image" content="https://repository-images.githubusercontent.com/263197559/fdfcac00-940a-11ea-9c15-839e1e475b1a">

            <!-- Twitter Meta Tags -->
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="MrPeker/awesome-illustrations">
            <meta name="twitter:description" content="A curated list of awesome illustrations & tools ✨.">
            <meta name="twitter:image" content="https://repository-images.githubusercontent.com/263197559/fdfcac00-940a-11ea-9c15-839e1e475b1a">
            
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
            <style>
                .btn-github{color:#fff;background-color:#444;border-color:rgba(0,0,0,0.2)}.btn-github:focus,.btn-github.focus{color:#fff;background-color:#2b2b2b;border-color:rgba(0,0,0,0.2)}
                .btn-github:hover{color:#fff;background-color:#2b2b2b;border-color:rgba(0,0,0,0.2)}
                .btn-github:active,.btn-github.active,.open>.dropdown-toggle.btn-github{color:#fff;background-color:#2b2b2b;border-color:rgba(0,0,0,0.2)}.btn-github:active:hover,.btn-github.active:hover,.open>.dropdown-toggle.btn-github:hover,.btn-github:active:focus,.btn-github.active:focus,.open>.dropdown-toggle.btn-github:focus,.btn-github:active.focus,.btn-github.active.focus,.open>.dropdown-toggle.btn-github.focus{color:#fff;background-color:#191919;border-color:rgba(0,0,0,0.2)}
                .btn-github:active,.btn-github.active,.open>.dropdown-toggle.btn-github{background-image:none}
                .btn-github.disabled:hover,.btn-github[disabled]:hover,fieldset[disabled] .btn-github:hover,.btn-github.disabled:focus,.btn-github[disabled]:focus,fieldset[disabled] .btn-github:focus,.btn-github.disabled.focus,.btn-github[disabled].focus,fieldset[disabled] .btn-github.focus{background-color:#444;border-color:rgba(0,0,0,0.2)}
                .btn-github .badge{color:#444;background-color:#fff}
                ul img {width: 100%}
            </style>
        </head>
        <body>
        <div class="container">
        <img class="w-100 mb-3" src="https://repository-images.githubusercontent.com/263197559/fdfcac00-940a-11ea-9c15-839e1e475b1a" alt="Awesome Illustrations Cover"/>
        <a class="btn btn-block btn-social btn-github text-white mb-3" target="_blank">
            <span class="fab fa-github mr-1"></span> Visit MrPeker/awesome-illustrations on GitHub
        </a>
      `,
  ];

  function processLine(line, index) {
    setTimeout(() => {
      if (index === lines.length - 1) {
        browser.close();
        output.push(`</div></body></html>`);
        output = output.join("");
        console.log("Finished");
        fs.writeFileSync("index.html", output);
      }
    }, 500);
    return new Promise(async (resolve, reject) => {
      if (line.split(" - ").length > 1) {
        console.log({ line });

        let url = line.match(/\[.*?\]\((.*?)\)/)[1];
        let imagePath = `imgs/${Date.now()}${Math.floor(
          Math.random() * 9999
        )}.jpg`;

        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: 0,
        });
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 100);
        });
        await page.screenshot({
          type: "jpeg",
          quality: 100,
          path: imagePath,
        });

        output.push(
          md.render(`${line}<br/>
[![A screenshot of ${url}](/${imagePath})](${url})`)
        );
        resolve(true);
      } else {
        output.push(md.render(line));
        resolve(true);
      }
    });
  }

  lines.reduce((previousPromise, nextLine, index) => {
    return previousPromise.then(() => {
      return processLine(nextLine, index);
    });
  }, Promise.resolve());
})();
