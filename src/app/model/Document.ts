import { Order } from "./Order";
import { Color, Copy, Ended, ImpressionPerSide, Size, Thickness } from "./Products";

export interface Document{
    id?:number;
    copyPrice:Copy;
    nCopies:number;
    isColor:Color;
    sizes:Size;
    thickness:Thickness;
    isTwoSides:boolean;
    finishType:Ended;
    impressionPerSide:ImpressionPerSide;
    isVertical:boolean;
    ringedPosition:boolean;

    order?:Order;
    comment?:string;
    url?:string;
}