/**
 * Số liệu tổng hợp của Logi.Data (Data Mart). Chuỗi theo tuần dùng chung nhãn tuần với
 * Trang chủ và báo cáo Vận tải; số theo ngày lấy từ module Kho và Vận tải.
 */

// ---------- Tài chính: 6 tháng, tỷ ₫ (tháng 10 tính đến 19/10) ----------
export const months = ['T5', 'T6', 'T7', 'T8', 'T9', 'T10'];
export const revenueByMonth = [11.8, 12.6, 13.4, 14.1, 15.2, 9.6];
export const costByMonth = [10.62, 11.4, 12.02, 12.66, 13.71, 8.69];

/** Dòng tiền 8 tuần, tỷ ₫ (tuần 42 mới đến thứ Hai) */
export const cashWeeks = ['T35', 'T36', 'T37', 'T38', 'T39', 'T40', 'T41', 'T42'];
export const cashIn = [3.1, 2.8, 3.6, 3.3, 2.9, 3.8, 3.4, 0.6];
export const cashOut = [2.9, 3.0, 3.1, 3.4, 2.7, 3.5, 3.6, 0.4];

/** Doanh thu tháng 9 theo loại hình, tỷ ₫ */
export const revenueByService = [
  { label: 'Sea FCL', value: 6.4 },
  { label: 'Air', value: 3.9 },
  { label: 'Trucking', value: 2.1 },
  { label: 'Sea LCL', value: 1.5 },
  { label: 'Kho', value: 0.9 },
  { label: 'Hải quan', value: 0.4 },
];

// ---------- Kinh doanh ----------
/** Sản lượng TEU xuất nhập theo tháng và mục tiêu */
export const teuByMonth = [412, 438, 451, 476, 502, 318];
export const TEU_TARGET = 500;
export const newCustomersByMonth = [4, 6, 3, 5, 7, 5];

export const topLanes = [
  { label: 'Hải Phòng → Los Angeles', value: 86, sub: 'Evergreen, Yang Ming · 4 khách' },
  { label: 'Cát Lái → Hamburg', value: 64, sub: 'CMA CGM, Hapag · 3 khách' },
  { label: 'Hải Phòng → Busan', value: 52, sub: 'HMM, Sinokor · 5 khách' },
  { label: 'Hải Phòng → Sydney', value: 41, sub: 'CMA CGM · 2 khách' },
  { label: 'Cát Lái → Long Beach', value: 37, sub: 'Yang Ming · 2 khách' },
];

export const lostReasons = [
  { label: 'Giá cao hơn đối thủ', value: 14 },
  { label: 'Không có chỗ đúng lịch tàu', value: 6 },
  { label: 'Phản hồi báo giá chậm', value: 5 },
  { label: 'Khách hoãn đơn hàng', value: 4 },
];

// ---------- Dự báo ----------
/** Job mở mới: 8 tuần thực tế (khớp Trang chủ) + 6 tuần dự báo */
export const fcWeeks = ['T35', 'T36', 'T37', 'T38', 'T39', 'T40', 'T41', 'T42', 'T43', 'T44', 'T45', 'T46', 'T47', 'T48'];
export const fcJobsActual = [95, 103, 98, 110, 106, 119, 116, 128];
export const fcJobsForecast = [131, 136, 142, 149, 153, 158];
export const fcJobsLo = [124, 127, 131, 135, 137, 139];
export const fcJobsHi = [138, 145, 153, 163, 169, 177];

/** Doanh thu tháng, tỷ ₫: T5–T9 thực tế, T10–T12 dự báo cả tháng */
export const fcMonths = ['T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
export const fcRevenueActual = [11.8, 12.6, 13.4, 14.1, 15.2];
export const fcRevenueForecast = [15.9, 17.1, 18.4];
export const fcRevenueLo = [15.3, 16.0, 16.8];
export const fcRevenueHi = [16.5, 18.2, 20.0];

/** Nhu cầu đầu kéo 7 ngày tới so với số xe nội bộ */
export const fcDays = ['T3 20/10', 'T4 21/10', 'T5 22/10', 'T6 23/10', 'T7 24/10', 'CN 25/10', 'T2 26/10'];
export const fcTrucksNeeded = [13, 11, 15, 17, 12, 4, 12];

/** Lấp đầy Khu A (hàng khô, Bán lẻ Delta) theo tuần, %; tuần 42 khớp sơ đồ kho */
export const fcFillActual = [41, 44, 46, 48, 50, 53];
export const fcFillForecast = [61, 70, 79, 87];
export const fcFillWeeks = ['T37', 'T38', 'T39', 'T40', 'T41', 'T42', 'T43', 'T44', 'T45', 'T46'];
export const FILL_LIMIT = 85;

export const forecastDrivers = [
  { label: 'Mùa cao điểm cuối năm', effect: '+12% job xuất đi Mỹ, EU từ tuần 44', tone: 'amber' as const },
  { label: 'RFQ đang thương lượng', effect: '186.400 USD pipeline, 32% tỷ lệ chốt', tone: 'blue' as const },
  { label: 'Hợp đồng kho Bán lẻ Delta', effect: 'Thêm 2 container nhập mỗi tuần từ T43', tone: 'blue' as const },
  { label: 'Tết Dương lịch', effect: 'Sản lượng giảm 8–10% tuần cuối tháng 12', tone: 'gray' as const },
];
