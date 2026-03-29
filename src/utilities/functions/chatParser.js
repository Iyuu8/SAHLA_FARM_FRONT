// src/utilities/functions/chatParser.js

import { pillColorForIndex } from '../data/chatConstants';

/**
 * Full message parser.
 *
 * Converts raw AI text into a structured array of blocks that MessageContent renders.
 *
 * Block types:
 *   { type: 'paragraph', segments: Segment[] }
 *   { type: 'bullet',    segments: Segment[] }
 *   { type: 'numbered',  n: number, segments: Segment[] }
 *   { type: 'heading',   level: 2|3, text: string }
 *   { type: 'spacer' }
 *
 * Inline segment types:
 *   { type: 'text',  content: string }
 *   { type: 'pill',  icon, content, color }
 *   { type: 'bold',  content: string }
 */

let _globalPillIndex = 0;

function parseInlineSegments(text) {
  const segments = [];
  const regex = /\[\[PILL:(\w+):([^\]]+)\]\]|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', content: text.slice(last, match.index) });
    }

    if (match[1] !== undefined) {
      segments.push({
        type: 'pill',
        icon: match[1],
        content: match[2],
        color: pillColorForIndex(_globalPillIndex),
      });
      _globalPillIndex++;
    } else {
      segments.push({ type: 'bold', content: match[3] });
    }

    last = regex.lastIndex;
  }

  if (last < text.length) {
    segments.push({ type: 'text', content: text.slice(last) });
  }

  return segments;
}

export function parseMessageSegments(text) {
  _globalPillIndex = 0;

  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  const blocks = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === '') {
      if (blocks.length > 0 && blocks[blocks.length - 1].type !== 'spacer') {
        blocks.push({ type: 'spacer' });
      }
      continue;
    }

    const headingMatch = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      continue;
    }

    const bulletMatch = trimmed.match(/^[-•*]\s+(.+)$/);
    if (bulletMatch) {
      blocks.push({ type: 'bullet', segments: parseInlineSegments(bulletMatch[1]) });
      continue;
    }

    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      blocks.push({ type: 'numbered', n: parseInt(numberedMatch[1], 10), segments: parseInlineSegments(numberedMatch[2]) });
      continue;
    }

    blocks.push({ type: 'paragraph', segments: parseInlineSegments(trimmed) });
  }

  if (blocks.length > 0 && blocks[blocks.length - 1].type === 'spacer') {
    blocks.pop();
  }

  return blocks;
}