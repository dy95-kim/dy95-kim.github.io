import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f6f1e8',
        ink: '#132022',
        fridge: '#0f766e',
        freezer: '#2563eb',
        card: '#fffaf1',
        accent: '#f59e0b',
        danger: '#dc2626',
        muted: '#6b7280',
      },
      boxShadow: {
        panel: '0 18px 50px rgba(19, 32, 34, 0.10)',
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          'Noto Sans KR',
          'Apple SD Gothic Neo',
          'Segoe UI',
          'sans-serif',
        ],
        display: [
          'Space Grotesk',
          'Pretendard Variable',
          'Pretendard',
          'Noto Sans KR',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

