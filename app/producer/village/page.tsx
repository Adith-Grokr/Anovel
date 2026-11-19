"use client";

import Image from "next/image";
import { useState } from "react";
import { CircleCheck, LocateFixed, MapPin, Users } from "lucide-react";
import { Card, PageTitle } from "@/components/dashboard/widgets";
import { Button } from "@/components/site/ui";
import { getVillage } from "@/lib/mock/data";
import { MultiFileDrop, bigInputClass, useMe } from "@/components/producer/shared";

const WORKSHOP_PHOTOS = [
  { src: "/images/loom.jpg", label: "Pit loom" },
  { src: "/images/yarn-dye.jpg", label: "Yarn dyeing" },
  { src: "/images/weaver-1.jpg", label: "Weaving" },
];

export default function ProducerVillage() {
  const me = useMe();
  const village = getVillage(me?.villageSlug ?? "pochampally");

  const [form, setForm] = useState({
    village: village?.name ?? "",
    mandal: "Bhoodan Pochampally",
    district: village?.district ?? "",
    state: village?.state ?? "",
    pin: "508284",
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const fillLocation = () => {
    setLocating(true);
    // Demo: fill a fixed point near the cluster instead of reading GPS.
    window.setTimeout(() => {
      setCoords({ lat: 17.3472, lng: 78.8186 });
      setLocating(false);
    }, 700);
  };

  const fields: { key: keyof typeof form; label: string; numeric?: boolean }[] = [
    { key: "village", label: "Village" },
    { key: "mandal", label: "Mandal / Taluk" },
    { key: "district", label: "District" },
    { key: "state", label: "State" },
    { key: "pin", label: "PIN code", numeric: true },
  ];

  return (
    <div className="space-y-5">
      <PageTitle title="My village" subtitle="Where you work. ANOVEL uses this for pickup and to tell your story to buyers." />

      <Card className="space-y-4">
        <Button
          type="button"
          variant="plum"
          size="lg"
          className="w-full"
          onClick={fillLocation}
          disabled={locating}
        >
          <LocateFixed size={20} /> {locating ? "Finding you…" : "Use my location"}
        </Button>
        {coords && (
          <p className="flex items-center gap-2 rounded-xl bg-sage/50 px-4 py-3 text-sm font-bold text-olive-dark">
            <MapPin size={18} /> Location saved: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1.5 block text-sm font-black text-ink">{f.label}</span>
              <input
                value={form[f.key]}
                inputMode={f.numeric ? "numeric" : undefined}
                maxLength={f.numeric ? 6 : undefined}
                onChange={(e) =>
                  setForm((s) => ({ ...s, [f.key]: f.numeric ? e.target.value.replace(/[^0-9]/g, "") : e.target.value }))
                }
                className={bigInputClass}
              />
            </label>
          ))}
        </div>

        <Button size="lg" className="w-full sm:w-auto" onClick={() => setSaved(true)}>
          {saved ? (
            <>
              <CircleCheck size={20} /> Saved
            </>
          ) : (
            "Save address"
          )}
        </Button>
      </Card>

      {village && (
        <Card className="!p-0 overflow-hidden">
          <div className="relative h-40 w-full bg-cream">
            <Image src={village.image} alt={village.clusterName} fill sizes="(min-width: 1024px) 768px, 100vw" className="object-cover" />
          </div>
          <div className="space-y-2 p-4">
            <h2 className="font-hand text-2xl text-ink">{village.clusterName}</h2>
            <p className="text-sm font-bold text-olive">{village.specialty}</p>
            <p className="flex items-center gap-2 text-sm text-muted">
              <Users size={16} /> {village.producersCount} producers in this cluster on ANOVEL
            </p>
            <p className="text-sm text-muted">{village.story}</p>
          </div>
        </Card>
      )}

      <Card className="space-y-4">
        <h2 className="font-hand text-2xl text-ink">Workshop photos</h2>
        <div className="grid grid-cols-3 gap-2">
          {WORKSHOP_PHOTOS.map((p) => (
            <figure key={p.src}>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-cream">
                <Image src={p.src} alt={p.label} fill sizes="(min-width: 640px) 200px, 33vw" className="object-cover" />
              </div>
              <figcaption className="mt-1 text-center text-xs font-bold text-muted">{p.label}</figcaption>
            </figure>
          ))}
        </div>
        <MultiFileDrop label="Add workshop photos" accept="image/*" files={photos} onChange={setPhotos} />
      </Card>
    </div>
  );
}
