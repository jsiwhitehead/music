import bahaiLibraryCatalog from "./bahai.txt" with { type: "text" };
import classicalLibraryCatalog from "./classical.txt" with { type: "text" };
import generalLibraryCatalog from "./general.txt" with { type: "text" };

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

type FlatTitleEntry = {
  listId: string;
  startVideoId: string;
  title: string;
};

type FlatArtistGroup = {
  artist: string;
  entries: FlatTitleEntry[];
};

type LibrarySectionId = "bahai" | "classical" | "general";

type LibrarySection =
  | {
      id: LibrarySectionId;
      kind: "classical";
      label: string;
      library: ComposerGroup[];
    }
  | {
      id: LibrarySectionId;
      kind: "flat";
      label: string;
      library: FlatArtistGroup[];
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

function parseClassicalLibrary(catalog: string): ComposerGroup[] {
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

function parseFlatTitleEntry(line: string): FlatTitleEntry {
  const parts = line.split("|").map((part) => part.trim());
  const title = parts[0];

  if (title === undefined || title === "") {
    throw new Error(`Invalid flat library line: "${line}"`);
  }

  switch (parts.length) {
    case 1:
      return { listId: "", startVideoId: "", title };
    case 2: {
      const [, listId] = parts;
      return { listId: listId ?? "", startVideoId: "", title };
    }
    case 3: {
      const [, listId, startVideoId] = parts;
      return {
        listId: listId ?? "",
        startVideoId: startVideoId ?? "",
        title,
      };
    }
    default:
      throw new Error(`Invalid flat library line: "${line}"`);
  }
}

function parseFlatLibrary(catalog: string): FlatArtistGroup[] {
  const library: FlatArtistGroup[] = [];
  let currentArtist: FlatArtistGroup | null = null;

  for (const rawLine of catalog.split("\n")) {
    const line = rawLine.replace(/\s+$/, "");
    const trimmed = line.trim();
    const indentation = line.length - line.trimStart().length;

    if (trimmed === "") {
      continue;
    }

    switch (indentation) {
      case 0:
        currentArtist = { artist: trimmed, entries: [] };
        library.push(currentArtist);
        break;
      case 2:
        if (currentArtist === null) {
          throw new Error(`Flat entry without artist: "${line}"`);
        }

        currentArtist.entries.push(parseFlatTitleEntry(trimmed));
        break;
      default:
        throw new Error(`Invalid indentation: "${line}"`);
    }
  }

  return library;
}

const LIBRARY_SECTIONS: LibrarySection[] = [
  {
    id: "general",
    kind: "flat",
    label: "General",
    library: parseFlatLibrary(generalLibraryCatalog),
  },
  {
    id: "classical",
    kind: "classical",
    label: "Classical",
    library: parseClassicalLibrary(classicalLibraryCatalog),
  },
  {
    id: "bahai",
    kind: "flat",
    label: "Baha'i",
    library: parseFlatLibrary(bahaiLibraryCatalog),
  },
];

function getLibrarySection(sectionId: LibrarySectionId): LibrarySection {
  const section = LIBRARY_SECTIONS.find(
    (candidate) => candidate.id === sectionId,
  );

  if (section === undefined) {
    throw new Error(`Unknown library section: "${sectionId}"`);
  }

  return section;
}

function getPlaybackUrl(recording: LinkedRecording): string {
  const search = new URLSearchParams({
    list: recording.listId,
    v: recording.startVideoId,
  });

  return `https://music.youtube.com/watch?${search.toString()}`;
}

function getPlaylistUrl(listId: string): string {
  const search = new URLSearchParams({ list: listId });
  return `https://music.youtube.com/playlist?${search.toString()}`;
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

function createBoundaryRow(
  columnCount: number,
  position: "top" | "bottom",
): HTMLTableRowElement {
  const row = document.createElement("tr");
  row.className = `composer-boundary-row composer-boundary-row--${position}`;

  for (let index = 0; index < columnCount; index += 1) {
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
    createBoundaryRow(3, "top"),
    ...rows,
    createBoundaryRow(3, "bottom"),
  );
  return composerSection;
}

function createFlatLibraryCellContent(entry: FlatTitleEntry): Node {
  if (entry.listId === "") {
    return document.createTextNode(entry.title);
  }

  const link = document.createElement("a");
  link.className = "recording-link";
  link.href =
    entry.startVideoId === ""
      ? getPlaylistUrl(entry.listId)
      : getPlaybackUrl({
          performers: entry.title,
          listId: entry.listId,
          startVideoId: entry.startVideoId,
        });
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = entry.title;
  return link;
}

function createFlatLibraryList(entries: FlatTitleEntry[]): HTMLUListElement {
  const list = document.createElement("ul");
  list.className = "recordings-list";

  for (const entry of entries) {
    const item = document.createElement("li");
    item.className = "recordings-item";
    item.append(createFlatLibraryCellContent(entry));
    list.append(item);
  }

  return list;
}

function createFlatLibraryRow(
  artistGroup: FlatArtistGroup,
): HTMLTableRowElement {
  const row = document.createElement("tr");
  row.className = "work-row flat-row";

  const artistCell = createCell("composer-cell", artistGroup.artist);
  const titleCell = createCell("work-cell");
  titleCell.append(createFlatLibraryList(artistGroup.entries));

  row.append(artistCell, titleCell);
  return row;
}

function renderClassicalLibrary(
  table: HTMLTableElement,
  library: ComposerGroup[],
): void {
  table.replaceChildren();

  for (const composerGroup of library) {
    const composerSection = createComposerSection(composerGroup);
    if (composerSection === null) continue;
    table.append(composerSection);
  }
}

function createFlatArtistSection(
  artistGroup: FlatArtistGroup,
): HTMLTableSectionElement | null {
  if (artistGroup.entries.length === 0) {
    return null;
  }

  const body = document.createElement("tbody");
  body.className = "flat-library";
  body.append(
    createBoundaryRow(2, "top"),
    createFlatLibraryRow(artistGroup),
    createBoundaryRow(2, "bottom"),
  );
  return body;
}

function renderFlatLibrary(
  table: HTMLTableElement,
  library: FlatArtistGroup[],
): void {
  table.replaceChildren();

  for (const artistGroup of library) {
    const section = createFlatArtistSection(artistGroup);
    if (section === null) continue;
    table.append(section);
  }
}

function renderLibrarySection(
  sectionId: LibrarySectionId,
  table: HTMLTableElement,
): void {
  const section = getLibrarySection(sectionId);
  table.dataset.section = section.id;

  switch (section.kind) {
    case "classical":
      renderClassicalLibrary(table, section.library);
      break;
    case "flat":
      renderFlatLibrary(table, section.library);
      break;
  }
}

function createSectionSwitcher(
  table: HTMLTableElement,
  initialSectionId: LibrarySectionId,
): HTMLDivElement {
  const switcher = document.createElement("div");
  switcher.className = "library-switcher";

  let selectedSectionId = initialSectionId;

  const buttons = LIBRARY_SECTIONS.map((section) => {
    const button = document.createElement("button");
    button.className = "library-switcher-button";
    button.type = "button";
    button.textContent = section.label;
    button.setAttribute(
      "aria-pressed",
      String(section.id === selectedSectionId),
    );

    button.addEventListener("click", () => {
      if (section.id === selectedSectionId) {
        return;
      }

      selectedSectionId = section.id;
      renderLibrarySection(selectedSectionId, table);

      for (const candidate of buttons) {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      }
    });

    return button;
  });

  switcher.append(...buttons);
  return switcher;
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

  const initialSectionId: LibrarySectionId = "general";
  const table = document.createElement("table");
  table.className = "library-table";
  renderLibrarySection(initialSectionId, table);

  app.append(heading, createSectionSwitcher(table, initialSectionId), table);

  root.append(app);
}

main();
