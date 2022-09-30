const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const data1=[];


 async function readcsv(){

    // let data1=[];

    //  fs.createReadStream(path.resolve(__dirname,'models','ecommerce.csv'))
    csv.parseFile('./models/ecommerce.csv')
        // .pipe(csv.parse({headers:true,maxRows:5,objectMode:true}))
        .on('error',error => console.log(error))
        .on('data', row => {
            // console.log(row);
            data1.push(row);
            console.log("data",data1);
        }
        )
        // .on('end', rowCount => console.log(`Parsed ${rowCount} lines`));
        .on('end', (rowCount)=> {console.log(rowCount) });

        console.log("data1",data1);
        return data1;
}


module.exports = {readcsv};