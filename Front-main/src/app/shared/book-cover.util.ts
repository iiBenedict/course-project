const PALETTE = [
  ['#4f46e5', '#7c3aed'],
  ['#0ea5e9', '#0284c7'],
  ['#059669', '#10b981'],
  ['#d97706', '#f59e0b'],
  ['#dc2626', '#ef4444'],
  ['#7c2d12', '#c2410c'],
  ['#0f766e', '#14b8a6'],
  ['#6d28d9', '#a855f7'],
  ['#be123c', '#f43f5e'],
  ['#1e40af', '#3b82f6']
];

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const attempt = current ? current + ' ' + word : word;

    if (attempt.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = attempt;
    }

    if (lines.length === maxLines) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = last.slice(0, Math.max(0, maxChars - 1)) + '…';
  }

  return lines;
}

export function bookCoverDataUri(title: string, author: string): string {
  const [c1, c2] = PALETTE[hash(title + author) % PALETTE.length];
  const titleLines = wrap(title || 'Untitled', 14, 4);
  const authorLine = (author || '').length > 22
    ? (author || '').slice(0, 21) + '…'
    : (author || '');

  const titleTspans = titleLines
    .map((line, i) => {
      const dy = i === 0 ? 0 : 30;
      return `<tspan x="150" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="300" height="420" fill="url(#g)"/>
  <rect x="18" y="18" width="264" height="384" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
  <text x="150" y="180" fill="white" font-family="Georgia, serif" font-size="26" font-weight="700" text-anchor="middle">
    ${titleTspans}
  </text>
  <text x="150" y="360" fill="rgba(255,255,255,0.85)" font-family="Georgia, serif" font-size="16" font-style="italic" text-anchor="middle">
    ${escapeXml(authorLine)}
  </text>
</svg>`.trim();

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
