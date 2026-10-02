import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const path = req.query['path'];

    const pathString = Array.isArray(path)
        ? path.join('/')
        : path;

    const query = new URLSearchParams();

    Object.entries(req.query).forEach(([key, value]) => {
        if (key === 'path') {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(item => query.append(key, item));
        } else if (value !== undefined) {
            query.append(key, value);
        }
    });

    const url =
        `https://api.rivegauche.ru/${pathString}?${query.toString()}`;

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0',
        },
    });

    const body = await response.text();

    res.status(response.status);
    res.setHeader(
        'Content-Type',
        response.headers.get('content-type') ?? 'application/json'
    );

    return res.send(body);
}