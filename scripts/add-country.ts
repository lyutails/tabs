import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const CATALOG_DIR = join(process.cwd(), 'catalog');

const BRANDS_COUNTRY: Record<string, string> = {
    darphin: 'europe',
    dalba: 'korea',
    caudalie: 'europe',
    bioderma: 'europe',
    clarins: 'europe',
    'estee-lauder': 'europe',
    erborian: 'korea',
    declare: 'europe',
    dior: 'europe',
    clinique: 'europe',
    centellian24: 'europe',
    farmstay: 'europe',
    foreo: 'europe',
    givenchy: 'europe',
    guerlain: 'europe',
    guam: 'europe',
    'holika-holika': 'korea',
    'im-from': 'korea',
    'institut-esthederm': 'europe',
    'jo-malone': 'europe',
    kans: 'china',
    lador: 'europe',
    'la-roche-posay': 'europe',
    'loreal-professionnel': 'europe',
    martiderm: 'europe',
    matrix: 'usa',
    'medi-peel': 'korea',
    'narciso-rodriguez': 'usa',
    'obagi-medical': 'usa',
    olaplex: 'usa',
    origins: 'usa',
    rocs: 'russia',
    'round-lab': 'korea',
    sesderma: 'europe',
    sisley: 'europe',
    thalgo: 'europe',
    uriage: 'europe',
    valmont: 'europe',
};

async function addCountryToCatalog() {
    const files = await readdir(CATALOG_DIR);

    for (const file of files) {
        if (extname(file) !== '.json') {
            continue;
        }

        const brand = file.replace('.json', '').toLowerCase();

        const country = BRANDS_COUNTRY[brand];

        if (!country) {
            console.warn(`Country not found for: ${file}`);
            continue;
        }

        const filePath = join(CATALOG_DIR, file);

        const content = await readFile(filePath, 'utf-8');
        const products = JSON.parse(content);

        const updatedProducts = products.map((product: any) => ({
            ...product,
            country,
        }));

        await writeFile(
            filePath,
            JSON.stringify(updatedProducts, null, 2),
            'utf-8',
        );

        console.log(`${file}: ${products.length} products → ${country}`);
    }
}

addCountryToCatalog();