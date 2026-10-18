import { REQUEST_STATUSES, type RequestStatus } from "@/lib/admin";

export function StatusBadge({ status }: { status: RequestStatus }) {
  const item = REQUEST_STATUSES.find((s) => s.value === status);
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${item?.tone ?? ""}`}
    >
      {item?.label ?? status}
    </span>
  );
}
