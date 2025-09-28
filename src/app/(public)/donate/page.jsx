'use client';

export default function DonationPage() {
  const bankDetails = [
    {
      bank: 'Punjab National Bank',
      accountHolder: 'Siloti Archive Research and Cultural Centre',
      accountNumber: '0627200100009801',
      ifsc: 'PUNB0062720',
      swift: 'PUNBINBBISB',
      adCode: '0300200',
      branch: 'Kalain', // you can update if needed
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero */}
        <h2 className="text-3xl font-bold text-center text-[#1276AB]">
          Support Sylheti Archive
        </h2>
        <p className="text-center text-xl text-[#1276AB] mt-2">
          Make a donation to help preserve Sylheti culture and heritage.
        </p>
        <p className="text-center text-lg text-[#666666] mt-4 max-w-3xl mx-auto">
          You can contribute directly to our Indian bank account. Your support
          helps us maintain and grow the archive.
        </p>

        {/* Bank Details Grid */}
        <div className="grid gap-10 mt-12">
          {bankDetails.map((bank, idx) => (
            <div
              key={idx}
              className={`bg-[#faf8f5] p-10 rounded-xl text-center border-2 border-transparent 
                hover:translate-y-[-10px] transition-all duration-300 hover:shadow-xl hover:border-[#d4a574] 
                relative overflow-hidden
                ${bankDetails.length === 1 ? 'max-w-md mx-auto' : 'w-full'}
            `}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1276AB] to-[#d4a574]" />
              <h3 className="text-xl font-semibold text-[#1276AB] mb-4">{bank.bank}</h3>
              <ul className="text-left text-[#666666] space-y-2 mt-4">
                <li>
                  <span className="font-semibold text-[#1276AB]">Account Holder:</span> {bank.accountHolder}
                </li>
                <li>
                  <span className="font-semibold text-[#1276AB]">Account Number:</span> {bank.accountNumber}
                </li>
                <li>
                  <span className="font-semibold text-[#1276AB]">IFSC:</span> {bank.ifsc}
                </li>
                <li>
                  <span className="font-semibold text-[#1276AB]">SWIFT Code:</span> {bank.swift}
                </li>
                <li>
                  <span className="font-semibold text-[#1276AB]">AD Code:</span> {bank.adCode}
                </li>
                <li>
                  <span className="font-semibold text-[#1276AB]">Branch:</span> {bank.branch}
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Optional Note */}
        <p className="text-center text-[#666666] mt-12 max-w-3xl mx-auto">
          For any queries regarding donations, please{' '}
          <a
            href="/contact"
            className="text-[#1276AB] font-semibold hover:underline"
          >
            contact us
          </a>
          .
        </p>
      </div>
    </section>
  );
}
