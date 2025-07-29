export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-white">
     <section className="w-full min-h-screen bg-gradient-to-b from-[#1276AB] via-[#1276AB] to-[#7DB9E8] text-white flex items-center justify-center px-4">
     <div className="max-w-4xl text-center animate-in fade-in-5 slide-in-from-bottom-8 ease-in duration-500">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
          Siloti Archive, Research & Cultural Centre
        </h1>

        <p className="text-[1.5rem] mb-8 text-[#d4a574] font-bold">
          Preserving the Past, Inspiring the Future
        </p>

        <p className="text-base md:text-lg text-white/80 leading-relaxed mb-10">
          Dedicated to preserving, researching, and promoting the rich cultural heritage of the Siloti languages and the native communities of Siloti origin across Northeast India, Sylhet (Bangladesh), and the Siloti diaspora around the world.
        </p>

        <a
          href="#about"
          className="inline-block bg-[#D4A574] text-[#1F1F1F] px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(212,165,116,0.3)] hover:shadow-[0_8px_25px_rgba(212,165,116,0.4)] hover:-translate-y-0.5 hover:bg-[#c19660]"
        >
          Discover Our Mission
        </a>
      </div>
    </section>

    {/* Our Mission */}
    <section
      id="about"
      className="scroll-mt-20 min-h-screen bg-[#FAF8F5] text-gray-800 py-20 px-4 sm:px-6 lg:px-8 flex items-center"
    >
      <div className="max-w-5xl mx-auto animate-in fade-in-5 slide-in-from-bottom-8 ease-in duration-500">
        <h2 className="relative text-3xl sm:text-4xl font-bold text-[#1276AB] text-center mb-6 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[3px] after:bg-[#D4A574]">
          Our Mission
        </h2>
        <p className="text-center italic text-gray-500 mb-10 text-sm sm:text-base">
          Preserve. Research. Promote.
        </p>

        {/* Mission Section: Text + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Mission Text */}
          <div className="space-y-6 text-base leading-relaxed text-gray-700">
            <p>
              The <strong>Siloti Archive, Research & Cultural Centre (SARCC)</strong> is a nonprofit initiative
              dedicated to safeguarding the rich linguistic, cultural, and historical heritage of the Siloti people
              and other Indigenous communities—such as the Khasi, Patra, Manipuri (Meitei and Bishnupriya),
              Tripuri, Garo, Santal, Bhumij, Kurmi, Bede, and various Tea Tribe groups—across Northeast India
              and Sylhet, Bangladesh.
            </p>
            <p>
              We are uniquely dedicated to reviving the historic <strong>Nagri script</strong> and celebrating the
              incredible diversity of Indigenous communities that represent centuries of peaceful coexistence.
            </p>
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[
              { number: '11M', label: 'Siloti Speakers Worldwide' },
              { number: '15+', label: 'Indigenous Communities' },
              { number: '5', label: 'Countries Served' },
              { number: '1', label: 'Endangered Script to Revive' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl text-center shadow hover:-translate-y-1 transition-transform"
              >
                <div className="text-3xl sm:text-4xl font-bold text-[#1276AB]">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why We're Here */}
        <div className="bg-white p-6 sm:p-10 rounded-xl mt-12 border-l-4 border-[#D4A574] space-y-6 text-base leading-relaxed text-gray-700">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1276AB] mb-4">Why We're Here</h3>
          <p>
            Centuries-old Indigenous traditions are fading. Languages like <strong>Nagri</strong>, the historical
            script of the Siloti people, are on the brink of extinction. Many Indigenous languages and
            cultural traditions such as Siloti Nagri are at risk of disappearing forever. With only a few elders
            left who can read the ancient <strong>Nagri Puthi</strong> manuscripts, our work has never been more
            urgent or important.
          </p>
          <p>
            SARCC was founded to preserve, research, and revive these endangered languages, scripts, and
            cultures—empowering future generations to reclaim and celebrate their identity. We're building
            bridges between generations, creating opportunities for cultural education, and empowering
            communities to reclaim their heritage with pride.
          </p>
        </div>
      </div>
    </section>

    </main>
  );
}
