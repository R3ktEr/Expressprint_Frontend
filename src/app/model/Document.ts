import {Order} from './Order';
import {Color, Copy, Ended, ImpressionPerSide, Size, Thickness} from './Products';

export interface Document {
  id?: number;
  copyPrice: Copy;
  nCopies: number;
  isColor: Color;
  size: Size;
  thickness: Thickness;
  isTwoSides: boolean;
  finishType: Ended;
  impressionPerSide: ImpressionPerSide;
  isVertical: boolean;
  ringedPosition: boolean;
  price?: number;
  order?: Order;
  comment?: string;
  url?: string;
}
