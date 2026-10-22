import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { addonPriceLabel, type Addon } from "@/data/addons";
import { gbp, lowestPrice, type Package, type VehicleTypeInfo } from "@/data/packages";
import { ppfFromPrice, type PpfSettings } from "@/data/ppf";
import { submitQuote } from "@/lib/quote";

// Applied whenever `nonce` changes, so a pricing card can preselect the form without remounting it.
export type QuotePreset = {
  nonce: number;
  service?: string | undefined;
  vehicle?: string | undefined;
  addonIds?: string[] | undefined;
  date?: string | undefined;
  message?: string | undefined;
};

type Props = {
  packages: Package[];
  ppf: PpfSettings;
  vehicleTypes: VehicleTypeInfo[];
  addons: Addon[];
  preset?: QuotePreset;
  disclaimer: string;
};

const field =
  "w-full rounded-sm border border-input bg-background px-3 py-3 text-base text-foreground outline-none ring-offset-background transition-shadow duration-200 focus:ring-2 focus:ring-ring sm:py-2 sm:text-sm";
const label = "text-sm font-medium text-card-foreground";

const NOT_SURE = "Not sure / Multiple services";

export function QuoteForm({ packages, ppf, vehicleTypes, addons, preset, disclaimer }: Props) {
  // The dropdown stores the service NAME; its label shows the price for the chosen vehicle type
  // (or the lowest price until a vehicle is chosen), so the list always matches the catalogue.
  const serviceNames = useMemo(
    () => [...packages.map((pkg) => pkg.name), ppf.name, NOT_SURE],
    [packages, ppf],
  );

  const [service, setService] = useState(serviceNames[0] ?? "");
  const [vehicleId, setVehicleId] = useState("");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const lastPresetMessage = useRef("");
  const [today, setToday] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Local date (not UTC) so "today" is right for UK visitors around midnight.
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setToday(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }, []);

  // Apply a preset (from a pricing card or the URL).
  useEffect(() => {
    if (!preset) return;
    if (preset.service) {
      const wanted = preset.service.toLowerCase();
      const match = serviceNames.find((n) => n.toLowerCase().startsWith(wanted));
      if (match) setService(match);
    }
    if (preset.vehicle !== undefined) {
      const wanted = preset.vehicle.toLowerCase();
      const match = vehicleTypes.find(
        (v) =>
          v.id === wanted ||
          v.label.toLowerCase() === wanted ||
          v.label.toLowerCase().startsWith(wanted),
      );
      setVehicleId(match?.id ?? "");
    }
    if (preset.addonIds)
      setAddonIds(preset.addonIds.filter((id) => addons.some((a) => a.id === id)));
    if (preset.date) setDate(preset.date);
    // A preset note (e.g. a chosen colour) never overwrites text the visitor typed themselves.
    if (
      preset.message !== undefined &&
      (!message.trim() || message === lastPresetMessage.current)
    ) {
      setMessage(preset.message);
      lastPresetMessage.current = preset.message;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset?.nonce]);

  // The package picked in the dropdown decides which optional extras and estimate are shown.
  const activePackage = packages.find((p) => p.name === service);
  const availableAddons = addons.filter((a) => activePackage && a.packageId === activePackage.id);
  const vehicle = vehicleTypes.find((v) => v.id === vehicleId);
  const selectedAddons = availableAddons.filter((a) => addonIds.includes(a.id));
  const basePrice = activePackage && vehicleId ? activePackage.prices[vehicleId] : undefined;
  const estimate =
    basePrice !== undefined
      ? basePrice + selectedAddons.reduce((sum, a) => sum + a.price, 0)
      : undefined;

  const serviceLabel = (name: string) => {
    const pkg = packages.find((p) => p.name === name);
    if (pkg) {
      const forVehicle = vehicleId ? pkg.prices[vehicleId] : undefined;
      return `${name} — from ${gbp(forVehicle ?? lowestPrice(pkg))}`;
    }
    if (name === ppf.name) {
      const from = ppfFromPrice(ppf);
      return from === null ? name : `${name} — from ${gbp(from)}`;
    }
    return name;
  };

  const toggleAddon = (id: string) =>
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // Hidden field real visitors never fill in: bots do. Pretend success and drop it.
    if (form.get("website")) {
      setSubmitted(true);
      return;
    }
    setSending(true);
    setError("");
    const result = await submitQuote({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      service,
      vehicle: vehicle?.label ?? "",
      message,
      preferredDate: date,
      addons: selectedAddons.map((a) => ({ id: a.id, name: a.name })),
    });
    setSending(false);
    if (result.ok) setSubmitted(true);
    else setError(result.error);
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 animate-[pop_.5s_ease-out_both] items-center justify-center rounded-sm bg-primary/10 text-primary">
          <Send className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-heading text-xl font-semibold text-card-foreground">
          Message sent!
        </h3>
        <p className="mt-2 text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you shortly with availability and pricing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className={field}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className={label}>
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={field}
          placeholder="07123 456789"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="service" className={label}>
          Service
        </label>
        <select
          id="service"
          name="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className={field}
        >
          {serviceNames.map((name) => (
            <option key={name} value={name}>
              {serviceLabel(name)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="vehicle" className={label}>
            Vehicle category
          </label>
          <select
            id="vehicle"
            name="vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className={field}
          >
            <option value="">Select vehicle type</option>
            {vehicleTypes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="date" className={label}>
            Preferred date <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field}
          />
        </div>
      </div>

      {availableAddons.length > 0 && (
        <fieldset className="space-y-3 border border-border bg-background/50 p-4">
          <legend className="px-1 text-sm font-medium text-card-foreground">Optional extras</legend>
          {availableAddons.map((addon) => (
            <label key={addon.id} className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={addonIds.includes(addon.id)}
                onChange={() => toggleAddon(addon.id)}
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]"
              />
              <span className="text-sm">
                <span className="font-medium text-foreground">
                  {addon.name} <span className="text-primary">{addonPriceLabel(addon)}</span>
                </span>
                <span className="mt-0.5 block text-muted-foreground">{addon.description}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      {estimate !== undefined && (
        <div
          className="border-l-2 border-primary bg-primary/5 px-4 py-3 text-sm"
          aria-live="polite"
        >
          <p className="font-medium text-foreground">
            {vehicle?.label} {activePackage?.name.toLowerCase()}
            {selectedAddons.length > 0 &&
              ` + ${selectedAddons.map((a) => a.name.toLowerCase()).join(", ")}`}
            : <span className="text-primary">from {gbp(estimate)}</span>
          </p>
          <p className="mt-1 text-muted-foreground">{disclaimer}</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="message" className={label}>
          Additional notes
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          maxLength={4000}
          onChange={(e) => setMessage(e.target.value)}
          className={field}
          placeholder="Tell us about your vehicle and what you're looking for..."
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="btn-primary inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3"
      >
        <Send className="h-4 w-4" />
        {sending ? "Sending..." : "Request Appointment"}
      </button>
    </form>
  );
}
