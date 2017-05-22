import React from 'react';
import Back from '../../../../../../static/svg/back.svg';
import Forward from '../../../../../../static/svg/forward.svg';

export default function Icon({
  glyph,
  width,
  height,
  className = 'icon',
  style
}) {
  let file = glyph;

  if (typeof glyph === 'string') {
    switch (glyph) {
      case 'back':
        file = Back;
        break;
      case 'forward':
        file = Forward;
        break;
      default:
    }
  }

  return (
    <svg className={className} width={width} height={height} style={style}>
      <use xlinkHref={file} />
    </svg>
  );
}
