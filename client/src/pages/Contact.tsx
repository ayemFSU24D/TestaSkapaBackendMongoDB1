export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold">Contact us</h1>

      {/* Stockholm */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Medieinstitutet – Stockholm</h2>
        <p>Gustavslundsvägen 151 D</p>
        <p>167 51 Bromma</p>

        <p className="mt-2">
          <strong>Phone hours:</strong> Mon, Wed, Fri: 10.00–12.00
        </p>
        <p className="text-sm text-gray-600">
          Switchboard closed Dec 22 and opens Jan 7, 2026
        </p>

        <p className="mt-2">
          <strong>Switchboard:</strong> 08–442 95 00
        </p>
        <p>
          <strong>Admissions:</strong> 020–10 33 80
        </p>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Gustavslundsvägen+151+D+Bromma"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-blue-600 hover:underline"
        >
          View on Google Maps
        </a>
      </div>

      {/* Göteborg */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Medieinstitutet – Göteborg</h2>

        <p><strong>Student entrance:</strong> Fürstenbergsgatan 1</p>
        <p>Anders Personsgatan 14</p>
        <p>416 64 Göteborg</p>

        <p className="mt-2">
          <strong>Phone hours:</strong> Mon, Wed, Fri: 10.00–12.00
        </p>
        <p className="text-sm text-gray-600">
          Switchboard closed Dec 22 and opens Jan 7, 2026
        </p>

        <p className="mt-2">
          <strong>Switchboard:</strong> 031–83 28 31
        </p>
        <p>
          <strong>Admissions:</strong> 020–10 33 80
        </p>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Anders+Personsgatan+14+Göteborg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-blue-600 hover:underline"
        >
          View on Google Maps
        </a>
      </div>

      {/* Malmö */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Medieinstitutet – Malmö</h2>

        <p>Drottninggatan 4B</p>
        <p>212 11 Malmö</p>

        <p className="mt-2">
          <strong>Phone hours:</strong> Mon, Wed, Fri: 10.00–12.00
        </p>
        <p className="text-sm text-gray-600">
          Switchboard closed Dec 22 and opens Jan 7, 2026
        </p>

        <p className="mt-2">
          <strong>Switchboard:</strong> 040–643 96 10
        </p>
        <p>
          <strong>Admissions:</strong> 020–10 33 80
        </p>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Drottninggatan+4B+Malmö"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-blue-600 hover:underline"
        >
          View on Google Maps
        </a>
      </div>

    </div>
  );
}
