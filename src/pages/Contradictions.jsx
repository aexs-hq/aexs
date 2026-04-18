import rawMd from '../../docs/business-contradictions.md?raw';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';

// ── Inline styles ────────────────────────────────────────────────────────────
const INLINE_CODE = {
  fontFamily: 'monospace',
  fontSize: '0.85em',
  background: '#ffffff10',
  padding: '1px 5px',
  borderRadius: 2,
  color: 'var(--color-teal)',
};

// ── Inline renderer ──────────────────────────────────────────────────────────
// Handles **bold**, *italic*, and `code` — nested (bold containing code, etc.).
function Inline({ text }) {
  const parts = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*\n]+)\*)|(`([^`]+)`)/g;
  let last = 0;
  let idx = 0;
  let m;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));

    if (m[1]) {
      // Bold — recurse so bold can contain code
      parts.push(<strong key={idx}><Inline text={m[2]} /></strong>);
    } else if (m[3]) {
      // Italic — recurse
      parts.push(<em key={idx}><Inline text={m[4]} /></em>);
    } else if (m[5]) {
      // Code — no further processing
      parts.push(<code key={idx} style={INLINE_CODE}>{m[6]}</code>);
    }

    last = m.index + m[0].length;
    idx++;
  }

  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

// ── Block parser ─────────────────────────────────────────────────────────────
// Converts markdown text into a flat array of typed block objects.
function parseMd(md) {
  const lines = md.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const t = lines[i].trim();

    // Code fence
    if (t.startsWith('```')) {
      const fence = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        fence.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', content: fence.join('\n') });
      i++;
      continue;
    }

    // Headings (check ### before ## before #)
    if (t.startsWith('### ')) {
      blocks.push({ type: 'h3', content: t.slice(4) });
      i++; continue;
    }
    if (t.startsWith('## ')) {
      blocks.push({ type: 'h2', content: t.slice(3) });
      i++; continue;
    }
    if (t.startsWith('# ')) {
      blocks.push({ type: 'h1', content: t.slice(2) });
      i++; continue;
    }

    // Horizontal rule (--- only; must check before list item)
    if (/^-{3,}$/.test(t)) {
      blocks.push({ type: 'hr' });
      i++; continue;
    }

    // Pipe table
    if (t.startsWith('|')) {
      const header = [];
      const rows = [];
      let sawSep = false;

      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const lt = lines[i].trim();
        // Separator row: only -, |, :, space
        if (/^\|[\s\-|:]+\|$/.test(lt)) {
          sawSep = true;
          i++;
          continue;
        }
        const cells = lt.slice(1, -1).split('|').map(c => c.trim());
        if (!sawSep && header.length === 0) {
          header.push(...cells);
        } else {
          rows.push(cells);
        }
        i++;
      }

      blocks.push({ type: 'table', header, rows });
      continue;
    }

    // Bullet list
    if (t.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Empty line
    if (t === '') { i++; continue; }

    // Paragraph — collect consecutive "normal" lines
    const pLines = [];
    while (i < lines.length) {
      const lt = lines[i].trim();
      if (
        lt === '' ||
        /^#{1,3} /.test(lt) ||
        lt.startsWith('|') ||
        lt.startsWith('```') ||
        /^-{3,}$/.test(lt) ||
        lt.startsWith('- ')
      ) break;
      pLines.push(lt);
      i++;
    }
    if (pLines.length) {
      blocks.push({ type: 'p', content: pLines.join(' ') });
    }
  }

  return blocks;
}

// ── Block renderer ───────────────────────────────────────────────────────────
function MdBlock({ block }) {
  switch (block.type) {

    case 'h1':
      return (
        <h1 style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 'clamp(20px, 4vw, 28px)',
          fontWeight: 300,
          color: 'var(--color-text)',
          margin: '0 0 6px',
          paddingBottom: 10,
          borderBottom: `1px solid ${'var(--color-border-ui)'}`,
          lineHeight: 1.2,
        }}>
          <Inline text={block.content} />
        </h1>
      );

    case 'h2':
      return (
        <h2 style={{
          fontFamily: "'Georgia', serif",
          fontSize: 16,
          fontWeight: 400,
          color: 'var(--color-gold)',
          margin: '36px 0 8px',
          paddingBottom: 4,
          borderBottom: `1px solid ${'var(--color-border-ui)'}`,
        }}>
          <Inline text={block.content} />
        </h2>
      );

    case 'h3':
      return (
        <h3 style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: '20px 0 6px',
        }}>
          <Inline text={block.content} />
        </h3>
      );

    case 'hr':
      return (
        <hr style={{
          border: 'none',
          borderTop: `1px solid ${'var(--color-border-ui)'}`,
          margin: '28px 0',
        }} />
      );

    case 'p':
      return (
        <p style={{
          fontSize: 13,
          color: 'var(--color-dim)',
          lineHeight: 1.8,
          margin: '0 0 10px',
        }}>
          <Inline text={block.content} />
        </p>
      );

    case 'code':
      return (
        <pre style={{
          background: '#ffffff06',
          border: `1px solid ${'var(--color-border-ui)'}`,
          borderRadius: 3,
          padding: '12px 16px',
          fontSize: 11,
          fontFamily: 'monospace',
          color: 'var(--color-dim)',
          overflowX: 'auto',
          margin: '10px 0',
          whiteSpace: 'pre',
        }}>
          {block.content}
        </pre>
      );

    case 'ul':
      return (
        <ul style={{ margin: '8px 0 10px', paddingLeft: 20 }}>
          {block.items.map((item, j) => (
            <li key={j} style={{
              fontSize: 13,
              color: 'var(--color-dim)',
              lineHeight: 1.7,
              marginBottom: 3,
            }}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );

    case 'table':
      return (
        <div style={{ overflowX: 'auto', margin: '12px 0' }}>
          <table style={{
            borderCollapse: 'collapse',
            width: '100%',
            fontSize: 12,
          }}>
            {block.header.length > 0 && (
              <thead>
                <tr>
                  {block.header.map((cell, j) => (
                    <th key={j} style={{
                      fontFamily: 'monospace',
                      fontSize: 9,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                      padding: '8px 12px',
                      border: `1px solid ${'var(--color-border-ui)'}`,
                      background: '#ffffff04',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                    }}>
                      <Inline text={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j}>
                  {row.map((cell, k) => (
                    <td key={k} style={{
                      padding: '7px 12px',
                      border: `1px solid ${'var(--color-border-ui)'}`,
                      color: 'var(--color-dim)',
                      verticalAlign: 'top',
                    }}>
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Contradictions() {
  const blocks = parseMd(rawMd);

  return (
    <PageShell>
      {/* Back nav */}
      <div style={{ marginBottom: 32 }}>
        <Link
          to="/"
          style={{
            fontFamily: 'monospace',
            fontSize: 9,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            textDecoration: 'none',
          }}
        >
          ← Home
        </Link>
      </div>

      {/* Rendered document */}
      <div>
        {blocks.map((block, i) => (
          <MdBlock key={i} block={block} />
        ))}
      </div>

      {/* Bottom back link */}
      <div style={{
        marginTop: 48,
        paddingTop: 20,
        borderTop: `1px solid ${'var(--color-border-ui)'}`,
      }}>
        <Link
          to="/"
          style={{
            fontFamily: 'monospace',
            fontSize: 9,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            textDecoration: 'none',
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </PageShell>
  );
}
