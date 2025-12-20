interface ProteinPopupProps {
  organ: string;
  level: number; // eller string om det är text
  drug: string;
  onClose: () => void; // en funktion utan argument som inte returnerar något
}

export function ProteinPopup({ organ, level, drug, onClose }: ProteinPopupProps) {
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
      }}
    >
      <h3>{organ}</h3>
      <p>
        <strong>Drug:</strong> {drug}
      </p>
      <p>
        <strong>Effect level:</strong> {level}
      </p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
