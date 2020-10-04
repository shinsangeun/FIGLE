const axios = require("axios");
const cheerio = require("cheerio");

let html = "";

async function getHtml() {
    try {
        return await axios.get(
            "http://fifaonline4.nexon.com/DataCenter/PlayerInfo?spid=234001183&n1Strong=1"
        );
    } catch (error) {
        console.error(error);
    }
}

async function getNews() {
    if (!html) {
        html = await getHtml();
       // console.log("html:", html);
    }

    const $ = cheerio.load(html.data);
    let smp = {};

    let test;
    test = $(".datacenter")[0];
    test = $(".wrap")[0];
    test = $(".player_view")[0];
    test = $(".content data_detail")[0];
    test = $(".wrap")[0];
    test = $(".content_header")[0];
    test = $(".thumb lh")[0];
    test = $(".img")[0];

/*.getElementsByClass("wrap").get(0)
        .getElementsByClass("player_view").get(0)
        .getElementsByClass("content data_detail").get(0)
        .getElementsByClass("wrap").get(0)
        .getElementsByClass("content_header").get(0)
        .getElementsByClass("thumb ${seasonName}").get(0)
        .getElementsByClass("img").get(0)
        .childNodes().get(0)
        .attributes().get("src")*/


    console.log("test-->", test);
    console.log("smp-->", smp);

    $("#content_header div")
        .first("div")
        .each(function (index, elem) {
            switch ($(this).find("div").text().trim()) {
                case "선수":
                    smp = $(this)
                        .find("img")
                        .text()
                    // .replace(/([\t|\n|\s])/gi, "");
                    break;
            }
        });

    console.log("smp:", smp);

    return smp;
}

module.exports = { getNews };
