"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useContactSubmissions } from "@/lib/admin/queries/contact";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { Table, Thead, Th, Tr, Td } from "@/components/admin/ui/Table";

export default function ContactPage() {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data, isLoading } = useContactSubmissions(page);

  if (isLoading || !data) return <p className="text-sm text-adm-muted">Loading…</p>;

  const { data: submissions, meta } = data;
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.perPage));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[28px] tracking-tight">Enquiries</h1>
        <span className="font-mono text-xs text-adm-muted">{meta.total} total</span>
      </div>

      {submissions.length === 0 ? (
        <EmptyState title="No enquiries yet" description="Submissions from the public contact form show up here." />
      ) : (
        <>
          <Table>
            <Thead>
              <tr>
                <Th />
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Interest</Th>
                <Th>Source</Th>
                <Th>Received</Th>
              </tr>
            </Thead>
            <tbody>
              {submissions.map((s) => (
                <Fragment key={s.id}>
                  <Tr>
                    <Td>
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                        className="text-adm-muted hover:text-adm-primary"
                      >
                        {expanded === s.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </Td>
                    <Td className="font-medium">{s.name}</Td>
                    <Td>{s.email}</Td>
                    <Td>{s.interest ?? "—"}</Td>
                    <Td>
                      <Badge>{s.source}</Badge>
                    </Td>
                    <Td className="font-mono text-xs text-adm-muted">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </Td>
                  </Tr>
                  {expanded === s.id ? (
                    <tr className="border-b border-adm-hairline bg-adm-neutral-light/60">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-adm-muted">
                          Message
                        </div>
                        <p className="whitespace-pre-wrap text-sm">{s.message}</p>
                        {s.country ? (
                          <p className="mt-2 text-xs text-adm-muted">Country: {s.country}</p>
                        ) : null}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </Table>

          <div className="mt-4 flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="font-mono text-xs text-adm-muted">
              Page {meta.page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
