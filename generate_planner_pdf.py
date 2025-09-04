def draw_journal_lines(canvas, doc):
    """Draw light gray horizontal rules every 18pt from a fixed top y down to just above bottom margin."""
    from reportlab.lib.colors import HexColor
    line_color = HexColor('#B0B0B0')
    line_width = 0.5
    # Set the top y for journal lines (e.g., below prompts)
    top_y = doc.bottomMargin + 220  # adjust as needed for prompt height
    bottom_y = doc.bottomMargin + 18  # leave a gap above bottom margin
    left_x = doc.leftMargin
    right_x = doc.leftMargin + doc.width
    y = top_y
    canvas.saveState()
    canvas.setStrokeColor(line_color)
    canvas.setLineWidth(line_width)
    while y > bottom_y:
        canvas.line(left_x, y, right_x, y)
        y -= 18
    canvas.restoreState()
"""
Astro Planner 4-page PDF generator (refactored for new schema)
"""
import os
import sys
import argparse
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, HRFlowable, PageBreak, FrameBreak, ListFlowable, ListItem, KeepTogether, Flowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.lib import colors
from validate_json import validate_json, load_json, load_schema

# Font registration
pdfmetrics.registerFont(TTFont("DejaVu", "fonts/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DejaVu-Bold", "fonts/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DejaVu-Oblique", "fonts/DejaVuSans-Oblique.ttf"))
pdfmetrics.registerFont(TTFont("DejaVu-BoldOblique", "fonts/DejaVuSans-BoldOblique.ttf"))
try:
    pdfmetrics.registerFont(TTFont("Symbola", "fonts/Symbola.ttf"))
    HAS_SYMBOLA = True
except Exception:
    HAS_SYMBOLA = False
registerFontFamily("DejaVu",
    normal="DejaVu",
    bold="DejaVu-Bold",
    italic="DejaVu-Oblique",
    boldItalic="DejaVu-BoldOblique")

# Section divider
class CustomSectionDivider(Flowable):
    def __init__(self, width="100%", thickness=0.5, color=colors.HexColor('#B0B0B0'), spaceBefore=8, spaceAfter=8):
        super().__init__()
        self.width = width
        self.thickness = thickness
        self.color = color
        self.spaceBefore = spaceBefore
        self.spaceAfter = spaceAfter
    def wrap(self, availWidth, availHeight):
        self._width = availWidth if self.width == "100%" else float(self.width)
        return self._width, self.spaceBefore + self.spaceAfter
    def draw(self):
        y = 0
        x1 = 0
        x2 = self._width
        canv = self.canv
        canv.saveState()
        canv.setStrokeColor(self.color)
        canv.setLineWidth(self.thickness)
        deco_font = "Helvetica"
        deco_font_size = 13
        star_width = canv.stringWidth('\u2727', deco_font, deco_font_size)
        canv.line(x1 + star_width + 2, y, x2 - star_width - 2, y)
        canv.setFont(deco_font, deco_font_size)
        canv.setFillColor(self.color)
        canv.drawString(x1, y - deco_font_size/3, '\u2727')
        canv.drawString(x2 - star_width, y - deco_font_size/3, '\u2727')
        canv.restoreState()

# Moon phase emoji helpers
def get_moon_emoji(phase):
    mapping = {
        "new moon": "\U0001F311",
        "waxing crescent": "\U0001F312",
        "first quarter": "\U0001F313",
        "waxing gibbous": "\U0001F314",
        "full moon": "\U0001F315",
        "waning gibbous": "\U0001F316",
        "last quarter": "\U0001F317",
        "waning crescent": "\U0001F318"
    }
    phase_lc = (phase or "").strip().lower()
    return mapping.get(phase_lc, "\U0001F315")

def get_args():
    parser = argparse.ArgumentParser(description="Astro Planner PDF Generator (4-page)")
    parser.add_argument('--input', help='Path to input JSON')
    parser.add_argument('--output', help='Path to output PDF')
    parser.add_argument('--date', help='Override date for header')
    parser.add_argument('--gui', action='store_true', help='Open GUI file pickers for input/output')
    return parser.parse_args()

############################################################
# HEADER/FOOTER DRAWING (LOCKED FOR ALL PAGES)
#
# The draw_header function below defines the ONLY header style for all pages.
# Do not modify this function except for global header changes.
# All PageTemplates must use this header for consistency.
#
# If you need to change the header, update this function and re-test all pages.
############################################################
# Header/footer drawing
HEADER_HEIGHT = 32
MARGIN = 0.6 * inch

def draw_header(canvas, doc, data):
    #
    # NOTE: This header is used on ALL pages. Do not override or bypass this function.
    #
    left_x = doc.leftMargin
    right_x = doc.leftMargin + doc.width
    mid_x = (left_x + right_x) / 2.0
    y = doc.height + doc.bottomMargin + 10
    # Left: Date (bold, Month-DD-YYYY)
    date_str = data.get('date', '')
    import re
    from datetime import datetime
    # Extract day of week from parenthesis if present
    day_of_week = ''
    m_day = re.search(r"\((\w+)\)", date_str)
    if m_day:
        day_of_week = m_day.group(1)
    # Remove any parenthetical day from the date string
    date_clean = re.sub(r"\s*\(.*\)$", "", date_str).strip()
    date_fmt = date_clean
    # Try to parse YYYY-MM-DD from anywhere in the string
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", date_clean)
    if m:
        try:
            dt = datetime.strptime(m.group(0), "%Y-%m-%d")
            date_fmt = dt.strftime("%B %d, %Y")
        except Exception:
            date_fmt = date_clean
    else:
        # Try to match 'Month DD, YYYY' or fallback
        m2 = re.match(r"([A-Za-z]+)\s*(\d{1,2}),\s*(\d{4})", date_clean)
        if m2:
            date_fmt = f"{m2.group(1)} {int(m2.group(2))}, {m2.group(3)}"
    # Draw crystal ball image at left edge of header, always
    crystal_ball_path = os.path.join('assets', 'CrystalBall.png')
    crystal_ball_size = 36  # px
    # Top-align the image with the date text
    date_font_size = 12
    date_y = y  # Baseline of date text
    # Calculate the top of the date text
    date_top_y = date_y + date_font_size
    crystal_ball_y = date_top_y - crystal_ball_size
    if os.path.exists(crystal_ball_path):
        canvas.drawImage(crystal_ball_path, left_x, crystal_ball_y, width=crystal_ball_size, height=crystal_ball_size, mask='auto')
    # Draw the date to the right of the image, inside the margin
    date_x = left_x + crystal_ball_size + 11
    canvas.setFont('DejaVuSans-Bold', date_font_size)
    canvas.setFillColor(colors.black)
    canvas.drawString(date_x, date_y, date_fmt)

    # Decorative line below header with diamond/star symbols
    symbol = '\u2726'  # Unicode sparkle/diamond
    symbol_font = 'Symbola' if HAS_SYMBOLA else 'Helvetica'
    symbol_size = 16
    canvas.setFont(symbol_font, symbol_size)
    symbol_width = canvas.stringWidth(symbol, symbol_font, symbol_size)
    line_color = colors.HexColor('#B0B0B0')
    # Move the line further down for more space (additional 20 points)
    line_y = date_y - 43  # Raise line by 1 more point
    # Center the whole group (star + gap + line + gap + star)
    gap = 6
    line_length = right_x - left_x - 2 * (symbol_width + gap)
    group_width = 2 * symbol_width + 2 * gap + line_length
    group_left = left_x + (right_x - left_x - group_width) / 2
    # Draw diamond/star symbols at each end, raised by 3 points, as outlined (border only, white fill)
    left_star_x = group_left
    right_star_x = group_left + symbol_width + gap + line_length + gap
    star_y = line_y - 4
    soft_grey = colors.HexColor('#B0B0B0')
    # Draw white fill first (slightly smaller)
    canvas.setFont(symbol_font, symbol_size - 1)
    canvas.setFillColor(colors.white)
    canvas.drawString(left_star_x + 0.5, star_y + 0.5, symbol)
    canvas.drawString(right_star_x + 0.5, star_y + 0.5, symbol)
    # Draw border in soft gray (slightly larger)
    canvas.setFont(symbol_font, symbol_size + 1)
    canvas.setFillColor(soft_grey)
    canvas.drawString(left_star_x - 1, star_y - 1, symbol)
    canvas.drawString(right_star_x - 1, star_y - 1, symbol)
    # Draw horizontal line between the stars, bold and darker gray
    # Use the same soft gray for both the line and the stars
    canvas.setStrokeColor(soft_grey)
    canvas.setLineWidth(1.2)
    line_start = left_star_x + symbol_width + gap
    line_end = right_star_x - gap
    canvas.line(line_start, line_y, line_end, line_y)
    canvas.saveState()
    left_x = doc.leftMargin
    right_x = doc.leftMargin + doc.width
    mid_x = (left_x + right_x) / 2.0
    y = doc.height + doc.bottomMargin + 10
    # Left: Date (bold, Month-DD-YYYY)
    date_str = data.get('date', '')
    import re
    from datetime import datetime
    # Extract day of week from parenthesis if present
    day_of_week = ''
    m_day = re.search(r"\((\w+)\)", date_str)
    if m_day:
        day_of_week = m_day.group(1)
    # Remove any parenthetical day from the date string
    date_clean = re.sub(r"\s*\(.*\)$", "", date_str).strip()
    date_fmt = date_clean
    # Try to parse YYYY-MM-DD from anywhere in the string
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", date_clean)
    if m:
        try:
            dt = datetime.strptime(m.group(0), "%Y-%m-%d")
            date_fmt = dt.strftime("%B %d, %Y")
        except Exception:
            date_fmt = date_clean
    else:
        # Try to match 'Month DD, YYYY' or fallback
        m2 = re.match(r"([A-Za-z]+)\s*(\d{1,2}),\s*(\d{4})", date_clean)
        if m2:
            date_fmt = f"{m2.group(1)} {int(m2.group(2))}, {m2.group(3)}"
    # Draw crystal ball image at left edge of header, always
    crystal_ball_path = os.path.join('assets', 'CrystalBall.png')
    crystal_ball_size = 36  # px
    # Top-align the image with the date text
    date_font_size = 12
    date_y = y  # Baseline of date text
    # Calculate the top of the date text
    date_top_y = date_y + date_font_size
    crystal_ball_y = date_top_y - crystal_ball_size
    if os.path.exists(crystal_ball_path):
        canvas.drawImage(crystal_ball_path, left_x, crystal_ball_y, width=crystal_ball_size, height=crystal_ball_size, mask='auto')
    # Draw the date to the right of the image, inside the margin
    date_x = left_x + crystal_ball_size + 11
    canvas.setFont('DejaVuSans-Bold', date_font_size)
    canvas.setFillColor(colors.black)
    canvas.drawString(date_x, date_y, date_fmt)

    # Draw day of week on the right, same line
    if day_of_week:
        day_map = {
            'Mon': 'Monday',
            'Tue': 'Tuesday',
            'Wed': 'Wednesday',
            'Thu': 'Thursday',
            'Fri': 'Friday',
            'Sat': 'Saturday',
            'Sun': 'Sunday'
        }
    full_day = day_map.get(day_of_week, day_of_week)
    canvas.setFont("DejaVuSans-Bold", 12)
    canvas.setFillColor(colors.black)
    canvas.drawRightString(right_x, y, full_day)
    # Center: Moon icon, lunar cycle, zodiac (move down by one line)
    phase_full = data.get('moon_phase_sign', '')
    phase_name = phase_full.split(' in ')[0] if ' in ' in phase_full else phase_full
    moon_emoji = get_moon_emoji(phase_name)
    y_center = y - 16 - 16  # move down by one more line (16pt)
    canvas.setFont("Symbola" if HAS_SYMBOLA else "Helvetica", 14)
    moon_w = canvas.stringWidth(moon_emoji, "Symbola" if HAS_SYMBOLA else "Helvetica", 14)
    canvas.setFont("Helvetica-Oblique", 11)
    phase_w = canvas.stringWidth(phase_full, "Helvetica-Oblique", 11)
    total_w = moon_w + 6 + phase_w
    start_x = mid_x - total_w / 2
    canvas.setFont("Symbola" if HAS_SYMBOLA else "Helvetica", 14)
    canvas.setFillColor(colors.black)
    canvas.drawString(start_x, y_center, moon_emoji)
    canvas.setFont("Helvetica-Oblique", 11)
    canvas.drawString(start_x + moon_w + 6, y_center, phase_full)
    canvas.restoreState()

def draw_footer(canvas, doc, data):
    canvas.saveState()
    canvas.setFont("DejaVu-Oblique", 9)
    canvas.setFillColor(colors.HexColor('#888888'))
    canvas.drawCentredString(doc.leftMargin + doc.width/2, doc.bottomMargin - 8, "✦ As above, so below ✦")
    canvas.restoreState()

# --- PAGE RENDERERS ---
def render_page_1_horoscope(data, story, styles):
    story.append(Paragraph("✦ HOROSCOPE ✦", styles['H1']))
    # Add planet of the day at the top of the Horoscope body
    planet = data.get('day_planet', '')
    if planet:
        story.append(Paragraph(f"<b>Planet of the Day:</b> {planet}", styles['Body']))
    h = data.get('horoscope', {})
    # 1. Transit Summary
    transit_summary = h.get('transit_summary')
    if isinstance(transit_summary, list):
        transit_items = [Paragraph(f"• {item}", styles['Body']) for item in transit_summary if item]
        if transit_items and all(isinstance(i, Paragraph) for i in transit_items):
            story.append(Paragraph("<b>Transit Summary</b>", styles['Label']))
            for para in transit_items:
                story.append(para)
    # 2. Upcoming Events
    if h.get('upcoming_events'):
        story.append(Paragraph("<b>Upcoming Events</b>", styles['Label']))
        for ev in h['upcoming_events']:
            when = ev.get('when', '')
            text = ev.get('text', '')
            bullet = f"<b>{when}:</b> {text}"
            story.append(Paragraph(bullet, styles['Body']))
    # 3. Focus of the Day
    focus = h.get('focus_of_day', {})
    if focus:
        story.append(Paragraph("<b>Focus of the Day</b>", styles['Label']))
        for k, label in [('dos', "Do's"), ('donts', "Don'ts"), ('opportunities', "Opportunities"), ('warnings', "Warnings")]:
            focus_items = focus.get(k)
            para_items = [Paragraph(f"• {item}", styles['Body']) for item in focus_items] if focus_items else []
            if para_items and all(isinstance(i, Paragraph) for i in para_items):
                story.append(Paragraph(f"<b>{label}:</b>", styles['Label']))
                for para in para_items:
                    story.append(para)
    # 4. Practical Task List
    if h.get('task_list'):
        task_list_items = [Paragraph(f"☐ {item}", styles['Body']) for item in h['task_list'] if item]
        if task_list_items and all(isinstance(i, Paragraph) for i in task_list_items):
            story.append(Paragraph("<b>Practical Task List</b>", styles['Label']))
            for para in task_list_items:
                story.append(para)
    # 5. Creative Flow
    cf = h.get('creative_flow', {})
    if cf:
        story.append(Paragraph("<b>Creative Flow of the Day</b>", styles['Label']))
        for k, label in [('project', 'Project'), ('mode', 'Mode'), ('time_box', 'Time Box'), ('bonus', 'Bonus')]:
            val = cf.get(k)
            if val:
                story.append(Paragraph(f"<b>{label}:</b> {val}", styles['Body']))
    story.append(Spacer(1, 8))

def render_page_2_rituals(data, story, styles):
    story.append(Paragraph("✦ RITUAL KIT ✦", styles['H1']))
    rk = data.get('rituals', {})
    checklist = rk.get('checklist', {})
    # Checklist
    story.append(Paragraph("<b>Checklist</b>", styles['Label']))
    for k, label in [('candle', 'Candle'), ('oil', 'Oil'), ('crystal', 'Crystal'), ('herb_incense', 'Herb/Incense')]:
        val = checklist.get(k)
        if val:
            story.append(Paragraph(f"☐ <b>{label}:</b> {val}", styles['Body']))
    extras = checklist.get('extras', [])
    for extra in extras:
        story.append(Paragraph(f"☐ <b>Extra:</b> {extra}", styles['Body']))
    story.append(Spacer(1, 6))
    # Timing blocks: casting, manifesting, releasing
    for block_name in ['casting', 'manifesting', 'releasing']:
        block = rk.get(block_name)
        if block:
            story.append(Paragraph(f"<b>{block_name.capitalize()}</b> <i>({block.get('window_start','')}–{block.get('window_end','')})</i>", styles['Label']))
            story.append(Paragraph(f"<b>Intent:</b> {block.get('intent','')}", styles['Body']))
            if block.get('why'):
                story.append(Paragraph(f"<b>Why:</b> {block['why']}", styles['Body']))
            story.append(Spacer(1, 2))
    # Notes
    notes = rk.get('notes')
    if notes:
        story.append(Paragraph("<b>Notes/Adaptations:</b>", styles['Label']))
        story.append(Paragraph(notes, styles['Body']))
    story.append(Spacer(1, 8))

def render_page_3_chores_kitchen(data, story, styles):
    from reportlab.platypus import FrameBreak
    chores = data.get('chores', {})
    kitchen = data.get('kitchen', {})
    # Left column: Chores
    story.append(Paragraph("✦ CHORES ✦", styles['H1']))
    if chores.get('energy_of_day'):
        story.append(Paragraph(f"<b>Energy of the Day:</b> {chores['energy_of_day']}", styles['Body']))
    to_do = chores.get('to_do', {})
    for k, label in [('indoor_large', 'Big'), ('indoor_small', 'Small'), ('outdoor', 'Outdoor'), ('plants', 'Plants')]:
        val = to_do.get(k)
        if val:
            story.append(Paragraph(f"<b>{label} Chores:</b>", styles['Label']))
            story.append(Paragraph(f"☐ {val}", styles['Body']))
    if chores.get('laundry_focus'):
        story.append(Paragraph(f"<b>Laundry Focus:</b> {chores['laundry_focus']}", styles['Body']))
    if chores.get('avoid'):
        story.append(Paragraph("<b>Chores to Avoid:</b>", styles['Label']))
        story.extend([Paragraph(f"• {item}", styles['Body']) for item in chores['avoid']])
    if chores.get('shopping_check'):
        story.append(Paragraph(f"<b>Shopping Check:</b> {chores['shopping_check']}", styles['Body']))
    # Move to right column
    story.append(FrameBreak())
    # Right column: Kitchen
    story.append(Paragraph("✦ KITCHEN ✦", styles['H1']))
    for k, label in [('tea_of_day', 'Tea of the Day'), ('breakfast', 'Breakfast'), ('lunch', 'Lunch'), ('dinner', 'Dinner'), ('snack_prep', 'Snack/Prep')]:
        val = kitchen.get(k)
        if val:
            story.append(Paragraph(f"<b>{label}:</b> {val}", styles['Body']))
    if kitchen.get('notes'):
        story.append(Paragraph(f"<b>Notes:</b> {kitchen['notes']}", styles['Body']))
    story.append(Spacer(1, 8))

def render_page_4_evening(data, story, styles):
    story.append(Paragraph("✦ EVENING REFLECTION ✦", styles['H1']))
    er = data.get('evening_reflection', {})
    for i, label in [(1, 'Prompt 1'), (2, 'Prompt 2')]:
        key = f'prompt{i}'
        val = er.get(key)
        if val:
            story.append(Paragraph(f"<b>{label}:</b> {val}", styles['Body']))
        else:
            story.append(Paragraph(f"<b>{label}:</b> ", styles['Body']))
            for _ in range(2):
                story.append(Spacer(1, 12))
    # Lined journal area
    story.append(Spacer(1, 10))
    class JournalLines(Flowable):
        def __init__(self, n_lines=16, left=0.1*inch, right=0.1*inch, spacing=18):
            super().__init__()
            self.n_lines = n_lines
            self.left = left
            self.right = right
            self.spacing = spacing
        def wrap(self, availWidth, availHeight):
            self._width = availWidth
            self._height = self.n_lines * self.spacing
            return self._width, self._height
        def draw(self):
            canv = self.canv
            canv.saveState()
            canv.setStrokeColor(colors.HexColor('#CCCCCC'))
            canv.setLineWidth(0.5)
            y = 0
            for i in range(self.n_lines):
                canv.line(self.left, y, self._width - self.right, y)
                y -= self.spacing
            canv.restoreState()
    story.append(JournalLines())
    story.append(Spacer(1, 8))

# --- MAIN PDF GENERATION ---
def render_pdf(data, output_path, date_override=None):
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='H1', fontName="DejaVu-Bold", fontSize=13, leading=15, spaceBefore=6, spaceAfter=4, textColor=colors.black, alignment=1))
    styles.add(ParagraphStyle(name='Label', fontName="DejaVu-Bold", fontSize=10, leading=13, textColor=colors.black, spaceAfter=2))
    styles.add(ParagraphStyle(name='Body', fontName="DejaVu", fontSize=10, leading=13, textColor=colors.black, spaceAfter=0))
    doc = BaseDocTemplate(output_path, pagesize=letter,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN)
    frame = Frame(MARGIN, MARGIN, letter[0]-2*MARGIN, letter[1]-2*MARGIN-HEADER_HEIGHT, id='normal')
    # Page 3: two equal-width frames with 18pt gutter
    col_width = (letter[0]-2*MARGIN-18)/2
    frame_left = Frame(MARGIN, MARGIN, col_width, letter[1]-2*MARGIN-HEADER_HEIGHT, id='left')
    frame_right = Frame(MARGIN+col_width+18, MARGIN, col_width, letter[1]-2*MARGIN-HEADER_HEIGHT, id='right')
    def on_page(canvas, doc):
        # Always use the locked header/footer for every page
        draw_header(canvas, doc, data)
        draw_footer(canvas, doc, data)

    def on_page3(canvas, doc):
        # Always use the locked header/footer for every page
        draw_header(canvas, doc, data)
        draw_footer(canvas, doc, data)
        # Draw vertical divider at mid_x
        mid_x = doc.leftMargin + (doc.width)/2
        y0 = doc.bottomMargin
        y1 = doc.bottomMargin + doc.height
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#B0B0B0'))
        canvas.setLineWidth(0.5)
        canvas.line(mid_x, y0, mid_x, y1)
        canvas.restoreState()

    def on_page4(canvas, doc):
        # Always use the locked header/footer for every page
        draw_header(canvas, doc, data)
        draw_footer(canvas, doc, data)
        draw_journal_lines(canvas, doc)
    doc.addPageTemplates([
        PageTemplate(id='page1', frames=[frame], onPage=on_page),
        PageTemplate(id='page2', frames=[frame], onPage=on_page),
        PageTemplate(id='page3', frames=[frame_left, frame_right], onPage=on_page3),
        PageTemplate(id='page4', frames=[frame], onPage=on_page4)
    ])
    story = []
    render_page_1_horoscope(data, story, styles)
    story.append(PageBreak())
    render_page_2_rituals(data, story, styles)
    story.append(PageBreak())
    render_page_3_chores_kitchen(data, story, styles)
    story.append(PageBreak())
    render_page_4_evening(data, story, styles)
    doc.build(story)

def main():
    # Register DejaVuSans-Bold font
    font_path = os.path.join('fonts', 'DejaVuSans-Bold.ttf')
    if os.path.exists(font_path):
        pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_path))
    args = get_args()
    input_path = args.input
    output_path = args.output
    date_override = args.date
    if not input_path:
        print("Input path required.")
        sys.exit(1)
    schema = load_schema("schema.json")
    data = load_json(input_path)
    validate_json(data, schema)
    if not output_path:
        from datetime import datetime
        date_str = date_override if date_override else data.get('date', '')
        try:
            date_fmt = datetime.strptime(date_str, "%Y-%m-%d").strftime("%Y-%m-%d")
        except Exception:
            date_fmt = datetime.today().strftime("%Y-%m-%d")
        output_path = f"out/planner_{date_fmt}.pdf"
    render_pdf(data, output_path, date_override)

if __name__ == "__main__":
    main()

