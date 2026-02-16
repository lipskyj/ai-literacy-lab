import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOBILE_SLOTS = [
  { x: 5, y: 3 }, { x: 52, y: 2 }, { x: 8, y: 14 }, { x: 54, y: 13 },
  { x: 5, y: 65 }, { x: 52, y: 63 }, { x: 8, y: 76 }, { x: 54, y: 75 },
  { x: 5, y: 88 }, { x: 52, y: 87 },
];

const DESKTOP_SLOTS = [
  { x: 2, y: 8 }, { x: 20, y: 5 }, { x: 70, y: 6 }, { x: 85, y: 10 },
  { x: 0, y: 30 }, { x: 15, y: 45 }, { x: 75, y: 30 }, { x: 85, y: 48 },
  { x: 2, y: 72 }, { x: 18, y: 80 }, { x: 42, y: 78 }, { x: 68, y: 75 }, { x: 82, y: 82 },
];

const COLOR_MAP = {
  orange: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white border-2 border-orange-300',
  blue: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white border-2 border-blue-300',
  green: 'bg-gradient-to-br from-green-400 to-green-600 text-white border-2 border-green-300',
  purple: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white border-2 border-purple-300',
  red: 'bg-gradient-to-br from-red-400 to-red-600 text-white border-2 border-red-300',
  white: 'bg-white text-gray-800 border-2 border-gray-200',
  gray: 'bg-gray-100 text-gray-800 border-2 border-gray-300',
};

const BubbleField = ({ items, onSelect, settings }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const mobileSlotCount = settings?.mobile_slot_count || 10;
  const desktopSlotCount = settings?.desktop_slot_count || 13;
  const cycleDuration = settings?.cycle_duration || 4000;
  const linkColor = settings?.link_bubble_color || 'orange';
  const regularColor = settings?.regular_bubble_color || 'white';

  const slots = isMobile ? MOBILE_SLOTS.slice(0, mobileSlotCount) : DESKTOP_SLOTS.slice(0, desktopSlotCount);
  const activeSlotCount = Math.min(slots.length, items.length);

  const [slotStates, setSlotStates] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRandomItem = useCallback((exclude) => {
    const available = items.filter(i => !exclude.has(i.id));
    if (available.length === 0) return items[Math.floor(Math.random() * items.length)];
    return available[Math.floor(Math.random() * available.length)];
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return;
    const initial = [];
    const used = new Set();
    for (let i = 0; i < activeSlotCount; i++) {
      const item = getRandomItem(used);
      used.add(item.id);
      initial.push({ item, key: Date.now() + i });
    }
    setSlotStates(initial);
  }, [activeSlotCount, items.length, getRandomItem]);

  useEffect(() => {
    if (slotStates.length === 0 || items.length === 0) return;
    
    const timers = [];
    const staggerDelay = cycleDuration / activeSlotCount;
    const intervals = [];
    
    slotStates.forEach((_, slotIndex) => {
      const initialDelay = slotIndex * staggerDelay;
      
      const timer = setTimeout(() => {
        setSlotStates(prev => {
          const currentIds = new Set(prev.filter(Boolean).map(s => s.item.id));
          const newItem = getRandomItem(currentIds);
          const newStates = [...prev];
          newStates[slotIndex] = { item: newItem, key: Date.now() + slotIndex };
          return newStates;
        });
        
        const interval = setInterval(() => {
          setSlotStates(prev => {
            const currentIds = new Set(prev.filter(Boolean).map(s => s.item.id));
            const newItem = getRandomItem(currentIds);
            const newStates = [...prev];
            newStates[slotIndex] = { item: newItem, key: Date.now() + slotIndex };
            return newStates;
          });
        }, cycleDuration);
        intervals.push(interval);
      }, initialDelay);
      
      timers.push(timer);
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
      intervals.forEach(i => clearInterval(i));
    };
  }, [slotStates.length, getRandomItem, activeSlotCount, cycleDuration, items.length]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {slots.map((slot, slotIndex) => {
        const state = slotStates[slotIndex];
        if (!state) return null;

        const bubbleColor = state.item.link ? COLOR_MAP[linkColor] : COLOR_MAP[regularColor];

        return (
          <div
            key={`slot-${slotIndex}`}
            className="absolute pointer-events-auto"
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              maxWidth: isMobile ? '42%' : '220px',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.button
                key={state.key}
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: -10 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                onClick={() => onSelect(state.item)}
                className={`px-4 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all hover:scale-105 ${bubbleColor}`}
              >
                <span dir="rtl" className="text-xs md:text-sm font-bold leading-snug">
                  {state.item.text}
                </span>
              </motion.button>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default BubbleField;