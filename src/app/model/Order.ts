import { Discounts } from "./Discounts";
import { Document } from "./Document";
import { _User } from "./User";

export interface Order{
    id:number;
    pickupDate:Date;
    orderDate:Date;
    user: _User;
    payed:boolean;
    pickedUp:boolean;
    finalPrice:number;
    ready:boolean;

    discounts?:Array<Discounts>;
    documents?:Array<Document>;
}
