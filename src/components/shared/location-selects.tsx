"use client";

import { bangladeshLocations, getThanasForDistrict } from "@/content/bangladesh-locations";

type LocationSelectsProps = {
  district: string;
  thana: string;
  onDistrictChange: (district: string) => void;
  onThanaChange: (thana: string) => void;
  labelClassName?: string;
  selectClassName?: string;
};

export function LocationSelects({
  district,
  thana,
  onDistrictChange,
  onThanaChange,
  labelClassName = "block text-sm",
  selectClassName = "mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
}: LocationSelectsProps) {
  const thanas = getThanasForDistrict(district);

  return (
    <>
      <label className={labelClassName}>
        District
        <select
          value={district}
          onChange={(event) => {
            onDistrictChange(event.target.value);
            onThanaChange("");
          }}
          required
          className={selectClassName}
        >
          <option value="">Select district</option>
          {bangladeshLocations.map((location) => (
            <option key={location.district} value={location.district}>
              {location.district}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClassName}>
        Thana
        <select
          value={thana}
          onChange={(event) => onThanaChange(event.target.value)}
          required
          disabled={!district}
          className={selectClassName}
        >
          <option value="">{district ? "Select thana" : "Select district first"}</option>
          {thanas.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
