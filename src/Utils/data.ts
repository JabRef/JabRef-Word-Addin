const data = [
  {
    id: "jabref/QGIFRNH8",
    type: "article-journal",
    "container-title": "CoRR",
    note: "_eprint: 1711.06134",
    title: '"Making you happy makes me happy" - Measuring Individual Mood with Smartwatches',
    URL: "http://arxiv.org/abs/1711.06134",
    volume: "abs/1711.06134",
    author: [
      {
        family: "Budner",
        given: "Pascal",
      },
      {
        family: "Eirich",
        given: "Joscha",
      },
      {
        family: "Gloor",
        given: "Peter A.",
      },
    ],
    issued: {
      "date-parts": [["2017"]],
    },
  },
  {
    id: "jabref/U89EWITH",
    type: "thesis",
    genre: "PhD Thesis",
    publisher: "Pierre and Marie Curie University, Paris, France",
    title:
      "Happywork : modélisation multi-agents de la satisfaction au travail. (happywork : multi-agent based modeling of job satisfaction)",
    URL: "https://tel.archives-ouvertes.fr/tel-01401254",
    author: [
      {
        family: "Chapuis",
        given: "Kevin",
      },
    ],
    issued: {
      "date-parts": [["2016"]],
    },
  },
  {
    id: "jabref/2QKSYJCL",
    type: "paper-conference",
    "collection-title": "CEUR Workshop Proceedings",
    "container-title":
      "Supplementary Proceedings of the 4th International Conference on Analysis of Images, Social Networks and Texts (AIST'2015), Yekaterinburg, Russia, April 9-11, 2015",
    page: "126–136",
    publisher: "CEUR-WS.org",
    title: 'Am I Really Happy When I Write "Happy" in My Post?',
    URL: "http://ceur-ws.org/Vol-1452/paper15.pdf",
    volume: "1452",
    author: [
      {
        family: "Shashkin",
        given: "Pavel",
      },
      {
        family: "Porshnev",
        given: "Alexander",
      },
    ],
    editor: [
      {
        family: "Khachay",
        given: "Mikhail Yu",
      },
      {
        family: "Konstantinova",
        given: "Natalia",
      },
      {
        family: "Panchenko",
        given: "Alexander",
      },
      {
        family: "Delhibabu",
        given: "Radhakrishnan",
      },
      {
        family: "Spirin",
        given: "Nikita",
      },
      {
        family: "Labunets",
        given: "Valeri G.",
      },
    ],
    issued: {
      "date-parts": [["2015"]],
    },
  },
  {
    id: "jabref/TXGT9C3K",
    type: "article-journal",
    "container-title": "Bus. Inf. Syst. Eng.",
    DOI: "10.1007/s12599-012-0239-z",
    issue: "6",
    page: "307–315",
    title:
      "On Dinosaurs, Measurement Ideologists, Separatists, and Happy Souls - Proposing and Justifying a Way to Make the Global IS/BISE Community Happy",
    volume: "4",
    author: [
      {
        family: "Buhl",
        given: "Hans Ulrich",
      },
      {
        family: "Fridgen",
        given: "Gilbert",
      },
      {
        family: "Müller",
        given: "Günter",
      },
      {
        family: "Röglinger",
        given: "Maximilian",
      },
    ],
    issued: {
      "date-parts": [["2012"]],
    },
  },
  {
    id: "jabref/GLL2PCQU",
    type: "paper-conference",
    "container-title":
      "Proceedings of the 8th International Conference on Advances in Computer Entertainment Technology, ACE 2011, Lisbon, Portugal, November 8-11, 2011",
    DOI: "10.1145/2071423.2071426",
    page: "2",
    publisher: "ACM",
    title: '"I\'m happy if you are happy.": a model for emotional contagion in game characters',
    author: [
      {
        family: "Dimas",
        given: "Joana",
      },
      {
        family: "Pereira",
        given: "Gonçalo Duarte Garcia",
      },
      {
        family: "Santos",
        given: "Pedro Alexandre",
      },
      {
        family: "Prada",
        given: "Rui",
      },
      {
        family: "Paiva",
        given: "Ana",
      },
    ],
    editor: [
      {
        family: "Romão",
        given: "Teresa",
      },
      {
        family: "Correia",
        given: "Nuno",
      },
      {
        family: "Inami",
        given: "Masahiko",
      },
      {
        family: "Kato",
        given: "Hirokasu",
      },
      {
        family: "Prada",
        given: "Rui",
      },
      {
        family: "Terada",
        given: "Tsutomu",
      },
      {
        family: "Dias",
        given: "A. Eduardo",
      },
      {
        family: "Chambel",
        given: "Teresa",
      },
    ],
    issued: {
      "date-parts": [["2011"]],
    },
  },
];
export type BibliographyEntry = {
  id: string;
  author?: { family?: string; given?: string }[];
  title: string;
  journal?: string;
  volume?: string;
  number?: string;
  pages?: string;
  year?: string;
  DOI?: string;
  type?: string;
  abstract?: string;
  keywords?: string;
  citationKey?: string;
  other?: unknown;
  "container-title"?: string;
  ISSN?: string;
  issue?: string;
  journalAbbreviation?: string;
  language?: string;
  page?: string;
  source?: string;
  issued?: unknown;
};

export default data;

export const citationByIndex = {
  citationID: "MENDELEY_CITATION_edacf0a6-85e6-4124-90ee-59edce276d5e",
  citationItems: [
    {
      id: "3dac7110-4c58-32d7-9156-94dc292bd081",
      itemData: {
        type: "article-journal",
        id: "3dac7110-4c58-32d7-9156-94dc292bd081",
        title:
          "Clebsch-Lagrange variational principle and geometric constraint analysis of relativistic field theories",
        author: [
          {
            family: "Rocks",
            given: "Tobias",
            "parse-names": false,
            "dropping-particle": "",
            "non-dropping-particle": "",
          },
          {
            family: "Rudolph",
            given: "Gerd",
            "parse-names": false,
            "dropping-particle": "",
            "non-dropping-particle": "",
          },
        ],
        "container-title": "Journal of Mathematical Physics",
        DOI: "10.1063/1.5085764",
        ISSN: "00222488",
        issued: { "date-parts": [[2021]] },
        abstract:
          "Inspired by the Clebsch optimal control problem, we introduce a new variational principle that is suitable for capturing the geometry of relativistic field theories with constraints related to a gauge symmetry. Its special feature is that the Lagrange multipliers couple to the configuration variables via the symmetry group action. The resulting constraints are formulated as a condition on the momentum map of the gauge group action on the phase space of the system. We discuss the Hamiltonian picture and the reduction in the gauge symmetry by stages in this geometric setting. We show that the Yang-Mills-Higgs action and the Einstein-Hilbert action fit into this new framework after a (1 + 3)-splitting. Moreover, we recover the GauÃ constraint of Yang-Mills-Higgs theory and the diffeomorphism constraint of general relativity as momentum map constraints.",
        issue: "8",
        volume: "60",
      },
      isTemporary: false,
    },
  ],
  properties: { noteIndex: 0 },
  isEdited: false,
  manualOverride: { isManuallyOverriden: false, citeprocText: "(Rocks and Rudolph 2021)", manualOverrideText: "" },
};
