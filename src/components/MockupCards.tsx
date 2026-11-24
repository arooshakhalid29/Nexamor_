import type { ReactNode } from 'react';
import { HERO_MOCK_IMAGES, type HeroMockAsset } from 'virtual:hero-mocks';

export { HERO_MOCK_IMAGES, type HeroMockAsset };

export interface UnifiedScatterSlotConfig {
  slotNumber: number;
  leftPct: number;
  topPct: number;
  baseCqw: number;
  band: 'top' | 'left' | 'right' | 'bottom';
  zIndex: number;
  parallaxStrength: number;
  floatAmpPx: number;
  floatDurationSec: number;
  showOnTablet: boolean;
  showOnPhone: boolean;
}

export const HERO_SCATTER_SLOTS: UnifiedScatterSlotConfig[] = [
  {
    slotNumber: 1,
    leftPct: 8,
    topPct: 5,
    baseCqw: 10,
    band: 'top',
    zIndex: 1,
    parallaxStrength: 7,
    floatAmpPx: 4,
    floatDurationSec: 9.2,
    showOnTablet: true,
    showOnPhone: true,
  },
  {
    slotNumber: 2,
    leftPct: 27,
    topPct: 12,
    baseCqw: 9,
    band: 'top',
    zIndex: 2,
    parallaxStrength: 5,
    floatAmpPx: 3.5,
    floatDurationSec: 11.4,
    showOnTablet: false,
    showOnPhone: false,
  },
  {
    slotNumber: 3,
    leftPct: 45,
    topPct: 4,
    baseCqw: 10,
    band: 'top',
    zIndex: 3,
    parallaxStrength: 6,
    floatAmpPx: 4,
    floatDurationSec: 10.2,
    showOnTablet: true,
    showOnPhone: true,
  },
  {
    slotNumber: 4,
    leftPct: 63,
    topPct: 11,
    baseCqw: 9,
    band: 'top',
    zIndex: 4,
    parallaxStrength: 5,
    floatAmpPx: 3.5,
    floatDurationSec: 11.8,
    showOnTablet: false,
    showOnPhone: false,
  },
  {
    slotNumber: 5,
    leftPct: 80,
    topPct: 5,
    baseCqw: 10,
    band: 'top',
    zIndex: 5,
    parallaxStrength: 7,
    floatAmpPx: 4.5,
    floatDurationSec: 8.8,
    showOnTablet: true,
    showOnPhone: true,
  },
  {
    slotNumber: 6,
    leftPct: 3,
    topPct: 34,
    baseCqw: 9,
    band: 'left',
    zIndex: 6,
    parallaxStrength: 8,
    floatAmpPx: 4,
    floatDurationSec: 12.1,
    showOnTablet: true,
    showOnPhone: false,
  },
  {
    slotNumber: 7,
    leftPct: 89,
    topPct: 32,
    baseCqw: 9,
    band: 'right',
    zIndex: 7,
    parallaxStrength: 8,
    floatAmpPx: 4,
    floatDurationSec: 9.7,
    showOnTablet: true,
    showOnPhone: false,
  },
  {
    slotNumber: 8,
    leftPct: 5,
    topPct: 62,
    baseCqw: 10,
    band: 'bottom',
    zIndex: 8,
    parallaxStrength: 7,
    floatAmpPx: 4,
    floatDurationSec: 10.6,
    showOnTablet: true,
    showOnPhone: true,
  },
  {
    slotNumber: 9,
    leftPct: 23,
    topPct: 72,
    baseCqw: 9,
    band: 'bottom',
    zIndex: 9,
    parallaxStrength: 5,
    floatAmpPx: 3.5,
    floatDurationSec: 9.5,
    showOnTablet: false,
    showOnPhone: false,
  },
  {
    slotNumber: 10,
    leftPct: 42,
    topPct: 77,
    baseCqw: 10,
    band: 'bottom',
    zIndex: 10,
    parallaxStrength: 6,
    floatAmpPx: 4,
    floatDurationSec: 12.4,
    showOnTablet: true,
    showOnPhone: true,
  },
  {
    slotNumber: 11,
    leftPct: 60,
    topPct: 71,
    baseCqw: 9,
    band: 'bottom',
    zIndex: 11,
    parallaxStrength: 5,
    floatAmpPx: 3.5,
    floatDurationSec: 11.1,
    showOnTablet: false,
    showOnPhone: false,
  },
  {
    slotNumber: 12,
    leftPct: 78,
    topPct: 74,
    baseCqw: 10,
    band: 'bottom',
    zIndex: 12,
    parallaxStrength: 7,
    floatAmpPx: 4,
    floatDurationSec: 8.9,
    showOnTablet: true,
    showOnPhone: true,
  },
  {
    slotNumber: 13,
    leftPct: 90,
    topPct: 56,
    baseCqw: 9,
    band: 'right',
    zIndex: 13,
    parallaxStrength: 8,
    floatAmpPx: 4.5,
    floatDurationSec: 10.9,
    showOnTablet: true,
    showOnPhone: false,
  },
];

export function renderFallbackShapePreview(index: number): ReactNode {
  const variant = index % 6;

  if (variant === 0) {
    return (
      <div className="flex h-full w-full flex-col justify-between bg-bg p-2">
        <div className="flex items-center justify-between border-b border-border pb-1">
          <span className="h-1 w-4 rounded-full bg-text" />
          <span className="h-1.5 w-3 rounded-[2px] bg-btn-primary-bg" />
        </div>
        <div className="my-auto flex flex-col items-center gap-1">
          <span className="h-1 w-4 rounded-full bg-accent" />
          <span className="h-2 w-10 rounded-[1px] bg-text" />
          <span className="h-1 w-8 rounded-full bg-muted/40" />
          <span className="mt-0.5 h-2 w-6 rounded-[2px] bg-btn-primary-bg" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="h-6 border border-border bg-surface-alt" />
          <div className="h-6 border border-border bg-surface-alt" />
        </div>
      </div>
    );
  }

  if (variant === 1) {
    return (
      <div className="flex h-full w-full flex-col justify-between bg-surface p-2">
        <div className="flex items-center justify-between">
          <span className="h-1 w-5 rounded-full bg-text" />
          <span className="h-1.5 w-3 rounded-[2px] bg-accent" />
        </div>
        <div className="space-y-1">
          <span className="block h-2 w-full bg-text" />
          <span className="block h-1.5 w-3/4 bg-text" />
          <span className="block h-1 w-4/5 bg-muted/40" />
        </div>
        <div className="h-10 border border-border bg-surface-alt" />
        <div className="grid grid-cols-2 gap-1">
          <div className="h-5 border border-border bg-bg" />
          <div className="h-5 border border-border bg-bg" />
        </div>
      </div>
    );
  }

  if (variant === 2) {
    return (
      <div className="flex h-full w-full flex-col bg-bg">
        <div className="space-y-1 bg-text p-2">
          <span className="block h-1 w-5 rounded-full bg-surface" />
          <span className="mt-1 block h-2 w-10 bg-surface" />
          <span className="block h-1.5 w-6 bg-accent" />
        </div>
        <div className="flex flex-1 flex-col justify-between p-2">
          <div className="h-7 border border-border bg-surface" />
          <div className="h-7 border border-border bg-surface-alt" />
        </div>
      </div>
    );
  }

  if (variant === 3) {
    return (
      <div className="flex h-full w-full flex-col justify-between bg-surface p-2">
        <div className="flex items-center justify-between border-b border-border pb-1">
          <span className="h-1 w-5 bg-text" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </div>
        <div className="h-9 border border-border bg-surface-alt" />
        <div className="space-y-1.5">
          <div className="h-3 border border-border bg-bg" />
          <div className="h-3 border border-border bg-bg" />
          <div className="h-3 border border-accent bg-bg" />
        </div>
      </div>
    );
  }

  if (variant === 4) {
    return (
      <div className="flex h-full w-full flex-col justify-between bg-bg p-2">
        <div className="flex items-center justify-between">
          <span className="h-1 w-4 bg-text" />
          <span className="h-1.5 w-4 bg-btn-primary-bg" />
        </div>
        <div className="space-y-1">
          <span className="block h-2 w-11 bg-text" />
          <span className="block h-1 w-8 bg-muted/45" />
          <span className="block h-2 w-7 bg-accent" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="h-8 border border-border bg-surface" />
          <div className="h-8 border border-border bg-surface-alt" />
          <div className="h-8 border border-border bg-surface-alt" />
          <div className="h-8 border border-border bg-surface" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between bg-surface p-2">
      <div className="flex items-center justify-between border-b border-border pb-1">
        <span className="h-1 w-6 bg-text" />
        <span className="h-1.5 w-4 bg-accent" />
      </div>
      <div className="h-12 border border-border bg-surface-alt p-1.5">
        <span className="block h-1.5 w-8 bg-text" />
        <span className="mt-1 block h-1 w-6 bg-muted/50" />
      </div>
      <div className="space-y-1">
        <span className="block h-1.5 w-full bg-border" />
        <span className="block h-1.5 w-5/6 bg-border" />
        <span className="block h-2 w-8 bg-btn-primary-bg" />
      </div>
    </div>
  );
}
