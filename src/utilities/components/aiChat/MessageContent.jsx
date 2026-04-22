import Pill from './Pill';

/**
 * Renders inline segments (text / pill / bold) within a single line.
 */
function InlineSegments({ segments }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'pill')  return <Pill key={i} icon={seg.icon} content={seg.content} color={seg.color} />;
        if (seg.type === 'bold')  return <strong key={i}>{seg.content}</strong>;
        return <span key={i}>{seg.content}</span>;
      })}
    </>
  );
}

/**
 * MessageContent — renders the full block structure of an AI message.
 *
 * Block types handled:
 *   paragraph  — normal prose, lineHeight 2.2 to give pills vertical room
 *   bullet     — "•" prefixed line with green dot
 *   numbered   — "1." prefixed line
 *   heading    — ## bold section title
 *   spacer     — vertical gap between paragraphs
 */
export default function MessageContent({ segments: blocks }) {
  // Group consecutive bullet / numbered blocks into lists so they render together
  const grouped = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];

    if (b.type === 'bullet') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'bullet') {
        items.push(blocks[i]);
        i++;
      }
      grouped.push({ type: 'bulletList', items });
      continue;
    }

    if (b.type === 'numbered') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'numbered') {
        items.push(blocks[i]);
        i++;
      }
      grouped.push({ type: 'numberedList', items });
      continue;
    }

    grouped.push(b);
    i++;
  }

  return (
    <div className="flex flex-col break-words" style={{ gap: '0px', overflowWrap: 'anywhere' }}>
      {grouped.map((block, idx) => {

        if (block.type === 'spacer') {
          return <div key={idx} style={{ height: '10px' }} />;
        }

        if (block.type === 'heading') {
          return (
            <p
              key={idx}
              className="font-bold"
              style={{
                fontSize: block.level === 2 ? '15px' : '14px',
                color: '#192514',
                marginBottom: '4px',
                marginTop: idx > 0 ? '6px' : '0',
              }}
            >
              {block.text}
            </p>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p key={idx} style={{ lineHeight: '2.2', margin: 0, fontSize: '15px' }}>
              <InlineSegments segments={block.segments} />
            </p>
          );
        }

        if (block.type === 'bulletList') {
          return (
            <ul key={idx} style={{ margin: '4px 0', paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2" style={{ lineHeight: '2.0', fontSize: '15px' }}>
                  {/* Green bullet dot */}
                  <span
                    className="flex-shrink-0 rounded-full mt-[0.55em]"
                    style={{ width: '6px', height: '6px', background: '#2E6900', display: 'inline-block' }}
                  />
                  <span><InlineSegments segments={item.segments} /></span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'numberedList') {
          return (
            <ol key={idx} style={{ margin: '4px 0', paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2" style={{ lineHeight: '2.0', fontSize: '15px' }}>
                  {/* Number badge */}
                  <span
                    className="flex-shrink-0 rounded-md flex items-center justify-center text-xs font-bold"
                    style={{
                      minWidth: '20px',
                      height: '20px',
                      background: '#2E6900',
                      color: '#F8FFF6',
                      marginTop: '0.45em',
                      fontSize: '11px',
                    }}
                  >
                    {item.n}
                  </span>
                  <span><InlineSegments segments={item.segments} /></span>
                </li>
              ))}
            </ol>
          );
        }

        return null;
      })}
    </div>
  );
}