"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { motion } from "framer-motion";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PersonDetailPage() {
  const { id } = useParams();
  const { data, error } = useSWR(`/api/public/pages/people/${id}`, fetcher);

  if (error) return <div className="text-center mt-10">Failed to load</div>;
  if (!data) return <div className="text-center mt-10">Loading...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-20">
      {/* Back Button */}
      <Link href="/people" className="text-[#1276AB] font-medium hover:underline mb-6 inline-block">
        ← Back to People
      </Link>

      {/* Avatar */}
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src={data.image || "/avatars/avatar.png"}
        alt={data.name}
        className="w-40 h-40 rounded-full mx-auto border-4 border-[#1276AB]/20 shadow-lg mb-6"
      />

      {/* Name & Role */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center text-[#1276AB] mb-2"
      >
        {data.name}
      </motion.h1>
      <p className="text-center text-[#D4A574] text-lg font-medium mb-8">{data.role}</p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-gray-700 text-lg leading-relaxed text-center"
      >
        {data.description}
      </motion.p>

      
    </main>
  );
}
