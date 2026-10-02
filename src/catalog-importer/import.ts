import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { BRANDS_CODES } from "../app/search/brands.constants";
import { Result } from "./catalog-importer.model";

const API_URL = 'https://api.rivegauche.ru';
const CATALOG_DIR = join(process.cwd(), 'catalog');

async function getBrandPage(
    brandCode: number,
    currentPage: number,
) {
    const params = new URLSearchParams({
        fields: 'BASIC',
        currentPage: String(currentPage),
        pageSize: '36',
        categoryCode: 'NewNav',
        brandCode: `rg_brand_${brandCode}`,
        rmSessionId: '68862355df126c3f7464b3e8',
        locale: 'ru',
    });

    const response = await fetch(
        `${API_URL}/rg/v1/newRG/products/search?${params}`,
        {
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Accept-Language': 'ru',
            },
        },
    );

    if (!response.ok) {
        throw new Error(
            `Rive Gauche error: ${response.status}`,
        );
    }

    return response.json();
}

function toResult(result: any): Result {
    return {
        brand: {
            code: result.brand.code,
            name: result.brand.name,
        },
        code: result.code,
        listingImage: {
            url: result.listingImage.url,
        },
        name: result.name,
        price: {
            formattedValue: result.price.formattedValue,
            value: result.price.value,
        },
    };
}

async function getBrandProducts(brandCode: number): Promise<Result[]> {
    const firstPage = await getBrandPage(brandCode, 0);

    const products: Result[] = firstPage.results.map(toResult);

    for (
        let page = 1;
        page < firstPage.pagination.totalPages;
        page++
    ) {
        const data = await getBrandPage(brandCode, page);

        products.push(...data.results.map(toResult));
    }

    return products;
}

async function main() {
    await mkdir(CATALOG_DIR, { recursive: true });

    for (const [brandName, brandCode] of Object.entries(BRANDS_CODES)) {
        const products = await getBrandProducts(brandCode);

        const filePath = join(
            CATALOG_DIR,
            `${brandName}.json`,
        );

        await writeFile(
            filePath,
            JSON.stringify(products, null, 2),
            'utf-8',
        );

        console.log(
            `${brandName}: ${products.length} products`,
        );
    }
}

main();

export { };