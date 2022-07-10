const {Gradeobject, ClassesObject} = require('../helper/objects')
const puppeteer = require('puppeteer')
const os = require("os")



async function getMaj(username, password) {
  let index = -2;
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

  let tabs = await page.$$('td[class="mdl-data-table__cell--non-numeric"]')
  for(i = 0; i < tabs.length; i++){
    let value = await page.evaluate(el => el.textContent, tabs[i])
    if(value == "Ausbildungsgang") index = i
    if(i == index + 1){
        browser.close()
        return value
    }
  }
}

async function getClasses(username, password){
    let gradearrayobject = []
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

  await page.waitForSelector('i.fa-graduation-cap', {visible: true})

  let allclasses = await page.$$("tr > td > b")
  allclasses.pop()
  let classes = [];
  for(i = 0; i < allclasses.length; i++){
    let value = await page.evaluate(el => el.textContent, allclasses[i])
    classes.push(value.split("-")[0].split(" ")[0])
  }

  browser.close();
  return new ClassesObject(classes)
}

async function getGrades(username, password, maj){
  let classeslist = await getClasses(username, password);
  let gradearrayobject = []
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

  await page.waitForSelector(`tr[class='0_${classeslist[maj]}_detailrow'] > td > table > tbody > tr`)

  let grades = await page.$$(`tr[class='0_${classeslist[maj]}_detailrow'] > td > table > tbody > tr`)
  grades.pop()
  grades.shift()

  for(i = 0; i < grades.length; i++){
    ret = []
    let grade = grades[i]

    let value = await page.evaluate(el => el.textContent, grade)

    value = value.split("\n").map(info => {
        let stack = info.trim()
        if(stack != ""){return stack}
    }).filter(el => {
        return (
            el !== undefined
        )
    })
    if(value.length == 4){
        value.splice(3, 0, "no information on points available")
    }
    
    gradeobject = new Gradeobject(value)
    gradearrayobject.push(gradeobject)
  }

  

  

  


  await browser.close();

  return gradearrayobject;
}


//works but needs performance 

module.exports = {getGrades, getClasses, getMaj}
