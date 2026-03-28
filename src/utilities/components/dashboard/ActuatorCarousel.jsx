import React from 'react';
import { motion } from 'framer-motion';
import ActuatorCard from './ActuatorCard';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function ActuatorCarousel({
  actuators,
  onToggleActuatorStatus,
}) {
  return (
    <motion.div
      className='flex w-full gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x'
      style={{ WebkitOverflowScrolling: 'touch' }}
      variants={containerVariants}
      initial='hidden'
      animate='show'
    >
      {actuators.map((actuator) => (
        <motion.div
          key={actuator.id}
          className='snap-start shrink-0 basis-full md:basis-auto min-w-0'
          variants={itemVariants}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          <ActuatorCard
            name={actuator.name}
            status={actuator.status}
            mode={actuator.mode}
            schedule={actuator.schedule}
            onToggle={() => onToggleActuatorStatus(actuator.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
