"use client";

import { PageTitle } from "@/components/dashboard/widgets";
import { TableWrap, td, th } from "@/components/admin/ui";
import { useDemo } from "@/lib/demo-store";
import { buyers, formatINR } from "@/lib/mock/data";

export default function AdminBuyersPage() {
  const { requirements, orders } = useDemo();
  const rows = buyers.map((b) => {
    const bOrders = orders.filter((o) => o.buyerId === b.id);
    return {
      ...b,
      reqs: requirements.filter((r) => r.buyerId === b.id).length,
      orders: bOrders.length,
      value: bOrders.reduce((s, o) => s + o.amount, 0),
    };
  });
  const countries = new Set(buyers.map((b) => b.country)).size;

  return (
    <>
      <PageTitle title="Buyers" subtitle={`${buyers.length} qualified buyers across ${countries} countries`} />

      <div className="hidden md:block">
        <TableWrap>
          <thead>
            <tr>
              <th className={th}>Company</th>
              <th className={th}>Country</th>
              <th className={th}>Type</th>
              <th className={th}>Contact</th>
              <th className={`${th} text-right`}>Requirements</th>
              <th className={`${th} text-right`}>Orders</th>
              <th className={`${th} text-right`}>Order value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id}>
                <td className={`${td} font-bold`}>{b.company}</td>
                <td className={`${td} whitespace-nowrap`}>
                  <span className="mr-1.5 text-lg" aria-hidden>
                    {b.flag}
                  </span>
                  {b.country}
                </td>
                <td className={td}>{b.type}</td>
                <td className={td}>
                  {b.contactName}
                  <p className="text-xs text-muted">{b.email}</p>
                </td>
                <td className={`${td} text-right`}>{b.reqs}</td>
                <td className={`${td} text-right`}>{b.orders}</td>
                <td className={`${td} text-right font-bold`}>{formatINR(b.value)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((b) => (
          <li key={b.id} className="flex items-start gap-3 rounded-xl border border-cream-2 bg-white p-4">
            <span className="text-3xl leading-none" aria-hidden>
              {b.flag}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">{b.company}</p>
              <p className="text-xs text-muted">
                {b.type} · {b.country}
              </p>
              <p className="truncate text-xs text-muted">
                {b.contactName} · {b.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink">
                <span>
                  <b>{b.reqs}</b> requirements
                </span>
                <span>
                  <b>{b.orders}</b> orders
                </span>
                <span className="font-bold">{formatINR(b.value)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
