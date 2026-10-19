import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { ColumnChart } from '../../../components/charts/ColumnChart';
import { LineChart } from '../../../components/charts/LineChart';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import {
  FILL_LIMIT, fcDays, fcFillActual, fcFillForecast, fcFillWeeks, fcJobsActual, fcJobsForecast, fcJobsHi, fcJobsLo,
  fcMonths, fcRevenueActual, fcRevenueForecast, fcRevenueHi, fcRevenueLo, fcTrucksNeeded, fcWeeks, forecastDrivers,
} from '../data';
import '../reports.css';

/** Đầu kéo nội bộ sẵn sàng mỗi ngày */
const TRUCK_CAPACITY = 12;

/** Ghép chuỗi thực tế + dự báo; điểm cuối thực tế lặp lại để đường dự báo nối liền */
const join = (actual: number[], forecast: number[]) => [...actual, ...forecast];
/** Khoảng tin cậy bắt đầu từ điểm thực tế cuối cùng để vùng tô nối liền với đường */
const bandOf = (actual: number[], lo: number[], hi: number[]) => {
  const pad: null[] = Array(actual.length - 1).fill(null);
  const last = actual[actual.length - 1];
  return { lo: [...pad, last, ...lo], hi: [...pad, last, ...hi] };
};

export default function ForecastPage() {
  const overDays = fcDays.filter((_, i) => fcTrucksNeeded[i] > TRUCK_CAPACITY);
  const extraTrips = fcTrucksNeeded.reduce((s, v) => s + Math.max(0, v - TRUCK_CAPACITY), 0);
  const fillCross = fcFillForecast.findIndex((v) => v > FILL_LIMIT);
  const jobs6w = fcJobsForecast.reduce((s, v) => s + v, 0);
  const jobsPrev6w = fcJobsActual.slice(-6).reduce((s, v) => s + v, 0);

  return (
    <>
      <PageHeader
        icon={<TrendingUp size={18} />}
        section="Báo cáo"
        title="Dự báo"
        description="Dự báo sản lượng job, doanh thu, nhu cầu xe và sức chứa kho từ số liệu lịch sử, mùa vụ và cơ hội đang mở. Cập nhật mỗi sáng thứ Hai."
        actions={<span className="subtle" style={{ fontSize: 12 }}>Sai số trung bình 4 tuần qua: <b>6,8%</b></span>}
      />
      <StatGrid
        items={[
          { label: 'Job mở mới · 6 tuần tới', value: formatNumber(jobs6w), note: `+${formatNumber(((jobs6w - jobsPrev6w) / jobsPrev6w) * 100, 0)}% so với 6 tuần qua`, noteTone: 'green', module: 'FMS' },
          { label: 'Doanh thu dự báo T10', value: `${formatNumber(fcRevenueForecast[0], 1)} tỷ ₫`, note: `Khoảng ${formatNumber(fcRevenueLo[0], 1)} – ${formatNumber(fcRevenueHi[0], 1)} tỷ`, module: 'FIN' },
          { label: 'Ngày thiếu đầu kéo · 7 ngày tới', value: String(overDays.length), note: `Cần thuê ngoài khoảng ${extraTrips} chuyến`, valueTone: 'amber', noteTone: 'amber', module: 'TMS' },
          { label: 'Khu A vượt ngưỡng lấp đầy', value: fillCross >= 0 ? `Tuần ${fcFillWeeks[fcFillActual.length + fillCross].slice(1)}` : 'Không', note: `Ngưỡng ${FILL_LIMIT}%`, valueTone: fillCross >= 0 ? 'red' : undefined, module: 'WMS' },
        ]}
      />

      <div className="report-grid">
        <Card title="Job mở mới theo tuần" subtitle="8 tuần thực tế, 6 tuần dự báo">
          <LineChart
            labels={fcWeeks}
            series={[{ name: 'Job mở mới', values: join(fcJobsActual, fcJobsForecast) }]}
            band={bandOf(fcJobsActual, fcJobsLo, fcJobsHi)}
            forecastFrom={fcJobsActual.length}
            format={(v) => `${formatNumber(v)} job`}
            axisFormat={(v) => formatNumber(v)}
            tipTitle={(i) => `Tuần ${fcWeeks[i].slice(1)}`}
            labelEvery={2}
            ariaLabel="Job mở mới theo tuần, thực tế và dự báo"
          />
        </Card>
        <Card title="Doanh thu theo tháng" subtitle="Tỷ ₫ · T5–T9 thực tế, T10–T12 dự báo cả tháng">
          <LineChart
            labels={fcMonths}
            series={[{ name: 'Doanh thu', values: join(fcRevenueActual, fcRevenueForecast) }]}
            band={bandOf(fcRevenueActual, fcRevenueLo, fcRevenueHi)}
            forecastFrom={fcRevenueActual.length}
            format={(v) => `${formatNumber(v, 1)} tỷ ₫`}
            axisFormat={(v) => formatNumber(v)}
            tipTitle={(i) => `Tháng ${fcMonths[i].slice(1)}`}
            domain={[10, 20]}
            ariaLabel="Doanh thu theo tháng, thực tế và dự báo"
          />
        </Card>
        <Card title="Nhu cầu đầu kéo 7 ngày tới" subtitle={`Đường ngang là ${TRUCK_CAPACITY} đầu kéo nội bộ`} action={<Link to="/dieu-phoi-xe" className="link-small">Mở điều phối xe</Link>}>
          <ColumnChart
            labels={fcDays.map((d) => d.split(' ')[1])}
            series={[{ name: 'Đầu kéo cần', values: fcTrucksNeeded }]}
            format={(v) => `${v} xe${v > TRUCK_CAPACITY ? ` · thiếu ${v - TRUCK_CAPACITY}` : ''}`}
            axisFormat={(v) => String(v)}
            tipTitle={(i) => fcDays[i]}
            target={{ value: TRUCK_CAPACITY, label: `Xe nội bộ: ${TRUCK_CAPACITY}` }}
            ariaLabel="Số đầu kéo cần theo ngày"
          />
          <div className="muted" style={{ fontSize: 12, marginTop: 8, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            Vượt công suất: {overDays.map((d) => <Badge key={d} tone="amber">{d}</Badge>)}
          </div>
        </Card>
        <Card title="Lấp đầy Khu A · kho Tân Uyên" subtitle={`% vị trí kệ đã dùng · ngưỡng ${FILL_LIMIT}%`} action={<Link to="/so-do-kho" className="link-small">Xem sơ đồ kho</Link>}>
          <LineChart
            labels={fcFillWeeks}
            series={[{ name: 'Lấp đầy Khu A', values: join(fcFillActual, fcFillForecast) }]}
            forecastFrom={fcFillActual.length}
            format={(v) => `${v}%`}
            axisFormat={(v) => `${v}%`}
            tipTitle={(i) => `Tuần ${fcFillWeeks[i].slice(1)}`}
            domain={[30, 100]}
            target={{ value: FILL_LIMIT, label: `Ngưỡng ${FILL_LIMIT}%` }}
            ariaLabel="Tỷ lệ lấp đầy Khu A theo tuần, thực tế và dự báo"
          />
        </Card>
      </div>

      <div className="report-grid">
        <Card title="Yếu tố đưa vào mô hình">
          {forecastDrivers.map((d) => (
            <div key={d.label} className="driver">
              <Badge tone={d.tone}>{d.tone === 'gray' ? 'Giảm' : 'Tăng'}</Badge>
              <div>
                <div style={{ fontWeight: 600 }}>{d.label}</div>
                <div className="muted" style={{ fontSize: 12 }}>{d.effect}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card title="Gợi ý hành động">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Alert tone="amber">Thứ Năm và thứ Sáu tuần này cần thêm {fcTrucksNeeded[2] - TRUCK_CAPACITY + fcTrucksNeeded[3] - TRUCK_CAPACITY} lượt đầu kéo ngoài xe nội bộ. Nên đặt trước với Vận tải Đông Á trước 17:00 hôm nay.</Alert>
            <Alert tone="red">Khu A dự kiến vượt {FILL_LIMIT}% vào tuần 46 khi hàng Bán lẻ Delta về thêm. Cân nhắc chuyển hàng chậm luân chuyển sang Khu B.</Alert>
            <Alert tone="blue">Sản lượng tăng 12% từ tuần 44: nên giữ chỗ trước với Evergreen và Yang Ming cho tuyến Hải Phòng → Mỹ.</Alert>
          </div>
        </Card>
      </div>
    </>
  );
}
