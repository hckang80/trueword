import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

const greetings = [
  'Hello',
  '안녕하세요',
  'Hola',
  'Bonjour',
  'Guten Tag!',
  '你好',
  'こんにちは',
  'Hallo',
  'مرحبا',
  'Olá',
  'Cześć',
  'Ciao'
];

const textVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.8,
      ease: 'easeIn'
    }
  }
};

export function TextAnimation() {
  const [currentGreeting, setCurrentGreeting] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentGreeting(prevIndex => (prevIndex + 1) % greetings.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <h2 className='text-5xl md:text-7xl font-bold mb-4 text-center'>
      <AnimatePresence mode='wait'>
        <motion.span
          key={currentGreeting}
          variants={textVariants}
          initial='initial'
          animate='animate'
          exit='exit'
        >
          {greetings[currentGreeting]}
        </motion.span>
      </AnimatePresence>
    </h2>
  );
}
