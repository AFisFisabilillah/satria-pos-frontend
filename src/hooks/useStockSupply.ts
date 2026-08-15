import { useQuery } from '@tanstack/react-query';
import { stockSupplyService } from '../services/stockSupplyService';
import type { StockSupplyQuery } from '../types/stockSupply';

export function useStockSupplies(params?: StockSupplyQuery) {
  return useQuery({
    queryKey: ['stockSupplies', params],
    queryFn: () => stockSupplyService.getAll(params),
  });
}
