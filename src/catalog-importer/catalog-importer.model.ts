export interface Result {
    brand: Brand;
    code: string;
    listingImage: ListingImage;
    name: string;
    price: Price;
}

export interface Brand {
    code: string;
    name: string;
}

export interface ListingImage {
    url: string;
}

export interface Price {
    formattedValue: string;
    value: number;
}