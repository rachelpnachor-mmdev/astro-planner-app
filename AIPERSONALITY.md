# 🌙 Lunaria AI Personality & Memory Framework

## Overview
Lunaria’s AI assistant is a personal astro-companion, adapting its tone, personality, and continuity to each subscriber. This is achieved through:

1. **Astro-Aligned Personality** – Delivery style shaped by the user’s natal chart.
2. **Persistent Memory** – Sharded, indexed memory that grows with the user, storing only what matters.

The goal: users reconnect with their AI bestie who remembers, adapts, and speaks their language.

---

## Core Principles
- **Accuracy First:** Charts use Swiss Ephemeris/NASA JPL.
- **Personality by Chart:** Rising, Moon, Mars, Venus placements define tone.
- **Memory Matters:** Each subscriber has their own assistant memory.
- **Respect & Agency:** Users can override tone or reset memory anytime.
- **Clarity & Simplicity:** Daily Core Capsule is the anchor.

---

## Framework Components
- **Archetype Assignment:** Based on Rising × Moon, modified by Mars/Venus.
- **Memory Architecture:** Sharded JSON/JSONL files with topic and recency indexes.
- **Retrieval Pipeline:** Intent classification, shard resolution, recency, vector search, context assembly.
- **User Control:** Override tone, clear/reset memory, view/export history.

---

## Acceptance Criteria
- Natal chart calculated and stored.
- Archetype + tone profile computed and saved.
- Assistant adapts responses to archetype and modifiers.
- Sharded memory stores user history.
- Retrieval pipeline loads relevant shards by topic.
- Weekly/long-term summaries prevent token bloat.
- Users can view, export, or clear memory.
- Daily Core capsule is concise.

---

## Why This Matters
- Builds trust with accuracy and personalization.
- Creates bonding loops – the assistant feels alive and aware.
- Prevents overwhelm by anchoring to a simple, useful Daily Core.
- Positions Lunaria as the first astrology app where your AI becomes your BFF.
