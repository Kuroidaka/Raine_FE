import { motion } from "framer-motion";

export const FadeIn= (p) => {
    const { children, className } = p
    return (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };