interface ProteinPopupProps {
  drug: string;
  organs: Record<string, string>; // organs and their effect levels
 
}

export function ProteinPopup({ drug, organs }: ProteinPopupProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 10,
        padding: "10px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "5px",
        zIndex: 2,
        maxHeight: "70vh",
        overflowY: "auto",
      }}
    >
      <h3>Drug: {drug}</h3>
      <ul style={{ paddingLeft: "20px" }}>
        {Object.entries(organs).map(([organ, level]) => (
          <li key={organ}>
            <strong>{organ}:</strong> {level}
          </li>
        ))}
      </ul>
    </div>
  );
}

