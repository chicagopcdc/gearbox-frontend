# Enhanced Matching UI

Google Summer of Code 2026 — Data for the Common Good
Contributor: Manjula Kudapa

The GEARBOx matching form presents clinicians with every trial-related question in a single scrolling column. Finding the fields relevant to a particular patient means scrolling past hundreds of questions that don't apply, which slows the matching process and increases the risk of incomplete data entry.

This is a three-panel alternative: category navigation on the left, a searchable form in the centre, and live trial results on the right. Clinicians can search for a field by name and jump straight to it, or browse directly to the category they need.

## The three panels

**Left sidebar (desktop only):** Category navigation. Lists the five form categories (Demographics, Disease, Treatment and Exposure, Organ Function, Biomarkers). Clicking a category expands and scrolls to its section in the center panel. The active category highlights as the user scrolls through the form.

**Center panel:** Patient information form. Contains the search bar, quick-select buttons for important fields, selected values chips, and the accordion form sections grouped by category. Each section expands when its category is active. Form behavior matches the original MatchForm: 1000ms debounce on changes, same validation, same API payloads, same showIf logic.

**Right panel (desktop only):** Live trial results. Displays Matched, Potential Match, and Unmatched trials with server-side pagination (four trials per page per group). Updates in response to form changes. On mobile, the sidebar becomes a horizontal strip and the center/right panels switch via Patient Info / Open Trials buttons.

## Components

**EnhancedMatchingPage.tsx** — top-level page component that wires session state to the three-panel layout, manages scroll position, field selection, and the active category state.

**ThreePanelLayout.tsx** — responsive layout shell; three-column flex on desktop, single-column with tab switcher on mobile.

**CategorySidebar.tsx** — navigation list of category buttons with visual active state and aria-current attribute.

**TypeaheadSearch.tsx** — combobox-pattern search input that filters fields by name, label, or category; returns up to eight results; handles hidden showIf fields by redirecting to their trigger field.

**QuickSelect.tsx** — row of buttons for fields marked in importantQuestionsConfig, allowing fast jumps to commonly used fields.

**EnhancedMatchForm.tsx** — the form itself; renders fields in accordion sections, manages debounced updates, applies field highlighting, tracks scroll position with IntersectionObserver to update active category.

**SelectedValuesBar.tsx** — displays filled fields as dismissible chips showing field label and current value; clearing a chip removes the value and triggers a debounced update.

**ResultsPanel.tsx** — reuses the existing MatchResult component inside a sticky-header wrapper; adds a background color transition during updates and displays blocking criteria for potential matches.

**TrialBlockingCriteria.tsx** — renders missing field names that caused a trial to be marked undetermined.

**getBlockingCriteria.ts** — walks a MatchInfoAlgorithm tree depth-first to extract up to two field names where isMatched is undefined.

**useFieldSearchIndex.ts** — builds a memoized array of SearchableField objects from config and values for the search dropdown; computes visibility and filled state per field.

**types.ts** — shared TypeScript types (SearchableField, CategorySummary) used across enhanced components.

## Data flow

`useMatchingSession` (in src/hooks/) extracts all state and API logic from the original MatchingPage into a reusable hook. It handles fetching match results via getMatchInfo, managing location filters, marking relevant fields, and all user input persistence. EnhancedMatchingPage consumes this hook and passes derived state down to presentational components. Only EnhancedMatchForm holds transient local state (the debounce buffer for form inputs).
