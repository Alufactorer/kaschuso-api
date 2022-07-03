
const puppeteer = require('puppeteer')
const os = require("os")

const sleep = ms => new Promise(r => setTimeout(r, ms));

const getMajMAPS = {
  "Big":0,
  "Bio":1,
  "Che":2,
  "Deu":3,
  "EngW":4,
  "Fra":5, 
  "Geo":6,
  "Ges":7,
  "Inf":8,
  "Mat":9,
  "Mus":10,
  "PAMS":11,
  "Phy":12,
  "Spo":13
}

const getMaj = {
  "Big":0,
  "Bio":1,
  "Che":2,
  "Deu":3,
  "EngW":4,
  "Fra":5, 
  "Geo":6,
  "Ges":7,
  "Inf":8,
  "Mat":9,
  "Mus":10,
  "PAMS":11,
  "Phy":12,
  "Spo":13
}

async function login(username, password, maj){
  let gradeobject = []
  console.log(os.platform())
  const r = /\B\s+|\s+\B/g

  if(os.platform() === "linux"){
    browser = await puppeteer.launch({ headless:true, executablePath: "/usr/bin/chromium-browser", args: ['--no-sandbox', "--disabled-setupid-sandbox",'--disable-dev-shm-usage'] })
  }
  if(os.platform() === "win32"){
    browser = await puppeteer.launch()    
  }


  const page = await browser.newPage();
  await page.goto('https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso');
  await page.type("input[name=userid]", username)
  await page.click("img[src='staticfiles/images/eye.gif']")
  await page.type("input[name=password]", password)
  await page.click(".btn.btn-primary")
  await page.waitForSelector('i.fa-graduation-cap', {visible: true})

  await page.click("i.fa-graduation-cap")

  await page.waitForSelector(`tr[class='0_${getMaj[maj]}_detailrow'] > td > table > tbody > tr`)

  let rg = [];
  let grades = await page.$$(`tr[class='0_${getMaj[maj]}_detailrow'] > td > table > tbody > tr`)
  grades.pop()
  grades.shift()

  for(i = 0; i < grades.length; i++){
    ret = []
    let grade = grades[i]

    let value = await page.evaluate(el => el.textContent, grade)

    value.split("\n").map(t => t.replaceAll(" ", "")).map(n => {

      if(n != ""){
        ret.push(n)
      }
    })
    ret = ret.map(s => s = (s.replace(/([A-Z])/g, ' $1').trim()))
      if(ret.length == 5){
        gradeobject.push({date:ret[0], info:ret[1], grade:ret[2], points:ret[3].split("sz")[0] + "s " + ret[3].split("Details")[1].split(":").join(" : "), weight:ret[4]})
      }
      if(ret.length == 4){
        gradeobject.push({date:ret[0], info:ret[1], grade:ret[2], points:"no information on points", weight:ret[3]})
      }

  }

  

  

  


  await browser.close();

  return gradeobject;
}
//works but needs performance 

module.exports = {login}
