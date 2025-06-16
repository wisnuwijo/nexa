"use client";
import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  useEffect(() => {
    const qrCodeRegionId = "reader";
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);

    const config = { fps: 10, qrbox: 250 };

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices[0].id;

          html5QrCode
            .start(
              cameraId,
              config,
              (decodedText: string) => {
                console.log("Success:", decodedText);
                onScanSuccess(decodedText);
                html5QrCode.stop().catch((err) => {
                  console.error("Failed to stop after scan", err);
                });
              },
              (errorMessage: string) => {
                console.log("Scan error", errorMessage);
              }
            )
            .catch((err) => {
              console.error("Unable to start scanning", err);
            });
        }
      })
      .catch((err) => {
        console.error("Camera fetch error", err);
      });

    return () => {
      html5QrCode.stop().catch((err) => console.log("Stop error", err));
    };
  }, [onScanSuccess]);

  return <div id="reader" style={{ width: "300px" }} />;
}
