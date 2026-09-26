export interface RGCatalogResponse {
    results: Result[];
}

export interface Result {
    addedToCart: boolean;
    addedToWishlist: boolean;
    basePrice: BasePrice;
    brand: Brand;
    canAddToCart: boolean;
    code: string;
    firstVariant: string;
    foreign: boolean;
    hasVariantType: boolean;
    inStockVariantCodes: number[];
    listingImage: ListingImage;
    listingImagesCount: number;
    name: string;
    notifyStockAvailability: boolean;
    price: Price;
    showcases: Showcase[];
    stock: Stock;
    subtitle: string;
    url: string;
    variantAttributeType: string;
    variantOptions: string[];
}

interface BasePrice {
    currencyIso: string;
    formattedValue: string;
    value: number;
}

interface Brand {
    code: string;
    name: string;
}

interface ListingImage {
    code: string;
    format: string;
    height: number;
    mime: string;
    url: string;
    width: number;
}

interface Price {
    currencyIso: string;
    formattedValue: string;
    priceType: string;
    value: number;
}

interface Showcase {
    backgroundColor: string;
    canCopy: boolean;
    code: string;
    discountPercent: number;
    fontColor: string;
    name: string;
}

type Stock = { stockLevelStatus: string };