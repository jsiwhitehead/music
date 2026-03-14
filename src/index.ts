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

function getComposerLabel(composer: string): string {
  const parts = composer.trim().split(/\s+/);
  return parts.at(-1) ?? composer;
}

function getRecordingLabel(performers: string): string {
  return performers.replace(/\s+\([^()]+\)$/, "");
}

function createCell(
  className: string,
  textContent?: string,
): HTMLTableCellElement {
  const cell = document.createElement("td");
  cell.className = className;
  if (textContent !== undefined) {
    cell.textContent = textContent;
  }
  return cell;
}

function createRecordingLink(recording: LinkedRecording): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = "recording-link";
  link.href = getPlaybackUrl(recording);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = getRecordingLabel(recording.performers);
  return link;
}

function createRecordingsList(recordings: LinkedRecording[]): HTMLUListElement {
  const list = document.createElement("ul");
  list.className = "recordings-list";

  for (const recording of recordings) {
    const item = document.createElement("li");
    item.className = "recordings-item";
    item.append(createRecordingLink(recording));
    list.append(item);
  }

  return list;
}

function createWorkRow(
  composer: string,
  work: Work,
  showComposer: boolean,
): HTMLTableRowElement | null {
  const linkedRecordings = work.recordings.filter(hasPlaybackIds);

  if (linkedRecordings.length === 0) {
    return null;
  }

  const row = document.createElement("tr");
  row.className = "work-row";

  const composerCell = createCell(
    "composer-cell",
    showComposer ? getComposerLabel(composer) : undefined,
  );
  if (!showComposer) {
    composerCell.classList.add("composer-cell--empty");
    composerCell.setAttribute("aria-hidden", "true");
  }

  const workCell = createCell("work-cell", work.title);
  const recordingsCell = createCell("recordings-cell");
  recordingsCell.append(createRecordingsList(linkedRecordings));

  row.append(composerCell, workCell, recordingsCell);
  return row;
}

function createBoundaryRow(position: "top" | "bottom"): HTMLTableRowElement {
  const row = document.createElement("tr");
  row.className = `composer-boundary-row composer-boundary-row--${position}`;

  for (let index = 0; index < 3; index += 1) {
    const cell = document.createElement("td");
    cell.className = "composer-boundary-cell";
    row.append(cell);
  }

  return row;
}

function createComposerSection(
  composerGroup: ComposerGroup,
): HTMLTableSectionElement | null {
  const rows = composerGroup.works
    .map((work, index) =>
      createWorkRow(composerGroup.composer, work, index === 0),
    )
    .filter((row): row is HTMLTableRowElement => row !== null);

  if (rows.length === 0) {
    return null;
  }

  const composerSection = document.createElement("tbody");
  composerSection.className = "composer-group";
  composerSection.append(
    createBoundaryRow("top"),
    ...rows,
    createBoundaryRow("bottom"),
  );
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

  const table = document.createElement("table");
  table.className = "library-table";

  app.append(heading, table);

  for (const composerGroup of library) {
    const composerSection = createComposerSection(composerGroup);
    if (composerSection === null) continue;
    table.append(composerSection);
  }

  root.append(app);
}

main();
