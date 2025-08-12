"use client";

import { motion } from "framer-motion";
import { useShiningEffect } from "@/hooks/use-shining-effect";
import { cn } from "@/lib/utils";


interface SelectionProcessItem {
  id: string;
  title: string;
  description: string;
  focusAreas: string;
  actions: string;
}

interface SelectionProcessSectionProps {
  data: SelectionProcessItem[];
  title: string;
  subtitle: string;
  subtitleClassName?: string;
}

export function SelectionProcessSection({
  data,
  title,
  subtitle,
  subtitleClassName,
}: SelectionProcessSectionProps) {
  const ref = useShiningEffect<HTMLDivElement>();

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl min-gradient-accent">
              {title}
            </h2>
            <p className={cn("max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400", subtitleClassName)}>
              {subtitle}
            </p>
          </div>
        </div>
        <div className="relative mx-auto max-w-5xl py-12">
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-gray-700" />
          <ol className="relative">
            {data.map((item, index) => (
              <li
                key={item.id}
                className={cn(
                  "mb-10 flex flex-col md:flex-row items-center w-full",
                  index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                )}
              >

                <motion.div
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    "glass-card p-6 rounded-lg shadow-lg w-full md:w-[calc(50%-2rem)]",
                    index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                  )}
                >
                  <h3 className="text-lg font-semibold min-gradient-accent">
                     {item.title}
                   </h3>
                  <p className="mb-4 text-base font-normal text-white">
                    {item.description}
                  </p>
                  <p className="text-sm text-white">
                    <span className="font-semibold min-gradient-accent">Focus Areas:</span>
                    <br />
                    {item.focusAreas}
                  </p>
                  <p className="text-sm text-white">
                    <br />
                    <span className="font-semibold min-gradient-accent">Actions:</span>
                    <br />
                    {item.actions}
                  </p>
                </motion.div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}