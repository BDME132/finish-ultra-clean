interface FormDatePickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  min?: string;
}

export default function FormDatePicker({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  min,
}: FormDatePickerProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-dark">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
