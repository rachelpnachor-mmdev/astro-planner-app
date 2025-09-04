# ARCHITECTURE.md

## Overview
This document describes the architecture of the Astro Planner PDF generator as implemented for the MVP. It covers the main components, data flow, rendering logic, and key design decisions that ensure maintainability, extensibility, and visual consistency.

---

## 1. System Components

- **generate_planner_pdf.py**: Main script for PDF generation. Handles input parsing, layout logic, and rendering.
- **assets/**: Contains local images (e.g., CrystalBall.png) used in the PDF.
- **fonts/**: Contains system sans-serif and symbol fonts (DejaVuSans, Symbola) for text and emoji rendering.
- **samples/**: Example JSON input files for testing and validation.
- **schema.json**: Defines the expected structure of the planner input data.

---

## 2. Data Flow

1. **Input**: JSON file (validated against `schema.json`) provides all planner content, including dates, sections, and chores.
2. **Processing**: `generate_planner_pdf.py` parses the input, validates structure, and prepares content for rendering.
3. **Rendering**: ReportLab is used to draw all elements (header, decorative line, sections, chores, moon/planet/zodiac icons) onto a US Letter, grayscale, two-column PDF.
4. **Output**: PDF file is written to disk, named by date or as specified by the user.

---

## 3. Rendering Logic

- **Header**: Drawn identically on every page using a single `draw_header` function, called by all page templates. Includes title, date, and decorative line.
- **Decorative Line**: 0.5pt grayscale rule, visually locked and enforced by code comments and function structure.
- **Sections**: Rendered in two columns, with minimal, elegant layout. Section order and content strictly follow the input JSON.
- **Chores**: Emoji tags are retained and rendered using Symbola font.
- **Fonts**: Only system sans-serif and Symbola fonts are used; no color or external resources.

---

## 4. Key Design Decisions

- **Consistency Enforcement**: Header and decorative line logic is centralized and protected by code comments to prevent accidental changes.
- **Local Assets Only**: All images and fonts are bundled locally; no network calls or external dependencies.
- **Extensibility**: The code is structured to allow new sections or layout changes with minimal disruption.
- **Validation**: Input is validated against a schema to ensure predictable rendering and error handling.

---

## 5. Future Considerations

- **Iteration Documentation**: Each major change or feature addition should be documented in a separate `iteration-XX.md` file.
- **Architectural Updates**: This file should be updated as new rendering features, data contracts, or layout changes are introduced.

---

## 6. References
- [ReportLab Documentation](https://www.reportlab.com/documentation/)
- [DejaVu Fonts](https://dejavu-fonts.github.io/)
- [Symbola Font](https://dn-works.com/ufas/)

---

*This document reflects the architecture as of September 3, 2025. For iteration-specific changes, see the corresponding `iteration-XX.md` files.*
