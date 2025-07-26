"use client";

import { motion } from "framer-motion";
import React from "react";

interface MotionDivWrapperProps extends React.ComponentProps<typeof motion.div> {
  children: React.ReactNode;
}

export const MotionDivWrapper: React.FC<MotionDivWrapperProps> = ({ children, ...props }) => {
  return <motion.div {...props}>{children}</motion.div>;
};