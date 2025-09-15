// Asset path constants for all PNG files
export const ASSETS = {
  // Main splash screen assets
  splash: require('../../assets/splash.png'),
  logo: require('../../assets/zenzone.png'),
  text: require('../../assets/text.png'),
  bubble: require('../../assets/bubble.png'),
  polygon3: require('../../assets/Polygon3.png'),
  polygon4: require('../../assets/Polygon4.png'),
  
  // Sign-in page assets
  moon: require('../../assets/moon.png'),
  fullcloud: require('../../assets/fullcloud.png'),
  gradient: require('../../assets/gradient.png'),
  welcomeback: require('../../assets/Welcomeback.png'),
  star: require('../../assets/star.png'),
  options: require('../../assets/options.png'),
  zenzonee: require('../../assets/ZenZonee.png'),
  sun: require('../../assets/sun.png'),
  start: require('../../assets/start.png'),
  
  // Home page assets
  home: require('../../assets/home.png'),
  top: require('../../assets/top.png'),
  girl: require('../../assets/girl.jpg'),
  settings: require('../../assets/settings.png'),
  cute: require('../../assets/cute.png'),
  cn: require('../../assets/cn.png'),
  nc: require('../../assets/nc.png'),
  gra: require('../../assets/gra.png'),
  bc: require('../../assets/bc.png'),
  nav: require('../../assets/nav.png'),
  
  // Emotion assets
  happy: require('../../assets/happy.png'),
  sad: require('../../assets/sad.png'),
  angry: require('../../assets/angry.png'),
  cry: require('../../assets/cry.png'),
  depress: require('../../assets/depress.png'),
  
  // Emotion active states
  h1: require('../../assets/h1.png'),
  s1: require('../../assets/s1.png'),
  a1: require('../../assets/a1.png'),
  c1: require('../../assets/c1.png'),
  d1: require('../../assets/d1.png'),
  
  // mountain: require('../../assets/mountain.png'), // Mountain.png - temporarily commented out until file is added
  
  // Additional assets available in the project
  pentagon: require('../../assets/pent.png'),
  group: require('../../assets/Group.png'),
  cloud: require('../../assets/cloud.png'),
  splash2: require('../../assets/Splash2.png'),
  textt: require('../../assets/textt.png'),
  welcome: require('../../assets/Welcome.png'),
} as const;

// Type for asset keys
export type AssetKey = keyof typeof ASSETS;

// Asset loading error types
export interface AssetError {
  asset: AssetKey;
  error: Error;
}