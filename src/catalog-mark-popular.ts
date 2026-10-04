import fs from 'node:fs';
import path from 'node:path';

const CATALOG_DIR = path.join(process.cwd(), 'catalog');

const files = fs
    .readdirSync(CATALOG_DIR)
    .filter(file => file.endsWith('.json'));

for (const file of files) {
    const filePath = path.join(CATALOG_DIR, file);

    const products = JSON.parse(
        fs.readFileSync(filePath, 'utf-8')
    );

    if (!Array.isArray(products) || products.length === 0) {
        console.log(`⚠️ Пропущен: ${file}`);
        continue;
    }

    // На случай, если скрипт запускается повторно:
    // сначала убираем старые отметки
    for (const product of products) {
        delete product.popular;
    }

    // Случайно выбираем 2 или 3 товара
    const count = Math.min(
        products.length,
        Math.floor(Math.random() * 2) + 2
    );

    // Перемешиваем товары
    const shuffled = [...products].sort(() => Math.random() - 0.5);

    // Помечаем первые count как popular
    for (let i = 0; i < count; i++) {
        shuffled[i].popular = true;
    }

    fs.writeFileSync(
        filePath,
        JSON.stringify(products, null, 2) + '\n',
        'utf-8'
    );

    console.log(`✓ ${file}: ${count} popular`);
}

console.log('\nГотово!');