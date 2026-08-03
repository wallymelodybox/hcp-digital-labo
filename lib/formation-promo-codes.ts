export type PromoDiscountType = "fixed" | "percent";

export type FormationPromoCode = {
  id: string;
  code: string;
  discountType: PromoDiscountType;
  discountValue: number;
  formuleId?: string;
  maxUses?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
};

export const defaultFormationPromoCodes: FormationPromoCode[] = [];

export function computeDiscountedPrice(price: number, promo: FormationPromoCode) {
  const discount = promo.discountType === "percent" ? Math.round((price * promo.discountValue) / 100) : promo.discountValue;
  return Math.max(price - discount, 0);
}
