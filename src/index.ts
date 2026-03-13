import { library, type Recording } from "./library.ts";

function getPlaybackUrl(recording: Recording): string {
  if (recording.listId === "" || recording.startVideoId === "") {
    throw new Error(
      "Set the recording listId and startVideoId values in src/library.ts.",
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
