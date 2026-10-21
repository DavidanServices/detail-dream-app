import { useMemo, useState } from "react";
import type { Addon } from "@/data/addons";
import type { QuotePreset } from "@/components/QuoteForm";

// Shared selection for a detailing page: pricing cards and the optional extra both feed the booking form.
export function useDetailingSelection(serviceName: string | undefined, addon: Addon | undefined) {
  const [vehicle, setVehicle] = useState<string | undefined>();
  const [withAddon, setWithAddon] = useState(false);
  const [nonce, setNonce] = useState(0);

  const preset: QuotePreset = useMemo(
    () => ({
      nonce,
      service: serviceName,
      vehicle,
      addonIds: withAddon && addon ? [addon.id] : [],
    }),
    [nonce, serviceName, vehicle, withAddon, addon],
  );

  return {
    preset,
    withAddon,
    choose: (vehicleId: string) => {
      setVehicle(vehicleId);
      setNonce((n) => n + 1);
    },
    toggleAddon: () => {
      setWithAddon((v) => !v);
      setNonce((n) => n + 1);
    },
  };
}
