import { Document } from "./Document";

export interface Order{
    id:number;
    pickUpdate:Date;
    orderDate:Date;
    //User
    isPayed:boolean;
    isPickedUp:boolean;
    finalPrice:number;
    isReady:boolean;

    //discounts
    documents:Array<Document>;
}