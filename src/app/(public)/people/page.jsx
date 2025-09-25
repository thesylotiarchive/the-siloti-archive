"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PeoplePage() {
  const { data, error } = useSWR("/api/public/pages/people", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const { title, intro, sections } = data.sections;

  return (
    <main className="max-w-6xl mx-auto px-4 py-20 space-y-16">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-3xl sm:text-4xl font-bold text-[#1276AB] text-center mb-10 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[3px] after:bg-[#D4A574]"
      >
        {title}
      </motion.h1>

      {/* Intro */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-muted-foreground mb-12 text-lg leading-relaxed text-center max-w-2xl mx-auto"
      >
        {intro}
      </motion.p>

      {/* Sections */}
      {sections.map((section, sIndex) => (
        <section key={sIndex} className="space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-semibold text-[#1276AB] text-center"
          >
            {section.title}
          </motion.h2>

          {/* People Grid */}
          <div className="flex flex-wrap justify-center gap-8">
            {section.people.map((person, i) => (
              <motion.div
                key={person.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] flex flex-col items-center bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Avatar */}
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={person.image || "/avatars/avatar.png"}
                  alt={person.name}
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-[#1276AB]/20 mb-4"
                />

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[#1276AB]">
                    {person.name}
                  </h3>
                  <p className="text-sm font-medium text-[#D4A574] mb-2">
                    {person.role}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    {person.description.length > 100
                      ? person.description.slice(0, 100) + "..."
                      : person.description}
                  </p>
                  <Link
                    href={`/people/${person.id}`}
                    className="text-[#1276AB] text-sm font-semibold hover:underline"
                  >
                    More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>



        </section>
      ))}
    </main>
  );
}
