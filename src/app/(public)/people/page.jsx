"use client";

import { motion } from "framer-motion";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PeoplePage() {
  const { data, error } = useSWR("/api/public/pages/people", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const { title, intro, people } = data.sections;

  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      {/* Title */}
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

      {/* People List */}
      <div className="space-y-8">
        {people.map((person, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
          >
            {/* Avatar */}
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={person.image || "/avatars/avatar.png"}
              alt={person.name}
              className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-[#1276AB]/20"
            />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-semibold text-[#1276AB]">
                {person.name}
              </h3>
              <p className="text-sm font-medium text-[#D4A574] mb-2">
                {person.role}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {person.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
