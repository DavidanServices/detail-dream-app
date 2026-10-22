import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ExternalLink, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { textFields } from "@/data/page-text";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/content")({ component: ContentPage });

const previews: Record<string, string> = {
  "Interior page": "/interior-detailing",
  "Exterior page": "/exterior-detailing",
  "PPF page": "/ppf",
};

function ContentPage() {
  const data = useQuery({
    queryKey: ["admin", "content"],
    queryFn: async () => {
      const { data, error } = await supabase!.from("site_content").select("key,value");
      if (error) throw error;
      return Object.fromEntries(data.map((r) => [r.key as string, r.value as string]));
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-4xl">Page texts</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Headlines and descriptions of the Interior and Exterior pages. Prices, extras and the
          lists of included services are edited under{" "}
          <span className="text-foreground">Pricing</span>. A text you leave empty or reset goes
          back to the built-in wording.
        </p>
      </div>
      {data.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {data.isError && (
        <p className="border border-border bg-card p-5 text-sm text-muted-foreground">
          Page texts are not set up yet. Run the migration{" "}
          <code>20261024120000_editable_content.sql</code> in the Supabase SQL Editor.
        </p>
      )}
      {data.data && <ContentForm key={JSON.stringify(data.data)} saved={data.data} />}
    </div>
  );
}

function ContentForm({ saved }: { saved: Record<string, string> }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(textFields.map((f) => [f.key, saved[f.key] ?? f.default])),
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof textFields>();
    for (const f of textFields) map.set(f.group, [...(map.get(f.group) ?? []), f]);
    return [...map.entries()];
  }, []);

  // What would be stored for a field: nothing when it equals the built-in default.
  const desired = (key: string) => {
    const field = textFields.find((f) => f.key === key)!;
    const value = (values[key] ?? "").trim();
    return value === "" || value === field.default ? undefined : value;
  };
  const changed = textFields.filter((f) => desired(f.key) !== saved[f.key]);

  const save = useMutation({
    mutationFn: async () => {
      for (const f of changed) {
        const value = desired(f.key);
        if (value === undefined) {
          const { error } = await supabase!.from("site_content").delete().eq("key", f.key);
          if (error) throw error;
        } else {
          if (value.length > 2000)
            throw new Error(`"${f.label}" is too long (max 2000 characters).`);
          const { error } = await supabase!.from("site_content").upsert({ key: f.key, value });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      toast.success("Texts saved. The website shows them straight away.");
      queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-10 pb-24">
      {groups.map(([group, fields]) => (
        <section key={group} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl">{group}</h2>
            {previews[group] && (
              <a
                href={previews[group]}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Open page <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="space-y-5 border border-border bg-card p-5">
            {fields.map((f) => {
              const modified = (values[f.key] ?? "") !== f.default;
              return (
                <div key={f.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor={f.key}>
                      {f.label}
                      {modified && <span className="ml-2 text-xs text-primary">edited</span>}
                    </Label>
                    {modified && (
                      <button
                        type="button"
                        onClick={() => setValues((prev) => ({ ...prev, [f.key]: f.default }))}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw className="h-3 w-3" /> Reset to default
                      </button>
                    )}
                  </div>
                  {f.multiline ? (
                    <Textarea
                      id={f.key}
                      rows={3}
                      maxLength={2000}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  ) : (
                    <Input
                      id={f.key}
                      maxLength={2000}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  )}
                  {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {changed.length === 0
              ? "No unsaved changes"
              : `${changed.length} unsaved ${changed.length === 1 ? "change" : "changes"}`}
          </p>
          <Button onClick={() => save.mutate()} disabled={save.isPending || changed.length === 0}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save texts
          </Button>
        </div>
      </div>
    </div>
  );
}
