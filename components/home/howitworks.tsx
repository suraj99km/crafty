import React from "react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  // Container animation with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  // Individual step animations
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Underline animation
  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "60%",
      transition: { duration: 0.8, ease: "easeInOut", delay: 0.3 },
    },
  };

  return (
    <motion.section
      className="pt-12 pb-8 px-6 text-center h-full flex flex-col justify-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Section Title with Animated Underline */}
      <div className="relative inline-block">
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
          variants={itemVariants}
        >
          How It Works
        </motion.h2>
        <motion.div
          className="absolute left-1/2 -bottom-0 h-1 bg-red-500 transform -translate-x-1/2"
          variants={underlineVariants}
          style={{ width: "60%", maxWidth: "200px" }}
        />
      </div>

      {/* Steps Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        {[
          { step: "1", text: "Artists List Their Handmade Creations" },
          { step: "2", text: "Buyers Explore & Order Quality Crafts" },
          { step: "3", text: "Seamless Delivery while Artists Grow Their Sales" }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 relative"
            variants={itemVariants}
          >
            {/* Step Number */}
            <div className="bg-red-500 text-white text-xl w-14 h-14 rounded-full flex justify-center items-center font-bold mx-auto shadow-md">
              {item.step}
            </div>
            {/* Step Text */}
            <h3 className="text-lg sm:text-xl font-medium text-gray-800 mt-4 text-center leading-snug">
              {item.text}
            </h3>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default HowItWorks;