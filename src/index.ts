import fs from 'fs';
import axios from 'axios';
import path from 'path';
import studentsInfo from './data/studentsInfo.json';


const serializeName = (name: string) => name.split(" ").join("_").toLowerCase();

const imageDownloader = async (url: string) => {
  // https://www.kindacode.com/article/using-axios-to-download-images-and-videos-in-node-js/

  var response = await axios({
    url: url,
    responseType: "stream",
  }).then((res) => res).catch((e) => console.log(e.message, url))
  return response
};

const createFile = async (url: string, studentName: string): Promise<void> => {
  const imageData = await imageDownloader(url);
  const localPath = `${studentName}.png`

  await imageData?.data.pipe(
    fs.createWriteStream(path.join(__dirname, 'images', localPath))
  );
};

interface typeObj {
  personName: string;
  urlImage: string;
}

var globalPeopleInfo: typeObj[] = []

function main() {
  studentsInfo.forEach(async (student) => {
    if (student['Envie uma foto sua de criança:'] != "") {
      globalPeopleInfo.push({
        personName: serializeName(student['Antes de tudo, nos diga quem é você?']),
        urlImage: encodeURI(student['Envie uma foto sua de criança:'])
      }) 
    }
  })

  var executionTime = globalPeopleInfo.length - 1
  var currentPosition = 0
  console.log(`
    BAIXAR DE IMAGENS - BY @VINIGOFR 
    FORAM IDENTIFICADAS ${executionTime + 1} imagens 
    AGUARDE O DOWNLOAD COMEÇAR
    `)

    // https://www.geeksforgeeks.org/node-js-fs-mkdir-method/
  if (!fs.existsSync(path.join(__dirname, 'images'))) {
    fs.mkdir(path.join(__dirname, 'images'), (err) => {
      if (err) { return console.error(err) }
      console.log('Diretório "images" criado com sucesso!');
  });
  }

  var currentInterval = setInterval(async () => {
    await createFile(globalPeopleInfo[currentPosition].urlImage, globalPeopleInfo[currentPosition].personName)
    console.log(`Imagem ${currentPosition + 1}/${executionTime + 1}`);
    currentPosition++

    if (currentPosition > executionTime) {
      clearInterval(currentInterval)
    }
  }, 1500)
}

main()