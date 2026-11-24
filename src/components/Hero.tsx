import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  HERO_MOCK_IMAGES,
  HERO_SCATTER_SLOTS,
  renderFallbackShapePreview,
  type HeroMockAsset,
  type UnifiedScatterSlotConfig,
} from './MockupCards';

const WORDMARK_LETTERS = ['N', 'e', 'x', 'a', 'm', 'o', 'r'];
const EAGER_LOAD_LIMIT = 6;
const ROTATION_INTERVAL_MS = 5000;

type ViewportMode = 'phone' | 'tablet' | 'desktop';

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getCenterOffset(slot: UnifiedScatterSlotConfig): { x: number; y: number } {
  const dx = 50 - slot.leftPct;
  const dy = 50 - slot.topPct;
  const distance = Math.hypot(dx, dy) || 1;
  return {
    x: Math.round((dx / distance) * 22),
    y: Math.round((dy / distance) * 22),
  };
}

function getCardWidthExpression(
  slot: UnifiedScatterSlotConfig,
  widthMultiplier: number
): string {
  const targetCqw = `${Number((slot.baseCqw * widthMultiplier).toFixed(2))}cqw`;
  const rightCap = `calc(${100 - slot.leftPct}cqw - 8px)`;
  const bottomCap = `calc((((98.8 - ${slot.topPct}) * (100svh - 4rem) / 100) - 4px) / 1.7)`;

  const caps = [targetCqw, rightCap, bottomCap];

  if (slot.band === 'top') {
    caps.push(`calc(((28 - ${slot.topPct}) * (100svh - 4rem) / 100) / 1.7)`);
  }
  if (slot.slotNumber === 6) {
    caps.push(`calc((((62 - 34) * (100svh - 4rem) / 100) - 24px) / 1.7)`);
  }
  if (slot.slotNumber === 7) {
    caps.push(`calc((((56 - 32) * (100svh - 4rem) / 100) - 24px) / 1.7)`);
  }
  if (slot.slotNumber === 12 && widthMultiplier <= 1.2) {
    caps.push('calc(12cqw - 20px)');
  }

  return `min(${caps.join(', ')})`;
}

function getTransformOrigin(slot: UnifiedScatterSlotConfig): string {
  const horiz = slot.leftPct <= 10 ? 'left' : slot.leftPct >= 78 ? 'right' : 'center';
  const vert =
    slot.band === 'top' ? 'top' : slot.band === 'bottom' ? 'bottom' : 'center';
  return `${vert} ${horiz}`;
}

interface ScatterCardProps {
  slot: UnifiedScatterSlotConfig;
  slotIndex: number;
  widthMultiplier: number;
  viewportMode: ViewportMode;
  image: HeroMockAsset | null;
  isInitialEager: boolean;
  entranceOrderIndex: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isTouchDevice: boolean;
  isTouchActive: boolean;
  prefersReducedMotion: boolean;
  onTapSelect: (slotIndex: number) => void;
  onHoverPauseChange: (slotIndex: number, paused: boolean) => void;
}

function ScatterCard({
  slot,
  slotIndex,
  widthMultiplier,
  viewportMode,
  image,
  isInitialEager,
  entranceOrderIndex,
  mouseX,
  mouseY,
  isTouchDevice,
  isTouchActive,
  prefersReducedMotion,
  onTapSelect,
  onHoverPauseChange,
}: ScatterCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasEntered, setHasEntered] = useState(prefersReducedMotion);

  const isDesktop = viewportMode === 'desktop';
  const useHoverInteraction = isDesktop && !isTouchDevice;
  const enableParallax = isDesktop && !prefersReducedMotion && !isTouchDevice;

  const parallaxX = useTransform(
    mouseX,
    [-1, 1],
    enableParallax ? [-slot.parallaxStrength, slot.parallaxStrength] : [0, 0]
  );
  const parallaxY = useTransform(
    mouseY,
    [-1, 1],
    enableParallax
      ? [-slot.parallaxStrength * 0.85, slot.parallaxStrength * 0.85]
      : [0, 0]
  );

  const isActive = useHoverInteraction ? isHovered : isTouchActive;
  const shouldZoom = !prefersReducedMotion && isActive;
  const targetScale = isDesktop ? 1.25 : 1.18;

  useEffect(() => {
    onHoverPauseChange(slotIndex, isActive);
  }, [isActive, onHoverPauseChange, slotIndex]);

  const { x: startX, y: startY } = getCenterOffset(slot);
  const entranceDelay = 0.42 + entranceOrderIndex * 0.09;
  const shouldFloat = !prefersReducedMotion && !isActive;

  const cardWidthExpr = getCardWidthExpression(slot, widthMultiplier);
  const transformOrigin = getTransformOrigin(slot);

  const floatKeyframesY =
    slot.band === 'bottom'
      ? [0, slot.floatAmpPx, 0]
      : [0, -slot.floatAmpPx, 0];

  return (
    <motion.div
      aria-hidden="true"
      className="absolute cursor-default select-none"
      style={{
        left: `${slot.leftPct}%`,
        top: `${slot.topPct}%`,
        width: cardWidthExpr,
        aspectRatio: '1 / 1.7',
        zIndex: isActive ? 20 : slot.zIndex,
        ...(enableParallax ? { x: parallaxX, y: parallaxY } : {}),
      }}
    >
      <motion.div
        onMouseEnter={() => {
          if (useHoverInteraction) setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (useHoverInteraction) setIsHovered(false);
        }}
        onClick={(event) => {
          if (useHoverInteraction) return;
          event.stopPropagation();
          onTapSelect(slotIndex);
        }}
        className="relative block h-full w-full cursor-default select-none"
        style={{ transformOrigin }}
        initial={
          prefersReducedMotion
            ? false
            : { opacity: 0, x: startX, y: startY, scale: 0.96, rotate: 0 }
        }
        animate={
          shouldZoom
            ? { opacity: 1, x: 0, y: 0, scale: targetScale, rotate: 0 }
            : { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
        }
        transition={
          shouldZoom || hasEntered
            ? { duration: prefersReducedMotion ? 0 : 0.3, ease: [0, 0, 0.2, 1] }
            : prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.8, delay: entranceDelay, ease: [0.16, 1, 0.3, 1] }
        }
        onAnimationComplete={() => {
          if (!hasEntered) setHasEntered(true);
        }}
      >
        <motion.div
          className="h-full w-full overflow-hidden rounded-[2px] border border-border bg-surface transition-shadow duration-300 ease-out"
          style={{
            boxShadow: isActive
              ? '0 12px 30px rgba(0, 0, 0, 0.16)'
              : '0 3px 12px rgba(0, 0, 0, 0.1)',
          }}
          animate={shouldFloat ? { y: floatKeyframesY } : { y: 0 }}
          transition={
            shouldFloat
              ? {
                  y: {
                    duration: slot.floatDurationSec,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: entranceDelay + 0.8,
                  },
                }
              : { duration: 0 }
          }
        >
          <div className="relative h-full w-full overflow-hidden bg-surface-alt">
            {image ? (
              <AnimatePresence initial={false} mode="sync">
                <motion.img
                  key={image.src}
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  loading={isInitialEager ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.6, ease: 'easeInOut' }
                  }
                  className="absolute inset-0 block h-full w-full max-w-none object-cover object-top"
                />
              </AnimatePresence>
            ) : (
              renderFallbackShapePreview(slotIndex)
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function getViewportMode(): ViewportMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'desktop';
  if (window.matchMedia('(max-width: 699px)').matches) return 'phone';
  if (window.matchMedia('(max-width: 1099px)').matches) return 'tablet';
  return 'desktop';
}

export default function Hero() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [viewportMode, setViewportMode] = useState<ViewportMode>(getViewportMode);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeTouchSlot, setActiveTouchSlot] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mqPhone = window.matchMedia('(max-width: 699px)');
    const mqTablet = window.matchMedia('(min-width: 700px) and (max-width: 1099px)');
    const mqHover = window.matchMedia('(hover: hover) and (pointer: fine)');

    const update = () => {
      if (mqPhone.matches) setViewportMode('phone');
      else if (mqTablet.matches) setViewportMode('tablet');
      else setViewportMode('desktop');
      setIsTouchDevice(!mqHover.matches);
      setActiveTouchSlot(null);
    };

    update();
    mqPhone.addEventListener('change', update);
    mqTablet.addEventListener('change', update);
    mqHover.addEventListener('change', update);
    return () => {
      mqPhone.removeEventListener('change', update);
      mqTablet.removeEventListener('change', update);
      mqHover.removeEventListener('change', update);
    };
  }, []);

  const totalImages = HERO_MOCK_IMAGES.length;

  const activeSlots = useMemo(() => {
    if (viewportMode === 'phone') {
      return HERO_SCATTER_SLOTS.filter((slot) => slot.showOnPhone);
    }
    if (viewportMode === 'tablet') {
      return HERO_SCATTER_SLOTS.filter((slot) => slot.showOnTablet);
    }
    return HERO_SCATTER_SLOTS;
  }, [viewportMode]);

  const widthMultiplier =
    viewportMode === 'phone' ? 1.72 : viewportMode === 'tablet' ? 1.17 : 0.78;

  const entranceOrderMap = useMemo(() => {
    const order = shuffleArray(activeSlots.map((_, index) => index));
    const map = new Map<number, number>();
    order.forEach((slotIdx, seqIdx) => {
      map.set(slotIdx, seqIdx);
    });
    return map;
  }, [activeSlots]);

  const [cardImageIndices, setCardImageIndices] = useState<number[]>(() =>
    activeSlots.map((_, index) => index)
  );
  const [swappedSlots, setSwappedSlots] = useState<Set<number>>(() => new Set());

  const cardImagesRef = useRef<number[]>(cardImageIndices);
  const pausedSlotsRef = useRef<Set<number>>(new Set());
  const slotRotationOrderRef = useRef<number[]>([]);
  const slotPointerRef = useRef<number>(0);
  const unusedQueueRef = useRef<number[]>([]);

  // Reset image assignment cleanly whenever breakpoint slot count changes
  useEffect(() => {
    const initial = activeSlots.map((_, index) => index);
    cardImagesRef.current = initial;
    setCardImageIndices(initial);
    setSwappedSlots(new Set());
    pausedSlotsRef.current.clear();
    slotRotationOrderRef.current = shuffleArray(
      activeSlots.map((_, index) => index)
    );
    slotPointerRef.current = 0;
    unusedQueueRef.current =
      totalImages > activeSlots.length
        ? shuffleArray(
            Array.from(
              { length: totalImages - activeSlots.length },
              (_, idx) => idx + activeSlots.length
            )
          )
        : [];
  }, [activeSlots, totalImages]);

  // Smooth cursor parallax (desktop only)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 75, damping: 22, mass: 0.65 });
  const smoothY = useSpring(rawY, { stiffness: 75, damping: 22, mass: 0.65 });

  useEffect(() => {
    const resetMouse = () => {
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener('blur', resetMouse);
    return () => window.removeEventListener('blur', resetMouse);
  }, [rawX, rawY]);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (viewportMode !== 'desktop' || prefersReducedMotion || isTouchDevice) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(nx);
    rawY.set(ny);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const handlePauseChange = (slotIndex: number, paused: boolean) => {
    if (paused) {
      pausedSlotsRef.current.add(slotIndex);
    } else {
      pausedSlotsRef.current.delete(slotIndex);
    }
  };

  const handleTapSelect = (slotIndex: number) => {
    setActiveTouchSlot((prev) => (prev === slotIndex ? null : slotIndex));
  };

  // Preload next unused image cleanly
  useEffect(() => {
    if (prefersReducedMotion || totalImages <= activeSlots.length) return;
    const nextIdx = unusedQueueRef.current[0];
    if (nextIdx === undefined) return;
    const nextAsset = HERO_MOCK_IMAGES[nextIdx];
    if (!nextAsset) return;
    const preloader = new Image();
    preloader.src = nextAsset.src;
  }, [activeSlots.length, cardImageIndices, prefersReducedMotion, totalImages]);

  // Cycle unused images every 5s in shuffled order with zero duplicates
  useEffect(() => {
    if (prefersReducedMotion || totalImages <= activeSlots.length) return;

    const timer = window.setInterval(() => {
      const pausedSet = pausedSlotsRef.current;

      let targetSlot: number | null = null;
      for (let attempt = 0; attempt < activeSlots.length; attempt += 1) {
        if (slotPointerRef.current >= slotRotationOrderRef.current.length) {
          slotRotationOrderRef.current = shuffleArray(
            activeSlots.map((_, idx) => idx)
          );
          slotPointerRef.current = 0;
        }
        const candidate = slotRotationOrderRef.current[slotPointerRef.current];
        slotPointerRef.current += 1;
        if (!pausedSet.has(candidate)) {
          targetSlot = candidate;
          break;
        }
      }

      if (targetSlot === null) return;

      const currentCards = cardImagesRef.current;

      if (unusedQueueRef.current.length === 0) {
        const offscreenPool = Array.from(
          { length: totalImages },
          (_, idx) => idx
        ).filter((idx) => !currentCards.includes(idx));
        unusedQueueRef.current = shuffleArray(offscreenPool);
      }

      const nextImageIndex = unusedQueueRef.current.shift();
      if (nextImageIndex === undefined) return;

      const nextCards = [...currentCards];
      nextCards[targetSlot] = nextImageIndex;
      cardImagesRef.current = nextCards;

      setCardImageIndices(nextCards);
      setSwappedSlots((prev) => {
        if (prev.has(targetSlot)) return prev;
        const nextSet = new Set(prev);
        nextSet.add(targetSlot);
        return nextSet;
      });
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [activeSlots, prefersReducedMotion, totalImages]);

  return (
    <section
      aria-label="Nexamor hero showcase"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (activeTouchSlot !== null) setActiveTouchSlot(null);
      }}
      className="relative h-[calc(100svh-4rem)] min-h-[calc(100svh-4rem)] w-full overflow-hidden bg-bg"
      style={{ containerType: 'inline-size' }}
    >
      {/* Unified cqw-scaled scatter cards */}
      <div className="absolute inset-0">
        {activeSlots.map((slot, slotIndex) => {
          const imgIndex = cardImageIndices[slotIndex] ?? slotIndex;
          const image =
            totalImages > 0
              ? HERO_MOCK_IMAGES[imgIndex % totalImages] ?? null
              : null;
          const isInitialEager =
            slotIndex < EAGER_LOAD_LIMIT && !swappedSlots.has(slotIndex);

          return (
            <ScatterCard
              key={`${viewportMode}-${slot.slotNumber}`}
              slot={slot}
              slotIndex={slotIndex}
              widthMultiplier={widthMultiplier}
              viewportMode={viewportMode}
              image={image}
              isInitialEager={isInitialEager}
              entranceOrderIndex={entranceOrderMap.get(slotIndex) ?? slotIndex}
              mouseX={smoothX}
              mouseY={smoothY}
              isTouchDevice={isTouchDevice}
              isTouchActive={activeTouchSlot === slotIndex}
              prefersReducedMotion={prefersReducedMotion}
              onTapSelect={handleTapSelect}
              onHoverPauseChange={handlePauseChange}
            />
          );
        })}
      </div>

      {/* Centered wordmark & taglines above all cards inside clear middle band */}
      <div className="pointer-events-none absolute inset-x-0 top-[49%] z-30 -translate-y-1/2 px-4 text-center sm:px-6">
        <h1
          aria-label="Nexamor"
          className="mx-auto font-display font-extrabold tracking-[-0.045em] leading-[0.98] text-text whitespace-nowrap"
          style={{ fontSize: 'clamp(48px, 11vw, 150px)' }}
        >
          <span className="sr-only">Nexamor</span>
          <span aria-hidden="true" className="inline-flex items-baseline justify-center">
            {WORDMARK_LETTERS.map((letter, idx) => (
              <span
                key={`${letter}-${idx}`}
                className="inline-block overflow-hidden align-bottom py-[0.04em]"
              >
                <motion.span
                  className="inline-block"
                  initial={
                    prefersReducedMotion
                      ? false
                      : { y: '40%', opacity: 0 }
                  }
                  animate={{ y: '0%', opacity: 1 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.45,
                          delay: idx * 0.06,
                          ease: [0, 0, 0.2, 1],
                        }
                  }
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: 0.4,
                  delay: 0.42,
                  ease: [0, 0, 0.2, 1],
                }
          }
          className="mx-auto mt-3 max-w-xl leading-snug text-muted"
          style={{
            fontSize: 'clamp(15px, 1.6vw, 22px)',
            textWrap: 'balance',
          }}
        >
          A <span className="font-semibold text-text">$500</span> website, live in{' '}
          <span className="font-semibold text-text">48 hours</span>.
        </motion.p>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: 0.4,
                  delay: 0.5,
                  ease: [0, 0, 0.2, 1],
                }
          }
          className="mx-auto mt-1.5 max-w-xl leading-snug text-muted"
          style={{
            fontSize: 'clamp(15px, 1.6vw, 22px)',
            textWrap: 'balance',
          }}
        >
          A website that works as hard as you do.
        </motion.p>
      </div>
    </section>
  );
}
