import sys
import json
import re

def parse_text(text):
    # Simple regex-based parser for the expected daily check-in format
    result = {}
    # Header
    header = re.search(r"Date:\s*(.+)\nMoon Phase & Sign:\s*(.+)\nDay Planet:\s*(.+)", text)
    if header:
        result["date"] = header.group(1).strip()
        result["moon_phase_sign"] = header.group(2).strip()
        result["day_planet"] = header.group(3).strip()
    # Ritual Kit
    ritual = re.search(r"Ritual Kit:\s*Candle:\s*(.+)\nOil:\s*(.+)\nCrystal:\s*(.+)\nHerb:\s*(.+)\nMini Ritual:\s*(.+)", text)
    if ritual:
        result["ritual_kit"] = {
            "candle": ritual.group(1).strip(),
            "oil": ritual.group(2).strip(),
            "crystal": ritual.group(3).strip(),
            "herb": ritual.group(4).strip(),
            "mini_ritual": ritual.group(5).strip()
        }
    # Upcoming Events
    events = re.search(r"Upcoming Events \(You-Only\):\s*Transit Notes:\s*(.+)\nReflection:\s*(.+)", text)
    if events:
        result["upcoming_events"] = {
            "transit_notes": events.group(1).strip(),
            "reflection": events.group(2).strip()
        }
    # Housewitch Chore
    chores = re.findall(r"Housewitch Chore of the Day:\s*((?:[\s\S]*?)(?=Kitchen Witch Tip:|$))", text)
    if chores:
        chore_lines = [line for line in chores[0].split('\n') if line.strip() and line.strip().startswith('[')]
        result["housewitch_chore"] = []
        for line in chore_lines:
            m = re.match(r"\[(.+?)\]\s*(.+)", line)
            if m:
                result["housewitch_chore"].append({"tag": m.group(1).strip(), "task": m.group(2).strip()})
    # Kitchen Witch
    kitchen = re.search(r"Kitchen Witch Tip:\s*Idea:\s*(.+)\nIngredient:\s*(.+)\nTreat:\s*(.+)\nNotes:\s*(.*)", text)
    if kitchen:
        result["kitchen_witch"] = {
            "idea": kitchen.group(1).strip(),
            "ingredient": kitchen.group(2).strip(),
            "treat": kitchen.group(3).strip(),
            "notes": kitchen.group(4).strip()
        }
    # Creative Flow
    creative = re.search(r"Creative Flow of the Day:\s*Project:\s*(.+)\nMode:\s*(.+)\nTime Box:\s*(.+)\nBonus:\s*(.+)", text)
    if creative:
        result["creative_flow"] = {
            "project": creative.group(1).strip(),
            "mode": creative.group(2).strip(),
            "time_box": creative.group(3).strip(),
            "bonus": creative.group(4).strip()
        }
    return result

def main():
    print("Paste your daily check-in text below. End input with Ctrl+D (Unix/macOS) or Ctrl+Z (Windows) and Enter.")
    input_text = sys.stdin.read()
    json_obj = parse_text(input_text)
    print(json.dumps(json_obj, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
