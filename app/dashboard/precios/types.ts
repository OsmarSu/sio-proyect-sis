// app/dashboard/precios/types.ts
import { Product } from "../productos/types";

export interface PricedProduct extends Product {
  code: string;
  floorPrice: number; // Precio mínimo en Bs.
  lastUpdate: string;
}

export type PriceField = 'minorPrice' | 'majorPrice' | 'floorPrice';

export interface MassUpdateConfig {
  category: string;
  field: PriceField;
  type: 'percentage' | 'fixed';
  value: number; // Puede ser negativo para descuentos
}