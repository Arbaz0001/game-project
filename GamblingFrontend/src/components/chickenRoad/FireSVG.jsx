export const FireSVG = () => (
  <svg width="40" height="80" viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="realFireGrad" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#ffd97d" />
        <stop offset="50%" stopColor="#ff7e00" />
        <stop offset="100%" stopColor="#d40000" />
      </radialGradient>
      <filter id="fireGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M20,80
         C12,60 10,45 14,30
         C8,18 12,8 20,0
         C28,8 32,18 26,30
         C30,45 28,60 20,80 Z"
      fill="url(#realFireGrad)"
      filter="url(#fireGlow)"
    >
      <animate
        attributeName="d"
        dur="1.2s"
        repeatCount="indefinite"
        values="
          M20,80 C12,60 10,45 14,30 C8,18 12,8 20,0 C28,8 32,18 26,30 C30,45 28,60 20,80 Z;
          M20,80 C12,58 8,44 14,28 C10,16 14,6 20,2 C26,6 30,18 28,32 C32,48 28,62 20,80 Z;
          M20,80 C12,60 10,45 14,30 C8,18 12,8 20,0 C28,8 32,18 26,30 C30,45 28,60 20,80 Z
        "
      />
    </path>
  </svg>
);
