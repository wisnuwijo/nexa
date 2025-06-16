"use client";
import { useState } from "react";
import QRScanner from "../components/qr_scanner";

export default function HomePage() {
  const [result, setResult] = useState("");

  return (
    <main style={{ padding: 20 }}>
      <h1>QR Scanner</h1>
      <QRScanner onScanSuccess={setResult} />
      <p>Hasil scan: {result}</p>
    </main>
  );
}
