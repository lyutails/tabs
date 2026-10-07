import express from 'express';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Result } from '../scripts/catalog-importer/catalog-importer.model.js';

const app = express();

const CATALOG_DIR = join(
    process.cwd(),
    'catalog',
);

app.get('/', (request, response) => {
    response.send('Hello from Express');
});

app.get('/api/products', async (request, response) => {
    const brand = request.query['brand'];
    const search = request.query['search'];

    if (typeof brand !== 'string') {
        response.status(400).json({
            error: 'Brand is required',
        });

        return;
    }

    const page = Number(request.query['page'] ?? 1);
    const pageSize = Number(request.query['pageSize'] ?? 20);

    if (!Number.isInteger(page) || page < 1) {
        response.status(400).json({
            error: 'Page must be a positive integer',
        });

        return;
    }

    if (!Number.isInteger(pageSize) || pageSize < 1) {
        response.status(400).json({
            error: 'Page size must be a positive integer',
        });

        return;
    }

    const filePath = join(
        CATALOG_DIR,
        `${brand}.json`,
    );

    try {
        const file = await readFile(
            filePath,
            'utf-8',
        );

        const products: Result[] = JSON.parse(file);
        const filteredProducts =
            typeof search === 'string'
                ? products.filter((product) =>
                    product.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
                : products;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        const paginatedProducts = filteredProducts.slice(
            start,
            end,
        );

        response.json(paginatedProducts);
    } catch {
        response.status(404).json({
            error: `Brand "${brand}" not found`,
        });
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});