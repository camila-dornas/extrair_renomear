const fs = require('fs');
const axios = require ('axios');
const path = require ('path');
const studentsInfo = require ('./data/studentsInfo.json');

const serializeName = (name) => name.split(" ").join("_").toLowerCase();

const imageDownloader = async (url) => {
  // https://www.kindacode.com/article/using-axios-to-download-images-and-videos-in-node-js/
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
  const codedURL = encodeURI(url)
    return axios({
      url: codedURL,
      responseType: "stream"
    }).then((res) => res).catch((e) => console.log(e.message, url))
};

const createFile = async (url, studentName) => {
  const imageData = await imageDownloader(url);
  const localPath = `${serializeName(studentName)}.png`
  const write = imageData?.data.pipe(
    fs.createWriteStream(path.join(__dirname, 'images', localPath))
  );
};

let total = 0

studentsInfo.forEach(async (student) => {
  if (!(student['Envie uma foto SUA (Selfie ou você no seu Set up) que te represente atualmente e que não seja uma animação:'] === " ")) {
    total += 1
    await createFile(
      student['Envie uma foto SUA (Selfie ou você no seu Set up) que te represente atualmente e que não seja uma animação:'],
      student['Antes de tudo, nos diga quem é você?']
    )
  }
})

console.log({total});