import { useState } from "react";
import Avatar from "./ui/Avatar";
import { useSpoolStore } from "../stores/spool";
import { useModalStore } from "../stores/ui";

const MATERIALS = ["PLA Basic", "PLA Matte", "PLA+", "PETG", "ABS", "ASA", "TPU", "Support"];
const PALETTE = [
  ["#1c1b1f", "Jet Black"],
  ["#efe9dd", "Ivory White"],
  ["#e23b2e", "Fire Red"],
  ["#f4b400", "Sunflower"],
  ["#12855a", "Forest Green"],
  ["#12a39a", "Teal"],
  ["#2f5fe1", "Cobalt Blue"],
  ["#8b5cf6", "Violet"],
  ["#ff7ac2", "Pink"],
  ["#b0b4bb", "Silver Grey"],
];

export default function SpoolModal() {
  const { members, currency, createFilament } = useSpoolStore();
  const close = useModalStore((s) => s.close);
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("PLA Basic");
  const [colorName, setColorName] = useState("");
  const [hex, setHex] = useState("#f4b400");
  const [price, setPrice] = useState("");
  const [grams, setGrams] = useState("1000");
  const [ownerId, setOwnerId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const complete = Boolean(colorName.trim() && parseFloat(price) > 0 && parseFloat(grams) > 0);

  async function submit() {
    if (!complete || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await createFilament({
        brand: brand.trim() || "Generic",
        material,
        color_name: colorName.trim(),
        hex,
        price_per_kg: parseFloat(price),
        grams: parseFloat(grams),
        owner_id: ownerId,
      });
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h3 className="font-display font-bold text-xl">Add filament</h3>
      <p className="text-sm text-black/50 mt-1">A new spool in the shared library.</p>

      <div className="mt-5">
        <span className="text-xs font-semibold text-black/55 block mb-2 tracking-wide">WHO BOUGHT THIS SPOOL</span>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setOwnerId(m.id)}
              className={`btn btn-sm rounded-full gap-2 ${ownerId === m.id ? "btn-neutral" : "bg-base-200 border-black/10"}`}
            >
              <Avatar name={m.name} color={m.color} size={20} />
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mt-4">
        <label className="block">
          <span className="text-xs font-semibold text-black/55 block mb-1.5">BRAND</span>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Bambu Lab"
            className="input input-bordered input-sm w-full"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-black/55 block mb-1.5">MATERIAL</span>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="select select-bordered select-sm w-full"
          >
            {MATERIALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3.5">
        <span className="text-xs font-semibold text-black/55 block mb-1.5">COLOUR NAME</span>
        <input
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder="Sunflower Yellow"
          className="input input-bordered input-sm w-full"
        />
        <div className="flex flex-wrap gap-2 mt-2.5">
          {PALETTE.map(([swatchHex, name]) => (
            <button
              key={swatchHex}
              type="button"
              title={name}
              onClick={() => {
                setHex(swatchHex);
                if (!colorName) setColorName(name);
              }}
              className="w-7 h-7 rounded-lg"
              style={{
                background: swatchHex,
                border: hex === swatchHex ? "2.5px solid #ff4d2e" : "2.5px solid rgba(0,0,0,.08)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mt-3.5">
        <label className="block">
          <span className="text-xs font-semibold text-black/55 block mb-1.5">PRICE / KG</span>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="249"
              className="input input-bordered input-sm w-full font-mono pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 font-mono text-xs">
              {currency}/kg
            </span>
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-black/55 block mb-1.5">GRAMS ON SPOOL</span>
          <input
            type="number"
            min="0"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            placeholder="1000"
            className="input input-bordered input-sm w-full font-mono"
          />
        </label>
      </div>

      {error && <div className="text-error text-sm mt-3">{error}</div>}

      <div className="flex gap-3 mt-5">
        <button type="button" className="btn bg-base-200 border-black/10" onClick={close}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary flex-1" disabled={!complete || submitting} onClick={submit}>
          {complete ? "Add to library" : "Add filament"}
        </button>
      </div>
    </>
  );
}
