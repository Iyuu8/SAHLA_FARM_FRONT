import { pillColorForIndex } from './chatConstants';

/**
 * Full message parser.
 *
 * Converts raw AI text into a structured array of blocks that MessageContent renders.
 *
 * Block types:
 *   { type: 'paragraph', segments: Segment[] }   — normal prose line(s)
 *   { type: 'bullet',    segments: Segment[] }   — "- " or "• " prefixed line
 *   { type: 'numbered',  n: number, segments: Segment[] } — "1. " prefixed line
 *   { type: 'heading',   level: 2|3, text: string }       — "## " or "### "
 *   { type: 'spacer' }                                    — blank line / paragraph gap
 *
 * Inline segment types (inside paragraphs / bullets):
 *   { type: 'text',  content: string }
 *   { type: 'pill',  icon, content, color }
 *   { type: 'bold',  content: string }
 */

// ─── Inline parser (text + pills + bold) ─────────────────────────────────────

let _globalPillIndex = 0; // resets per message parse call

function parseInlineSegments(text) {
  const segments = [];
  // Combined regex: pill tags OR **bold**
  const regex = /\[\[PILL:(\w+):([^\]]+)\]\]|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', content: text.slice(last, match.index) });
    }

    if (match[1] !== undefined) {
      // Pill: [[PILL:icon:content]]
      segments.push({
        type: 'pill',
        icon: match[1],
        content: match[2],
        color: pillColorForIndex(_globalPillIndex),
      });
      _globalPillIndex++;
    } else {
      // Bold: **text**
      segments.push({ type: 'bold', content: match[3] });
    }

    last = regex.lastIndex;
  }

  if (last < text.length) {
    segments.push({ type: 'text', content: text.slice(last) });
  }

  return segments;
}

// ─── Block parser ─────────────────────────────────────────────────────────────

export function parseMessageSegments(text) {
  _globalPillIndex = 0; // reset pill color counter for this message

  // Normalise line endings
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into lines
  const lines = normalized.split('\n');

  const blocks = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // Blank line → spacer (only if previous block wasn't already a spacer)
    if (trimmed === '') {
      if (blocks.length > 0 && blocks[blocks.length - 1].type !== 'spacer') {
        blocks.push({ type: 'spacer' });
      }
      continue;
    }

    // Heading ## / ###
    const headingMatch = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      continue;
    }

    // Bullet: "- " or "• " or "* "
    const bulletMatch = trimmed.match(/^[-•*]\s+(.+)$/);
    if (bulletMatch) {
      blocks.push({ type: 'bullet', segments: parseInlineSegments(bulletMatch[1]) });
      continue;
    }

    // Numbered list: "1. " "2. " etc.
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      blocks.push({ type: 'numbered', n: parseInt(numberedMatch[1], 10), segments: parseInlineSegments(numberedMatch[2]) });
      continue;
    }

    // Normal paragraph line
    blocks.push({ type: 'paragraph', segments: parseInlineSegments(trimmed) });
  }

  // Remove trailing spacer
  if (blocks.length > 0 && blocks[blocks.length - 1].type === 'spacer') {
    blocks.pop();
  }

  return blocks;
}