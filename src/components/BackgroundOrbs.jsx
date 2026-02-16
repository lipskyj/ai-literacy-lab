import React from 'react';
import { motion } from 'framer-motion';

const BackgroundOrbs = () => (
  <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-gray-50">
    <motion.div
      animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }}
      transition={{ duration: 15, repeat: Infinity }}
      className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-400/40 blur-[100px]"
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1], x: [0, -50, 0] }}
      transition={{ duration: 18, repeat: Infinity }}
      className="absolute top-1/2 -right-40 w-[700px] h-[700px] rounded-full bg-orange-400/30 blur-[120px]"
    />
  </div>
);

export default BackgroundOrbs;