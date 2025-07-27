import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ef14bffad7c242c7b52b8010d3413bbb',
  appName: 'subconscious-muse',
  webDir: 'dist',
  server: {
    url: 'https://ef14bffa-d7c2-42c7-b52b-8010d3413bbb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;