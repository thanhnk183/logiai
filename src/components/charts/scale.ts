import type { MouseEvent } from 'react';

/** Thang trục Y "tròn số": trả về min, max và các vạch chia */
export function niceScale(min: number, max: number, count = 4) {
  const span = max - min || Math.abs(max) || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return { min: lo, max: hi, ticks };
}

/** Vị trí chuột trong `.chart-wrap` (px) và toạ độ x trong hệ viewBox của SVG */
export function pointerIn(e: MouseEvent<SVGSVGElement>, viewWidth: number) {
  const svgBox = e.currentTarget.getBoundingClientRect();
  const wrap = (e.currentTarget.closest('.chart-wrap') as HTMLElement).getBoundingClientRect();
  return {
    xView: ((e.clientX - svgBox.left) / svgBox.width) * viewWidth,
    x: e.clientX - wrap.left,
    y: e.clientY - wrap.top,
  };
}
