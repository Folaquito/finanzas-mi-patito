export default function Patito({ size = 80, stage = 2, mood = 'happy', animate = false }) {
  const body = stage === 1 ? '#fff8db' : stage === 4 ? '#FFD23F' : '#FFE89A';
  const accent = stage === 4 ? '#E89F00' : '#FFB800';
  const beak = '#FF8A3D';
  const ink = '#2d2a26';

  if (stage === 1) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={animate ? 'patito-bob' : undefined}
        aria-hidden="true"
      >
        <ellipse cx="55" cy="93" rx="22" ry="3" fill="rgba(0,0,0,.08)" />
        <ellipse cx="50" cy="55" rx="28" ry="36" fill={body} stroke={ink} strokeWidth="2" />
        <circle cx="40" cy="50" r="2" fill={accent} opacity=".7" />
        <circle cx="58" cy="42" r="1.5" fill={accent} opacity=".7" />
        <circle cx="48" cy="68" r="1.8" fill={accent} opacity=".7" />
        {mood === 'happy' && (
          <>
            <circle cx="42" cy="60" r="1.5" fill={ink} />
            <circle cx="58" cy="60" r="1.5" fill={ink} />
            <path
              d="M44 70 Q 50 74 56 70"
              stroke={ink}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    );
  }

  const headR = stage === 2 ? 19 : 22;
  const headY = stage === 2 ? 38 : 36;
  const bodyRX = stage === 2 ? 26 : 32;
  const bodyRY = stage === 2 ? 22 : 26;
  const bodyY = stage === 2 ? 64 : 62;

  const eyes = {
    happy: (
      <>
        <circle cx={50 - 5} cy={headY - 2} r="3.2" fill={ink} />
        <circle cx={50 + 5} cy={headY - 2} r="3.2" fill={ink} />
        <circle cx={50 - 4.2} cy={headY - 3} r="1" fill="#fff" />
        <circle cx={50 + 5.8} cy={headY - 3} r="1" fill="#fff" />
      </>
    ),
    content: (
      <>
        <path
          d={`M${50 - 8} ${headY - 2} Q${50 - 5} ${headY - 5} ${50 - 2} ${headY - 2}`}
          stroke={ink}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M${50 + 2} ${headY - 2} Q${50 + 5} ${headY - 5} ${50 + 8} ${headY - 2}`}
          stroke={ink}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
    worried: (
      <>
        <circle cx={50 - 5} cy={headY - 1} r="2.8" fill={ink} />
        <circle cx={50 + 5} cy={headY - 1} r="2.8" fill={ink} />
        <path
          d={`M${50 - 9} ${headY - 7} L${50 - 2} ${headY - 5}`}
          stroke={ink}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d={`M${50 + 9} ${headY - 7} L${50 + 2} ${headY - 5}`}
          stroke={ink}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
    sad: (
      <>
        <path
          d={`M${50 - 8} ${headY - 2} Q${50 - 5} ${headY + 1} ${50 - 2} ${headY - 2}`}
          stroke={ink}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M${50 + 2} ${headY - 2} Q${50 + 5} ${headY + 1} ${50 + 8} ${headY - 2}`}
          stroke={ink}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={50 - 8} cy={headY + 5} r="1.5" fill="#3D8BFF" />
      </>
    ),
    sleepy: (
      <>
        <path
          d={`M${50 - 8} ${headY - 2} Q${50 - 5} ${headY} ${50 - 2} ${headY - 2}`}
          stroke={ink}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M${50 + 2} ${headY - 2} Q${50 + 5} ${headY} ${50 + 8} ${headY - 2}`}
          stroke={ink}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
    celebrate: (
      <>
        <path
          d={`M${50 - 8} ${headY - 3} L${50 - 2} ${headY - 3}`}
          stroke={ink}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d={`M${50 + 2} ${headY - 3} L${50 + 8} ${headY - 3}`}
          stroke={ink}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d={`M${50 - 8} ${headY + 1} Q${50} ${headY + 3} ${50 - 2} ${headY + 1}`}
          stroke={ink}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M${50 + 2} ${headY + 1} Q${50 + 8} ${headY + 3} ${50 + 8} ${headY + 1}`}
          stroke={ink}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
    thinking: (
      <>
        <circle cx={50 - 5} cy={headY - 2} r="3" fill={ink} />
        <circle cx={50 + 5} cy={headY - 2} r="3" fill={ink} />
        <circle cx={50 - 4} cy={headY - 3} r="1" fill="#fff" />
        <circle cx={50 + 6} cy={headY - 3} r="1" fill="#fff" />
        <text x="62" y={headY - 12} fontSize="14" fill={ink} fontFamily="var(--font-sans)">
          ?
        </text>
      </>
    ),
  }[mood];

  const mouth =
    mood === 'celebrate' ? (
      <path
        d={`M${50 - 6} ${headY + 8} Q${50} ${headY + 13} ${50 + 6} ${headY + 8}`}
        stroke={ink}
        strokeWidth="2"
        fill="#fff"
        strokeLinecap="round"
      />
    ) : null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={animate ? 'patito-bob' : undefined}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="93" rx="28" ry="3" fill="rgba(0,0,0,.08)" />
      <path
        d={`M40 ${bodyY + 22} L38 ${bodyY + 30} M44 ${bodyY + 22} L46 ${bodyY + 30}`}
        stroke={beak}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d={`M56 ${bodyY + 22} L54 ${bodyY + 30} M60 ${bodyY + 22} L62 ${bodyY + 30}`}
        stroke={beak}
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <ellipse
        cx="50"
        cy={bodyY}
        rx={bodyRX}
        ry={bodyRY}
        fill={body}
        stroke={ink}
        strokeWidth="2.5"
      />
      <ellipse cx="50" cy={bodyY + 4} rx={bodyRX - 8} ry={bodyRY - 6} fill="#fff" opacity=".5" />
      <path
        d={`M${50 - bodyRX + 10} ${bodyY - 2} Q ${50 - bodyRX + 18} ${bodyY + 10} ${50 - bodyRX + 24} ${bodyY + 12} Q ${50 - bodyRX + 18} ${bodyY + 18} ${50 - bodyRX + 8} ${bodyY + 12} Z`}
        fill={accent}
        stroke={ink}
        strokeWidth="2"
      />

      <circle cx="50" cy={headY} r={headR} fill={body} stroke={ink} strokeWidth="2.5" />
      <ellipse cx={50 - 7} cy={headY - 7} rx="6" ry="3" fill="#fff" opacity=".55" />

      {(mood === 'happy' || mood === 'celebrate' || mood === 'content') && (
        <>
          <ellipse cx={50 - 12} cy={headY + 4} rx="3" ry="2" fill="#FF9CA0" opacity=".7" />
          <ellipse cx={50 + 12} cy={headY + 4} rx="3" ry="2" fill="#FF9CA0" opacity=".7" />
        </>
      )}

      {eyes}
      {mouth}

      <path
        d={`M${50 - 7} ${headY + 5} Q ${50} ${headY + 11} ${50 + 7} ${headY + 5} Q ${50} ${headY + 8} ${50 - 7} ${headY + 5} Z`}
        fill={beak}
        stroke={ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {stage >= 3 && (
        <path
          d={`M${50 - 3} ${headY - headR - 1} Q${50} ${headY - headR - 7} ${50 + 3} ${headY - headR - 1}`}
          stroke={ink}
          strokeWidth="2.5"
          fill={accent}
          strokeLinecap="round"
        />
      )}

      {stage === 4 && (
        <g>
          <path
            d={`M${50 - 14} ${headY - headR - 2} L${50 - 10} ${headY - headR - 12} L${50 - 5} ${headY - headR - 4} L${50} ${headY - headR - 14} L${50 + 5} ${headY - headR - 4} L${50 + 10} ${headY - headR - 12} L${50 + 14} ${headY - headR - 2} Z`}
            fill="#FFD23F"
            stroke={ink}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="50" cy={headY - headR - 9} r="1.5" fill="#E5564B" />
        </g>
      )}
    </svg>
  );
}
