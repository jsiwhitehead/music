type Recording = {
  performers: string;
  tracks: string[];
};

type Work = {
  recordings: Recording[];
  title: string;
};

type ComposerGroup = {
  composer: string;
  works: Work[];
};

type PlaylistItemListResponse = {
  items: Array<{
    id: string;
    snippet?: {
      resourceId?: {
        videoId?: string;
      };
    };
  }>;
  nextPageToken?: string;
};

type PlaylistSnapshotItem = {
  itemId: string;
  videoId: string | null;
};

type GoogleTokenClient = {
  callback: (response: GoogleTokenResponse) => void;
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
};

type GoogleTokenResponse = {
  access_token: string;
  error?: string;
  expires_in?: number;
};

type StoredGoogleToken = {
  accessToken: string;
  expiresAt: number;
};

type GoogleAccounts = {
  oauth2: {
    initTokenClient: (config: {
      callback: (response: GoogleTokenResponse) => void;
      client_id: string;
      scope: string;
    }) => GoogleTokenClient;
  };
};

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}

const PLAYBACK_CONFIG = {
  clientId:
    "729120950214-20f64j9b1ueiu265of41bvpdlvmhuilt.apps.googleusercontent.com",
  playlistId: "PLroVAjJyejURtdhGR00hCPtKFA1q_rVsM",
};

const GOOGLE_TOKEN_STORAGE_KEY = "music.google-token";
const YOUTUBE_AUTH_SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl";
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

const library: ComposerGroup[] = [
  {
    composer: "Frederic Chopin",
    works: [
      {
        title: "4 Ballades",
        recordings: [
          {
            performers: "Vladimir Ashkenazy",
            tracks: [
              "rHDPbP6_ue0",
              "y0KhgLoJB0w",
              "IcG3HiO51g4",
              "JMIPYcg1A5w",
            ],
          },
          {
            performers: "Krystian Zimerman",
            tracks: [
              "mxx_WcjV5U8",
              "oOGYtZeHoQg",
              "COgNjtTFvLE",
              "A3Wriv-QEtE",
            ],
          },
          {
            performers: "Arthur Rubinstein",
            tracks: [
              "jNgF8EcjXes",
              "ju9bx_cQqi4",
              "JHoeIvtmwc8",
              "7TQM2Yp8OpQ",
            ],
          },
        ],
      },
    ],
  },
];

let googleTokenClient: GoogleTokenClient | null = null;

function getPlaybackUrl(): string {
  return `https://music.youtube.com/playlist?list=${PLAYBACK_CONFIG.playlistId}`;
}

async function requestYouTube(
  path: string,
  accessToken: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  if (init?.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${YOUTUBE_API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `YouTube API request failed (${response.status}): ${await response.text()}`,
    );
  }

  return response;
}

async function getPlaylistSnapshot(
  accessToken: string,
  playlistId: string,
): Promise<PlaylistSnapshotItem[]> {
  const snapshot: PlaylistSnapshotItem[] = [];
  let pageToken: string | undefined;

  do {
    const search = new URLSearchParams({
      maxResults: "50",
      part: "snippet",
      playlistId,
    });

    if (pageToken !== undefined) {
      search.set("pageToken", pageToken);
    }

    const response = await requestYouTube(
      `/playlistItems?${search.toString()}`,
      accessToken,
    );
    const payload = (await response.json()) as PlaylistItemListResponse;

    for (const item of payload.items) {
      snapshot.push({
        itemId: item.id,
        videoId: item.snippet?.resourceId?.videoId ?? null,
      });
    }

    pageToken = payload.nextPageToken;
  } while (pageToken !== undefined);

  return snapshot;
}

function playlistMatchesRecording(
  snapshot: PlaylistSnapshotItem[],
  recording: Recording,
): boolean {
  if (snapshot.length !== recording.tracks.length) {
    return false;
  }

  return recording.tracks.every(
    (videoId, index) => videoId === snapshot[index]?.videoId,
  );
}

async function clearPlaylist(
  accessToken: string,
  snapshot: PlaylistSnapshotItem[],
): Promise<void> {
  for (const item of snapshot) {
    const search = new URLSearchParams({ id: item.itemId });

    await requestYouTube(`/playlistItems?${search.toString()}`, accessToken, {
      method: "DELETE",
    });
  }
}

async function insertRecordingTracks(
  accessToken: string,
  playlistId: string,
  recording: Recording,
): Promise<void> {
  for (const videoId of recording.tracks) {
    await requestYouTube("/playlistItems?part=snippet", accessToken, {
      body: JSON.stringify({
        snippet: {
          playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId,
          },
        },
      }),
      method: "POST",
    });
  }
}

function getGoogleAccounts(): GoogleAccounts {
  if (window.google?.accounts === undefined) {
    throw new Error("Google Identity Services failed to load.");
  }

  return window.google.accounts;
}

function getGoogleTokenClient(): GoogleTokenClient {
  if (googleTokenClient === null) {
    googleTokenClient = getGoogleAccounts().oauth2.initTokenClient({
      callback: () => {
        throw new Error("Google token client callback was not set.");
      },
      client_id: PLAYBACK_CONFIG.clientId,
      scope: YOUTUBE_AUTH_SCOPE,
    });
  }

  return googleTokenClient;
}

function loadStoredGoogleToken(): StoredGoogleToken | null {
  const storedValue = window.sessionStorage.getItem(GOOGLE_TOKEN_STORAGE_KEY);

  if (storedValue === null) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<StoredGoogleToken>;

    if (
      typeof parsedValue.accessToken !== "string" ||
      typeof parsedValue.expiresAt !== "number"
    ) {
      return null;
    }

    return {
      accessToken: parsedValue.accessToken,
      expiresAt: parsedValue.expiresAt,
    };
  } catch {
    return null;
  }
}

function saveGoogleToken(token: StoredGoogleToken): void {
  window.sessionStorage.setItem(
    GOOGLE_TOKEN_STORAGE_KEY,
    JSON.stringify(token),
  );
}

function getValidStoredGoogleToken(): string | null {
  const storedToken = loadStoredGoogleToken();

  if (storedToken === null) {
    return null;
  }

  if (storedToken.expiresAt <= Date.now() + 60_000) {
    window.sessionStorage.removeItem(GOOGLE_TOKEN_STORAGE_KEY);
    return null;
  }

  return storedToken.accessToken;
}

function requestAccessToken(): Promise<string> {
  const cachedToken = getValidStoredGoogleToken();

  if (cachedToken !== null) {
    return Promise.resolve(cachedToken);
  }

  return new Promise((resolve, reject) => {
    const tokenClient = getGoogleTokenClient();

    tokenClient.callback = (response: GoogleTokenResponse) => {
      if (response.error !== undefined) {
        reject(new Error(`Google OAuth failed: ${response.error}`));
        return;
      }

      if (response.expires_in === undefined) {
        reject(new Error("Google OAuth response did not include expiry."));
        return;
      }

      saveGoogleToken({
        accessToken: response.access_token,
        expiresAt: Date.now() + response.expires_in * 1000,
      });

      resolve(response.access_token);
    };

    tokenClient.requestAccessToken({ prompt: "" });
  });
}

function assertPlaybackConfig(): void {
  if (PLAYBACK_CONFIG.clientId.length === 0) {
    throw new Error("Set the OAuth client ID in src/index.ts.");
  }

  if (PLAYBACK_CONFIG.playlistId.startsWith("REPLACE_WITH_")) {
    throw new Error("Set the hardcoded reusable playlist ID in src/index.ts.");
  }
}

async function syncRecordingToPlaylist(recording: Recording): Promise<string> {
  assertPlaybackConfig();

  if (recording.tracks.length === 0) {
    throw new Error("Recording has no tracks.");
  }

  const accessToken = await requestAccessToken();
  const snapshot = await getPlaylistSnapshot(
    accessToken,
    PLAYBACK_CONFIG.playlistId,
  );

  if (playlistMatchesRecording(snapshot, recording)) {
    return getPlaybackUrl();
  }

  await clearPlaylist(accessToken, snapshot);
  await insertRecordingTracks(
    accessToken,
    PLAYBACK_CONFIG.playlistId,
    recording,
  );

  return getPlaybackUrl();
}

function createRecordingRow(
  workTitle: string,
  recording: Recording,
): HTMLLIElement {
  const row = document.createElement("li");
  row.className = "recording-row";

  const work = document.createElement("span");
  work.className = "work-cell";
  work.textContent = workTitle;
  if (workTitle.length === 0) {
    work.setAttribute("aria-hidden", "true");
  }

  const performers = document.createElement("span");
  performers.className = "performers";
  performers.textContent = recording.performers;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Play";
  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Opening...";

    try {
      const playbackUrl = await syncRecordingToPlaylist(recording);
      window.open(playbackUrl, "_blank", "noopener,noreferrer");
    } finally {
      button.textContent = "Play";
      button.disabled = false;
    }
  });

  row.append(work, performers, button);
  return row;
}

function main(): void {
  const root = document.querySelector("#root");

  if (!(root instanceof HTMLElement)) {
    throw new Error("Missing #root element.");
  }

  const app = document.createElement("main");
  app.className = "library";

  const heading = document.createElement("h1");
  heading.textContent = "Music";

  app.append(heading);

  for (const composerGroup of library) {
    const composerSection = document.createElement("section");
    composerSection.className = "composer-section";

    const composerHeading = document.createElement("h2");
    composerHeading.className = "composer-heading";
    composerHeading.textContent = composerGroup.composer;

    const recordings = document.createElement("ul");
    recordings.className = "recordings";

    for (const work of composerGroup.works) {
      for (const [recordingIndex, recording] of work.recordings.entries()) {
        recordings.append(
          createRecordingRow(recordingIndex === 0 ? work.title : "", recording),
        );
      }
    }

    composerSection.append(composerHeading, recordings);
    app.append(composerSection);
  }

  root.append(app);
}

main();
