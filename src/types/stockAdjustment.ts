import type { User } from './user';

export type AdjustmentType = 'damaged' | 'lost' | 'expired' | 'correction' | string;

export interface StockAdjustmentItemSummary {
  id: number;
  quantity_in: number;
  quantity_remaining: number;
  purchase_price: string;
  expired_at?: string;
  created_at: string;
  updated_at: string;
  product_summary: {
    id: number;
    name: string;
    image?: string;
  };
}

export interface StockAdjustment {
  id: number;
  stock_supply_item_id: number;
  user_id: number;
  quantity: number;
  type: AdjustmentType;
  reason?: string;
  created_at: string;
  updated_at: string;
  stock_supply_item?: StockAdjustmentItemSummary;
  user?: User;
}

export interface StockAdjustmentQuery {
  search?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
  size?: number;
  page?: number;
}

export interface CreateStockAdjustmentRequest {
  stock_supply_item_id: number;
  quantity: number;
  type: AdjustmentType;
  reason?: string;
}
