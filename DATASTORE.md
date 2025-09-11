# 🌙 Lunaria Storage & Monetization Strategy

## Overview
Lunaria’s core value is memory — the feeling of having a personal astro-BFF who remembers and grows with you. To stay sustainable, Lunaria launches with local-only storage and moves to cloud-backed storage once revenue supports it.

---

## Phase 1 – MVP (Local-Only Storage)
- Stored on device (AsyncStorage, SQLite, or secure file system).
- Data format: JSON shards + indexes.
- Pros: Zero infra cost, fast dev, strong privacy (“your data never leaves your phone”).
- Cons: Memory lost if app is deleted/device lost, no cross-device sync.

---

## Phase 2 – Early Revenue (Ads + Simple Premium)
- Free tier: Daily Core (local memory only) + ads.
- Ad-free unlock: $0.99/mo or one-time IAP.

---

## Phase 3 – Cloud Memory Launch (Premium Tier)
- Infra: Firebase/Supabase/AWS Amplify for JSON shard storage + vector DB.
- Premium ($4.99–$7.99/mo): Persistent memory across devices, rich ritual library, extended journaling, no ads.

---

## Phase 4 – Long-Term Scale
- Free tier: ad-supported local memory.
- Premium: cloud memory + full AI features.
- Microtransactions: ritual packs, crystal guides, seasonal astrology bundles.

---

## Migration Plan (Local → Cloud)
1. Local-first JSON is MVP source of truth.
2. Premium: sync local shards to cloud, cloud becomes master, local caches for offline.
3. Downgrade: local-only memory, cloud copy archived then purged.

---

## Acceptance Criteria
- MVP app functions offline with JSON shards.
- Ads integrated for Free tier.
- Ad-free option available for $0.99.
- Premium introduces persistent cloud memory.
- Migration keeps user history intact.
- Clear messaging around privacy and data ownership.

---

## Why This Matters
- De-risks infra cost during MVP.
- Proves traction before investing in cloud.
- Natural upgrade path from Free → Ad-Free → Premium.
- Reinforces Lunaria’s promise: your AI bestie always remembers you.
