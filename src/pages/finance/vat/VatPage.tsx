import { useState } from 'react';
import { Percent } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import { vatInvoices, vatPeriod } from '../data';
import { vnd, vndShort } from '../shared';
import type { VatInvoice } from '../types';
import '../finance.css';

type Filter = 'all' | 'Đầu ra' | 'Đầu vào' | 'issue';

const statusTone: Record<VatInvoice['status'], Tone> = {
  'Đã cấp mã': 'green',
  'Hợp lệ': 'green',
  'Chờ cấp mã': 'amber',
  'Sai thông tin': 'red',
};

const vatOf = (i: VatInvoice) => Math.round((i.net * i.rate) / 100);

export default function VatPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const issues = vatInvoices.filter((i) => i.status === 'Sai thông tin' || i.status === 'Chờ cấp mã');
  const rows = vatInvoices.filter((i) => (filter === 'all' ? true : filter === 'issue' ? issues.includes(i) : i.direction === filter));
  const payable = vatPeriod.output - vatPeriod.input;

  return (
    <>
      <PageHeader
        icon={<Percent size={18} />}
        section="Tài chính"
        title="Thuế VAT"
        description={`Hóa đơn đầu ra, đầu vào và số thuế GTGT phải nộp kỳ ${vatPeriod.name}. Hóa đơn điện tử đồng bộ với cơ quan thuế để cấp mã.`}
        actions={<button className="btn">Xuất bảng kê</button>}
      />
      <StatGrid
        items={[
          { label: 'VAT đầu ra', value: vndShort(vatPeriod.output), note: 'Cước quốc tế 0%, nội địa và kho 8%', module: 'FIN' },
          { label: 'VAT đầu vào được khấu trừ', value: vndShort(vatPeriod.input), note: 'Hóa đơn hợp lệ' },
          { label: 'VAT phải nộp (tạm tính)', value: vndShort(payable), note: `Hạn nộp tờ khai ${vatPeriod.deadline}`, valueTone: 'amber' },
          { label: 'Hóa đơn cần xử lý', value: String(issues.length), note: '1 sai thông tin, 1 chờ cấp mã', valueTone: 'red', noteTone: 'red' },
        ]}
      />
      {issues.some((i) => i.status === 'Sai thông tin') && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="red">Hóa đơn đầu vào HPX/26/1002 của Hải Phòng Logistics Xanh sai mã số thuế người mua, chưa được khấu trừ. Cần yêu cầu nhà cung cấp lập hóa đơn thay thế trước kỳ kê khai.</Alert>
        </div>
      )}
      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tất cả', count: vatInvoices.length },
            { value: 'Đầu ra', label: 'Đầu ra', count: vatInvoices.filter((i) => i.direction === 'Đầu ra').length },
            { value: 'Đầu vào', label: 'Đầu vào', count: vatInvoices.filter((i) => i.direction === 'Đầu vào').length },
            { value: 'issue', label: 'Cần xử lý', count: issues.length },
          ]}
        />
      </div>
      <Card title="Bảng kê hóa đơn" subtitle={vatPeriod.name} bodyClassName="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Số hóa đơn</th><th>Loại</th><th>Đối tác</th><th>Ngày</th><th className="num">Tiền hàng</th><th className="num">Thuế suất</th><th className="num">Tiền thuế</th><th>Tình trạng</th></tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i.number}>
                <td className="mono" style={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>{i.number}</td>
                <td><Badge tone={i.direction === 'Đầu ra' ? 'blue' : 'gray'}>{i.direction}</Badge></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{i.party}</div>
                  {i.note && <div style={{ fontSize: 11.5, color: i.status === 'Sai thông tin' ? 'var(--red)' : 'var(--text-3)' }}>{i.note}</div>}
                </td>
                <td>{i.date}</td>
                <td className="num">{vnd(i.net)}</td>
                <td className="num">{i.rate}%</td>
                <td className="num"><b>{vnd(vatOf(i))}</b></td>
                <td><Badge tone={statusTone[i.status]}>{i.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
