import libraryCatalog from "./library.txt" with { type: "text" };

type Recording = {
  performers: string;
  listId?: string;
  startVideoId?: string;
};

type LinkedRecording = Recording & {
  listId: string;
  startVideoId: string;
};

type Work = {
  recordings: Recording[];
  title: string;
};

type ComposerGroup = {
  composer: string;
  works: Work[];
};

function hasPlaybackIds(recording: Recording): recording is LinkedRecording {
  return Boolean(recording.listId && recording.startVideoId);
}

function parseRecording(line: string): Recording {
  const parts = line.split("|").map((part) => part.trim());
  const performers = parts[0];

  if (performers === undefined || performers === "") {
    throw new Error(`Invalid recording line: "${line}"`);
  }

  switch (parts.length) {
    case 1:
      return { performers };
    case 3: {
      const [, listId, startVideoId] = parts as [string, string, string];
      return {
        performers,
        listId,
        startVideoId,
      };
    }
    default:
      throw new Error(`Invalid recording line: "${line}"`);
  }
}

function parseLibrary(catalog: string): ComposerGroup[] {
  const library: ComposerGroup[] = [];

  let currentComposer: ComposerGroup | null = null;
  let currentWork: Work | null = null;

  for (const rawLine of catalog.split("\n")) {
    const line = rawLine.replace(/\s+$/, "");
    const trimmed = line.trim();
    const indentation = line.length - line.trimStart().length;

    if (trimmed === "") {
      continue;
    }

    switch (indentation) {
      case 0:
        currentComposer = { composer: trimmed, works: [] };
        library.push(currentComposer);
        currentWork = null;
        break;
      case 2:
        if (currentComposer === null) {
          throw new Error(`Work without composer: "${line}"`);
        }

        currentWork = { title: trimmed, recordings: [] };
        currentComposer.works.push(currentWork);
        break;
      case 4:
        if (currentWork === null) {
          throw new Error(`Recording without work: "${line}"`);
        }

        currentWork.recordings.push(parseRecording(trimmed));
        break;
      default:
        throw new Error(`Invalid indentation: "${line}"`);
    }
  }

  return library;
}

const library = parseLibrary(libraryCatalog);

function getPlaybackUrl(recording: LinkedRecording): string {
  const search = new URLSearchParams({
    list: recording.listId,
    v: recording.startVideoId,
  });

  return `https://music.youtube.com/watch?${search.toString()}`;
}

function createRecordingRow(
  workTitle: string,
  recording: LinkedRecording,
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
  button.addEventListener("click", () => {
    window.open(getPlaybackUrl(recording), "_blank", "noopener,noreferrer");
  });

  row.append(work, performers, button);
  return row;
}

function createComposerSection(
  composerGroup: ComposerGroup,
): HTMLElement | null {
  const rows: HTMLLIElement[] = [];

  for (const work of composerGroup.works) {
    const linkedRecordings = work.recordings.filter(hasPlaybackIds);

    for (const [recordingIndex, recording] of linkedRecordings.entries()) {
      rows.push(
        createRecordingRow(recordingIndex === 0 ? work.title : "", recording),
      );
    }
  }

  if (rows.length === 0) {
    return null;
  }

  const composerSection = document.createElement("section");
  composerSection.className = "composer-section";

  const composerHeading = document.createElement("h2");
  composerHeading.className = "composer-heading";
  composerHeading.textContent = composerGroup.composer;

  const recordings = document.createElement("ul");
  recordings.className = "recordings";
  recordings.append(...rows);

  composerSection.append(composerHeading, recordings);
  return composerSection;
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
    const composerSection = createComposerSection(composerGroup);
    if (composerSection === null) continue;
    app.append(composerSection);
  }

  root.append(app);
}

main();
