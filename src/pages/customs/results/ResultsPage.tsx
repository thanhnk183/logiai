import { ShieldCheck } from 'lucide-react';
import { HBars } from '../../../components/charts/HBars';
import { Alert } from '../../../components/ui/Alert';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { channelStats, clearHoursByChannel, declarations } from '../data';
import { ChannelBadge, channelTone } from '../shared';
import type { Channel } from '../types';
import '../customs.css';

const channels: Channel[] = ['Xanh', 'Vàng', 'Đỏ'];
const toneVar = { green: 'var(--green)', amber: '#c27c0e', red: 'var(--red)', blue: 'var(--brand)', gray: 'var(--text-3)' } as const;

/** Thanh tỉ lệ một hàng: tổng 100%, mỗi đoạn có nhãn chữ (không chỉ dựa vào màu) */
function ChannelShare() {
  return (
    <Card title="Phân luồng · 30 ngày" subtitle={`${channelStats.total} tờ khai đã phân luồng`}>
      <div className="share-bar" role="img" aria-label={channels.map((c) => `Luồng ${c.toLowerCase()} ${channelStats[c]}`).join(', ')}>
        {channels.map((c) => (
          <div
            key={c}
            className="share-bar__seg"
            style={{ flex: channelStats[c], background: toneVar[channelTone[c]] }}
            title={`Luồng ${c.toLowerCase()}: ${channelStats[c]} tờ khai`}
          />
        ))}
      </div>
      <div className="share-legend">
        {channels.map((c) => (
          <div key={c}>
            <span><i style={{ background: toneVar[channelTone[c]] }} /> Luồng {c.toLowerCase()}</span>
            <b>{formatNumber((channelStats[c] / channelStats.total) * 100, 0)}%</b>
            <span className="subtle">{channelStats[c]} tờ khai</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function ResultsPage() {
  const inspections = declarations.filter((d) => d.status === 'Chờ kiểm hóa');
  const recent = declarations.filter((d) => d.channel);

  return (
    <>
      <PageHeader
        icon={<ShieldCheck size={18} />}
        section="Hải quan"
        title="Kết quả thông quan"
        description="Kết quả phân luồng, lịch kiểm hóa và thời gian thông quan. Tờ khai đã thông quan tự cập nhật mốc Hải quan của job."
      />
      <StatGrid
        items={[
          { label: 'Tỷ lệ luồng xanh · 30 ngày', value: `${formatNumber((channelStats['Xanh'] / channelStats.total) * 100, 0)}%`, note: '+4 điểm so với tháng 9', noteTone: 'green', module: 'CUS' },
          { label: 'Kiểm hóa hôm nay', value: String(inspections.length), note: inspections[0] ? `${inspections[0].customer} · ${inspections[0].inspection?.time}` : 'Không có', valueTone: 'red', noteTone: 'red' },
          { label: 'Thông quan trung bình', value: '7,9 giờ', note: 'Từ lúc truyền đến khi thông quan' },
          { label: 'Tờ khai phải khai bổ sung', value: '3', note: '30 ngày gần nhất', noteTone: 'amber' },
        ]}
      />

      {inspections.map((d) => (
        <div key={d.job} style={{ marginBottom: 16 }}>
          <Alert tone="red">
            <b>Kiểm hóa {d.inspection?.time}</b> · tờ khai {d.number} · {d.customer} (<JobLink code={d.job} />) · {d.inspection?.place}.
            {' '}Container chưa được kéo về kho cho đến khi thông quan.
          </Alert>
        </div>
      ))}

      <div className="report-grid">
        <ChannelShare />
        <Card title="Thời gian thông quan theo luồng" subtitle="Trung bình 30 ngày, tính bằng giờ">
          <HBars rows={clearHoursByChannel} unit=" giờ" />
        </Card>
      </div>

      <Card title="Kết quả gần đây" bodyClassName="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Tờ khai</th><th>Khách hàng</th><th>Loại hình</th><th>Phân luồng</th><th>Đăng ký</th><th>Thông quan</th><th className="num">Thời gian</th></tr>
          </thead>
          <tbody>
            {recent.map((d) => (
              <tr key={d.job}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{d.number}</div>
                  <JobLink code={d.job} style={{ fontSize: 11 }} />
                </td>
                <td style={{ fontWeight: 600 }}>{d.customer}</td>
                <td className="muted">{d.typeCode} · {d.direction}</td>
                <td><ChannelBadge channel={d.channel} /></td>
                <td style={{ whiteSpace: 'nowrap' }}>{d.registeredAt}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{d.clearedAt ?? <span className="text-red">Chờ kiểm hóa</span>}</td>
                <td className="num">{d.clearHours ? `${formatNumber(d.clearHours, 1)} giờ` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
