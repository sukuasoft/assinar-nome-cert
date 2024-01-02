import Jimp from 'jimp';
import fs_p from 'node:fs/promises';
import fs from 'node:fs';

//posições onde vai começar a escrita
const x: number = 1000;
const y: number = 780;

const students: string[] = [];

openData();
start();

async function openData() {
    if(fs.existsSync('data.json')){
        const content=  (await fs_p.readFile('data.json')).toString('utf-8');
        try{
           const json = JSON.parse(content);
           
           if(Array.isArray(json)){
            for(const item of json){
                if(typeof item === "string"){
                    students.push(item);
                }
                else{
                    students.splice(0, students.length);
                    throw new Error();
                }

            }
            }
        }catch(ex){
            console.log('Ocorreu um erro na leitura');
        }
    }

}

async function start() {


    //carregando a fonte que vamos utilizar
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

    for (const student_name of students) {
        //carregando a imagem
        const image = await Jimp.read('cert.png');
        console.log(`Escrevendo nome de ${student_name} no certificado!`);


        const sizeBox = {
            x: font.info.size * 25,
            y: font.common.lineHeight * 2
        }
        //escrevendo na imagem
        image.print(font, x - (Math.floor(sizeBox.x / 2)), y - sizeBox.y, {
            text: student_name,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
        },
            sizeBox.x, sizeBox.y);


        console.log("Salvando o certificado....");

        //salvando a nova imagem
        await image.writeAsync(`output/cert_${student_name.replace(' ', '-')
            .replace(/[^a-zA-z\-]/g, '')}.png`);

        console.log(`Certificado de ${student_name} salvo com sucesso!`);

    }

}

