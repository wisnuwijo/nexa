
// Type for your route parameters
type Params = {
    params: {
        qr: string;
    };
};
  
export default function ExtinguisherDetail({ params }: Params) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-4xl font-bold">
        QR Code: {params.qr}
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-2xl font-bold">
          This is the detail page
        </div>
        <div className="text-xl">
          This is the detail page
        </div>
      </div>
    </div>
  )
}