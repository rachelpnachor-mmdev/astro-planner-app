# ARCHITECTURE.md

## Overview
This document describes the architecture of the Astro Planner PDF generator as implemented for the MVP. It covers the main components, data flow, rendering logic, and key design decisions that ensure maintainability, extensibility, and visual consistency.

---

## 1. System Components

- **assets/**: Contains local images (e.g., CrystalBall.png) used in the PDF.
- **fonts/**: Contains system sans-serif and symbol fonts (DejaVuSans, Symbola) for text and emoji rendering.
- **samples/**: Example JSON input files for testing and validation.

- **AI Personality & Memory Framework**: See [AIPERSONALITY.md](AIPERSONALITY.md) for details on the adaptive assistant, archetype mapping, and sharded memory architecture.
- **Archetype Mapping**: See [AIARCHETYPE.md](AIARCHETYPE.md) for tone guidelines and implementation notes.
- **Datastore Architecture**: See [DATASTORE.md](DATASTORE.md) for sharding, migration, and monetization strategy.

2. **Processing**: `generate_planner_pdf.py` parses the input, validates structure, and prepares content for rendering.
3. **Rendering**: ReportLab is used to draw all elements (header, decorative line, sections, chores, moon/planet/zodiac icons) onto a US Letter, grayscale, two-column PDF.
4. **Output**: PDF file is written to disk, named by date or as specified by the user.

---

## 3. Rendering Logic

5. **AI Assistant**: User interactions and responses are shaped by the AI personality and memory framework, with tone and delivery style determined by archetype and user profile.

- **Decorative Line**: 0.5pt grayscale rule, visually locked and enforced by code comments and function structure.
- **Sections**: Rendered in two columns, with minimal, elegant layout. Section order and content strictly follow the input JSON.
- **Chores**: Emoji tags are retained and rendered using Symbola font.

- **AI Assistant Output**: When generating planner content, the assistant’s responses and suggestions reflect the user’s archetype and memory context.

- **Local Assets Only**: All images and fonts are bundled locally; no network calls or external dependencies.
- **Extensibility**: The code is structured to allow new sections or layout changes with minimal disruption.
- **Validation**: Input is validated against a schema to ensure predictable rendering and error handling.

- **AI Integration**: The architecture supports modular integration of the AI personality, archetype, and memory features for future expansion.

- **Architectural Updates**: This file should be updated as new rendering features, data contracts, or layout changes are introduced.

---

- **AI/LLM Expansion**: Future iterations will expand the assistant’s capabilities, memory architecture, and tone adaptation. See [AIPERSONALITY.md](AIPERSONALITY.md) and [DATASTORE.md](DATASTORE.md).
- [ReportLab Documentation](https://www.reportlab.com/documentation/)
- [Symbola Font](https://dn-works.com/ufas/)


- [AIPERSONALITY.md](AIPERSONALITY.md)
- [AIARCHETYPE.md](AIARCHETYPE.md)
- [DATASTORE.md](DATASTORE.md)
