import { Order } from "./Order";

export interface User{
    id:number;
    mail:string;
    name:string;
    phonenumber:number;
    admin:boolean;
    isDisabled:boolean;
    userOrders:Order[];

   

}

