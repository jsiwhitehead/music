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
        title: "Brandenburg Concertos",
        recordings: [
          {
            performers: "The English Concert; Trevor Pinnock",
            listId: "",
            startVideoId: "",
          },
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
        title: "English Suites",
        recordings: [
          { performers: "Angela Hewitt", listId: "", startVideoId: "" },
        ],
      },
    ],
  },
  {
    composer: "George Frideric Handel",
    works: [
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
      {
        title: "Water Music",
        recordings: [
          {
            performers: "English Baroque Soloists; John Eliot Gardiner",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Music for the Royal Fireworks",
        recordings: [
          {
            performers: "The English Concert; Trevor Pinnock",
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
        title: "Symphony No. 94 'Surprise'",
        recordings: [
          {
            performers: "Royal Concertgebouw Orchestra; Colin Davis",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 104 'London'",
        recordings: [
          {
            performers: "Royal Concertgebouw Orchestra; Colin Davis",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "String Quartets, Op. 76",
        recordings: [
          { performers: "Takács Quartet", listId: "", startVideoId: "" },
          {
            performers: "Quatuor Mosaïques",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Cello Concerto No. 1 in C major",
        recordings: [
          {
            performers: "Steven Isserlis; Bremen German Chamber Philharmonic",
            listId: "",
            startVideoId: "",
          },
        ],
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
            performers: "Freiburg Baroque Orchestra; René Jacobs",
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
        title: "Symphony No. 40",
        recordings: [
          {
            performers: "Vienna Philharmonic; Karl Böhm",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 41 'Jupiter'",
        recordings: [
          {
            performers: "Vienna Philharmonic; Karl Böhm",
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
        title: "String Quintets",
        recordings: [
          { performers: "Talich Quartet", listId: "", startVideoId: "" },
          {
            performers: "Amadeus Quartet; Cecil Aronowitz",
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
        title: "Symphony No. 3 'Eroica'",
        recordings: [
          {
            performers: "Berlin Philharmonic; Herbert von Karajan (1963)",
            listId: "",
            startVideoId: "",
          },
          {
            performers:
              "Orchestre Révolutionnaire et Romantique; John Eliot Gardiner",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 5",
        recordings: [
          {
            performers: "Vienna Philharmonic; Carlos Kleiber",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 9",
        recordings: [
          {
            performers: "Berlin Philharmonic; Herbert von Karajan (1963)",
            listId: "",
            startVideoId: "",
          },
          {
            performers:
              "Orchestre Révolutionnaire et Romantique; John Eliot Gardiner",
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
              "Itzhak Perlman; Philharmonia Orchestra; Carlo Maria Giulini",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Piano Concerto No. 5 'Emperor'",
        recordings: [
          {
            performers: "Emil Gilels; Cleveland Orchestra; George Szell",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Piano Sonata No. 14 'Moonlight'",
        recordings: [
          { performers: "Wilhelm Kempff", listId: "", startVideoId: "" },
          {
            performers: "Maurizio Pollini",
            listId: "",
            startVideoId: "",
          },
        ],
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
        title: "Piano Sonata No. 29 'Hammerklavier'",
        recordings: [
          {
            performers: "Maurizio Pollini",
            listId: "",
            startVideoId: "",
          },
          { performers: "Alfred Brendel", listId: "", startVideoId: "" },
        ],
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
        title: "Late String Quartets",
        recordings: [
          {
            performers: "Quartetto Italiano",
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
        title: "Missa solemnis",
        recordings: [
          {
            performers:
              "Monteverdi Choir; Orchestre Révolutionnaire et Romantique; John Eliot Gardiner",
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
        recordings: [
          {
            performers: "Royal Concertgebouw Orchestra; Bernard Haitink",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 9 'Great'",
        recordings: [
          {
            performers: "Royal Concertgebouw Orchestra; Nikolaus Harnoncourt",
            listId: "",
            startVideoId: "",
          },
        ],
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
      {
        title: "Piano Sonata in B-flat major D960",
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
    ],
  },
  {
    composer: "Johannes Brahms",
    works: [
      {
        title: "Symphony No. 1",
        recordings: [
          {
            performers: "Berlin Philharmonic; Herbert von Karajan (1963)",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Vienna Philharmonic; Carlos Kleiber",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 4",
        recordings: [
          {
            performers: "Berlin Philharmonic; Herbert von Karajan (1963)",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Vienna Philharmonic; Carlos Kleiber",
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
      {
        title: "Clarinet Quintet",
        recordings: [
          {
            performers: "Amadeus Quartet; Gervase de Peyer",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Antonín Dvořák",
    works: [
      {
        title: "Symphony No. 9 'From the New World'",
        recordings: [
          {
            performers: "Czech Philharmonic; Karel Ančerl",
            listId: "",
            startVideoId: "",
          },
        ],
      },
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
        title: "String Quartet No. 12 'American'",
        recordings: [
          { performers: "Takács Quartet", listId: "", startVideoId: "" },
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
        title: "Symphony No. 5",
        recordings: [
          {
            performers: "Berlin Philharmonic; Claudio Abbado",
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
      {
        title: "Das Lied von der Erde",
        recordings: [
          {
            performers: "Vienna Philharmonic; Bruno Walter (1960)",
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
        title: "Prélude à l'après-midi d'un faune",
        recordings: [
          {
            performers: "Cleveland Orchestra; Pierre Boulez (1993)",
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
        title: "Preludes, Book II",
        recordings: [
          {
            performers: "Walter Gieseking",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "String Quartet",
        recordings: [
          {
            performers: "Quartetto Italiano",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Maurice Ravel",
    works: [
      {
        title: "Daphnis et Chloé",
        recordings: [
          {
            performers: "Boston Symphony Orchestra; Charles Munch",
            listId: "",
            startVideoId: "",
          },
        ],
      },
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
      {
        title: "String Quartet",
        recordings: [
          {
            performers: "Quartetto Italiano",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Jean Sibelius",
    works: [
      {
        title: "Symphony No. 2",
        recordings: [
          {
            performers: "London Symphony Orchestra; Colin Davis",
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
    ],
  },
  {
    composer: "Igor Stravinsky",
    works: [
      {
        title: "The Firebird",
        recordings: [
          {
            performers: "Columbia Symphony Orchestra; Igor Stravinsky",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Cleveland Orchestra; Pierre Boulez",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Petrushka",
        recordings: [
          {
            performers: "Columbia Symphony Orchestra; Igor Stravinsky",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "The Rite of Spring",
        recordings: [
          {
            performers: "Cleveland Orchestra; Pierre Boulez",
            listId: "",
            startVideoId: "",
          },
          {
            performers: "Columbia Symphony Orchestra; Igor Stravinsky",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Dmitri Shostakovich",
    works: [
      {
        title: "Symphony No. 5",
        recordings: [
          {
            performers: "Leningrad Philharmonic Orchestra; Yevgeny Mravinsky",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Symphony No. 10",
        recordings: [
          {
            performers: "Berlin Philharmonic; Herbert von Karajan",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "String Quartet No. 8",
        recordings: [
          {
            performers: "Borodin Quartet",
            listId: "",
            startVideoId: "",
          },
        ],
      },
      {
        title: "Cello Concerto No. 1",
        recordings: [
          {
            performers:
              "Mstislav Rostropovich; Leningrad Philharmonic Orchestra; Yevgeny Mravinsky",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Hector Berlioz",
    works: [
      {
        title: "Symphonie fantastique",
        recordings: [
          {
            performers: "Boston Symphony Orchestra; Charles Munch",
            listId: "",
            startVideoId: "",
          },
        ],
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
    composer: "Anton Bruckner",
    works: [
      {
        title: "Symphony No. 7",
        recordings: [
          {
            performers: "Vienna Philharmonic; Herbert von Karajan",
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
        title: "Enigma Variations",
        recordings: [
          {
            performers: "London Symphony Orchestra; Adrian Boult",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Béla Bartók",
    works: [
      {
        title: "Music for Strings, Percussion and Celesta",
        recordings: [
          {
            performers: "Chicago Symphony Orchestra; Fritz Reiner (1958)",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
  {
    composer: "Sergei Prokofiev",
    works: [
      {
        title: "Symphony No. 5",
        recordings: [
          {
            performers: "Berlin Philharmonic; Claudio Abbado",
            listId: "",
            startVideoId: "",
          },
        ],
      },
    ],
  },
];
