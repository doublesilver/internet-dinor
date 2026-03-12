// 인터넷공룡 캐릭터 SVG 컴포넌트 (Figma AI 기반)

interface DinoCharacterProps {
  variant?: 'hero' | 'promo' | 'cta' | '404' | 'loading' | 'sk' | 'kt' | 'lg' | 'sky' | 'hello';
  className?: string;
}

export function DinoCharacter({ variant = 'hero', className = '' }: DinoCharacterProps) {
  const getColor = () => {
    switch (variant) {
      case 'sk': return '#9B59B6';
      case 'kt': return '#3498DB';
      case 'lg': return '#ECF0F1';
      case 'sky': return '#E67E22';
      case 'hello': return '#2980B9';
      default: return '#9B59B6';
    }
  };

  const getWifiIcon = () => (
    <g transform="translate(140, 30)">
      <path
        d="M 0 30 Q -15 15 -30 15 Q -45 15 -60 30 M 0 20 Q -12 8 -30 8 Q -48 8 -60 20 M -15 30 Q -20 25 -30 25 Q -40 25 -45 30"
        fill="none" stroke="#2DC2F1" strokeWidth="4" strokeLinecap="round"
      />
      <circle cx="-30" cy="35" r="5" fill="#2DC2F1" />
    </g>
  );

  if (variant === 'loading') {
    return (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="60" fill={getColor()} opacity="0.3" />
        <path d="M 100 50 Q 80 45 70 60 Q 60 75 65 95 Q 70 115 85 125 Q 100 135 115 125 Q 130 115 135 95 Q 140 75 130 60 Q 120 45 100 50" fill={getColor()} />
        {getWifiIcon()}
      </svg>
    );
  }

  if (variant === '404') {
    return (
      <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="200" cy="280" rx="80" ry="60" fill={getColor()} />
        <ellipse cx="200" cy="180" rx="70" ry="80" fill={getColor()} />
        <circle cx="180" cy="170" r="8" fill="#333" />
        <circle cx="220" cy="170" r="8" fill="#333" />
        <path d="M 180 165 L 175 160 M 220 165 L 225 160" stroke="#333" strokeWidth="3" />
        <ellipse cx="200" cy="210" rx="15" ry="10" fill="#333" opacity="0.5" />
        <g transform="translate(200, 100)">
          <path d="M -20 0 L 20 40 M 20 0 L -20 40" stroke="#ff4444" strokeWidth="5" strokeLinecap="round" />
          <path d="M 0 30 Q -15 15 -30 15 M 0 20 Q -12 8 -30 8" fill="none" stroke="#999" strokeWidth="3" strokeLinecap="round" />
        </g>
        <text x="280" y="140" fontSize="60" fill="#f15c2d">?</text>
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 300 350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50 300 Q 30 280 40 250 Q 45 230 55 220" stroke={getColor()} strokeWidth="20" strokeLinecap="round" fill="none" />
      <ellipse cx="150" cy="250" rx="90" ry="70" fill={getColor()} />
      <ellipse cx="150" cy="150" rx="80" ry="90" fill={getColor()} />
      <path d="M 120 200 L 110 170 L 120 180 M 140 190 L 135 160 L 140 170 M 160 190 L 160 155 L 160 170" fill={getColor()} stroke={getColor()} strokeWidth="3" />
      <circle cx="130" cy="140" r="10" fill="white" />
      <circle cx="170" cy="140" r="10" fill="white" />
      <circle cx="132" cy="142" r="6" fill="#333" />
      <circle cx="172" cy="142" r="6" fill="#333" />
      <path d="M 120 170 Q 150 185 180 170" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="240" rx="15" ry="40" fill={getColor()} transform="rotate(-20 100 240)" />
      <ellipse cx="200" cy="240" rx="15" ry="40" fill={getColor()} transform="rotate(20 200 240)" />
      {variant === 'hero' && (
        <>
          <circle cx="210" cy="200" r="12" fill={getColor()} />
          <path d="M 210 188 L 220 175 M 210 188 L 200 175" stroke={getColor()} strokeWidth="3" />
        </>
      )}
      {variant === 'cta' && (
        <>
          <rect x="180" y="200" width="40" height="60" rx="8" fill="#2DC2F1" />
          <rect x="185" y="205" width="30" height="45" rx="4" fill="white" />
        </>
      )}
      <ellipse cx="120" cy="310" rx="20" ry="35" fill={getColor()} />
      <ellipse cx="180" cy="310" rx="20" ry="35" fill={getColor()} />
      {(variant === 'hero' || variant === 'sk') && getWifiIcon()}
      {variant === 'kt' && (
        <g transform="translate(150, 80)">
          <path d="M -20 0 L -10 -15 L 0 0 M 0 0 L 10 -15 L 20 0" stroke="#2DC2F1" strokeWidth="4" fill="none" />
        </g>
      )}
      {variant === 'lg' && <circle cx="150" cy="80" r="15" fill="#e74c3c" />}
      {variant === 'sky' && <path d="M 130 80 L 150 60 L 170 80 L 150 100 Z" fill="#FFEF0A" />}
      {variant === 'hello' && <text x="135" y="85" fontSize="30">@</text>}
    </svg>
  );
}

export function DinoGroup({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end gap-4 ${className}`}>
      <DinoCharacter variant="sk" className="h-24 w-24" />
      <DinoCharacter variant="kt" className="h-28 w-28" />
      <DinoCharacter variant="lg" className="h-32 w-32" />
      <DinoCharacter variant="sky" className="h-28 w-28" />
      <DinoCharacter variant="hello" className="h-24 w-24" />
    </div>
  );
}
