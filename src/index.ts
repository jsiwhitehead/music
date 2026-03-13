import libraryCatalog from "./library.txt" with { type: "text" };

type Recording = {
  performers: string;
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

function parseRecording(line: string): Recording {
  const parts = line.split("|").map((part) => part.trim());

  if (parts.length !== 3 || parts[0] === "") {
    throw new Error(`Invalid recording line: "${line}"`);
  }

  const [performers, listId, startVideoId] = parts as [string, string, string];

  return {
    performers,
    listId,
    startVideoId,
  };
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

    if (indentation === 0) {
      currentComposer = { composer: trimmed, works: [] };
      library.push(currentComposer);
      currentWork = null;
      continue;
    }

    if (indentation === 2) {
      if (currentComposer === null) {
        throw new Error(`Work without composer: "${line}"`);
      }

      currentWork = { title: trimmed, recordings: [] };
      currentComposer.works.push(currentWork);
      continue;
    }

    if (indentation === 4) {
      if (currentWork === null) {
        throw new Error(`Recording without work: "${line}"`);
      }

      currentWork.recordings.push(parseRecording(trimmed));
      continue;
    }

    throw new Error(`Invalid indentation: "${line}"`);
  }

  return library;
}

const library = parseLibrary(libraryCatalog);

function getPlaybackUrl(recording: Recording): string {
  if (recording.listId === "" || recording.startVideoId === "") {
    throw new Error(
      "Set the recording listId and startVideoId values in src/library.txt.",
    );
  }

  const search = new URLSearchParams({
    list: recording.listId,
    v: recording.startVideoId,
  });

  return `https://music.youtube.com/watch?${search.toString()}`;
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
  button.addEventListener("click", () => {
    window.open(getPlaybackUrl(recording), "_blank", "noopener,noreferrer");
  });

  row.append(work, performers, button);
  return row;
}

function createComposerSection(composerGroup: ComposerGroup): HTMLElement {
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
    app.append(createComposerSection(composerGroup));
  }

  root.append(app);
}

main();
