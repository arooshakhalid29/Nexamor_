/// <reference types="vite/client" />

declare module 'virtual:hero-mocks' {
  export interface HeroMockAsset {
    src: string;
    filename: string;
    width: number;
    height: number;
  }

  export const HERO_MOCK_IMAGES: HeroMockAsset[];
}
