import { Result } from "./catalog-importer.model";


const BRANDS_CODES: Record<string, number> = {
    darphin: 267,
};

const API_URL = 'https://api.rivegauche.ru';

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

async function main() {

    const data = await getBrandPage(267, 0);

    const result = data.results[0];

    const product: Result = {
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

    const products: Result[] = data.results.map((result: Result) => ({
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
    }));

    console.log(products);
}

main();

export { };