import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Loader2, Mail, MessageCircle, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  REQUEST_STATUSES,
  formatDate,
  whatsappLink,
  type QuoteRequest,
  type RequestStatus,
} from "@/lib/admin";
import { gbp } from "@/data/packages";
import { site } from "@/data/site";
import { supabase } from "@/lib/supabase";

type Search = { status?: string | undefined; open?: string | undefined };

export const Route = createFileRoute("/admin/requests")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["status"] === "string" ? { status: s["status"] } : {}),
    ...(typeof s["open"] === "string" ? { open: s["open"] } : {}),
  }),
  component: RequestsPage,
});

function RequestsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/requests" });
  const [query, setQuery] = useState("");
  const status = search.status ?? "all";

  const requests = useQuery({
    queryKey: ["admin", "requests"],
    refetchInterval: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase!
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as QuoteRequest[];
    },
  });

  const rows = requests.data ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (!q ||
          [r.name, r.email, r.phone, r.service, r.message].some((v) =>
            v?.toLowerCase().includes(q),
          )),
    );
  }, [rows, status, query]);

  const selected = rows.find((r) => r.id === search.open) ?? null;
  const setStatusFilter = (value: string) =>
    navigate({ search: (prev) => ({ ...prev, status: value === "all" ? undefined : value }) });
  const openRow = (id: string | undefined) =>
    navigate({ search: (prev) => ({ ...prev, open: id }) });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl">Requests</h1>
          <p className="mt-2 text-muted-foreground">
            Everything sent through the website contact form.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => requests.refetch()}
          disabled={requests.isFetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${requests.isFetching ? "animate-spin" : ""}`} />{" "}
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[{ value: "all", label: "All" }, ...REQUEST_STATUSES].map((s) => {
          const count =
            s.value === "all" ? rows.length : rows.filter((r) => r.status === s.value).length;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatusFilter(s.value)}
              className={`rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                status === s.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label} <span className="opacity-70">{count}</span>
            </button>
          );
        })}
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="border border-border bg-card">
        {requests.isError && (
          <p className="p-5 text-sm text-destructive">
            Could not load requests. Check that you are signed in as an admin.
          </p>
        )}
        {requests.isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">
            {rows.length === 0 ? "No requests yet." : "No requests match your filters."}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Received</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Service</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Quote</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} onClick={() => openRow(r.id)} className="cursor-pointer">
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatDate(r.created_at)}
                  </TableCell>
                  <TableCell className={r.status === "new" ? "font-semibold" : ""}>
                    {r.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {r.service ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {r.email}
                    {r.phone && (
                      <>
                        <br />
                        {r.phone}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    {r.quoted_price != null ? gbp(r.quoted_price) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && openRow(undefined)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <RequestDetail
              key={selected.id}
              request={selected}
              onClose={() => openRow(undefined)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function RequestDetail({ request, onClose }: { request: QuoteRequest; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [price, setPrice] = useState(request.quoted_price?.toString() ?? "");
  const [notes, setNotes] = useState(request.admin_notes ?? "");

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "new-count"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const parsed = price.trim() === "" ? null : Number(price);
      if (parsed !== null && (!Number.isFinite(parsed) || parsed < 0))
        throw new Error("Enter a valid price.");
      const { error } = await supabase!
        .from("quote_requests")
        .update({
          status,
          quoted_price: parsed,
          admin_notes: notes.trim() || null,
          handled_at: status === "new" ? null : (request.handled_at ?? new Date().toISOString()),
        })
        .eq("id", request.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase!.from("quote_requests").delete().eq("id", request.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Request deleted");
      refresh();
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const greeting = `Hi ${request.name.split(" ")[0]}, thanks for your enquiry to ${site.name}${request.service ? ` about ${request.service}` : ""}.`;

  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-heading text-2xl">{request.name}</SheetTitle>
        <SheetDescription>Received {formatDate(request.created_at)}</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          {request.phone && (
            <>
              <Button asChild size="sm" variant="outline">
                <a href={`tel:${request.phone}`}>
                  <Phone className="mr-2 h-4 w-4" /> Call
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={whatsappLink(request.phone, greeting)} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </>
          )}
          <Button asChild size="sm" variant="outline">
            <a
              href={`mailto:${request.email}?subject=${encodeURIComponent(`Your enquiry — ${site.name}`)}&body=${encodeURIComponent(greeting)}`}
            >
              <Mail className="mr-2 h-4 w-4" /> Email
            </a>
          </Button>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="break-all">{request.email}</dd>
          <dt className="text-muted-foreground">Phone</dt>
          <dd>{request.phone ?? "—"}</dd>
          <dt className="text-muted-foreground">Service</dt>
          <dd>{request.service ?? "—"}</dd>
          <dt className="text-muted-foreground">Vehicle</dt>
          <dd>{request.vehicle ?? "—"}</dd>
          <dt className="text-muted-foreground">Preferred date</dt>
          <dd>
            {request.preferred_date
              ? new Date(request.preferred_date).toLocaleDateString("en-GB", {
                  dateStyle: "medium",
                })
              : "—"}
          </dd>
          <dt className="text-muted-foreground">Extras</dt>
          <dd>{request.addons && request.addons.length > 0 ? request.addons.join(", ") : "—"}</dd>
        </dl>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Message</p>
          <p className="whitespace-pre-wrap border border-border bg-muted/40 p-3 text-sm">
            {request.message || "No message."}
          </p>
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as RequestStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quoted">Quoted price (£)</Label>
              <Input
                id="quoted"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 185"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Private notes</Label>
            <Textarea
              id="notes"
              rows={4}
              maxLength={4000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Only visible to admins"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this request?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the request from {request.name}. It cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => remove.mutate()}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
