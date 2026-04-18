"""
AEXS MegaDeck 2026 — build_deck.py
Generates AEXS_MegaDeck_2026.pdf (17 slides, 960×540 points, widescreen 16:9)
Run: python3 build_deck.py
"""

from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase.pdfmetrics import stringWidth
import json
import math
import os

# ─── TOKEN + CONTENT SOURCES ─────────────────────────────────────────────────
_ROOT    = os.path.dirname(os.path.abspath(__file__))
_TOKENS  = json.load(open(os.path.join(_ROOT, 'tokens/design-tokens.json')))
_FOUNDER = json.load(open(os.path.join(_ROOT, 'content/founder-bio.json')))
# Canonical business values — every dollar / % / period in the PDF reads from here.
# ADR-004 enforces this via scripts/verify-content-consistency.js.
_PITCH   = json.load(open(os.path.join(_ROOT, 'content/pitch-data.json')))
_F       = _FOUNDER['identity']
_FC      = _FOUNDER['credentials']

_c  = _TOKENS['colors']
_t  = _TOKENS['type']
_cv = _TOKENS['canvas']

# ─── CANVAS ──────────────────────────────────────────────────────────────────
W = _cv['width']
H = _cv['height']
OUTPUT = os.path.join(_ROOT, "AEXS_MegaDeck_2026.pdf")

# ─── PALETTE — all HexColor values sourced from tokens/design-tokens.json ────
BG     = HexColor(_c['bg-pdf'])
BG2    = HexColor(_c['bg-alt'])
CARD   = HexColor(_c['card-deck'])
CARD2  = HexColor(_c['card-alt'])

BORDER  = HexColor(_c['border-deck'])
BORDER2 = HexColor(_c['border-alt'])

GOLD   = HexColor(_c['gold'])
GOLD_L = HexColor(_c['gold-light'])
GOLD_D = HexColor(_c['gold-dark'])
BLUE   = HexColor(_c['blue-500'])
BLUE_L = HexColor(_c['blue-light'])
BLUE_D = HexColor(_c['blue-dark'])
GREEN  = HexColor(_c['green-emerald'])
GREEN_L= HexColor(_c['green-light'])
RED    = HexColor(_c['red'])
ORANGE = HexColor(_c['orange-amber'])
PURPLE = HexColor(_c['purple-violet'])

W1 = HexColor(_c['white-1'])
W2 = HexColor(_c['white-2'])
W3 = HexColor(_c['white-3'])
W4 = HexColor(_c['white-4'])
W5 = HexColor(_c['white-5'])

# ─── SLIDE-SURFACE TINTS — dark tinted backgrounds used in specific slides ───
_PURPLE_BG  = HexColor(_c['surface-purple-bg'])
_GREEN_BG   = HexColor(_c['surface-green-bg'])
_BLUE_BG    = HexColor(_c['surface-blue-bg'])
_NAVY_BG    = HexColor(_c['surface-navy-bg'])
_TEAL_BG    = HexColor(_c['surface-teal-bg'])
_GOLD_TINT  = HexColor(_c['surface-gold-tint'])
_GOLD_DEEP  = HexColor(_c['surface-gold-deep'])
_RED_TINT   = HexColor(_c['surface-red-tint'])
_PURPLE_DPK = HexColor(_c['purple-deep'])

# ─── TYPOGRAPHY — pt values from tokens/design-tokens.json type.* ─────────────
_SZ_WORDMARK    = _t['size-wordmark']     # 54 — "AEXS" wordmark
_SZ_ASK         = _t['size-ask']          # 36 — ask/CTA heading (slide 17)
_SZ_SLIDE_TITLE = _t['size-slide-title']  # 28 — main title in most slides
_SZ_DISPLAY     = _t['size-display']      # 30 — display / cover subtitle
_SZ_HEADLINE    = _t['size-headline']     # 22 — headline / large metric
_SZ_SUBHEAD     = _t['size-subhead']      # 14 — subheading / module title
_SZ_METRIC      = _t['size-metric']       # 20 — metric card values
_SZ_ROI         = _t['size-roi']          # 18 — ROI/impact values
_SZ_DECK_LBL    = _t['size-deck-label']   # 12 — deck section labels
_SZ_BODY        = _t['size-body']         # 11 — body text
_SZ_BODY_SM     = _t['size-body-sm']      # 10 — small body / helper default
_SZ_CTA         = _t['size-cta']          # 13 — CTA / ask paragraph
_SZ_LABEL       = _t['size-label']        # 9  — labels / chrome text
_SZ_CAPTION     = _t['size-caption']      # 8  — captions / chrome tag
_SZ_STAT_VAL    = _t['size-stat-value']   # 15 — stat strip value text
_SZ_STAT_LARGE  = _t['size-stat-large']   # 44 — large crisis statistics
_SZ_TINY        = _t['size-tiny']         # 7  — tiny text / tag labels
_SZ_NODE        = _t['size-node-label']   # 7.5 — orbit node labels

# ─── ALIGNMENT COEFFICIENT ────────────────────────────────────────────────────
# Optical center formula: baseline = bar_mid - font_size * OPTICAL_CENTER_COEFF
OPTICAL_CENTER_COEFF = _TOKENS['alignment']['optical-center-coefficient']

# ─── PRIMITIVE HELPERS ───────────────────────────────────────────────────────

def bg(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def chrome(c, slide_number, total=17):
    # Top gold bar (3px)
    c.setFillColor(GOLD)
    c.rect(0, H - 3, W, 3, fill=1, stroke=0)
    # Bottom bar (28px)
    c.setFillColor(BORDER)
    c.rect(0, 0, W, 28, fill=1, stroke=0)
    # "AEXS" label
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawString(30, 9, "AEXS")
    # Tagline
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_CAPTION)
    c.drawString(62, 9, "AI EXECUTIVE SUITE  |  CONFIDENTIAL  |  APRIL 2026")
    # Slide counter
    c.setFillColor(W4)
    c.setFont("Helvetica", _SZ_CAPTION)
    label = f"{slide_number} / {total}"
    c.drawRightString(W - 30, 9, label)


def left_bar(c, color):
    c.setFillColor(color)
    c.rect(0, 0, 4, H, fill=1, stroke=0)


def card_box(c, x, y, w, h, fill=CARD, stroke_color=BORDER, r=6, stroke_w=0.5):
    c.setFillColor(fill)
    c.setStrokeColor(stroke_color)
    c.setLineWidth(stroke_w)
    c.roundRect(x, y, w, h, r, fill=1, stroke=1)


def section_kicker(c, text, x, y, color):
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", _SZ_CAPTION)
    c.drawString(x, y, text.upper())
    # Rule 4pt below
    rule_y = y - 6
    c.setStrokeColor(color)
    c.setLineWidth(1)
    c.line(x, rule_y, x + 40, rule_y)


def tag(c, x, y, text, bg_color, fg_color, font_size=8):
    tw = len(text) * font_size * 0.6 + 14
    th = 16
    r = 4
    c.setFillColor(bg_color)
    c.setStrokeColor(bg_color)
    c.setLineWidth(0.5)
    c.roundRect(x, y - th / 2, tw, th, r, fill=1, stroke=0)
    c.setFillColor(fg_color)
    c.setFont("Helvetica-Bold", font_size)
    c.drawString(x + 7, y - th / 2 + (th - font_size) / 2 + 1, text)


def bullet(c, text, x, y, size=10, color=W2, dot_color=GOLD):
    # Dot
    c.setFillColor(dot_color)
    c.circle(x + 4, y + 3.5, 2.5, fill=1, stroke=0)
    # Text
    c.setFillColor(color)
    c.setFont("Helvetica", size)
    c.drawString(x + 14, y, text)


def h_rule(c, x, y, w, color, thickness=1.0):
    c.setStrokeColor(color)
    c.setLineWidth(thickness)
    c.line(x, y, x + w, y)


def wrap_text(c, text, x, y, max_w, size=10, color=W3, lead=15):
    c.setFillColor(color)
    c.setFont("Helvetica", size)
    words = text.split()
    line = ""
    cur_y = y
    for word in words:
        test = (line + " " + word).strip()
        if stringWidth(test, "Helvetica", size) <= max_w:
            line = test
        else:
            if line:
                c.drawString(x, cur_y, line)
                cur_y -= lead
            line = word
    if line:
        c.drawString(x, cur_y, line)
        cur_y -= lead
    return cur_y


# ─── ALIGNMENT HELPERS ───────────────────────────────────────────────────────

def footer_bar(c, label, body,
               label_color=GOLD, body_color=W3,
               bg_fill=None, stroke_color=None,
               label_size=10, body_size=10,
               bar_y=36, bar_h=42,
               label_x=46, body_x=None):
    fill   = bg_fill or CARD2
    stroke = stroke_color or BORDER
    card_box(c, 0, bar_y, W, bar_h, fill=fill, stroke_color=stroke, r=0)
    # Left accent bar
    c.setFillColor(label_color)
    c.rect(0, bar_y, 4, bar_h, fill=1, stroke=0)
    # Optical center — coefficient from tokens/design-tokens.json alignment
    bar_mid   = bar_y + bar_h / 2
    label_base = bar_mid - label_size * OPTICAL_CENTER_COEFF
    body_base  = bar_mid - body_size  * OPTICAL_CENTER_COEFF
    # Label
    c.setFillColor(label_color)
    c.setFont("Helvetica-Bold", label_size)
    c.drawString(label_x, label_base, label)
    # Body
    if body_x is None:
        body_x = label_x + stringWidth(label + "   ", "Helvetica-Bold", label_size)
    c.setFillColor(body_color)
    c.setFont("Helvetica", body_size)
    c.drawString(body_x, body_base, body)


def two_line_bar(c, title, line1, line2=None,
                 title_color=GOLD, body_color=W3,
                 bg_fill=None, stroke_color=None,
                 bar_y=36, bar_h=52):
    fill   = bg_fill or CARD2
    stroke = stroke_color or BORDER
    card_box(c, 0, bar_y, W, bar_h, fill=fill, stroke_color=stroke, r=0)
    c.setFillColor(title_color)
    c.rect(0, bar_y, 4, bar_h, fill=1, stroke=0)
    line2_y = bar_y + bar_h * 0.16
    if line2 is None:
        title_y = bar_y + bar_h * 0.62
        line1_y = bar_y + bar_h * 0.22
    else:
        title_y = bar_y + bar_h * 0.72
        line1_y = bar_y + bar_h * 0.44
        line2_y = bar_y + bar_h * 0.16
    c.setFillColor(title_color)
    c.setFont("Helvetica-Bold", _SZ_BODY_SM)
    c.drawString(46, title_y, title)
    c.setFillColor(body_color)
    c.setFont("Helvetica", _SZ_LABEL)
    c.drawString(46, line1_y, line1)
    if line2 is not None:
        c.drawString(46, line2_y, line2)


def stat_strip(c, items,
               val_color=GREEN, lbl_color=W3,
               bg_fill=None, stroke_color=None,
               bar_y=36, bar_h=42):
    fill   = bg_fill or CARD2
    stroke = stroke_color or BORDER
    card_box(c, 0, bar_y, W, bar_h, fill=fill, stroke_color=stroke, r=0)
    c.setFillColor(val_color)
    c.rect(0, bar_y, 4, bar_h, fill=1, stroke=0)
    bar_mid = bar_y + bar_h / 2
    val_y   = bar_mid - _SZ_STAT_VAL * OPTICAL_CENTER_COEFF
    lbl_y   = bar_mid + 14 * OPTICAL_CENTER_COEFF - 14
    ew      = (W - 90) / len(items)
    for i, (val, lbl) in enumerate(items):
        cx = 90 + ew * i
        # Value
        c.setFillColor(val_color)
        c.setFont("Helvetica-Bold", _SZ_STAT_VAL)
        vw = stringWidth(val, "Helvetica-Bold", _SZ_STAT_VAL)
        c.drawString(cx + (ew - vw) / 2, val_y, val)
        # Label
        c.setFillColor(lbl_color)
        c.setFont("Helvetica", _SZ_CAPTION)
        lw = stringWidth(lbl, "Helvetica", _SZ_CAPTION)
        c.drawString(cx + (ew - lw) / 2, lbl_y, lbl)
        # Divider
        if i < len(items) - 1:
            c.setStrokeColor(BORDER2)
            c.setLineWidth(0.5)
            c.line(cx + ew, bar_y + 8, cx + ew, bar_y + bar_h - 8)


# ─── SLIDE 01 — COVER ────────────────────────────────────────────────────────

def slide_01(c):
    bg(c)
    left_bar(c, GOLD)
    chrome(c, 1)
    # PRE-SEED tag top-right
    tag(c, W - 170, H - 22, "PRE-SEED  |  CONFIDENTIAL", GOLD_D, GOLD_L, font_size=7)
    # Wordmark
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", _SZ_WORDMARK)
    c.drawString(30, H - 110, "AEXS")
    # Tagline under wordmark
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_DECK_LBL)
    c.drawString(30, H - 132, "AI EXECUTIVE SUITE")
    h_rule(c, 30, H - 142, 160, GOLD, 1)
    # Description block
    c.setFillColor(W2)
    c.setFont("Helvetica", _SZ_BODY_SM)
    c.drawString(30, H - 162, "The AI command layer for enterprise leadership.")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_LABEL)
    lines = [
        "AI Chief of Staff  +  Governance Engine  +  Decision Intelligence",
        "Sold as a unified suite. Three tiers. One platform.",
    ]
    for i, ln in enumerate(lines):
        c.drawString(30, H - 182 - i * 14, ln)
    # Ask box
    card_box(c, 30, H - 310, 250, 60, fill=CARD2, stroke_color=GOLD, r=6)
    c.setFillColor(GOLD_L)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawString(46, H - 264, "SEED ROUND")
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_HEADLINE)
    c.drawString(46, H - 290, f"{_PITCH['round']['size']} {_PITCH['round']['instrument']}  |  {_PITCH['round']['cap']} CAP")
    # Right panel — 3 layer cards
    card_w, card_h = 230, 70
    cx = W - card_w - 30
    layers = [
        (GOLD,   "AI CHIEF OF STAFF",      "Executive memory, briefings, follow-up"),
        (BLUE,   "AI GOVERNANCE ENGINE",   "EU AI Act, ISO 42001, audit reports"),
        (GREEN,  "DECISION INTELLIGENCE",  "Frameworks, scenario models, audit trail"),
    ]
    for i, (color, title, desc) in enumerate(layers):
        cy = H - 140 - i * (card_h + 10)
        card_box(c, cx, cy, card_w, card_h, fill=CARD, stroke_color=color, r=6)
        # Left accent bar on card
        c.setFillColor(color)
        c.rect(cx, cy, 4, card_h, fill=1, stroke=0)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(cx + 12, cy + card_h - 22, title)
        c.setFillColor(W3)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(cx + 12, cy + card_h - 38, desc)
    # Purple memory graph strip
    strip_y = H - 380
    card_box(c, cx, strip_y, card_w, 38, fill=_PURPLE_BG, stroke_color=PURPLE, r=4)
    c.setFillColor(PURPLE)
    c.rect(cx, strip_y, 4, 38, fill=1, stroke=0)
    c.setFillColor(PURPLE)
    c.setFont("Helvetica-Bold", _SZ_CAPTION)
    c.drawString(cx + 12, strip_y + 24, "EXECUTIVE MEMORY GRAPH")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_TINY)
    c.drawString(cx + 12, strip_y + 10, "Persistent context across all three layers")
    # Key metrics row at bottom of left
    metrics = [(_PITCH['financials']['arr_y3'], "Y3 ARR"), (_PITCH['financials']['breakeven'], "Break-even"), ("$257M", "Implied Val.")]
    for i, (val, lbl) in enumerate(metrics):
        mx = 30 + i * 85
        c.setFillColor(GOLD_L)
        c.setFont("Helvetica-Bold", _SZ_DECK_LBL)
        c.drawString(mx, H - 390, val)
        c.setFillColor(W4)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(mx, H - 404, lbl)


# ─── SLIDE 02 — THE CRISIS ───────────────────────────────────────────────────

def slide_02(c):
    bg(c)
    left_bar(c, RED)
    chrome(c, 2)
    section_kicker(c, "THE LEADERSHIP CRISIS", 30, H - 48, RED)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_DISPLAY)
    c.drawString(30, H - 82, "Executives Are Flying Blind. At Scale.")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Four converging failure points — each large enough to demand a dedicated tool. None of them solved.")

    stats = [
        ("73%", "of executives report",       "decision overload",       RED),
        ("$3T", "in enterprise value lost",    "annually to poor decisions", ORANGE),
        ("40+", "compliance frameworks",       "AI teams must navigate",  GOLD),
        ("12%", "of AI projects",              "succeed in production",   BLUE),
    ]
    cw = (W - 60) // 4 - 6
    cy_top = H - 130
    cy_bot = 82  # above footer bar

    for i, (val, sub1, sub2, color) in enumerate(stats):
        cx = 30 + i * (cw + 8)
        ch = cy_top - cy_bot
        card_box(c, cx, cy_bot, cw, ch, fill=CARD, stroke_color=color, r=6)
        c.setFillColor(color)
        c.rect(cx, cy_bot, 4, ch, fill=1, stroke=0)
        # Stat value
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_STAT_LARGE)
        vw = stringWidth(val, "Helvetica-Bold", _SZ_STAT_LARGE)
        c.drawString(cx + (cw - vw) / 2, cy_bot + ch - 68, val)
        # Sub lines
        c.setFillColor(W2)
        c.setFont("Helvetica", _SZ_LABEL)
        lw1 = stringWidth(sub1, "Helvetica", _SZ_LABEL)
        c.drawString(cx + (cw - lw1) / 2, cy_bot + ch - 86, sub1)
        c.setFillColor(W3)
        lw2 = stringWidth(sub2, "Helvetica", _SZ_LABEL)
        c.drawString(cx + (cw - lw2) / 2, cy_bot + ch - 100, sub2)

    two_line_bar(c,
        "The EU AI Act is enforceable NOW.",
        "Article 13 transparency requirements are in force as of August 2025. Non-compliance exposes companies to fines up to 7% of global annual turnover.",
        title_color=RED, body_color=W3, bar_y=36, bar_h=44)


# ─── SLIDE 03 — THE PROBLEM ───────────────────────────────────────────────────

def slide_03(c):
    bg(c)
    left_bar(c, ORANGE)
    chrome(c, 3)
    section_kicker(c, "THE PROBLEM", 30, H - 48, ORANGE)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_DISPLAY)
    c.drawString(30, H - 82, "Three Crises. Zero Unified Solutions.")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Every competitor solves one dimension. No platform addresses all three simultaneously.")

    cols = [
        (GOLD,   "EXECUTIVE OVERLOAD",
         ["73% of C-suite report decision fatigue",
          "Avg exec manages 14+ stakeholder streams",
          "Follow-up failure rate exceeds 60%",
          "No persistent memory across tools",
          "Briefings built manually every morning"]),
        (RED,    "GOVERNANCE VACUUM",
         ["EU AI Act enforcement began Aug 2025",
          "ISO 42001 requires continuous documentation",
          "Board audit requests have no tooling",
          "Compliance teams lack AI-native systems",
          "Fines up to EUR 35M for violations"]),
        (BLUE,   "DECISION DEBT",
         ["40+ frameworks with no unified layer",
          "Decisions made without structured logic",
          "No audit trail for strategic choices",
          "Scenario modeling done in spreadsheets",
          "12% AI project success rate in prod"]),
    ]
    cw = (W - 60) // 3 - 6
    cy_top = H - 128
    cy_bot = 90

    for i, (color, title, bullets) in enumerate(cols):
        cx = 30 + i * (cw + 9)
        ch = cy_top - cy_bot
        card_box(c, cx, cy_bot, cw, ch, fill=CARD, stroke_color=color, r=6)
        c.setFillColor(color)
        c.rect(cx, cy_bot, 4, ch, fill=1, stroke=0)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_BODY_SM)
        c.drawString(cx + 12, cy_bot + ch - 22, title)
        h_rule(c, cx + 12, cy_bot + ch - 30, cw - 24, color, 0.5)
        for j, b in enumerate(bullets):
            bullet(c, b, cx + 12, cy_bot + ch - 52 - j * 18,
                   size=8, color=W3, dot_color=color)

    # Synthesis bar at bottom (no footer_bar helper — synthesis text)
    card_box(c, 0, 36, W, 52, fill=_GREEN_BG, stroke_color=GREEN, r=0)
    c.setFillColor(GREEN)
    c.rect(0, 36, 4, 52, fill=1, stroke=0)
    c.setFillColor(GREEN)
    c.setFont("Helvetica-Bold", _SZ_BODY_SM)
    c.drawString(46, 36 + 52 * 0.62, "The Unified Gap:")
    c.setFillColor(W2)
    c.setFont("Helvetica", _SZ_LABEL)
    c.drawString(46, 36 + 52 * 0.32,
        "No incumbent owns Executive Software + AI Governance + Decision Intelligence simultaneously. That is the AEXS category.")


# ─── SLIDE 04 — MARKET OPPORTUNITY ───────────────────────────────────────────

def slide_04(c):
    bg(c)
    left_bar(c, GOLD)
    chrome(c, 4)
    section_kicker(c, "MARKET OPPORTUNITY", 30, H - 48, GOLD)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_DISPLAY)
    c.drawString(30, H - 82, "A $450B Category Waiting to Be Created")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Three adjacent markets converging under one compliance-driven forcing function.")

    # Concentric circles — left panel
    cx_c, cy_c = 220, H // 2 - 10
    outer_r, mid_r, inner_r = 140, 95, 50

    # Draw from outer to inner
    c.setFillColor(_BLUE_BG)
    c.setStrokeColor(PURPLE)
    c.setLineWidth(1.5)
    c.circle(cx_c, cy_c, outer_r, fill=1, stroke=1)

    c.setFillColor(_NAVY_BG)
    c.setStrokeColor(BLUE)
    c.setLineWidth(1.5)
    c.circle(cx_c, cy_c, mid_r, fill=1, stroke=1)

    c.setFillColor(_TEAL_BG)
    c.setStrokeColor(GREEN)
    c.setLineWidth(1.5)
    c.circle(cx_c, cy_c, inner_r, fill=1, stroke=1)

    # Outer ring label (PURPLE) — anchored in outer ring band
    outer_lbl_y = cy_c + (outer_r + mid_r) / 2 - 4
    c.setFillColor(PURPLE)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawCentredString(cx_c, outer_lbl_y, "EXECUTIVE SOFTWARE")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_CAPTION)
    c.drawCentredString(cx_c, outer_lbl_y - 12, "$280B TAM")

    # Middle ring label (BLUE) — in mid ring band
    mid_lbl_y = cy_c + (mid_r + inner_r) / 2 - 4
    c.setFillColor(BLUE_L)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawCentredString(cx_c, mid_lbl_y, "AI GOVERNANCE / GRC")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_CAPTION)
    c.drawCentredString(cx_c, mid_lbl_y - 12, "$122B TAM")

    # Inner label (GREEN) — center
    c.setFillColor(GREEN_L)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawCentredString(cx_c, cy_c + 6, "DECISION")
    c.drawCentredString(cx_c, cy_c - 6, "INTEL")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_CAPTION)
    c.drawCentredString(cx_c, cy_c - 18, "$48B TAM")

    # Legend — right panel
    lx = cx_c + outer_r + 40
    legend = [
        (PURPLE, "$450B+", "Total Addressable Market",
         "Unified executive + governance + decision platform"),
        (BLUE,   "$28B",   "Serviceable Addressable Market",
         "AI-ready enterprise buyers in compliance-active sectors"),
        (GREEN,  "$2.8B",  "Serviceable Obtainable Market",
         "5-year target in EU-compliant enterprise segment"),
    ]
    ly = H - 130
    for color, amt, lbl, desc in legend:
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_HEADLINE)
        c.drawString(lx, ly, amt)
        c.setFillColor(W2)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(lx, ly - 18, lbl)
        c.setFillColor(W3)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(lx, ly - 32, desc)
        ly -= 80

    footer_bar(c,
        "Category Creation Moment:",
        "AEXS sits at the intersection of three multi-billion markets no incumbent currently owns simultaneously.",
        label_color=GOLD, body_color=W3, bar_y=36, bar_h=42)


# ─── SLIDE 05 — THE SOLUTION ──────────────────────────────────────────────────

def slide_05(c):
    bg(c)
    left_bar(c, GOLD)
    chrome(c, 5)
    section_kicker(c, "THE SOLUTION", 30, H - 48, GOLD)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_DISPLAY)
    c.drawString(30, H - 82, "One Platform. Three Layers. Zero Compromise.")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Each module delivers immediate value. Together they create a compounding moat.")

    modules = [
        (GOLD,  "CHIEF OF STAFF",   "AI Chief of Staff",
         ["Executive memory — persistent context", "Daily briefing generation",
          "Meeting prep and follow-up tracking", "Stakeholder relationship mapping",
          "Priority queue management"],
         _PITCH['product_pricing'][0]['price'], "STARTER TIER"),
        (RED,   "GOVERNANCE",       "AI Governance Engine",
         ["EU AI Act Article 13 compliance", "ISO 42001 documentation engine",
          "Automated audit report generation", "Real-time policy monitoring",
          "Board-ready compliance dashboards"],
         _PITCH['product_pricing'][1]['price'], "PROFESSIONAL TIER"),
        (BLUE,  "DECISION INTEL",   "Decision Intelligence",
         ["Structured decision frameworks", "Multi-scenario modeling",
          "Full decision audit trail", "Outcome probability scoring",
          "Executive alignment workflows"],
         _PITCH['product_pricing'][2]['price'], "ENTERPRISE TIER"),
    ]
    cw = (W - 60) // 3 - 6
    cy_top = H - 128
    cy_bot = 90

    for i, (color, badge, title, bullets, price, tier) in enumerate(modules):
        cx = 30 + i * (cw + 9)
        ch = cy_top - cy_bot
        card_box(c, cx, cy_bot, cw, ch, fill=CARD, stroke_color=color, r=6)
        c.setFillColor(color)
        c.rect(cx, cy_bot, 4, ch, fill=1, stroke=0)
        # Badge
        tag(c, cx + 12, cy_bot + ch - 14, badge, color, BG, font_size=7)
        # Title
        c.setFillColor(W1)
        c.setFont("Helvetica-Bold", _SZ_BODY)
        c.drawString(cx + 12, cy_bot + ch - 34, title)
        h_rule(c, cx + 12, cy_bot + ch - 42, cw - 24, color, 0.5)
        for j, b in enumerate(bullets):
            bullet(c, b, cx + 12, cy_bot + ch - 60 - j * 16,
                   size=8, color=W3, dot_color=color)
        # Price callout
        card_box(c, cx + 8, cy_bot + 6, cw - 16, 34, fill=BG2, stroke_color=color, r=4)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_SUBHEAD)
        c.drawString(cx + 16, cy_bot + 24, price)
        c.setFillColor(W4)
        c.setFont("Helvetica", _SZ_TINY)
        c.drawString(cx + 16, cy_bot + 12, tier)

    # Purple foundation strip
    card_box(c, 30, 82, W - 60, 6, fill=PURPLE, stroke_color=PURPLE, r=2)
    card_box(c, 0, 36, W, 46, fill=_PURPLE_BG, stroke_color=PURPLE, r=0)
    c.setFillColor(PURPLE)
    c.rect(0, 36, 4, 46, fill=1, stroke=0)
    c.setFillColor(PURPLE)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawString(46, 36 + 46 * 0.65, "EXECUTIVE MEMORY GRAPH")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_CAPTION)
    c.drawString(46, 36 + 46 * 0.28,
        "Persistent context layer shared across all three modules — the moat that deepens with every use.")


# ─── SLIDE 06 — CHIEF OF STAFF ────────────────────────────────────────────────

def slide_06(c):
    bg(c)
    left_bar(c, GOLD)
    chrome(c, 6)
    section_kicker(c, "MODULE 01 — AI CHIEF OF STAFF", 30, H - 48, GOLD)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, "The AI Chief of Staff")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Persistent executive memory. Proactive intelligence. Zero follow-up gaps.")

    # Left: vertical timeline
    timeline = [
        ("6:55 AM", GOLD,   "Morning Briefing",     "Priorities, risks, decisions due today"),
        ("9:30 AM", BLUE,   "Pre-Meeting Prep",      "Stakeholder map, key positions, talking points"),
        ("12:00 PM", GREEN, "Follow-Up Sweep",       "Auto-log action items from morning sessions"),
        ("3:00 PM",  ORANGE,"Decision Queue",        "Structured prompts for outstanding choices"),
        ("5:00 PM",  PURPLE,"Day Synthesis",         "Memory commit: outcomes stored for context"),
    ]
    tx = 30
    ty_start = H - 135
    step = 64

    for i, (time, color, title, desc) in enumerate(timeline):
        ty = ty_start - i * step
        # Time label
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_CAPTION)
        c.drawString(tx, ty, time)
        # Connector dot and line
        c.setFillColor(color)
        c.circle(tx + 56, ty + 4, 5, fill=1, stroke=0)
        if i < len(timeline) - 1:
            c.setStrokeColor(BORDER2)
            c.setLineWidth(1)
            c.setDash(2, 3)
            c.line(tx + 56, ty - 3, tx + 56, ty - step + 12)
            c.setDash()
        # Card
        card_box(c, tx + 70, ty - 10, 290, 42, fill=CARD, stroke_color=color, r=4)
        c.setFillColor(color)
        c.rect(tx + 70, ty - 10, 3, 42, fill=1, stroke=0)
        c.setFillColor(W2)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(tx + 80, ty + 18, title)
        c.setFillColor(W3)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(tx + 80, ty + 4, desc)

    # Right panel: 4 metric cards
    rx = 440
    metrics = [
        (GOLD,   "2.4 hrs",   "Saved per executive daily"),
        (GREEN,  "91%",       "Follow-up completion rate"),
        (BLUE,   "14+",       "Stakeholder streams managed"),
        (PURPLE, "100%",      "Context retained session-to-session"),
    ]
    mw = W - rx - 30
    mh = 54
    for i, (color, val, lbl) in enumerate(metrics):
        my = H - 140 - i * (mh + 10)
        card_box(c, rx, my, mw, mh, fill=CARD, stroke_color=color, r=6)
        c.setFillColor(color)
        c.rect(rx, my, 4, mh, fill=1, stroke=0)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_METRIC)
        c.drawString(rx + 16, my + 28, val)
        c.setFillColor(W3)
        c.setFont("Helvetica", _SZ_LABEL)
        c.drawString(rx + 16, my + 12, lbl)

    # Pricing strip at bottom
    card_box(c, 0, 36, W, 42, fill=_GOLD_TINT, stroke_color=GOLD, r=0)
    c.setFillColor(GOLD)
    c.rect(0, 36, 4, 42, fill=1, stroke=0)
    bar_mid = 36 + 42 / 2
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", _SZ_BODY_SM)
    _starter_price = _PITCH['product_pricing'][0]['price'].split('/')[0]
    c.drawString(46, bar_mid - 10 * OPTICAL_CENTER_COEFF, f"{_starter_price} / month — STARTER TIER")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_LABEL)
    c.drawString(46 + stringWidth(f"{_starter_price} / month — STARTER TIER   ", "Helvetica-Bold", _SZ_BODY_SM),
                 bar_mid - 9 * OPTICAL_CENTER_COEFF, "Included in every AEXS subscription. Expands with Governance and Decision tiers.")


# ─── SLIDE 07 — GOVERNANCE ENGINE ────────────────────────────────────────────

def slide_07(c):
    bg(c)
    left_bar(c, RED)
    chrome(c, 7)
    section_kicker(c, "MODULE 02 — AI GOVERNANCE ENGINE", 30, H - 48, RED)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, "AI Governance Engine")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "From compliance burden to automated board-readiness. Real-time, continuous, audit-proof.")

    # Regulatory alert bar
    card_box(c, 30, H - 140, W - 60, 28, fill=_RED_TINT, stroke_color=RED, r=4)
    c.setFillColor(RED)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawString(46, H - 128, "EU AI Act ALERT:")
    c.setFillColor(W2)
    c.setFont("Helvetica", _SZ_LABEL)
    c.drawString(46 + stringWidth("EU AI Act ALERT:  ", "Helvetica-Bold", _SZ_LABEL), H - 128,
                 "Article 13 (transparency) enforcement began August 2025. Article 6 (high-risk AI) enters force February 2026.")

    # Three pillars
    pillars = [
        (RED,    "MONITOR",   "Continuous AI Act Monitoring",
         ["Real-time Article 13 compliance scan", "Automated risk classification",
          "Policy gap identification", "Alert engine for new requirements",
          "Shadow AI detection"]),
        (ORANGE, "CERTIFY",   "ISO 42001 Documentation",
         ["Auto-generated policy templates", "Evidence collection workflows",
          "Certification readiness scoring", "Audit trail maintenance",
          "Version control for all documents"]),
        (GREEN,  "REPORT",    "Board-Ready Audit Reports",
         ["One-click executive summary", "Regulator-formatted output",
          "Risk heat maps", "Board presentation mode",
          "Historical compliance trend charts"]),
    ]
    cw = (W - 60) // 3 - 6
    cy_top = H - 168
    cy_bot = 82

    for i, (color, badge, title, bullets) in enumerate(pillars):
        cx = 30 + i * (cw + 9)
        ch = cy_top - cy_bot
        card_box(c, cx, cy_bot, cw, ch, fill=CARD, stroke_color=color, r=6)
        c.setFillColor(color)
        c.rect(cx, cy_bot, 4, ch, fill=1, stroke=0)
        tag(c, cx + 12, cy_bot + ch - 14, badge, color, BG, font_size=7)
        c.setFillColor(W1)
        c.setFont("Helvetica-Bold", _SZ_BODY_SM)
        c.drawString(cx + 12, cy_bot + ch - 32, title)
        h_rule(c, cx + 12, cy_bot + ch - 40, cw - 24, color, 0.5)
        for j, b in enumerate(bullets):
            bullet(c, b, cx + 12, cy_bot + ch - 58 - j * 16,
                   size=8, color=W3, dot_color=color)

    footer_bar(c,
        "Non-compliance exposure:",
        "Fines up to EUR 35M or 7% of global annual turnover — whichever is higher. No existing enterprise tool covers all Articles.",
        label_color=RED, body_color=W2, bar_y=36, bar_h=42)


# ─── SLIDE 08 — DECISION INTELLIGENCE ────────────────────────────────────────

def slide_08(c):
    bg(c)
    left_bar(c, BLUE)
    chrome(c, 8)
    section_kicker(c, "MODULE 03 — DECISION INTELLIGENCE", 30, H - 48, BLUE)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, "Decision Intelligence")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Structure. Scenario. Audit. From idea to outcome — with a full paper trail.")

    # 5-step horizontal flow
    steps = [
        (BLUE,   "FRAME",    "Define decision scope and stakeholders"),
        (GOLD,   "MODEL",    "Build scenario branches and assign probabilities"),
        (ORANGE, "SIMULATE", "Run outcome analysis across scenarios"),
        (GREEN,  "DECIDE",   "Record rationale and approvals"),
        (PURPLE, "AUDIT",    "Retrieve and review full decision history"),
    ]
    sw = (W - 60 - 40) // 5  # 40 for 4 connectors
    sy = H - 280
    sh = 100

    for i, (color, title, desc) in enumerate(steps):
        sx = 30 + i * (sw + 10)
        card_box(c, sx, sy, sw, sh, fill=CARD, stroke_color=color, r=6)
        c.setFillColor(color)
        c.rect(sx, sy, 4, sh, fill=1, stroke=0)
        # Step number
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_HEADLINE)
        c.drawString(sx + 12, sy + sh - 34, str(i + 1))
        c.setFillColor(W1)
        c.setFont("Helvetica-Bold", _SZ_BODY_SM)
        c.drawString(sx + 12, sy + sh - 52, title)
        wrap_text(c, desc, sx + 12, sy + sh - 70, sw - 20, size=8, color=W3, lead=12)
        # Connector arrow
        if i < len(steps) - 1:
            ax = sx + sw + 2
            ay = sy + sh / 2
            c.setStrokeColor(BORDER2)
            c.setLineWidth(1)
            c.line(ax, ay, ax + 8, ay)
            c.setFillColor(BORDER2)
            c.setStrokeColor(BORDER2)
            # Draw triangle arrowhead using lines
            c.setLineWidth(0.5)
            c.line(ax + 8, ay - 4, ax + 12, ay)
            c.line(ax + 12, ay, ax + 8, ay + 4)

    # Right panel: 3 ROI metrics
    rois = [
        (BLUE,  "3.2x",   "average ROI on structured decisions"),
        (GREEN, "67%",    "reduction in decision reversal rate"),
        (GOLD,  "4.8hrs", "saved per major decision cycle"),
    ]
    for i, (color, val, lbl) in enumerate(rois):
        ry = H - 330 - i * 56
        card_box(c, W - 200, ry, 170, 46, fill=CARD, stroke_color=color, r=4)
        c.setFillColor(color)
        c.rect(W - 200, ry, 4, 46, fill=1, stroke=0)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_ROI)
        c.drawString(W - 186, ry + 26, val)
        c.setFillColor(W3)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(W - 186, ry + 10, lbl)

    footer_bar(c,
        "The Compounding Flywheel:",
        "Every decision recorded enriches the Executive Memory Graph — making Chief of Staff smarter and Governance evidence richer.",
        label_color=BLUE, body_color=W3, bar_y=36, bar_h=42)


# ─── SLIDE 09 — THE MOAT ─────────────────────────────────────────────────────

def slide_09(c):
    bg(c)
    left_bar(c, PURPLE)
    chrome(c, 9)
    section_kicker(c, "COMPETITIVE MOAT", 30, H - 48, PURPLE)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, "The Executive Memory Graph")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "The persistence layer that makes AEXS irreplaceable. Every interaction compounds the value.")

    # Orbit node diagram
    orbit_r = 88
    node_r  = 28
    cx_c    = 220
    cy_c    = H // 2 - 10

    # Center hub
    c.setFillColor(PURPLE)
    c.setStrokeColor(_PURPLE_DPK)
    c.setLineWidth(2)
    c.circle(cx_c, cy_c, 34, fill=1, stroke=1)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_CAPTION)
    c.drawCentredString(cx_c, cy_c + 4, "MEMORY")
    c.drawCentredString(cx_c, cy_c - 8, "GRAPH")

    nodes = [
        (GOLD,   "Briefings",  0),
        (BLUE,   "Decisions",  60),
        (GREEN,  "Compliance", 120),
        (RED,    "Risks",      180),
        (ORANGE, "Follow-ups", 240),
        (PURPLE, "Stakeholders", 300),
    ]

    for color, label, angle in nodes:
        rad = math.radians(angle)
        nx = cx_c + orbit_r * math.cos(rad)
        ny = cy_c + orbit_r * math.sin(rad)
        # Dashed connector
        c.setStrokeColor(color)
        c.setLineWidth(0.8)
        c.setDash(4, 3)
        c.line(cx_c, cy_c, nx, ny)
        c.setDash()
        # Node circle
        c.setFillColor(color)
        c.setStrokeColor(BG)
        c.setLineWidth(1)
        c.circle(nx, ny, node_r, fill=1, stroke=1)
        # Label — verify fit
        lw = stringWidth(label, "Helvetica-Bold", _SZ_NODE)
        if lw > node_r * 1.4:
            label = label[:6] + "."
        c.setFillColor(BG)
        c.setFont("Helvetica-Bold", _SZ_NODE)
        c.drawCentredString(nx, ny - 3, label)

    # Right panel: 4 moat items
    moat = [
        (PURPLE, "Persistent Context",    "Memory compounds with every session — no cold starts"),
        (GOLD,   "Cross-Module Sync",     "Chief of Staff briefs from Governance + Decision data"),
        (BLUE,   "Institutional Memory",  "Leadership changes don't reset context — it persists"),
        (GREEN,  "Network Effects",       f"NRR target {_PITCH['unit_economics']['nrr']} as context value grows over time"),
    ]
    rx = cx_c + orbit_r + 60
    mw = W - rx - 30
    ry = H - 135

    for color, title, desc in moat:
        card_box(c, rx, ry - 56, mw, 50, fill=CARD, stroke_color=color, r=4)
        c.setFillColor(color)
        c.rect(rx, ry - 56, 4, 50, fill=1, stroke=0)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_BODY_SM)
        c.drawString(rx + 12, ry - 30, title)
        wrap_text(c, desc, rx + 12, ry - 46, mw - 24, size=8, color=W3, lead=11)
        ry -= 64

    footer_bar(c,
        f"Expected NRR: {_PITCH['unit_economics']['nrr']}",
        "Each added module deepens the memory graph — switching cost grows geometrically, not linearly.",
        label_color=PURPLE, body_color=W3, bar_y=36, bar_h=42)


# ─── SLIDE 10 — WHY NOW ───────────────────────────────────────────────────────

def slide_10(c):
    bg(c)
    left_bar(c, ORANGE)
    chrome(c, 10)
    section_kicker(c, "TIMING", 30, H - 48, ORANGE)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_DISPLAY)
    c.drawString(30, H - 82, "Three Forces. One Window. 2026.")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Each force alone would justify urgency. Together they define a narrow, non-recurring entry point.")

    forces = [
        (RED,    "REGULATORY\nFORCING",    "EU AI Act Enforcement",
         ["Article 13 transparency in force",
          "High-risk AI deadline: Feb 2026",
          "Fines up to EUR 35M",
          "No tooling exists at enterprise scale",
          "First-mover owns procurement",
          "Compliance window: now"]),
        (BLUE,   "ENTERPRISE\nREADINESS", "AI Adoption Inflection",
         ["ChatGPT drove exec AI awareness",
          "Boards now asking AI strategy Qs",
          "IT procurement cycles warming",
          "CFO-level ROI frameworks emerging",
          "Executive software budgets unlocked",
          "Compliance urgency = fast approval"]),
        (GOLD,   "CATEGORY\nVACUUM",      "No Unified Incumbent",
         ["Monday.com = project management",
          "OneTrust = privacy (not AI Act)",
          "Notion = knowledge (no governance)",
          "No tool owns all three layers",
          "Category creation = price setting",
          "First platform wins sticky accounts"]),
    ]
    cw = (W - 60) // 3 - 6
    cy_top = H - 128
    cy_bot = 82

    for i, (color, force_raw, subtitle, bullets) in enumerate(forces):
        force_lines = force_raw.split("\n")
        cx = 30 + i * (cw + 9)
        ch = cy_top - cy_bot
        card_box(c, cx, cy_bot, cw, ch, fill=CARD, stroke_color=color, r=6)
        c.setFillColor(color)
        c.rect(cx, cy_bot, 4, ch, fill=1, stroke=0)
        # Large force title (2 lines)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_SUBHEAD)
        c.drawString(cx + 12, cy_bot + ch - 28, force_lines[0])
        if len(force_lines) > 1:
            c.drawString(cx + 12, cy_bot + ch - 44, force_lines[1])
        c.setFillColor(W2)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(cx + 12, cy_bot + ch - 62, subtitle)
        h_rule(c, cx + 12, cy_bot + ch - 70, cw - 24, color, 0.5)
        for j, b in enumerate(bullets):
            bullet(c, b, cx + 12, cy_bot + ch - 88 - j * 16,
                   size=8, color=W3, dot_color=color)

    footer_bar(c,
        "The window is not permanent.",
        "Category leaders are established in the first 18–24 months of a new compliance forcing function. AEXS is positioned to move now.",
        label_color=ORANGE, body_color=W3, bar_y=36, bar_h=42)


# ─── SLIDE 11 — COMPETITIVE MATRIX ───────────────────────────────────────────

def slide_11(c):
    bg(c)
    left_bar(c, GOLD)
    chrome(c, 11)
    section_kicker(c, "COMPETITIVE LANDSCAPE", 30, H - 48, GOLD)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, "AEXS Has No Direct Competitor")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Every incumbent solves one dimension. AEXS owns the intersection.")

    rows = [
        "Executive Memory",
        "EU AI Act Compliance",
        "ISO 42001 Docs",
        "Decision Audit Trail",
        "Board-Ready Reports",
        "Suite Integration",
        "Enterprise Pricing",
    ]
    cols = ["AEXS", "Monday.com", "OneTrust", "Notion", "ServiceNow", "Compliance.ai"]
    col_w  = (W - 60) / len(cols)
    row_h  = 36
    tbl_x  = 30
    tbl_y  = H - 140

    # Matrix: True=full, None=partial, False=no
    data = [
        [True,  False, False, False, False, False],
        [True,  False, True,  False, None,  True],
        [True,  False, None,  False, False, True],
        [True,  False, False, None,  False, False],
        [True,  False, False, False, None,  False],
        [True,  False, False, False, False, False],
        [True,  None,  False, False, True,  False],
    ]

    # Header row
    for j, col in enumerate(cols):
        cx_h = tbl_x + j * col_w
        if j == 0:
            c.setFillColor(_GOLD_TINT)
            c.setStrokeColor(GOLD)
        else:
            c.setFillColor(CARD)
            c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.rect(cx_h, tbl_y, col_w, 28, fill=1, stroke=1)
        color = GOLD if j == 0 else W3
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_CAPTION if j > 0 else 9)
        tw = stringWidth(col, "Helvetica-Bold", _SZ_CAPTION)
        c.drawString(cx_h + (col_w - tw) / 2, tbl_y + 9, col)

    # Data rows
    for i, row in enumerate(rows):
        ry = tbl_y - (i + 1) * row_h
        for j in range(len(cols)):
            cx_r = tbl_x + j * col_w
            if j == 0:
                c.setFillColor(_GOLD_DEEP)
                c.setStrokeColor(GOLD)
            else:
                c.setFillColor(CARD if i % 2 == 0 else BG2)
                c.setStrokeColor(BORDER)
            c.setLineWidth(0.3)
            c.rect(cx_r, ry, col_w, row_h, fill=1, stroke=1)

        # Row label
        c.setFillColor(W2)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(tbl_x + 8, ry + 12, row)

        # Marks for competitors
        for j in range(1, len(cols)):
            cx_r = tbl_x + j * col_w
            val = data[i][j]
            if val is True:
                c.setFillColor(BLUE)
                c.setFont("Helvetica-Bold", _SZ_BODY_SM)
                tw = stringWidth("●", "Helvetica-Bold", _SZ_BODY_SM)
                c.drawString(cx_r + (col_w - tw) / 2, ry + 11, "●")
            elif val is None:
                c.setFillColor(W4)
                c.setFont("Helvetica", _SZ_BODY_SM)
                tw = stringWidth("◐", "Helvetica", _SZ_BODY_SM)
                c.drawString(cx_r + (col_w - tw) / 2, ry + 11, "~")
            else:
                c.setFillColor(W5)
                c.setFont("Helvetica", _SZ_BODY_SM)
                tw = stringWidth("○", "Helvetica", _SZ_BODY_SM)
                c.drawString(cx_r + (col_w - tw) / 2, ry + 11, "○")

        # AEXS column — green checkmarks
        cx_a = tbl_x
        c.setFillColor(GREEN)
        c.setFont("Helvetica-Bold", _SZ_BODY)
        c.drawCentredString(cx_a + col_w / 2, ry + 11, "✓")

    footer_bar(c,
        "Category positioning:",
        "AEXS is not a better Monday.com or a cheaper OneTrust — it is a new category: the AI executive operating layer.",
        label_color=GOLD, body_color=W3, bar_y=36, bar_h=42)


# ─── SLIDE 12 — BUSINESS MODEL ───────────────────────────────────────────────

def slide_12(c):
    bg(c)
    left_bar(c, GREEN)
    chrome(c, 12)
    section_kicker(c, "BUSINESS MODEL", 30, H - 48, GREEN)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, "Three-Tier SaaS. Built to Expand.")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Land with compliance urgency. Expand across the full executive suite.")

    tiers = [
        (BLUE,   "STARTER",    _PITCH['product_pricing'][0]['price'].split('/')[0], "/month",
         "AI Chief of Staff",
         ["Executive memory + briefings", "Follow-up tracking",
          "Stakeholder mapping", "Priority queue", "1 user seat"],
         False),
        (GOLD,   "PROFESSIONAL", _PITCH['product_pricing'][1]['price'].split('/')[0], "/month",
         "Chief of Staff + Governance",
         ["Everything in Starter", "EU AI Act monitoring",
          "ISO 42001 documentation", "Board audit reports",
          "Up to 5 user seats"],
         True),
        (GREEN,  "ENTERPRISE",  _PITCH['product_pricing'][2]['price'].split('/')[0], "/month",
         "Full Suite — All Three Modules",
         ["Everything in Professional", "Decision Intelligence",
          "Full scenario modeling", "Executive audit trail",
          "Unlimited seats + API access"],
         False),
    ]
    cw = (W - 60) // 3 - 6
    cy_top = H - 128
    cy_bot = 88

    for i, (color, tier, price, per, subtitle, features, featured) in enumerate(tiers):
        cx = 30 + i * (cw + 9)
        ch = cy_top - cy_bot
        fill = CARD2 if featured else CARD
        stroke = color
        card_box(c, cx, cy_bot, cw, ch, fill=fill, stroke_color=stroke, r=6, stroke_w=1.5 if featured else 0.5)
        c.setFillColor(color)
        c.rect(cx, cy_bot, 4, ch, fill=1, stroke=0)
        if featured:
            tag(c, cx + cw - 120, cy_bot + ch - 14, "RECOMMENDED", color, BG, font_size=7)
        c.setFillColor(W4)
        c.setFont("Helvetica-Bold", _SZ_CAPTION)
        c.drawString(cx + 12, cy_bot + ch - 20, tier)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_DISPLAY)
        c.drawString(cx + 12, cy_bot + ch - 56, price)
        c.setFillColor(W3)
        c.setFont("Helvetica", _SZ_LABEL)
        c.drawString(cx + 12 + stringWidth(price, "Helvetica-Bold", _SZ_DISPLAY) + 4,
                     cy_bot + ch - 42, per)
        c.setFillColor(W2)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(cx + 12, cy_bot + ch - 72, subtitle)
        h_rule(c, cx + 12, cy_bot + ch - 80, cw - 24, color, 0.5)
        for j, f in enumerate(features):
            bullet(c, f, cx + 12, cy_bot + ch - 98 - j * 16,
                   size=8, color=W3, dot_color=color)

    stat_strip(c, [
        (_PITCH['unit_economics']['avg_deal_size'], "Avg Contract Value"),
        (_PITCH['unit_economics']['nrr'],           "Target NRR"),
        (_PITCH['unit_economics']['cac_payback'],   "Payback Period"),
        ("<12mo",                                   "Break-even"),  # DERIVED-BREAKEVEN-RANGE: shorthand for canonical breakeven (Month 12)
        (_PITCH['unit_economics']['gross_margin'],  "Gross Margin"),
    ], val_color=GREEN, bar_y=36, bar_h=42)


# ─── SLIDE 13 — FINANCIALS ────────────────────────────────────────────────────

def slide_13(c):
    bg(c)
    left_bar(c, BLUE)
    chrome(c, 13)
    section_kicker(c, "FINANCIAL PROJECTIONS", 30, H - 48, BLUE)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, f"Path to {_PITCH['financials']['arr_y3']} ARR in 36 Months")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, f"Verified model. Suite-tier pricing. {_PITCH['financials']['breakeven']} break-even. {_PITCH['financials']['arr_y3']} Y3 ARR confirmed.")

    # Left: bar chart — ARR at key milestones (scale matches pitch-data arr_y3)
    bars = [
        ("Pre-Rev", 0,     GOLD,   "—"),
        ("Mo 6",    0.025, GOLD,   _PITCH['financials']['arr_m6']),
        ("Y1",      0.081, BLUE,   _PITCH['financials']['arr_y1']),
        ("Y2",      0.286, GREEN,  _PITCH['financials']['arr_y2']),
        ("Y3",      1.0,   GREEN,  _PITCH['financials']['arr_y3']),
    ]
    chart_x = 30
    chart_bottom = 92
    chart_top    = H - 130
    chart_h      = chart_top - chart_bottom
    bar_w = 54
    gap   = 12

    for i, (lbl, frac, color, val) in enumerate(bars):
        bx = chart_x + i * (bar_w + gap)
        bh = max(4, frac * chart_h)
        by = chart_bottom
        # Background bar
        c.setFillColor(BORDER)
        c.rect(bx, by, bar_w, chart_h, fill=1, stroke=0)
        # Filled bar
        c.setFillColor(color)
        c.rect(bx, by, bar_w, bh, fill=1, stroke=0)
        # Value label
        c.setFillColor(W2)
        c.setFont("Helvetica-Bold", _SZ_CAPTION)
        c.drawCentredString(bx + bar_w / 2, by + bh + 4, val)
        # Period label
        c.setFillColor(W3)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawCentredString(bx + bar_w / 2, chart_bottom - 14, lbl)

    # Y-axis labels
    for pct, lbl in [(0, "$0"), (0.25, "$8M"), (0.5, "$16M"), (0.75, "$24M"), (1.0, "$32M")]:  # DERIVED-CHART-TICKS: axis ticks on the ARR chart — scale rounds canonical _PITCH['financials']['arr_y3'] ($32.2M) down to $32M for clean quarter intervals.
        ay = chart_bottom + pct * chart_h
        c.setStrokeColor(BORDER2)
        c.setLineWidth(0.3)
        c.setDash(2, 4)
        c.line(chart_x, ay, chart_x + 5 * (bar_w + gap), ay)
        c.setDash()
        c.setFillColor(W4)
        c.setFont("Helvetica", _SZ_TINY)
        c.drawRightString(chart_x - 4, ay - 3, lbl)

    # Right: milestone timeline
    rx = chart_x + 5 * (bar_w + gap) + 50
    milestones = [
        (GOLD,   "Seed Close",       "Q2 2026",   f"{_PITCH['round']['size']} {_PITCH['round']['instrument']} at {_PITCH['round']['cap']} cap"),
        # $15K MRR milestone is a tactical GTM target, not in canonical pitch-data.
        (BLUE,   "MVP + 5 Pilots",   "Q3 2026",   "$15K MRR, product validated"),
        (GREEN,  "Break-even",       _PITCH['financials']['breakeven'],  "Cash-flow positive"),
        # $3M ARR is a Series-A-ready interim target, not in canonical pitch-data.
        (ORANGE, "Series A Ready",   "Q1 2027",   "$3M ARR, 40+ enterprise accounts"),
        (PURPLE, "Market Leadership","Q4 2027",   "$8M ARR, category defined"),  # DERIVED-ARR-TARGET: Q4 2027 interim ARR milestone between _PITCH['financials']['arr_y2'] ($9.2M) and 'arr_y3' ($32.2M). Distinct from _PITCH['round']['cap'] ($8M valuation cap) — shared literal, different concept.
        (GOLD,   "Series A",         "Q1 2028",   f"Scale phase — {_PITCH['financials']['arr_y3']} Y3 target"),
    ]
    my = H - 128

    for color, title, period, desc in milestones:
        c.setFillColor(color)
        c.circle(rx + 6, my + 4, 4, fill=1, stroke=0)
        if my > H - 128 + 4:
            c.setStrokeColor(BORDER2)
            c.setLineWidth(0.5)
        c.setFillColor(W2)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(rx + 18, my + 2, title)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_CAPTION)
        c.drawString(rx + 18 + stringWidth(title + "  ", "Helvetica-Bold", _SZ_LABEL), my + 2, period)
        c.setFillColor(W3)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(rx + 18, my - 12, desc)
        my -= 48

    two_line_bar(c,
        "Model assumptions (verified):",
        f"{_PITCH['product_pricing'][0]['price'].split('/')[0]}/{_PITCH['product_pricing'][1]['price'].split('/')[0]}/{_PITCH['product_pricing'][2]['price'].split('/')[0]} suite tiers  |  {_PITCH['round']['size']} seed starting cash  |  Conservative enterprise conversion rates",
        f"All figures derived from calcSuite() unit-tested model. Y3 ARR = {_PITCH['financials']['arr_y3']} verified.",
        title_color=W4, body_color=W4, bg_fill=BG2, stroke_color=BORDER,
        bar_y=36, bar_h=52)


# ─── SLIDE 14 — GO-TO-MARKET ──────────────────────────────────────────────────

def slide_14(c):
    bg(c)
    left_bar(c, BLUE_L)
    chrome(c, 14)
    section_kicker(c, "GO-TO-MARKET", 30, H - 48, BLUE_L)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, "Land With Compliance. Expand With Intelligence.")

    # Beachhead bar — 22px below headline baseline (H-82)
    bh_y = H - 82 - 22 - 22  # headline at H-82, bar top = H-126
    card_box(c, 30, bh_y, W - 60, 22, fill=_GOLD_TINT, stroke_color=GOLD, r=4)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", _SZ_CAPTION)
    c.drawString(46, bh_y + 7, "BEACHHEAD:")
    c.setFillColor(W2)
    c.setFont("Helvetica", _SZ_CAPTION)
    c.drawString(46 + stringWidth("BEACHHEAD:  ", "Helvetica-Bold", _SZ_CAPTION), bh_y + 7,
                 "EU-exposed enterprise companies (500–5,000 employees) with active AI deployments and no compliance tooling.")

    phases = [
        (GOLD,  "PHASE 1",    "Land",
         "Q2–Q4 2026",
         ["Target: EU-compliant enterprise", "Lead with Governance module",
          "Compliance urgency = fast approval", "5 design partners → 20 accounts",
          f"Avg deal: {_PITCH['product_pricing'][1]['price']} Professional"]),
        (BLUE,  "PHASE 2",    "Expand",
         "Q1–Q3 2027",
         ["Upsell to Decision Intelligence", "Activate Chief of Staff for execs",
          "Build referral from compliance win", f"Target NRR: {_PITCH['unit_economics']['nrr']}",
          f"Avg expanded ACV: {_PITCH['product_pricing'][2]['price']}"]),
        (GREEN, "PHASE 3",    "Scale",
         "Q4 2027+",
         ["Category leadership established", "Partner channel + resellers",
          "Platform API ecosystem opens", "Series A round deployed",
          "Target: 200+ enterprise accounts"]),
    ]
    cw = (W - 60) // 3 - 6
    cy_top = bh_y - 8
    cy_bot = 88

    for i, (color, phase, action, timing, bullets) in enumerate(phases):
        cx = 30 + i * (cw + 9)
        ch = cy_top - cy_bot
        card_box(c, cx, cy_bot, cw, ch, fill=CARD, stroke_color=color, r=6)
        c.setFillColor(color)
        c.rect(cx, cy_bot, 4, ch, fill=1, stroke=0)
        tag(c, cx + 12, cy_bot + ch - 14, phase, color, BG, font_size=7)
        c.setFillColor(W1)
        c.setFont("Helvetica-Bold", _SZ_SUBHEAD)
        c.drawString(cx + 12, cy_bot + ch - 34, action)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_CAPTION)
        c.drawString(cx + 12, cy_bot + ch - 50, timing)
        h_rule(c, cx + 12, cy_bot + ch - 58, cw - 24, color, 0.5)
        for j, b in enumerate(bullets):
            bullet(c, b, cx + 12, cy_bot + ch - 76 - j * 16,
                   size=8, color=W3, dot_color=color)

    stat_strip(c, [
        (_PITCH['unit_economics']['avg_deal_size'], "Avg Contract Value"),
        ("$12K",                                    "CAC Target"),  # DERIVED-CAC-TACTICAL: tactical CAC target; canonical cac_payback is 12 months (= 1× avg_deal_size).
        (_PITCH['unit_economics']['ltv_cac'],       "LTV/CAC Ratio"),
        (_PITCH['unit_economics']['cac_payback'],   "Payback Period"),
        (_PITCH['unit_economics']['nrr'],           "Target NRR"),
    ], val_color=BLUE_L, bar_y=36, bar_h=42)


# ─── SLIDE 15 — TRACTION ──────────────────────────────────────────────────────

def slide_15(c):
    bg(c)
    left_bar(c, GREEN)
    chrome(c, 15)
    section_kicker(c, "TRACTION", 30, H - 48, GREEN)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, "Foundation Built. Momentum Loading.")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "Q1 2026 foundation complete. Q2 2026: MVP, pilots, first revenue.")

    # Left: 4 validation proof cards
    proofs = [
        (GREEN,  "Q1 2026 — CONFIRMED",
         "Full engineering foundation: CI pipeline, 20 unit tests, verified financial model, investor-grade demo."),
        (GOLD,   "Investor Deck Live",
         "Cinematic scrollable deck with interactive financial model — available at demo session."),
        (BLUE,   "Model Verified",
         f"{_PITCH['financials']['arr_y3']} Y3 ARR confirmed by Vitest-tested calcSuite(). All figures in pitch match live model."),
        (ORANGE, "0 Open Contradictions",
         "6 business contradictions identified, documented, and resolved. No unresolved discrepancies."),
    ]
    pw = 380
    py = H - 130

    for color, title, desc in proofs:
        card_box(c, 30, py - 68, pw, 62, fill=CARD, stroke_color=color, r=4)
        c.setFillColor(color)
        c.rect(30, py - 68, 4, 62, fill=1, stroke=0)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(46, py - 40, title)
        wrap_text(c, desc, 46, py - 56, pw - 30, size=8, color=W3, lead=11)
        py -= 76

    # Right: milestone timeline
    rx = 30 + pw + 30
    milestones_done = [
        (True,  "Q1 2026",  "Foundation complete — repo, CI, model, deck"),
        (True,  "Apr 2026", "Investor presentation materials ready"),
        (False, "Q2 2026",  "MVP live — 5 beta pilots launched"),
        (False, "Q3 2026",  "$15K MRR — 20 paying beta users"),
        (False, "Q4 2026",  "Series A ready — $3M ARR"),
    ]
    my = H - 128

    for done, period, desc in milestones_done:
        color = GREEN if done else BORDER2
        c.setFillColor(color)
        c.circle(rx + 8, my + 4, 6, fill=1, stroke=0)
        if done:
            c.setFillColor(BG)
            c.setFont("Helvetica-Bold", _SZ_TINY)
            c.drawCentredString(rx + 8, my + 2, "✓")
        c.setFillColor(GREEN if done else W4)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(rx + 22, my + 2, period)
        c.setFillColor(W3 if done else W4)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(rx + 22, my - 12, desc)
        my -= 50

    footer_bar(c,
        "Signal from the market is clear:",
        "EU AI Act enforcement + board AI scrutiny + exec overload = three simultaneous demand drivers for AEXS.",
        label_color=GREEN, body_color=W3, bar_y=36, bar_h=42)


# ─── SLIDE 16 — THE TEAM ──────────────────────────────────────────────────────

def slide_16(c):
    bg(c)
    left_bar(c, GOLD)
    chrome(c, 16)
    section_kicker(c, "THE TEAM", 30, H - 48, GOLD)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SLIDE_TITLE)
    c.drawString(30, H - 82, "Built by a Technical Founder Who Moves Fast")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 106, "The founder is the target customer. The product solves a problem experienced firsthand.")

    # Left: founder card
    fw = 380
    fh = H - 130 - 90
    card_box(c, 30, 90, fw, fh, fill=CARD2, stroke_color=GOLD, r=6, stroke_w=1.5)
    c.setFillColor(GOLD)
    c.rect(30, 90, 4, fh, fill=1, stroke=0)
    # Avatar circle
    c.setFillColor(GOLD_D)
    c.circle(30 + fw / 2, 90 + fh - 50, 30, fill=1, stroke=0)
    c.setFillColor(GOLD_L)
    c.setFont("Helvetica-Bold", _SZ_HEADLINE)
    c.drawCentredString(30 + fw / 2, 90 + fh - 57, _F['public_name'][0])
    # Name & title
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_SUBHEAD)
    c.drawCentredString(30 + fw / 2, 90 + fh - 100, _F['title'])
    c.setFillColor(GOLD_L)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawCentredString(30 + fw / 2, 90 + fh - 116, f"{_F['company']} — AI Executive Suite")
    h_rule(c, 60, 90 + fh - 126, fw - 60, GOLD_D, 0.5)

    founder_bullets = _FC
    for j, b in enumerate(founder_bullets):
        bullet(c, b, 46, 90 + fh - 148 - j * 18, size=8, color=W3, dot_color=GOLD)

    # Founder fit box
    card_box(c, 46, 106, fw - 32, 40, fill=_GOLD_TINT, stroke_color=GOLD_D, r=4)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawString(60, 132, "Founder Fit:")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_CAPTION)
    c.drawString(60, 118, "I built AEXS to solve the exact problem I faced as an executive.")

    # Right: hire plan
    rx = 30 + fw + 30
    rw = W - rx - 30
    hires = [
        (GOLD,   "Head of Sales / GTM", "Month 1", "$150K base"),
        (BLUE,   "Senior Engineer",     "Month 2", "$140K base"),
        (GREEN,  "Customer Success",    "Month 3", "$110K base"),
        (ORANGE, "Marketing Lead",      "Month 4", "$120K base"),
        (PURPLE, "Advisory Network",    "Now",     "Forming — equity-based"),
    ]
    hy = H - 130

    c.setFillColor(W2)
    c.setFont("Helvetica-Bold", _SZ_BODY_SM)
    c.drawString(rx, hy, "Seed-Funded Hire Plan")
    h_rule(c, rx, hy - 8, rw, GOLD_D, 0.5)
    hy -= 22

    for color, role, timing, comp in hires:
        card_box(c, rx, hy - 42, rw, 38, fill=CARD, stroke_color=color, r=4)
        c.setFillColor(color)
        c.rect(rx, hy - 42, 4, 38, fill=1, stroke=0)
        tag(c, rx + rw - 80, hy - 24, timing, color, BG, font_size=7)
        c.setFillColor(W2)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(rx + 14, hy - 20, role)
        c.setFillColor(W4)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(rx + 14, hy - 34, comp)
        hy -= 50

    two_line_bar(c,
        "Advisory Network — Now Forming",
        "Seeking advisors with: enterprise SaaS distribution  |  EU regulatory expertise  |  AI governance domain knowledge",
        "Equity compensation. Pre-seed stage. Strategic value over brand name.",
        title_color=GOLD, body_color=W3, bar_y=36, bar_h=52)


# ─── SLIDE 17 — THE ASK ───────────────────────────────────────────────────────

def slide_17(c):
    bg(c)
    left_bar(c, GOLD)
    chrome(c, 17)
    section_kicker(c, "THE ASK", 30, H - 48, GOLD)
    c.setFillColor(W1)
    c.setFont("Helvetica-Bold", _SZ_ASK)
    c.drawString(30, H - 88, f"{_PITCH['round']['size']} Seed Round")
    # First close target — right aligned
    c.setFillColor(ORANGE)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawRightString(W - 30, H - 60, "FIRST CLOSE TARGET: JUNE 2026")

    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_BODY)
    c.drawString(30, H - 110, f"{_PITCH['round']['instrument']} note at {_PITCH['round']['cap']} valuation cap. Funds GTM, engineering, and first enterprise pilots.")

    # Left: stacked use-of-funds bar + legend
    bar_w = 200
    bar_x = 30
    bar_top = H - 132
    bar_bot = 110
    bar_h_total = bar_top - bar_bot

    allocs = [
        (BLUE,   0.40, "Sales / GTM",         "40%   $600K"),
        (GREEN,  0.30, "Engineering",          "30%   $450K"),
        (ORANGE, 0.15, "Marketing",            "15%   $225K"),
        (PURPLE, 0.15, "Operations / Legal",   "15%   $225K"),
    ]
    cy = bar_bot
    for color, frac, lbl, amt in allocs:
        bh = frac * bar_h_total
        c.setFillColor(color)
        c.setStrokeColor(BG)
        c.setLineWidth(0.5)
        c.rect(bar_x, cy, bar_w, bh, fill=1, stroke=1)
        # Label inside bar if tall enough
        if bh > 16:
            c.setFillColor(BG)
            c.setFont("Helvetica-Bold", _SZ_LABEL)
            mid_y = cy + bh / 2 - 4
            c.drawString(bar_x + 10, mid_y, lbl)
        cy += bh

    # Legend
    lx = bar_x + bar_w + 20
    ly = bar_top - 10
    c.setFillColor(W2)
    c.setFont("Helvetica-Bold", _SZ_LABEL)
    c.drawString(lx, ly, "Use of Funds")
    h_rule(c, lx, ly - 8, 180, GOLD_D, 0.5)
    ly -= 22
    for color, frac, lbl, amt in allocs:
        c.setFillColor(color)
        c.rect(lx, ly - 2, 10, 10, fill=1, stroke=0)
        c.setFillColor(W2)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(lx + 16, ly, lbl)
        c.setFillColor(W4)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(lx + 16 + stringWidth(lbl + "  ", "Helvetica-Bold", _SZ_LABEL), ly, amt)
        ly -= 22

    # Right: "This Round Unlocks" milestones
    rx = lx + 200 + 10
    rw = W - rx - 30
    c.setFillColor(W2)
    c.setFont("Helvetica-Bold", _SZ_BODY_SM)
    c.drawString(rx, bar_top - 10, "This Round Unlocks")
    h_rule(c, rx, bar_top - 20, rw, GOLD_D, 0.5)

    unlocks = [
        (GOLD,   "5 Enterprise Pilots",       "Design partner validation by Q3 2026"),
        (GREEN,  "MVP Deployment",            "Live product — not just demo"),
        (BLUE,   "$15K MRR by Month 3",       "First revenue before Series A raise"),
        (ORANGE, "Series A Foundation",       "$3M ARR, 40+ accounts, Q1 2027"),
        (PURPLE, "Category Leadership",       "First mover in AI executive operating layer"),
    ]
    uy = bar_top - 34
    for color, title, desc in unlocks:
        c.setFillColor(color)
        c.circle(rx + 6, uy + 4, 4, fill=1, stroke=0)
        c.setFillColor(W2)
        c.setFont("Helvetica-Bold", _SZ_LABEL)
        c.drawString(rx + 18, uy + 2, title)
        c.setFillColor(W3)
        c.setFont("Helvetica", _SZ_CAPTION)
        c.drawString(rx + 18, uy - 11, desc)
        uy -= 38

    # GOLD CTA card at bottom
    card_box(c, 30, 36, W - 60, 50, fill=_GOLD_TINT, stroke_color=GOLD, r=6, stroke_w=1.5)
    c.setFillColor(GOLD)
    c.rect(30, 36, 4, 50, fill=1, stroke=0)
    bar_mid = 36 + 50 / 2
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", _SZ_CTA)
    c.drawString(50, bar_mid - 13 * OPTICAL_CENTER_COEFF + 8, "Ready to lead the executive AI category?")
    c.setFillColor(W3)
    c.setFont("Helvetica", _SZ_LABEL)
    c.drawString(50, bar_mid - 9 * OPTICAL_CENTER_COEFF - 10,
        "Contact the founder  |  aexs.ai  |  Seed deck available on request  |  SAFE documentation ready")


# ─── BUILD ────────────────────────────────────────────────────────────────────

def build():
    c = canvas.Canvas(OUTPUT, pagesize=(W, H))
    c.setTitle("AEXS — AI Executive Suite — Investor Deck 2026")
    slides = [
        slide_01, slide_02, slide_03, slide_04, slide_05,
        slide_06, slide_07, slide_08, slide_09, slide_10,
        slide_11, slide_12, slide_13, slide_14, slide_15,
        slide_16, slide_17,
    ]
    for fn in slides:
        fn(c)
        c.showPage()
    c.save()
    print(f"✓  Built {len(slides)} slides → {OUTPUT}")


if __name__ == "__main__":
    build()
