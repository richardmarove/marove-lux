export const theme = {
  colors: {
    surface: '#0D0D0F', // App background
    surfaceElevated: '#1A1A1F', // Cards, modals
    surfacePressed: '#252530', // Active state
    accent: '#C9A96E', // Warm antique gold
    accentMuted: '#8A7444', // Subtle borders
    textPrimary: '#F0EDE5', // Main text
    textSecondary: '#7A7780', // Captions
    success: '#5DB075', // Got It
    danger: '#D4654A', // Delete
    tryAgain: '#E0A858', // Try Again
    transparent: 'transparent',
  },
  typography: {
    fonts: {
      heading: 'PlayfairDisplay_600SemiBold',
      body: 'DMSans_400Regular',
      bodyMedium: 'DMSans_500Medium',
      bodyBold: 'DMSans_700Bold',
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  borderRadius: {
    sm: 8, // Buttons
    md: 12, // Cards
    lg: 24, // Pills
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};
