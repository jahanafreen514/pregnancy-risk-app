
import React from "react";

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+55", country: "Brazil" },
  { code: "+7", country: "Russia" },
  { code: "+82", country: "South Korea" },
  { code: "+31", country: "Netherlands" },
  { code: "+46", country: "Sweden" },
  { code: "+41", country: "Switzerland" },
  { code: "+34", country: "Spain" },
  { code: "+52", country: "Mexico" },
  { code: "+65", country: "Singapore" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
];

const CountryCodeSelector = ({ value, onChange, className }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`rounded-2xl border border-pink-100 bg-white/90 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg ${className}`}
    >
      {countryCodes.map((country) => (
        <option key={country.code} value={country.code}>
          {country.code} ({country.country})
        </option>
      ))}
    </select>
  );
};

export default CountryCodeSelector;