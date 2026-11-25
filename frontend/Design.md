# Design Brief: Symlinx-inspired Minimalist Terminal Web UI

Create a minimalist, text-oriented interface inspired by the Symlinx website (https://symlinx.net).

## Design Direction
Combine minimalist web design, terminal-inspired typography, and the independent internet / old-school personal homepage aesthetic.

## Core Requirements
- Monospaced typography throughout.
- Predominantly monochromatic colour palette.
- White background and dark foreground by default.
- Simple, document-like single-column layouts.
- Sharp corners and minimal borders.
- Compact text-based navigation.
- Plain hyperlinks and text-based interactive elements.
- Clear hierarchy through spacing, typography and separators.
- Avoid excessive component nesting.

## Visual Restrictions
Do not introduce:
- Glassmorphism or neumorphism.
- Rounded cards or pill buttons.
- Gradients and decorative shadows.
- Unnecessary illustrations.
- Excessive animations.
- Conventional SaaS dashboard styling.
- Unnecessary terminal window mockups.

## Interaction
- Text links should have clear hover states.
- Interactive elements must support keyboard navigation.
- Use simple textual status indicators.
- Keep animations subtle and respect reduced-motion preferences.

## Responsive Behaviour
Maintain the same design identity across desktop and mobile. Adapt widths, spacing and navigation without introducing a completely different mobile design.

## Implementation Philosophy
Prefer semantic HTML, lightweight CSS, reusable components and minimal dependencies. The interface should feel intentionally simple rather than unfinished.

The final result should resemble an independently maintained technical website from the minimalist internet community, not a modern commercial SaaS landing page.

# Light Theme CSS 
--bg: #F1F4EF;
--fg: #26352B;
--fg-secondary: #748477;
--border: #CED8CD;
--accent: #496C50;

# Dark Theme CSS
--bg: #171F1A;
--fg: #DCE8DD;
--fg-secondary: #91A994;
--border: #35483A;
--accent: #9BBE9E;