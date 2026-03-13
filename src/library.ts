export type Recording = {
  performers: string;
  listId: string;
  startVideoId: string;
};

export type Work = {
  recordings: Recording[];
  title: string;
};

export type ComposerGroup = {
  composer: string;
  works: Work[];
};

export const library: ComposerGroup[] = [
  {
    composer: "Johann Sebastian Bach",
    works: [
      {
        title: "Goldberg Variations",
        recordings: [
          { performers: "Glenn Gould (1955)", listId: "", startVideoId: "" },
          { performers: "Angela Hewitt", listId: "", startVideoId: "" },
        ],
      },
      {
        title: "The Well-Tempered Clavier, Book I",
        recordings: [
          { performers: "Angela Hewitt", listId: "", startVideoId: "" },
          {
            performers: "Sviatoslav Richter",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "English Suites",
        recordings: [
          { performers: "Angela Hewitt", listId: "", startVideoId: "" },
        ],
      },
      {
        title: "Cello Suites",
        recordings: [
          {
            performers: "Pablo Casals",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Steven Isserlis",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Sonatas and Partitas for Solo Violin",
        recordings: [
          {
            performers: "Arthur Grumiaux",
            listId: "",
            startVideoId: "",
          },
          { performers: "Hilary Hahn", listId: "", startVideoId: "" },
        ],
      },
      {
        title: "Mass in B minor",
        recordings: [
          {
            performers:
              "Monteverdi Choir; English Baroque Soloists; John Eliot Gardiner",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "St Matthew Passion",
        recordings: [
          {
            performers:
              "Monteverdi Choir; English Baroque Soloists; John Eliot Gardiner",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Dunedin Consort; John Butt",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Selected Organ Chorales",
        recordings: [],
      },
    ],
  },
  {
    composer: "George Frideric Handel",
    works: [
      {
        title: "Keyboard Suites",
        recordings: [],
      },
      {
        title: "Messiah",
        recordings: [
          {
            performers: "English Concert; Trevor Pinnock",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Joseph Haydn",
    works: [
      {
        title: "Piano Trios",
        recordings: [],
      },
      {
        title: "String Quartets, Op. 76",
        recordings: [
          { performers: "Takacs Quartet", listId: "", startVideoId: "" },
          {
            performers: "Quatuor Mosaiques",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 88",
        recordings: [
          {
            performers: "Royal Concertgebouw Orchestra; Colin Davis",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "The Seven Last Words of Our Saviour from the Cross",
        recordings: [],
      },
      {
        title: "The Creation",
        recordings: [
          {
            performers: "Academy of Ancient Music; Christopher Hogwood",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Freiburg Baroque Orchestra; Rene Jacobs",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Wolfgang Amadeus Mozart",
    works: [
      {
        title: "Fantasia in C minor, K. 475",
        recordings: [],
      },
      {
        title: "Piano Sonatas Nos. 1-5",
        recordings: [],
      },
      {
        title: "Piano Sonatas Nos. 6-18",
        recordings: [],
      },
      {
        title: "Piano Concerto No. 17",
        recordings: [],
      },
      {
        title: "Piano Concerto No. 19",
        recordings: [],
      },
      {
        title: "Piano Concerto No. 20",
        recordings: [
          {
            performers: "Mitsuko Uchida; English Chamber Orchestra",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Clara Haskil; Igor Markevitch",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Piano Concerto No. 23",
        recordings: [
          {
            performers: "Mitsuko Uchida; English Chamber Orchestra",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Piano Concerto No. 24",
        recordings: [],
      },
      {
        title: "Piano Concerto No. 27",
        recordings: [],
      },
      {
        title: "Serenata notturna, K. 239",
        recordings: [],
      },
      {
        title: "Clarinet Concerto",
        recordings: [
          {
            performers:
              "Sabine Meyer; Staatskapelle Dresden; Herbert Blomstedt",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Thea King; English Chamber Orchestra; Jeffrey Tate",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Requiem",
        recordings: [
          {
            performers:
              "English Baroque Soloists; Monteverdi Choir; John Eliot Gardiner",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Staatskapelle Dresden; Peter Schreier",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Ludwig van Beethoven",
    works: [
      {
        title: "Piano Concertos Nos. 1-5",
        recordings: [],
      },
      {
        title: "Violin Concerto",
        recordings: [
          {
            performers:
              "Itzhak Perlman; Philharmonia Orchestra; Carlo Maria Giulini",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Piano Sonata No. 8 'Pathetique'",
        recordings: [],
      },
      {
        title: "Piano Sonata No. 21 'Waldstein'",
        recordings: [
          { performers: "Alfred Brendel", listId: "", startVideoId: "" },
          { performers: "Wilhelm Kempff", listId: "", startVideoId: "" },
        ],
      },
      {
        title: "Piano Sonata No. 23 'Appassionata'",
        recordings: [
          {
            performers: "Sviatoslav Richter",
            listId: "",
            startVideoId: "",
          },
          { performers: "Alfred Brendel", listId: "", startVideoId: "" },
        ],
      },
      {
        title: "Piano Sonatas Nos. 27-31",
        recordings: [],
      },
      {
        title: "Piano Sonata No. 32, Op. 111",
        recordings: [
          {
            performers: "Maurizio Pollini",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Diabelli Variations",
        recordings: [
          { performers: "Alfred Brendel", listId: "", startVideoId: "" },
          {
            performers: "Maurizio Pollini",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 3 'Eroica'",
        recordings: [
          {
            performers: "Berlin Philharmonic; Herbert von Karajan (1963)",
            listId: "",
            startVideoId: "",
          },
          {
            performers:
              "Orchestre Revolutionnaire et Romantique; John Eliot Gardiner",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Missa solemnis",
        recordings: [
          {
            performers:
              "Monteverdi Choir; Orchestre Revolutionnaire et Romantique; John Eliot Gardiner",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Franz Schubert",
    works: [
      {
        title: "Symphony No. 8 'Unfinished'",
        recordings: [],
      },
      {
        title: "Symphony No. 9 'Great'",
        recordings: [],
      },
      {
        title: "Piano Sonata in B-flat major, D. 960",
        recordings: [
          { performers: "Alfred Brendel", listId: "", startVideoId: "" },
          {
            performers: "Sviatoslav Richter",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Winterreise",
        recordings: [
          {
            performers: "Dietrich Fischer-Dieskau; Gerald Moore",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Ian Bostridge; Julius Drake",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Erlkonig",
        recordings: [],
      },
      {
        title: "Auf dem Wasser zu singen",
        recordings: [],
      },
      {
        title: "6 Moments musicaux, D. 780",
        recordings: [],
      },
      {
        title: "4 Impromptus, D. 899",
        recordings: [],
      },
      {
        title: "4 Impromptus, D. 935",
        recordings: [],
      },
      {
        title: "String Quintet in C major",
        recordings: [
          {
            performers: "Alban Berg Quartet; Heinrich Schiff",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Felix Mendelssohn",
    works: [
      {
        title: "Violin Concerto",
        recordings: [],
      },
      {
        title: "Songs Without Words",
        recordings: [],
      },
    ],
  },
  {
    composer: "Frederic Chopin",
    works: [
      {
        title: "Ballades",
        recordings: [],
      },
      {
        title: "Scherzos",
        recordings: [],
      },
      {
        title: "Piano Concerto No. 1",
        recordings: [],
      },
      {
        title: "Preludes",
        recordings: [],
      },
    ],
  },
  {
    composer: "Johannes Brahms",
    works: [
      {
        title: "Piano Concerto No. 1",
        recordings: [],
      },
      {
        title: "Piano Concerto No. 2",
        recordings: [
          {
            performers: "Emil Gilels; Berlin Philharmonic; Eugen Jochum",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Violin Concerto",
        recordings: [
          {
            performers:
              "Arthur Grumiaux; New Philharmonia Orchestra; Colin Davis",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Piano Sonata No. 3",
        recordings: [],
      },
      {
        title: "Late Piano Pieces Opp. 117-119",
        recordings: [],
      },
      {
        title: "A German Requiem",
        recordings: [
          {
            performers:
              "Bavarian Radio Symphony Orchestra; Wolfgang Sawallisch",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Max Bruch",
    works: [
      {
        title: "Violin Concerto No. 1",
        recordings: [],
      },
    ],
  },
  {
    composer: "Cesar Franck",
    works: [
      {
        title: "Violin Sonata",
        recordings: [],
      },
    ],
  },
  {
    composer: "Richard Strauss",
    works: [
      {
        title: "Four Last Songs",
        recordings: [],
      },
    ],
  },
  {
    composer: "Richard Wagner",
    works: [
      {
        title: "Siegfried Idyll",
        recordings: [],
      },
    ],
  },
  {
    composer: "Antonin Dvorak",
    works: [
      {
        title: "Cello Concerto",
        recordings: [
          {
            performers:
              "Mstislav Rostropovich; Berlin Philharmonic; Herbert von Karajan",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 8",
        recordings: [],
      },
      {
        title: "Symphony No. 9 'From the New World'",
        recordings: [
          {
            performers: "Czech Philharmonic; Karel Ancerl",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Piano Quintet No. 2",
        recordings: [
          {
            performers: "Sviatoslav Richter; Borodin Quartet",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Gabriel Faure",
    works: [
      {
        title: "Requiem",
        recordings: [],
      },
    ],
  },
  {
    composer: "Gustav Mahler",
    works: [
      {
        title: "Symphony No. 2 'Resurrection'",
        recordings: [
          {
            performers: "London Symphony Orchestra; Leonard Bernstein",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Royal Concertgebouw Orchestra; Bernard Haitink",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 9",
        recordings: [
          {
            performers: "Berlin Philharmonic; Herbert von Karajan",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Claude Debussy",
    works: [
      {
        title: "La mer",
        recordings: [
          {
            performers: "Boston Symphony Orchestra; Charles Munch",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Cleveland Orchestra; Pierre Boulez (1994)",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Preludes, Book I",
        recordings: [
          {
            performers: "Walter Gieseking",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Violin Sonata",
        recordings: [],
      },
    ],
  },
  {
    composer: "Maurice Ravel",
    works: [
      {
        title: "Piano Concerto in G major",
        recordings: [
          {
            performers:
              "Martha Argerich; Berlin Radio Symphony Orchestra; Claudio Abbado",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Gaspard de la nuit",
        recordings: [
          {
            performers: "Martha Argerich",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Edvard Grieg",
    works: [
      {
        title: "Piano Concerto",
        recordings: [],
      },
      {
        title: "Lyric Pieces",
        recordings: [],
      },
    ],
  },
  {
    composer: "Isaac Albeniz",
    works: [
      {
        title: "Iberia",
        recordings: [],
      },
      {
        title: "Navarra",
        recordings: [],
      },
      {
        title: "Suite espanola No. 1, Op. 47",
        recordings: [],
      },
    ],
  },
  {
    composer: "Franz Liszt",
    works: [
      {
        title: "Piano Sonata in B minor",
        recordings: [
          {
            performers: "Martha Argerich",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Edward Elgar",
    works: [
      {
        title: "Cello Concerto",
        recordings: [],
      },
    ],
  },
  {
    composer: "Jean Sibelius",
    works: [
      {
        title: "Violin Concerto",
        recordings: [
          {
            performers:
              "David Oistrakh; Moscow Philharmonic; Gennady Rozhdestvensky",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 5",
        recordings: [
          {
            performers: "Helsinki Philharmonic; Paavo Berglund",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
];
