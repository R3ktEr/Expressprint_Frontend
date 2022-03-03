import { Discounts } from "./Discounts";
import { Document } from "./Document";
import { _User } from "./User";

export interface Order{
    id:number;
    pickUpdate:Date;
    orderDate:Date;
    user: _User;
    isPayed:boolean;
    isPickedUp:boolean;
    finalPrice:number;
    isReady:boolean;

    discounts?:Array<Discounts>;
    documents?:Array<Document>;
}