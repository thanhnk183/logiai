const vn = (n: number, digits = 0) =>
  n.toLocaleString('vi-VN', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** 2840 (triệu) → "2,84 tỷ"; 960 → "960 tr" */
export function formatMillions(m: number): string {
  if (m === 0) return '0';
  if (m >= 1000) return `${vn(m / 1000, 2)} tỷ`;
  return `${vn(m)} tr`;
}

/** 9860 → "9.860 USD" */
export function formatUsd(n: number): string {
  return `${vn(n)} USD`;
}

/** 17000 → "17k", 8300 → "8,3k" */
export function formatK(n: number): string {
  const k = n / 1000;
  return `${vn(k, Number.isInteger(Math.round(k * 10) / 10) ? 0 : 1)}k`;
}

/** 3.65 → "3,65"; 1240 → "1.240" */
export function formatNumber(n: number, maxDigits = 2): string {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: maxDigits });
}
