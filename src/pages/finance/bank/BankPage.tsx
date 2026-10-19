import { useState } from 'react';
import { Landmark, Link2, Upload } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { formatNumber } from '../../../utils/format';
import { bankAccounts, bankTxns } from '../data';
import { vnd, vndShort } from '../shared';
import type { BankTxn } from '../types';
import '../finance.css';

type Filter = 'all' | 'unmatched' | 'in' | 'out';

const currencyOf = (account: string) => bankAccounts.find((a) => a.code === account)?.currency ?? 'VND';
const money = (n: number, account: string) => {
  const cur = currencyOf(account);
  const sign = n > 0 ? '+' : '−';
  return cur === 'USD' ? `${sign}${formatNumber(Math.abs(n))} USD` : `${sign}${formatNumber(Math.abs(n))} ₫`;
};

export default function BankPage() {
  const [txns, setTxns] = useState(bankTxns);
  const [filter, setFilter] = useState<Filter>('all');

  const unmatched = txns.filter((t) => !t.matched);
  const rows = txns.filter((t) =>
    filter === 'all' ? true : filter === 'unmatched' ? !t.matched : filter === 'in' ? t.amount > 0 : t.amount < 0,
  );
  const match = (t: BankTxn) => setTxns((l) => l.map((x) => (x.id === t.id ? { ...x, matched: t.suggestion?.ref, suggestion: undefined } : x)));

  return (
    <>
      <PageHeader
        icon={<Landmark size={18} />}
        section="Tài chính"
        title="Thu chi và ngân hàng"
        description="Số dư tài khoản và sao kê nhập tự động từ ngân hàng. Hệ thống gợi ý ghép từng giao dịch với hóa đơn phải thu hoặc khoản phải trả."
        actions={<button className="btn"><Upload size={15} /> Nhập sao kê</button>}
      />

      <div className="stats">
        {bankAccounts.map((a) => (
          <div key={a.code} className="card stat">
            <div className="stat__label"><span>{a.bank} · {a.currency}</span></div>
            <div className="stat__value">{a.currency === 'USD' ? `${formatNumber(a.balance)} USD` : vndShort(a.balance)}</div>
            <div className="stat__note mono">{a.number}</div>
          </div>
        ))}
        <div className="card stat">
          <div className="stat__label"><span>Giao dịch chưa ghép</span></div>
          <div className="stat__value" style={{ color: unmatched.length ? 'var(--amber)' : 'var(--green)' }}>{unmatched.length}</div>
          <div className="stat__note">Ghép để cập nhật công nợ</div>
        </div>
      </div>

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tất cả', count: txns.length },
            { value: 'unmatched', label: 'Chưa ghép', count: unmatched.length },
            { value: 'in', label: 'Tiền vào' },
            { value: 'out', label: 'Tiền ra' },
          ]}
        />
      </div>

      <Card title="Sao kê gần đây" subtitle="Cập nhật lúc 08:10 hôm nay" bodyClassName="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Thời gian</th><th>Tài khoản</th><th>Nội dung</th><th className="num">Số tiền</th><th>Ghép với</th></tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{t.time}</td>
                <td className="mono" style={{ fontSize: 11.5, whiteSpace: 'nowrap' }}>{t.account}</td>
                <td className="mono" style={{ fontSize: 11.5 }}>{t.description}</td>
                <td className="num" style={{ fontWeight: 600, color: t.amount > 0 ? 'var(--green)' : undefined }}>{money(t.amount, t.account)}</td>
                <td style={{ minWidth: 230 }}>
                  {t.matched ? (
                    <span className="matched"><Link2 size={13} /> {t.matched}</span>
                  ) : t.suggestion && t.suggestion.ref !== '—' ? (
                    <div className="suggest">
                      <div>
                        <div>Gợi ý: <b className="mono">{t.suggestion.ref}</b></div>
                        <div className="subtle" style={{ fontSize: 11 }}>{t.suggestion.reason}</div>
                      </div>
                      <button className="btn btn--primary btn--sm" onClick={() => match(t)}>Ghép</button>
                    </div>
                  ) : (
                    <div>
                      <Badge tone="amber">Chưa xác định</Badge>
                      {t.suggestion && <div className="subtle" style={{ fontSize: 11, marginTop: 2 }}>{t.suggestion.reason}</div>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="subtle" style={{ fontSize: 11.5, marginTop: 10 }}>
        Tổng tiền VND trên các tài khoản: {vnd(bankAccounts.filter((a) => a.currency === 'VND').reduce((s, a) => s + a.balance, 0))}.
      </p>
    </>
  );
}
