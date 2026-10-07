import {
    access,
    mkdir,
    readFile,
    writeFile,
} from 'node:fs/promises';
import { join } from 'node:path';

import { BRANDS_CODES } from '../app/search/brands.constants';
import { Result } from './catalog-importer.model';

const API_URL = 'https://api.rivegauche.ru';

const CATALOG_DIR = join(
    process.cwd(),
    'catalog',
);

const IMAGES_DIR = join(
    process.cwd(),
    'public',
    'catalog-images',
);

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

async function downloadImage(
    imageUrl: string,
    brandName: string,
    productCode: string,
): Promise<string> {
    const brandFolder = brandName.toLowerCase();

    const brandDir = join(
        IMAGES_DIR,
        brandFolder,
    );

    await mkdir(brandDir, {
        recursive: true,
    });

    const originalExtension =
        imageUrl.split('.').pop()?.split('?')[0];

    const extension =
        originalExtension === 'png' ||
            originalExtension === 'webp'
            ? originalExtension
            : 'jpg';

    const fileName = `${productCode}.${extension}`;

    const filePath = join(
        brandDir,
        fileName,
    );

    const localUrl =
        `/catalog-images/${brandFolder}/${fileName}`;

    // Если картинка уже есть локально,
    // вообще не обращаемся к Rive Gauche.
    try {
        await access(filePath);

        return localUrl;
    } catch {
        // Файла нет — скачиваем.
    }

    const url = `${API_URL}${imageUrl}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Image error ${response.status}: ${url}`,
        );
    }

    const buffer = Buffer.from(
        await response.arrayBuffer(),
    );

    await writeFile(
        filePath,
        buffer,
    );

    console.log(
        `  Image: ${brandFolder}/${fileName}`,
    );

    return localUrl;
}

async function loadExistingCatalog(
    brandName: string,
): Promise<Result[]> {
    const filePath = join(
        CATALOG_DIR,
        `${brandName}.json`,
    );

    try {
        const file = await readFile(
            filePath,
            'utf-8',
        );

        const products = JSON.parse(file);

        return Array.isArray(products)
            ? products
            : [];
    } catch {
        return [];
    }
}

async function toResult(
    result: any,
    brandName: string,
    oldProduct?: Result,
): Promise<Result> {
    let imageUrl = '';

    try {
        imageUrl = await downloadImage(
            result.listingImage.url,
            brandName,
            result.code,
        );
    } catch (error) {
        console.error(
            `  Failed to download image for ${result.code}`,
            error,
        );

        // Если новая картинка не скачалась,
        // используем старую локальную, если она есть.
        imageUrl =
            oldProduct?.listingImage.url ??
            result.listingImage.url;
    }

    return {
        brand: {
            code: result.brand.code,
            name: result.brand.name,
        },
        code: result.code,
        listingImage: {
            url: imageUrl,
        },
        name: result.name,
        price: {
            formattedValue: result.price.formattedValue,
            value: result.price.value,
        },

        // Сохраняем наши локальные данные.
        ...(oldProduct?.popular !== undefined
            ? { popular: oldProduct.popular }
            : {}),

        ...(oldProduct?.country !== undefined
            ? { country: oldProduct.country }
            : {}),

        ...(oldProduct?.purpose !== undefined
            ? { purpose: oldProduct.purpose }
            : {}),
    };
}

async function getBrandProducts(
    brandCode: number,
    brandName: string,
    oldProducts: Result[],
): Promise<Result[]> {
    const oldProductsByCode = new Map(
        oldProducts.map(product => [
            product.code,
            product,
        ]),
    );

    const firstPage = await getBrandPage(
        brandCode,
        0,
    );

    const products: Result[] = [];

    for (const result of firstPage.results) {
        products.push(
            await toResult(
                result,
                brandName,
                oldProductsByCode.get(result.code),
            ),
        );
    }

    for (
        let page = 1;
        page < firstPage.pagination.totalPages;
        page++
    ) {
        const data = await getBrandPage(
            brandCode,
            page,
        );

        for (const result of data.results) {
            products.push(
                await toResult(
                    result,
                    brandName,
                    oldProductsByCode.get(result.code),
                ),
            );
        }
    }

    return products;
}

async function main() {
    await mkdir(
        CATALOG_DIR,
        { recursive: true },
    );

    await mkdir(
        IMAGES_DIR,
        { recursive: true },
    );

    for (
        const [brandName, brandCode]
        of Object.entries(BRANDS_CODES)
    ) {
        console.log(
            `\n${brandName}: loading products...`,
        );

        try {
            // Загружаем существующий каталог ДО его перезаписи.
            const oldProducts =
                await loadExistingCatalog(
                    brandName,
                );

            const products =
                await getBrandProducts(
                    brandCode,
                    brandName,
                    oldProducts,
                );

            const filePath = join(
                CATALOG_DIR,
                `${brandName}.json`,
            );

            await writeFile(
                filePath,
                JSON.stringify(
                    products,
                    null,
                    2,
                ),
                'utf-8',
            );

            console.log(
                `${brandName}: ${products.length} products`,
            );
        } catch (error) {
            console.error(
                `${brandName}: failed`,
                error,
            );
        }
    }
}

main();

export { };