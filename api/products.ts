import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    const brand = request.query['brand'];
    const search = request.query['search'];

    if (typeof brand !== 'string') {
        return response.status(400).json({
            error: 'Brand is required',
        });
    }

    const page = Number(request.query['page'] ?? 1);
    const pageSize = Number(request.query['pageSize'] ?? 20);

    if (!Number.isInteger(page) || page < 1) {
        return response.status(400).json({
            error: 'Page must be a positive integer',
        });
    }

    if (!Number.isInteger(pageSize) || pageSize < 1) {
        return response.status(400).json({
            error: 'Page size must be a positive integer',
        });
    }

    const filePath = join(
        process.cwd(),
        'catalog',
        `${brand}.json`,
    );

    try {
        const file = await readFile(
            filePath,
            'utf-8',
        );

        const products = JSON.parse(file);

        const filteredProducts =
            typeof search === 'string'
                ? products.filter((product: any) =>
                    product.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
                : products;

        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        const paginatedProducts =
            filteredProducts.slice(start, end);

        return response.json(paginatedProducts);
    } catch {
        return response.status(404).json({
            error: `Brand "${brand}" not found`,
        });
    }
}