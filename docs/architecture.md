# Architecture

This document describes how the system is structured, how playback is produced, and what YouTube Music is responsible for.

## Library model

The local catalogue has three section-specific shapes:

- Classical: `composer -> work -> recording`
- General: `artist -> album`
- Baha'i: `artist -> title`

The local catalogue is stored in section-specific text files. Classical uses nested composer groups containing works and recordings. General and Baha'i use artist-grouped entries where each album or title may optionally store playback ids.

### Invariants

- In the classical section, a work belongs to one composer.
- In the classical section, a recording belongs to one work.
- In the general and Baha'i sections, an album or title belongs to one artist.
- Classical playback entries store a `listId` and `startVideoId`.
- In the general and Baha'i sections, linked entries store a `listId`.
- In the general and Baha'i sections, linked entries MAY also store a `startVideoId` when playback should begin at a specific track.
- In the classical section, `startVideoId` must resolve within `listId`.

## State model

The system has one authoritative kind of state:

- Local catalogue state: the in-memory library data.

### Invariants

- The local catalogue is authoritative.
- External systems do not define canonical library data.
- Playback URLs must always be reproducible from the local catalogue.

## Playback model

Playback is created by resolving a selected library entry from the local catalogue and opening its YouTube Music watch URL directly.

Flow:

1. Resolve the selected recording, album, or title from the local catalogue.
2. Construct a YouTube Music URL from the selected entry's stored playback target.
3. Open that URL in YouTube Music.

Playback is launched using either:

[https://music.youtube.com/watch?v=VIDEO_ID&list=LIST_ID](https://music.youtube.com/watch?v=VIDEO_ID&list=LIST_ID)

or

[https://music.youtube.com/playlist?list=LIST_ID](https://music.youtube.com/playlist?list=LIST_ID)

### Invariants

- Playback targets are read directly from the local catalogue.
- The application does not implement audio playback itself.
- The application does not synchronize or mutate YouTube playlists.
- YouTube Music handles playback once the watch URL is opened.
