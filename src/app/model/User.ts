import { Order } from "./Order";

export interface _User{
    id?:number;
    googleId:string;
    mail:string;
    name:string;
    phonenumber?:number;
    admin:boolean;
    disabled:boolean;

    userOrders?:Array<Order>;
}

