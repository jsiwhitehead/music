# Curated Music Library - Approach

This document defines the curation approach for the listening library. The library is a listening guide, not a historical catalogue or complete discography. It is meant to provide reliable entry points into strong listening choices with clarity, musical quality, and practical long-term listening use as the guiding priorities.

## Listening profile

Rules:

- The library SHOULD reflect a clear listening center of gravity rather than aiming for neutral survey coverage.
- The listening center of gravity SHOULD remain the Classical and Romantic core repertoire.
- Keyboard-led, solo, and concerto-like listening SHOULD be treated as the dominant priority areas.
- The library SHOULD favor substantial repertoire suited to focused repeat listening over lighter, occasional, or primarily social repertoire.

## Repertoire

Rules:

- The library SHOULD focus on the central classical repertoire.
- A work SHOULD be included when it is historically important, widely performed or recorded, and consistently recommended by critics and reference guides.
- A work SHOULD also be likely to sustain repeat listening.
- Expansion SHOULD prioritize important missing works and priority listening areas over expanding discographies for completeness alone.
- The repertoire SHOULD naturally include orchestral works, concertos, chamber music, keyboard works, and vocal or choral works, but coverage SHOULD be weighted by long-term listening priority rather than strict category symmetry.
- The library SHOULD NOT pursue chronological balance for its own sake across earlier, core, and later repertoire.
- Sonata-, concerto-, and other solo-centered repertoire SHOULD generally receive more curatorial depth than small-ensemble chamber repertoire.
- Repertoire outside the main center of gravity MAY be included when it is exceptional, clearly useful, or fills an important gap in the listening guide.
- A small number of opera excerpts or overtures MAY be included when they function convincingly as self-contained listening works.
- Reflective vocal or sacred repertoire MAY justify inclusion beyond what raw category size alone would suggest.
- Full operas are excluded initially because they sit outside the library's current listening center of gravity and require a different curation approach at work and recording level.
- Library size is not fixed and MAY grow organically.
- The library MAY distinguish between a wider discovery layer and a smaller core of works that justify deeper coverage.
- A one-time interesting work is less important than a work likely to become part of regular listening life.

## Classical work model

Rules:

- The classical library MUST be organized as:

```text
composer -> work -> recording
```

- A work SHOULD be the musical unit that listeners normally choose intentionally.
- A work MAY be a collection of related pieces when that reflects natural listening practice.
- Broad bodies of repertoire SHOULD use a `selected` label when the library is intentionally curating from a larger corpus rather than treating the whole corpus as one practical listening unit.
- Granularity SHOULD remain practical rather than strictly musicological or taxonomic.
- Work boundaries SHOULD reflect lived listening habits, especially when listeners tend to return to a named set, book, cycle, or other practical grouping as one unit.
- A work MAY be an overture, prelude, or other excerpt when that excerpt has an established independent concert or listening life.
- The library MUST NOT model movements, track structures, or album groupings as primary organizational units.
- Recordings SHOULD represent performances by specific performers, rather than album packaging.
- Work titles SHOULD favor familiar listener-facing names over maximal catalogue formality, including only the key, opus, or catalogue detail that materially helps identification.
- Nicknames and quoted identifiers SHOULD use typographic quotation marks.
- Catalogue numbers SHOULD be included when they materially help identification, especially for Bach, Mozart, and Schubert.
- Within a composer, works SHOULD generally be ordered for browsing as:
  1. solo keyboard / solo instrumental
  2. chamber
  3. concertos
  4. orchestral
  5. vocal / sacred
- Within one of those broad groups, works SHOULD be ordered by listening priority and browsing usefulness rather than chronology alone, usually leading with central or approachable anchor works while still preserving obvious musical relationships such as numbered families, late trilogies, or closely linked sets when that makes browsing clearer.
- Typographic punctuation in `src/classical.txt`, including curly quotation marks and en dashes where appropriate, is intentional and part of the library's house style.

## Classical recordings

Rules:

- Each work SHOULD have a small set of recordings that represent it exceptionally well.
- Recordings SHOULD be chosen primarily for musical authority, interpretive insight, ensemble quality, and recording clarity.
- Musical conviction SHOULD matter more than purely technical sound quality.
- Each work SHOULD ideally have one reference recording that serves as the default listening recommendation.
- Additional recordings SHOULD be included only when they add meaningful perspective, such as a distinct interpretive approach, historical significance, clearly superior musicianship or sound, or support for a work that is likely to remain in regular rotation, rather than simply documenting what exists.
- Recordings SHOULD be selected work by work, rather than determined by album groupings or recording cycles.
- Recordings from any period MAY be included when they offer exceptional musical insight.
- Performer names SHOULD be listed in listening order: soloist, collaborator or ensemble, then conductor where applicable.
- Recording order within a work SHOULD communicate priority:
  1. default reference
  2. contrasting alternative
  3. historical or special-case alternative
- A small set of recordings should represent a work clearly and authoritatively rather than attempting to document every notable interpretation.
- Typical outcome:
  1. most works: one recording
  2. core works: two or three recordings
  3. exceptional cases: more when repeated listening clearly justifies it

## Non-classical model

Rules:

- The general and Baha'i libraries MUST be organized as:

```text
artist -> title
```

- A top-level artist entry SHOULD group together the albums or titles that are most worth keeping in regular reach.
- Non-classical entries SHOULD usually represent an album, but MAY represent a standalone title when that is the more natural listening unit.
- Non-classical entries SHOULD stay simple: one artist heading, then a short list of titles beneath it.
- Non-classical libraries SHOULD NOT introduce an extra recording layer unless there is a clear need that justifies a format change.

## Library file formats

Rules:

- `src/classical.txt` recording entries MUST use one of these forms:

```text
performers
```

or

```text
performers | listId | startVideoId
```

- The performer field MUST always be present.
- The curated library in `src/classical.txt` is authoritative even when a playable link is not currently available.
- The app MAY omit recordings that do not have both `listId` and `startVideoId`.

- `src/general.txt` and `src/bahai.txt` MUST be organized as:

```text
artist
  title |
```

or

```text
artist
  title | listId
```

or

```text
artist
  title | listId | startVideoId
```

- The top-level artist field MUST always be present.
- The indented title field MUST always be present.
- The `listId` field MAY be blank until a link is known.
- The `startVideoId` field MAY be added when playback should start from a specific track within the linked list.
- Non-classical entries represent one album or title, optionally linked by one YouTube Music `listId`, with an optional `startVideoId`.
