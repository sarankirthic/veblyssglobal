"use client";

import { useState } from "react";
import { useActivityLog, useFunnel, useGeo, useProductPerformance, useTraffic } from "@/lib/admin/queries/metrics";
import { RoleGate } from "@/components/admin/RoleGate";
import { StatTile } from "@/components/admin/dashboard/StatTile";
import { TrafficChart } from "@/components/admin/dashboard/TrafficChart";
import { HorizontalBarList } from "@/components/admin/dashboard/HorizontalBarList";
import { Table, Thead, Th, Tr, Td } from "@/components/admin/ui/Table";
import { EmptyState } from "@/components/admin/ui/EmptyState";

const RANGES = [7, 30, 90];

export default function DashboardPage() {
  const [days, setDays] = useState(30);
  const { data: traffic, isLoading: trafficLoading } = useTraffic(days);
  const { data: funnel, isLoading: funnelLoading } = useFunnel(days);
  const { data: products, isLoading: productsLoading } = useProductPerformance(days);
  const { data: geo, isLoading: geoLoading } = useGeo(days);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl">Dashboard</h1>
        <div className="flex gap-1 border border-adm-hairline bg-white p-1">
          {RANGES.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs ${days === d ? "bg-adm-navy text-white" : "text-adm-muted"}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {funnelLoading || !funnel ? (
        <p className="text-sm text-adm-muted">Loading…</p>
      ) : (
        <div className="mb-6 grid grid-cols-3 gap-4">
          <StatTile label="Pageviews" value={funnel.pageviews} hint={`Last ${days} days`} />
          <StatTile label="Product Views" value={funnel.productViews} hint={`Last ${days} days`} />
          <StatTile label="Enquiries" value={funnel.enquiries} hint={`Last ${days} days`} />
        </div>
      )}

      <div className="mb-6 border border-adm-hairline bg-white p-6">
        <h3 className="mb-4 text-lg">Traffic</h3>
        {trafficLoading || !traffic ? (
          <p className="text-sm text-adm-muted">Loading…</p>
        ) : (
          <TrafficChart series={traffic.series} />
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div className="border border-adm-hairline bg-white p-6">
          <h3 className="mb-4 text-lg">Top Products</h3>
          {productsLoading || !products ? (
            <p className="text-sm text-adm-muted">Loading…</p>
          ) : (
            <HorizontalBarList
              rows={products.top.map((p) => ({ label: p.path, value: p.views }))}
            />
          )}
        </div>
        <div className="border border-adm-hairline bg-white p-6">
          <h3 className="mb-4 text-lg">Geography</h3>
          {geoLoading || !geo ? (
            <p className="text-sm text-adm-muted">Loading…</p>
          ) : (
            <HorizontalBarList
              rows={geo.breakdown.map((g) => ({ label: g.country, value: g.count }))}
            />
          )}
        </div>
      </div>

      <RoleGate allow={["admin"]}>
        <ActivityLogPanel />
      </RoleGate>
    </div>
  );
}

function ActivityLogPanel() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivityLog(page);

  return (
    <div className="border border-adm-hairline bg-white p-6">
      <h3 className="mb-4 text-lg">Activity Log</h3>
      {isLoading || !data ? (
        <p className="text-sm text-adm-muted">Loading…</p>
      ) : data.data.length === 0 ? (
        <EmptyState title="No activity yet" />
      ) : (
        <>
          <Table>
            <Thead>
              <tr>
                <Th>Action</Th>
                <Th>Entity</Th>
                <Th>User</Th>
                <Th>When</Th>
              </tr>
            </Thead>
            <tbody>
              {data.data.map((a) => (
                <Tr key={a.id}>
                  <Td className="font-mono text-xs">{a.action}</Td>
                  <Td>{a.entity}</Td>
                  <Td className="font-mono text-xs text-adm-muted">{a.userId ?? "—"}</Td>
                  <Td className="font-mono text-xs text-adm-muted">
                    {new Date(a.createdAt).toLocaleString()}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="font-mono text-xs text-adm-muted hover:text-adm-navy disabled:opacity-30"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={data.data.length < 20}
              className="font-mono text-xs text-adm-muted hover:text-adm-navy disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
