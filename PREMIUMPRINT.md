# PREMIUMPRINT.md

## Overview

The **Premium Print Service** lets subscribed users order a **custom printed planner** that includes only the modules they have unlocked. It is a **print-on-demand only service** (no downloadable PDFs).

* Planner content: daily, weekly, and monthly pages compiled from subscribed modules.
* Planner options: cover design, binding style, size, week start, theme.
* Legal requirement: users must agree to a **personal use license** — printed planners are for personal/private use only and may not be resold, redistributed, or reproduced.

---

## User Flow

1. User subscribes to at least one package (Witch, Meals, Chores, Goals).
2. User selects **Premium Print Service**.
3. App prompts user to configure print options:
   * Date range (default: 1 year starting next month).
   * Modules (auto-selected from subscriptions).
   * Cover design, binding style, size, week start, theme.
4. App displays **license agreement** requiring confirmation:
   * Non-commercial use only.
   * No resale or redistribution of planner content.
   * Copyright remains with the publisher.
5. User confirms license agreement.
6. App generates a **print job** and sends to print partner.
7. User receives confirmation + shipping updates.

---

## User Stories (BDD)

### License Agreement

**Scenario: show license**
**Given** I start Premium Print setup,
**When** I reach checkout,
**Then** I should be shown a license agreement covering personal-use rights.

**Scenario: require confirmation**
**Given** the license is displayed,
**When** I tap “Continue,”
**Then** I must first check “I agree,”
**And** the order cannot proceed without acceptance.

**Scenario: enforce license**
**Given** I completed an order,
**When** my book is printed,
**Then** my account reflects that it is for **personal use only** and may not be resold.

---

## Requirements

### Functional

* Premium Print available only for subscribed users.
* Planner setup wizard: modules, date range, cover, binding, size, week start, theme.
* Display license agreement at checkout.
* Require acceptance before order submission.
* Generate print job with selected options.
* Send to print-on-demand partner.
* Provide confirmation + shipping updates.

### Non-Functional

* License agreement stored with order for recordkeeping.
* Terms written in plain language but enforce legal restrictions.
* Print-ready files must meet printer specs.

---

## Example License Text (to embed at checkout)

> **Personal Use License**
> By ordering this printed planner, you agree that it is licensed for personal and private use only.
> You may not sell, resell, reproduce, or distribute the content or printed product in any form, physical or digital.
> All content and design remain the property of [Publisher].
> Violation of these terms may result in termination of service and/or legal action.

---

## Data Contracts

### Print Setup

```json
{
  "print_setup": {
    "date_range": {"start": "2026-01-01", "end": "2026-12-31"},
    "modules": ["horoscope", "witch", "meals"],
    "cover_design": "decorative_moon",
    "binding": "spiral",
    "size": "a5",
    "week_start": "monday",
    "theme": "classic",
    "license_agreed": true
  }
}
```

### Print Job JSON

```json
{
  "print_job": {
    "user_id": "12345",
    "setup": { /* from print_setup */ },
    "status": "submitted",
    "license_agreed": true,
    "shipping": {
      "name": "Rachel",
      "address": "123 Main St, NM, USA",
      "status": "in_transit",
      "tracking_number": "ABC123XYZ"
    }
  }
}
```

---

## Acceptance Criteria

* [ ] Premium Print Service available only for subscribed users.
* [ ] Users can configure print options (cover, binding, size, theme).
* [ ] License agreement is shown and must be accepted.
* [ ] Orders cannot proceed without acceptance.
* [ ] Print jobs reflect only subscribed modules.
* [ ] Final printed book reflects user’s design choices.
* [ ] Confirmation + shipping updates are provided.

---

## Subscription-Aware Compile
- Only unlocked modules are included in the printed planner.
- No PDF download is available for Premium Print.

## Customization
- Cover gallery, binding (hard/paper/spiral), size (8×10 or A5), theme, week start.

## Legal
- Personal-use license acceptance is stored with each order.

## Analytics
- Print Setup Started/Completed.
- License Accepted.
- Order Submitted.
- Order Shipped.

## API Notes
- Print-on-demand partner integration.
- Asset pipeline for covers.
- Preflight checks (bleed/trim/CMYK).
