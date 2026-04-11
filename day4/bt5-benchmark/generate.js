import fs from 'fs';

const writer = fs.createWriteStream('big.csv');
writer.write('id,name,email,age\n');

for (let i = 1; i <= 3_000_000; i++) {
  writer.write(`${i},User ${i},user${i}@gmail.com,${20 + (i % 50)}\n`);
}

writer.end(() => console.log('Done!'));