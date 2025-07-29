'use client';

import React from 'react';

export default function WhatWeDoPage() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#1276AB]">What We Do</h2>
        <p className="text-center text-lg text-[#666666] mt-4 max-w-3xl mx-auto">
          Comprehensive cultural preservation through archive, research, education, and community engagement
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {/* Cultural Preservation */}
          <div className="bg-[#faf8f5] p-10 rounded-xl text-center border-2 border-transparent hover:translate-y-[-10px] transition-all duration-300 hover:shadow-xl hover:border-[#d4a574] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1276AB] to-[#d4a574]" />
            <div className="text-5xl mb-6 text-[#1276AB]">🏛️</div>
            <h3 className="text-xl font-semibold text-[#1276AB] mb-4">Cultural Preservation</h3>
            <ul className="text-left text-[#666666] space-y-2">
              <li>Reviving endangered languages like Nagri</li>
              <li>Documenting oral histories and traditions</li>
              <li>Preserving cultural practices and rituals</li>
            </ul>
          </div>

          {/* Research & Education */}
          <div className="bg-[#faf8f5] p-10 rounded-xl text-center border-2 border-transparent hover:translate-y-[-10px] transition-all duration-300 hover:shadow-xl hover:border-[#d4a574] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1276AB] to-[#d4a574]" />
            <div className="text-5xl mb-6 text-[#1276AB]">🔬</div>
            <h3 className="text-xl font-semibold text-[#1276AB] mb-4">Research & Education</h3>
            <ul className="text-left text-[#666666] space-y-2">
              <li>Establishing a Museum, Library, and Cultural Centre in Cachar, Assam</li>
              <li>Supporting academic research, workshops, and public lectures</li>
              <li>Promoting Indigenous knowledge and cultural exchange</li>
            </ul>
          </div>

          {/* Community Empowerment */}
          <div className="bg-[#faf8f5] p-10 rounded-xl text-center border-2 border-transparent hover:translate-y-[-10px] transition-all duration-300 hover:shadow-xl hover:border-[#d4a574] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1276AB] to-[#d4a574]" />
            <div className="text-5xl mb-6 text-[#1276AB]">👥</div>
            <h3 className="text-xl font-semibold text-[#1276AB] mb-4">Community Empowerment</h3>
            <ul className="text-left text-[#666666] space-y-2">
              <li>Job creation through cultural education</li>
              <li>Skills training for underprivileged groups</li>
              <li>Promoting peace, harmony, and cultural coexistence</li>
            </ul>
          </div>

          {/* Library & Archives */}
          <div className="bg-[#faf8f5] p-10 rounded-xl text-center border-2 border-transparent hover:translate-y-[-10px] transition-all duration-300 hover:shadow-xl hover:border-[#d4a574] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1276AB] to-[#d4a574]" />
            <div className="text-5xl mb-6 text-[#1276AB]">📚</div>
            <h3 className="text-xl font-semibold text-[#1276AB] mb-4">Library & Archives</h3>
            <ul className="text-left text-[#666666] space-y-2">
              <li>Develop a public-access library for all age groups</li>
              <li>Collect rare books, manuscripts, and periodicals</li>
              <li>Create digital archives for global access</li>
              <li>Provide multimedia resources for language education</li>
            </ul>
          </div>

          {/* Museum Development */}
          <div className="bg-[#faf8f5] p-10 rounded-xl text-center border-2 border-transparent hover:translate-y-[-10px] transition-all duration-300 hover:shadow-xl hover:border-[#d4a574] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1276AB] to-[#d4a574]" />
            <div className="text-5xl mb-6 text-[#1276AB]">🏺</div>
            <h3 className="text-xl font-semibold text-[#1276AB] mb-4">Museum Development</h3>
            <ul className="text-left text-[#666666] space-y-2">
              <li>Exhibit historical artifacts and cultural objects</li>
              <li>Preserve and display Nagri Puthi manuscripts</li>
              <li>Digitize and document heritage sites</li>
              <li>Curate rotating exhibitions and oral history displays</li>
            </ul>
          </div>

          {/* Global Outreach */}
          <div className="bg-[#faf8f5] p-10 rounded-xl text-center border-2 border-transparent hover:translate-y-[-10px] transition-all duration-300 hover:shadow-xl hover:border-[#d4a574] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1276AB] to-[#d4a574]" />
            <div className="text-5xl mb-6 text-[#1276AB]">🌍</div>
            <h3 className="text-xl font-semibold text-[#1276AB] mb-4">Global Outreach</h3>
            <ul className="text-left text-[#666666] space-y-2">
              <li>Connect with Siloti diaspora worldwide</li>
              <li>Share cultural materials through digital platforms</li>
              <li>Facilitate international cultural exchange</li>
              <li>Offer online access to archives and virtual exhibits</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
