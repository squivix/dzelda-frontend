import * as fs from "fs";

const fileData = JSON.parse(fs.readFileSync("/home/ordem/WebstormProjects/dzelda-frontend/public/data/preview/lesson-vocabs/1.json", "utf-8"));
fileData.forEach(v => delete v.meanings);
console.log(JSON.stringify(fileData));
