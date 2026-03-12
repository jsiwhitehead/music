# Architecture

This document describes how the system is structured, how playback is produced, and what YouTube Music is responsible for.

## Library model

The library hierarchy is:

composer -> work -> recording -> tracks

The local catalogue is stored as nested composer groups containing works, recordings, and ordered YouTube video IDs.

### Invariants

- A work belongs to one composer.
- A recording belongs to one work.
- A recording's tracks are ordered.
- Track order must be preserved during playback.
- Track entries are YouTube video IDs.

## State model

The system has two kinds of state:

- Local catalogue state: the in-memory library data.
- Derived playback state: the reusable YouTube playlist used as a playback buffer.

The reusable playlist is not library data. It may be cleared and recreated at any time from the local catalogue.

### Invariants

- The local catalogue is authoritative.
- External systems do not define canonical library data.
- Playback state must always be reproducible from the local catalogue.

## Playback model

Playback is created by synchronizing one recording into the reusable YouTube playlist, then opening that playlist in YouTube Music.

Flow:

1. Resolve the selected recording from the local catalogue.
2. Obtain a valid OAuth access token.
3. Read the current reusable playlist.
4. If it already matches the recording, skip mutation and open it directly.
5. Otherwise, replace its contents with the recording's tracks in order.
6. Open the playlist in YouTube Music.

Playback is launched using:

[https://music.youtube.com/playlist?list=PLAYLIST_ID](https://music.youtube.com/playlist?list=PLAYLIST_ID)

### Invariants

- Playback uses the local recording order exactly.
- The reusable playlist is replaced per playback request when needed.
- The application does not implement audio playback itself.
- YouTube Music handles playback once the playlist is opened.
