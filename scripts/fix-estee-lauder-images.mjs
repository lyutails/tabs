import fs from 'node:fs';
import path from 'node:path';

const catalogPath = path.resolve('catalog/estee-lauder.json');
const imagesDir = path.resolve('public/catalog-images/estee-lauder');

const products = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

let updated = 0;
let missing = 0;

for (const product of products) {
  const code = product.code;
  const imagePath = path.join(imagesDir, `${code}.jpg`);

  if (!fs.existsSync(imagePath)) {
    console.warn(`Нет изображения: ${code}.jpg`);
    missing++;
    continue;
  }

  product.listingImage ??= {};
  product.listingImage.url =
    `/catalog-images/estee-lauder/${code}.jpg`;

  updated++;
}

fs.writeFileSync(
  catalogPath,
  JSON.stringify(products, null, 2) + '\n',
  'utf8'
);

console.log(`Обновлено путей: ${updated}`);
console.log(`Изображений не найдено: ${missing}`);