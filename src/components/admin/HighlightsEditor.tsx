import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { iconKeys, type Highlight } from "@/data/icons";

type Props = { items: Highlight[]; onChange: (items: Highlight[]) => void };

// Rows of "what's included": icon, short title and the full sentence shown on the cards.
export function HighlightsEditor({ items, onChange }: Props) {
  const patch = (index: number, change: Partial<Highlight>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...change } : item)));
  const move = (index: number, by: -1 | 1) => {
    const next = [...items];
    const target = index + by;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="grid gap-2 border border-border bg-background/50 p-3 sm:grid-cols-[7rem_1fr_auto]"
        >
          <select
            value={item.icon}
            onChange={(e) => patch(i, { icon: e.target.value })}
            aria-label="Icon"
            className="rounded-sm border border-input bg-background px-2 py-2 text-sm text-foreground"
          >
            {iconKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <div className="space-y-2">
            <Input
              value={item.title}
              maxLength={80}
              placeholder="Short title (shown on the icon grid)"
              onChange={(e) => patch(i, { title: e.target.value })}
              aria-label="Short title"
            />
            <Input
              value={item.text}
              maxLength={200}
              placeholder="Full text (shown on the package cards)"
              onChange={(e) => patch(i, { text: e.target.value })}
              aria-label="Text"
            />
          </div>
          <div className="flex items-start gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label="Move up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              aria-label="Move down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onChange(items.filter((_, index) => index !== i))}
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { icon: "check", title: "", text: "" }])}
      >
        <Plus className="mr-1 h-4 w-4" /> Add item
      </Button>
    </div>
  );
}
