export type ProductType={
    product_reference:string,
    product_photo:string,
    product_category:string,
    product_name:string,
    product_description:string,
    product_price:number,
    business_name:string,
    business_location:string,
    business_phone_number:number,
    business_till_number:number,
    business_paybill:number,
    business_paybill_account_number:number,
    business_location_photo:string,
    business_location_lat_long:string,
    sellerAvatar:string | null,
}

export type tagType={
    label:string,
    href:string,
    className?:string,
    variant:any,
    icon?:any
}

export type Location = {
    degreesLatitude: number;
    degreesLongitude: number;
    name: string;
    address: string;
}