import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CATALOG_DIR = join(process.cwd(), 'catalog');

const PURPOSE_RULES: Array<[string[], string]> = [
    [['moist'], 'moisture'],
    [['nourish'], 'nourish'],
    [['clean'], 'cleanse'],
    [['repair'], 'repair'],
    [['aha', 'bha', 'pha', 'peel', 'peeling', 'exfol'], 'exfoliate'],
    [['pdrn'], 'pdrn'],
    [['bakuchiol'], 'bakuchiol'],
    [['retinol'], 'retinol'],
    [['peptide'], 'peptides'],
    [['candle'], 'aromatherapy'],
];

function getPurpose(name: string): string | null {
    const normalizedName = name.toLowerCase();

    for (const [keywords, purpose] of PURPOSE_RULES) {
        if (keywords.some(keyword => normalizedName.includes(keyword))) {
            return purpose;
        }
    }

    return null;
}

async function addPurposeToCatalog() {
    const files = await readdir(CATALOG_DIR);

    for (const file of files) {
        if (!file.endsWith('.json')) {
            continue;
        }

        const filePath = join(CATALOG_DIR, file);

        const content = await readFile(filePath, 'utf-8');
        const products = JSON.parse(content);

        let matched = 0;

        const updatedProducts = products.map((product: any) => {
            const purpose = getPurpose(product.name);

            if (purpose) {
                matched++;
            }

            if (purpose) {
                return {
                    ...product,
                    purpose,
                };
            }

            return product;
        });

        await writeFile(
            filePath,
            JSON.stringify(updatedProducts, null, 2),
            'utf-8',
        );

        console.log(
            `✓ ${file} → ${matched}/${products.length} products matched`,
        );
    }
}

addPurposeToCatalog();