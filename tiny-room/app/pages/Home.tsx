import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/pages/Home.scss';
import SectionNavigator from '../components/SectionNavigator';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const totalSections = 3;
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToSection = useCallback(
    (direction: 'up' | 'down') => {
      if (isScrolling) return;

      setIsScrolling(true);
      setCurrentSection(prev => {
        if (direction === 'up') {
          return Math.max(0, prev - 1);
        } else {
          return Math.min(totalSections - 1, prev + 1);
        }
      });

      // 防抖：等待动画完成后才能继续滚动
      setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    },
    [isScrolling, totalSections]
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        scrollToSection('down');
      } else {
        scrollToSection('up');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSection('down');
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection('up');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollToSection]);

  const sections = [
    {
      id: 0,
      content: (
        <>
          <h1>Tiny Room</h1>
        </>
      ),
    },
    {
      id: 1,
      content: (
        <>
          <h2 className="text-4xl font-bold mb-4">What I Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 bg-white/10 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Frontend Development</h3>
              <p>Creating responsive and interactive web applications with modern technologies.</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">UI/UX Design</h3>
              <p>Designing intuitive and beautiful user interfaces with attention to detail.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 2,
      content: (
        <>
          <h2 className="text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            I'm always interested in hearing about new projects and opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="mailto:your.email@example.com"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition-colors"
            >
              Contact Me
            </a>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="home-container">
      <div
        className="sections-wrapper"
        style={{ transform: `translateY(-${currentSection * 100}vh)` }}
      >
        {sections.map(section => (
          <motion.section
            key={section.id}
            className="home-section"
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentSection === section.id ? 1 : 0.3,
              scale: currentSection === section.id ? 1 : 0.95,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="section-content">{section.content}</div>
          </motion.section>
        ))}
      </div>
      <SectionNavigator
        sections={sections}
        currentSection={currentSection}
        isScrolling={isScrolling}
        onSelectSection={id => {
          setIsScrolling(true);
          setCurrentSection(id);
          setTimeout(() => setIsScrolling(false), 500);
        }}
      />
    </div>
  );
}
