import {EndedType, SheetSize, ThicknessType} from 'src/app/model/Enums';

export interface Color {
  id: number;
  price: number;
  date: Date;
  isValid: boolean;
  isColor: boolean;
}

export interface Copy {
  id: number;
  price: number;
  date: Date;
  isValid: boolean;
}

export interface Ended {
  id: number;
  price: number;
  date: Date;
  isValid: boolean;
  endedType: EndedType;
}

export interface ImpressionPerSide {
  id: number;
  price: number;
  date: Date;
  isValid: boolean;
  impressionsTypes: ImpressionPerSide;
}

export interface Size {
  id: number;
  price: number;
  date: Date;
  isValid: boolean;
  sizeSheet: SheetSize;
  sheetSize: string;
}

export interface Thickness {
  id: number;
  price: number;
  date: Date;
  isValid: boolean;
  thicknessType: ThicknessType;
  description: string;
}
