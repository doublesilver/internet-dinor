"use client";

import type { CarrierPriceData } from "@/components/sections/price-calculator/priceData";

export interface CalculatorSelection {
  internetIndex: number;
  tvIndex: number;
  mobileIndex: number;
}

interface PriceCalculatorSelectorProps {
  accentColor: string;
  priceData: CarrierPriceData;
  selection: CalculatorSelection;
  onChange: (selection: CalculatorSelection) => void;
}

interface ButtonGroupProps {
  label: string;
  options: string[];
  selectedIndex: number;
  accentColor: string;
  onSelect: (index: number) => void;
}

function ButtonGroup({ label, options, selectedIndex, accentColor, onSelect }: ButtonGroupProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-brand-graphite">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(index)}
              className="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              style={
                isSelected
                  ? { backgroundColor: accentColor, color: "#ffffff", borderWidth: 1, borderColor: accentColor }
                  : { backgroundColor: "#ffffff", color: "#374151", borderWidth: 1, borderColor: "#e5e7eb" }
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PriceCalculatorSelector({
  accentColor,
  priceData,
  selection,
  onChange
}: PriceCalculatorSelectorProps) {
  return (
    <div className="space-y-5">
      <ButtonGroup
        label="인터넷 속도"
        options={priceData.internetOptions.map((o) => o.label)}
        selectedIndex={selection.internetIndex}
        accentColor={accentColor}
        onSelect={(index) => onChange({ ...selection, internetIndex: index })}
      />
      <ButtonGroup
        label="TV 상품"
        options={priceData.tvOptions.map((o) => o.label)}
        selectedIndex={selection.tvIndex}
        accentColor={accentColor}
        onSelect={(index) => onChange({ ...selection, tvIndex: index })}
      />
      <ButtonGroup
        label="휴대폰 결합"
        options={priceData.mobileOptions.map((o) => o.label)}
        selectedIndex={selection.mobileIndex}
        accentColor={accentColor}
        onSelect={(index) => onChange({ ...selection, mobileIndex: index })}
      />
    </div>
  );
}
