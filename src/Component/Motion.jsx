import { motion } from "framer-motion";

export const FadeIn= (p) => {
    const { children, className } = p
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };