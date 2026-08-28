---
name: frontend-design-nino
description: "Design direction for the Nino product ecosystem, preserving its visual identity, design tokens, accessibility standards, and surface-specific needs."
---

# Nino Frontend Design

Approach design as the design lead responsible for the Nino product ecosystem.

Nino is not a single interface. It is a family of products serving different people,
contexts, devices, and jobs.

The goal is not to make every Nino product look identical.

The goal is to make them feel related while allowing each product to develop the
visual hierarchy, density, interaction model, and personality appropriate to its job.

Distinctiveness must come from the product, its users, and its context — never from
arbitrary decoration.

---

# 1. Understand the surface before designing

Before making visual decisions, identify which Nino surface is being designed.

## Landing

Purpose:
Communicate Nino's value to restaurant owners and convert interest into action.

Primary audience:
Restaurant owners and decision makers.

Design characteristics:
- Strong brand expression
- Storytelling
- Marketing hierarchy
- Deliberate visual moments
- Lower information density
- Strong typography
- Controlled motion
- Clear conversion paths

The Landing may be the most expressive Nino surface.

Do not make it look like a SaaS dashboard.

---

## Manager

Purpose:
Help restaurant operators manage their business efficiently.

Primary audience:
Owners, managers and restaurant staff.

Design characteristics:
- Operational clarity
- Predictable navigation
- Medium-to-high information density
- Fast scanning
- Strong hierarchy
- Consistent actions
- Clear feedback
- Reduced decorative noise

Manager is a work environment.

Efficiency wins over visual spectacle.

Distinctiveness should come primarily from typography, composition, interaction
quality and Nino's visual language — not decoration.

---

## Customer

Purpose:
Allow restaurant customers to discover products and place orders with minimal friction.

Primary audience:
End customers of each restaurant.

Important:
Customer is part of Nino technically, but the restaurant is the visible brand.

Nino must not visually compete with the tenant.

Design characteristics:
- Mobile-first
- Food and products are visually dominant
- Extremely clear ordering flow
- Strong touch targets
- Low cognitive load
- Fast perceived interaction
- Tenant branding has priority

The interface should feel polished and intentionally designed without making Nino
more visually prominent than the restaurant.

White-label constraints override Nino brand expression.

---

## Backoffice

Purpose:
Operate and supervise the Nino platform itself.

Primary audience:
Nino internal staff and administrators.

Design characteristics:
- High information density
- Operational clarity
- Data-heavy layouts
- Tables, filters and status visualization
- Strong information architecture
- Minimal decorative expression
- Efficient bulk operations where appropriate

Backoffice is infrastructure disguised as an interface.

Do not design it like Manager simply because both are dashboards.

Its visual hierarchy should reflect platform operations rather than restaurant
operations.

---

## Courier

Purpose:
Help delivery workers execute deliveries quickly and safely.

Primary audience:
Couriers working in motion, frequently using mobile devices outdoors.

Design characteristics:
- Mobile-first
- Glanceable information
- Large touch targets
- Strong contrast
- Minimal reading
- Clear status transitions
- Location and route context
- Immediate next action
- Resilience to interruption

Courier is an execution interface.

The user should understand the current state and next action within seconds.

Avoid interaction patterns requiring precision or prolonged attention.

---

# 2. Shared identity, different expressions

All Nino products belong to the same ecosystem.

They should share foundational design language where appropriate:

- typography principles
- spacing rhythm
- color semantics
- interaction behavior
- border and radius philosophy
- icon language
- focus treatment
- accessibility standards
- motion principles
- feedback patterns

But shared identity does not mean visual uniformity.

Landing can be expressive.

Manager can be operational.

Customer can disappear behind the restaurant brand.

Backoffice can be dense.

Courier can be aggressively functional.

Do not force visual consistency when contextual consistency is more important.

---

# 3. Existing design decisions come first

Before inventing visual decisions, inspect the existing project.

Look for:

- design tokens
- semantic colors
- typography
- spacing scale
- radius scale
- shadows
- components
- layout primitives
- iconography
- previous screens
- responsive patterns
- accessibility conventions

Reuse existing decisions whenever they satisfy the design problem.

Do not introduce a new token because a slightly different value looks better locally.

Do not introduce another font, radius, shadow, color or spacing convention without
a product-level reason.

Creativity operates inside the system before expanding the system.

If the system cannot express an important product need, explicitly identify the gap
before introducing a new primitive or token.

---

# 4. Ground the design in the real task

Never design from the component name alone.

A "card", "dashboard", "hero", "table" or "checkout" is not a design direction.

Determine:

- Who is using this?
- Which Nino product are they using?
- What are they trying to accomplish?
- What information matters first?
- What decision must they make?
- What is the primary action?
- What could prevent them from completing it?
- In what physical/device context are they using it?

Design from those answers.

---

# 5. Establish hierarchy before decoration

Every screen must have a clear answer to:

1. What is happening?
2. What matters most?
3. What can the user do next?

Use:

- typography
- spacing
- grouping
- alignment
- contrast
- scale
- position

before introducing decorative elements.

If removing decoration destroys the hierarchy, the hierarchy was never strong enough.

---

# 6. Typography carries product character

Typography is part of Nino's identity.

Respect existing typography tokens and roles.

Do not introduce arbitrary typefaces to make a screen feel distinctive.

Create distinction through:

- scale
- weight
- width
- rhythm
- whitespace
- hierarchy
- composition

Marketing surfaces may use typography expressively.

Operational surfaces should prioritize scanning and comprehension.

Customer typography must coexist with tenant branding.

Courier typography must prioritize immediate readability.

---

# 7. Structure is information

Structural devices must encode meaning.

Dividers, sections, labels, badges, numbering, grouping and containers should explain
relationships between information.

Do not use:

- numbered sections without sequence
- badges without semantic meaning
- cards merely because information exists
- containers around everything
- excessive separators
- decorative labels

Avoid "card soup".

If several elements belong together naturally, composition and spacing may communicate
that relationship better than another bordered rectangle.

---

# 8. Avoid generic AI design

Do not default to visual patterns simply because they reliably look polished.

Be suspicious of:

- gratuitous gradients
- excessive cards
- glassmorphism without purpose
- arbitrary glowing accents
- oversized metric cards
- decorative charts
- excessive pills
- floating blobs
- unnecessary rounded containers
- icon + title + description repeated endlessly
- generic SaaS dashboard composition
- animation everywhere

A polished interface can still be generic.

Nino should feel intentionally designed rather than generated.

---

# 9. Motion must explain something

Use motion when it improves:

- orientation
- hierarchy
- continuity
- feedback
- perceived responsiveness

Marketing surfaces may use orchestrated motion as part of storytelling.

Operational products should use motion primarily for feedback and state transitions.

Customer interactions should feel immediate.

Courier motion must never interfere with task execution.

Respect reduced-motion preferences.

---

# 10. Writing is interface design

Write from the user's perspective.

Use language they recognize, not implementation terminology.

Prefer:

"Salvar alterações"

over:

"Submit"

Prefer:

"Pedido saiu para entrega"

over internal status names.

Actions must remain linguistically consistent throughout a flow.

If an action is called "Publicar", success feedback should use "Publicado".

Errors must explain what happened and, whenever possible, what the user can do next.

Empty states should provide direction.

Avoid filler copy.

---

# 11. Responsive design is contextual design

Do not treat responsive design as shrinking desktop layouts.

Consider what matters at each viewport and context.

Ask:

- What remains visible?
- What moves?
- What collapses?
- What becomes the primary action?
- What information can be deferred?
- What interaction changes?

Customer and Courier are fundamentally mobile contexts.

Manager and Backoffice must remain highly usable on desktop while degrading
intentionally to smaller screens.

Landing should preserve narrative hierarchy across sizes.

---

# 12. Accessibility is a quality floor

Accessibility is not optional polish.

Always consider:

- keyboard navigation
- visible focus
- semantic HTML
- sufficient contrast
- touch target size
- screen-reader meaning
- reduced motion
- form labels
- error association
- status announcements where appropriate

Do not announce these decisions unless relevant to the discussion.

Implement them.

---

# 13. Design process

Work internally through:

UNDERSTAND
→ INSPECT
→ PLAN
→ CRITIQUE
→ BUILD
→ INSPECT
→ REFINE

## Understand

Identify:

- product surface
- user
- task
- context
- primary action

## Inspect

Study existing:

- tokens
- components
- layouts
- patterns
- nearby screens

## Plan

Define a compact direction:

### Hierarchy
What dominates and why?

### Layout
How is information organized?

### Typography
Which existing roles express the hierarchy?

### Interaction
What should feel immediate?

### Signature
Is there one memorable element appropriate to this surface?

A signature element is optional.

Operational screens frequently need no visual stunt.

## Critique

Before implementation ask:

- Could this belong to any generic SaaS?
- Does this feel appropriate for this Nino product?
- Did I invent anything the existing system already solves?
- Is anything decorative without purpose?
- Is the hierarchy obvious?
- Is the primary action obvious?

Revise before building if necessary.

## Build

Implement the approved direction faithfully.

Do not gradually introduce unrelated aesthetic decisions while coding.

## Inspect

When the environment allows it, inspect the rendered interface.

Screenshots are preferred over reasoning from code alone.

Check multiple viewport sizes.

## Refine

Remove unnecessary visual elements.

Fix hierarchy, rhythm, alignment and interaction inconsistencies.

Do not add decoration merely because the result feels "too simple".

Simple and intentional is preferable to elaborate and arbitrary.

---

# 14. Restraint

Spend visual boldness where it matters.

Landing may deserve a memorable visual signature.

Manager may need one strong hierarchy decision.

Customer may need Nino to disappear.

Backoffice may need none.

Courier may need nothing more memorable than exceptional clarity.

The objective is not to demonstrate design ability.

The objective is to make each Nino product feel inevitable for the job it performs.
