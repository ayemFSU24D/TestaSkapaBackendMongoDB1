interface ProteinPopupProps {
  drug: string;
  organs: Record<string, string>;
}

export function ProteinPopup({ drug, organs }: ProteinPopupProps) {
  return (
    <div className="mt-4 p-3 bg-white border border-gray-300 rounded shadow max-w-full max-h-[70vh] overflow-y-auto">
      <h3 className="font-semibold mb-2">Drug: {drug}</h3>
      <ul className="pl-4 space-y-1">
        {Object.entries(organs).map(([organ, level]) => (
          <li key={organ}>
            <strong>{organ}:</strong> {level}
          </li>
        ))}
      </ul>
    </div>
  );
}


