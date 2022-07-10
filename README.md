# kaschuso-api
Kaschuso api


## features
  -get grades
  -get major
  -get classes
  
  
### usage
```
{getGrades, getMaj, getClasses} = require("sodseus");

(async () => {
  let grades = await getGrades("username", "password", "Class")
  let classes = await getClasses("username", "password")
  let major = await getMaj("username", "password")
  
  console.log(classes, major, grades)
})()


```
