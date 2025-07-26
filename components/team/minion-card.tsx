"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star } from "lucide-react"

interface MinionCardProps {
  member: {
    name: string
    position: string
    specialty: string
    minion: string
  }
  index: number
}

export const MinionCard = ({ member, index }: MinionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
      data-hover="true"
    >
      <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 text-center group-hover:border-[#cdaa72]/20 relative overflow-hidden">
        {/* Mathematical symbol decoration */}
        <motion.div
          className="absolute top-4 right-4 text-[#cdaa72] font-serif text-lg opacity-20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          {index % 3 === 0 ? "π" : index % 3 === 1 ? "∑" : "∫"}
        </motion.div>

        {/* Minion Avatar */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#16556d] via-[#356a72] to-[#16556d] rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Image
              src="/images/minion-avatar.png"
              alt={`${member.name} - ${member.minion}`}
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <motion.div
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#16556d] rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.2 }}
          >
            <Star className="h-4 w-4 text-[#cdaa72]" />
          </motion.div>
        </div>

        <h4 className="text-xl font-light text-[#16556d] mb-2 group-hover:text-[#cdaa72] transition-colors">
          {member.name}
        </h4>
        <p className="text-[#356a72] font-light text-sm mb-2">{member.position}</p>
        <p className="text-gray-500 font-light text-xs mb-4">{member.specialty}</p>

        {/* Minion character name */}
        <div className="bg-[#f6f094]/20 rounded-full px-3 py-1 inline-block">
          <span className="text-[#16556d] text-xs font-light">MINion {member.minion}</span>
        </div>

        <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-[#cdaa72] to-[#f6f094] mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>
    </motion.div>
  )
}
