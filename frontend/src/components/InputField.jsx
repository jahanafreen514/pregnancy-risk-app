function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-2xl border border-pink-200 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400 transition"
      />
    </div>
  );
}

export default InputField;