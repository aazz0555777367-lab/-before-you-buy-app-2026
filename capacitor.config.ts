import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.beforeyoubuy.app',
  appName: 'قبل تشتري',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0F172A',
      androidSplashResourceName: 'splash',
      iosSpinnerStyle: 'small',
      spinnerColor: '#3B82F6',
      showSpinner: true,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F172A',
      overlaysWebView: true
    }
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: true,
    backgroundColor: '#0F172A',
    preferredContentMode: 'mobile'
  }
};

export default config;
