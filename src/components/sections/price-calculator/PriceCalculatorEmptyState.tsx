interface PriceCalculatorEmptyStateProps {
  carrierName: string;
}

export function PriceCalculatorEmptyState({ carrierName }: PriceCalculatorEmptyStateProps) {
  return (
    <div className="rounded-[20px] bg-white p-8 text-center text-sm text-brand-slate shadow-lg">
      현재 비교 가능한 {carrierName} 상품이 없습니다.
    </div>
  );
}
