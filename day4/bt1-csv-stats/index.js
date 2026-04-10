import fs from 'fs';
import readline from 'readline';

async function csvStats(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  let lineCount = 0;
  let errorCount = 0;
  const domainCount = {};
  let headers = [];

  for await (const line of rl) {
    // bỏ qua dòng header
    if (headers.length === 0) {
      headers = line.split(',');
      continue;
    }

    lineCount++
    // kiểm tra hợp lệ
    const cols = line.split(',');
    const email = cols[2];  // cột thứ 3 là email

    // Email hợp lệ khi có @ và có domain phía sau
    const isValid = email && email.includes('@') && email.split('@')[1]?.length > 0;

    if (!isValid) {

      errorCount++;
      continue;  // dòng lỗi, bỏ qua phần đếm domain
    }

    // đếm domain
    const domain = email.split('@')[1];
    domainCount[domain] = (domainCount[domain] || 0) + 1;

  }

  // in kết quả
  // đổi thành cặp key value
  const top5 = Object.entries(domainCount)
  .sort((a,b) => b[1] - a[1]) // xắp xếp giảm dần theo số lần
  .slice(0,5); //lấy 5 cái đầu

  const errorRate = ((errorCount / lineCount) * 100).toFixed(2);
  console.log(`Tổng dòng dữ liệu: ${lineCount}`);
  console.log(`Dòng lỗi: ${errorCount} (${errorRate}%)`);
  console.log(`\nTop 5 domain:`);
  top5.forEach(([domain, count], i) => {
    console.log(`  ${i + 1}. ${domain}: ${count} lần`);
  });

}

csvStats(process.argv[2]);