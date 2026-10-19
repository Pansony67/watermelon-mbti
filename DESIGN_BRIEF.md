# Melonality design brief

Who we design for: a first-time visitor from TikTok, Instagram, Reddit or Google, on a phone, deciding in about three seconds whether to take the quiz. Everything below serves one action: **Take the quiz**.

## What we took from each reference

Studied on a 390 px phone and a 1440 px desktop (October 2026).

| Reference | What it does well | What we take |
| --- | --- | --- |
| **16personalities.com** (home, test, INFP page) | Phone home screen: one sentence of promise, a time cost ("Only 10 minutes"), one full-width "Take the test" button, illustration under it. The test shows question one at once. Type pages: huge type name, a coloured family subtitle, trait chips, then the illustration. Four colour-coded groups. | The above-the-fold recipe (promise, time, one button). The type page order. A four-family colour system where every family owns one hue. |
| **Duolingo** | The characters are the hero, not decoration. A chunky button with a darker bottom edge that physically presses down. | Put our 20 characters forward. A tactile primary button: lifts on hover, presses on tap, never just fades. |
| **Arc** | Heavy, tightly tracked headline. One-sentence subline. One dark button with an arrow. | Tight negative tracking on display type. Subline one sentence long. Arrow that moves on hover. |
| **Headspace** | The primary action lives in the header on every scroll position. Big, friendly, sentence-case headline. | A sticky header with "Take the quiz" always one tap away. |
| **Co–Star** | Restraint and deadpan copy ("You're not sad, just bored"). | Copy voice: short, dry, specific. No exclamation marks. |
| **Truity** | Counter-example: stock photography and serif "science" make a fun quiz feel corporate. | No stock photos. No serif accents. |

## Principles

1. **One primary action per screen**: "Take the quiz" (or, after a result, "Share it"). Everything else is a quieter link.
2. **Characters over chrome.** Our 20 illustrations are the brand. Frame them; do not hide them in cards.
3. **Mobile first at 375 px.** The headline, the promise and the button fit in the first phone screen.
4. **Colour means family.** Green, Blue, Yellow and Purple only ever mean a family. The brand colour, watermelon red, only ever means "do this".
5. **Motion has a reason.** Entrances only above the fold and only once; no scroll-triggered fades, no loops, no cursor effects.

## Typography

- **Display: Bricolage Grotesque** (variable, Google Fonts). A grotesque with character: confident like Arc, playful enough for a watermelon quiz, and not a default. Replaces Fredoka (read as childish) and Archivo.
- **Text: Figtree** (kept). Clean, open, very legible at 16 px on phones.
- Scale, phone to desktop (fluid with `clamp`):

| Token | Phone | Desktop | Line height | Tracking | Weight |
| --- | --- | --- | --- | --- | --- |
| `display` | 44 px | 76 px | 0.98 | -0.035em | 800 |
| `h1` | 36 px | 56 px | 1.04 | -0.03em | 780 |
| `h2` | 28 px | 40 px | 1.1 | -0.02em | 720 |
| `h3` | 20 px | 24 px | 1.25 | -0.01em | 650 |
| `lead` | 18 px | 20 px | 1.5 | 0 | 400 |
| `body` | 16 px | 17 px | 1.6 | 0 | 400 |
| `small` | 14 px | 14 px | 1.5 | 0 | 500 |
| `label` | 13 px | 13 px | 1.3 | 0.01em | 600, sentence case |

Paragraphs stop at 62 characters. Headlines use `text-wrap: balance`, paragraphs `pretty`. Scores and counts use tabular figures.

## Colour

**Neutrals** (one warm grey family): paper `#FFFFFF`, paper-2 `#F6F5F4`, line `#E9E6E4`, ink `#1D1715`, ink-2 `#5C5350`, ink-3 `#736966` (5.3:1 on white). Dark mode: paper `#1C1816`, ink `#F4EFEC`, ink-3 `#A39893` (6.3:1).

**Brand**: watermelon red `#DC2450` for the primary button (white text 4.8:1, AA). Its pressed edge is `#A3163A`. Decorative flesh `#FF4D6D` for marks and the seed motif only, never for text on white. Red text on white uses `#D41E47` (5.2:1).

**Families**: each family has four roles. The light pair works on white pages; the dark pair builds the character stages.

| Family | Tint (light bg) | Ink (text on tint/white) | Deep (stage bg) | Glow (accent on deep) | Meaning |
| --- | --- | --- | --- | --- | --- |
| Green | `#EDF5EC` | `#2E6B3A` (5.8:1) | `#0E2419` | `#77D9A0` (9.5:1) | heart-led |
| Blue | `#EBF1F8` | `#2D5A8E` (6.2:1) | `#0D1A30` | `#8AB8FF` (8.6:1) | steady |
| Yellow | `#FAF3E0` | `#7A5A0E` (5.8:1) | `#2A1D07` | `#F0C250` (9.8:1) | fired up |
| Purple | `#F2EEF8` | `#5B3E8E` (7.3:1) | `#1C1030` | `#C0A0FF` (8.3:1) | questioners |

No gradients between families and no purple-to-blue gradients. Light only appears as a soft radial "stage light" in a family's own hue behind its characters.

## Spacing, radius, elevation

- Spacing scale (4 px base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Sections: 64 px top / 80 px bottom on phones, 96 / 112 on desktop (bottom slightly larger, optically).
- Container: 1152 px max, 20 px side gutter on phones, 32 px from tablet up.
- Radius: 10 px controls, 16 px cards, 28 px panels and stages. Smaller inside, larger outside.
- Elevation: two warm, ink-tinted shadows (`card`, `panel`). No borders and shadows together.

## Components

- **Primary button**: watermelon red, white text, 56 px tall on phones, a 4 px darker bottom edge. Hover lifts 2 px and slides the arrow; press drops onto the edge. Focus: 2 px ink ring with offset.
- **Secondary**: plain text link with an arrow, underline on hover. Never a second filled button beside the primary.
- **Header**: sticky, solid paper (no blur). Logo, Home, Quiz, Types, How it works, About; account and theme on the right; "Take the quiz" always visible, including on phones.
- **Character stage**: a family's deep colour with a radial light in its glow colour, the character standing on it, outlined in its glow colour.
- **Chips**: square-cornered, sentence case, family tint plus ink. No pill badges above headlines.
- **Footer**: two short link groups and the legal links. No four-column link farm.

## Page plan

- **Home**: headline "What kind of watermelon eater are you?", one-line promise with the time cost, the primary button, "Free, no sign-up" plus the live player count. The 3D melon with its four random character callouts stays as the hero visual. Then: a real preview of a result, so people see the payoff; three steps as a numbered sequence (not icon boxes); the four families as colour stages; a two-column FAQ list (no accordion); a closing call to action.
- **Quiz**: full-screen on phones, one statement at a time, big tap targets, a thin progress bar and "3 of 20". Logic, questions and scoring untouched.
- **Result**: a screenshot-ready first screen (character, "You're the …", tagline, family, top trait) on the family's stage. Then share (native share sheet, copy link), why you got it (radar, family match), the full description, and next steps.
- **Types index**: keep the cinematic family bands the user chose; new type, a one-line meaning per family, tighter rhythm.
- **Type page**: family stage hero, the type's story, habits, typical profile, the other four in the family, a share link and the quiz button.
- **How it works, About, Privacy, Terms, 404**: one editorial layout, the new type scale, no icon-box rows.
- **Sign-in**: same logic, restyled to the system.
- **Sharing**: Open Graph and Twitter cards for the site, the types index and each of the 20 types (character on its family stage, name, tagline).

## Avoid list (from the brief) and how we comply

Purple-to-blue gradients, gradient text, emoji headings, Inter, coloured-border cards, glassmorphism, low-contrast dark mode, three-icon-box rows, pill badge above the headline, Lucide everywhere, untouched shadcn, fade-in on scroll, cursor glow, hover-fade-only buttons, inconsistent spacing, em dashes, serif italic accents, Space Grotesk with Instrument Serif, grain over gradients: none of these are used. Icons stay Phosphor, used sparingly.

## Quality bar

WCAG AA contrast everywhere (checked with axe), visible focus states, semantic landmarks, descriptive alt text on character art. Mobile Lighthouse: no layout shift, `next/image` everywhere, fonts self-hosted through `next/font`.

## Untouched

SITE_URL, auth and callback routes, Google verification files, the WebSite JSON-LD, quiz questions, branching, scoring, database schema and tracking, and the 20 character images (only framed or resized in CSS).
