# Architecture

This document describes how the system is structured, how playback is produced, and what YouTube Music is responsible for.

## Library model

The library hierarchy is:

composer -> work -> recording

The local catalogue is stored as nested composer groups containing works and recordings. Each recording stores the YouTube Music playback target needed to open that recording directly.

### Invariants

- A work belongs to one composer.
- A recording belongs to one work.
- A recording stores a `listId` for a playable YouTube Music list container.
- A recording stores a `startVideoId` for the track that playback should start from.
- `startVideoId` must resolve within `listId`.

## State model

The system has one authoritative kind of state:

- Local catalogue state: the in-memory library data.

### Invariants

- The local catalogue is authoritative.
- External systems do not define canonical library data.
- Playback URLs must always be reproducible from the local catalogue.

## Playback model

Playback is created by resolving a recording from the local catalogue and opening its YouTube Music watch URL directly.

Flow:

1. Resolve the selected recording from the local catalogue.
2. Construct a YouTube Music watch URL from the recording's `listId` and `startVideoId`.
3. Open that URL in YouTube Music.

Playback is launched using:

[https://music.youtube.com/watch?v=VIDEO_ID&list=LIST_ID](https://music.youtube.com/watch?v=VIDEO_ID&list=LIST_ID)

### Invariants

- Playback targets are read directly from the local catalogue.
- The application does not implement audio playback itself.
- The application does not synchronize or mutate YouTube playlists.
- YouTube Music handles playback once the watch URL is opened.
