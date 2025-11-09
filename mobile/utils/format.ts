export const formatVND = (value: number | string | undefined | null) => {
  const n = Number(value ?? 0) || 0;
  // Insert dot as thousand separator, no decimals
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
};

export default formatVND;
