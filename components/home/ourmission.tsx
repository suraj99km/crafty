import React from 'react';
import { motion } from 'framer-motion';

const OurMission = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  // Special animation for the button
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: 1.2 }
    },
    hover: {
      scale: 1,
      backgroundColor: "#b91c1c", // dark red
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="px-6 md:px-12 lg:px-20 py-16 bg-gray-50 rounded-t-3xl mt-10 shadow-inner"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 relative"
          variants={itemVariants}
        >
          <span className="relative">
            Our Mission
            <motion.span 
              className="absolute -bottom-2 left-0 h-1 bg-red-500"
              initial={{ width: 0 }}
              whileInView={{ width: "60%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </span>
        </motion.h2>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6"
          variants={itemVariants}
        >
          At <span className="inline-block text-white bg-red-500 rounded-lg px-2 py-1 font-bold transform transition-transform">CraftID.in</span>,
          we believe <span className="text-red-500 font-extrabold">every artist deserves a stage.</span>
        </motion.p>
        
        <motion.blockquote 
          className="border-l-4 border-red-500 italic text-gray-700 pl-6 py-2 my-8 bg-white rounded-r-lg shadow-sm"
          variants={itemVariants}
        >
          <p className="text-lg md:text-xl">"Every product at CraftID carries a story—
          a story of passion, dedication, and craftsmanship."</p>
        </motion.blockquote>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6"
          variants={itemVariants}
        >
          We empower artists to <span className="font-bold text-blue-500 underline decoration-dotted decoration-blue-300">showcase their work</span>,
          build their profiles, and expand their reach, ensuring they receive the
          <span className="text-red-500 font-bold"> recognition</span> they deserve.
        </motion.p>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6"
          variants={itemVariants}
        >
          Our platform is more than just transactions—it's about
          <span className="text-gray-900 font-semibold"> meaningful connections </span>
          between artists and buyers.
        </motion.p>
        
        <motion.p 
          className="text-xl md:text-2xl font-bold text-gray-900 mb-10 text-center"
          variants={itemVariants}
        >
          Join us in celebrating creativity!
        </motion.p>
        
        <motion.div 
          className="text-center mt-8"
          variants={itemVariants}
        >
          <motion.a
            href="/products"
            className="inline-block font-bold px-8 py-4 text-white bg-red-500 rounded-full shadow-md transition-all"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Explore Unique Crafts
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ➜
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OurMission;