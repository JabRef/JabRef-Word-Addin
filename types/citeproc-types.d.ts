/* eslint-disable */

// Type definitions for Citeproc-js
// Project: https://github.com/Juris-M/citeproc-js
// Original definitions by: Bilal Alam https://github.com/BilalAlam173
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
declare module "citeproc" {
  export interface CSL {
    Engine: Engine;
    PROCESSOR_VERSION: string;
    CONDITION_LEVEL_TOP: number;
    CONDITION_LEVEL_BOTTOM: number;
    PLAIN_HYPHEN_REGEX: RegExp;
    LOCATOR_LABELS_REGEXP: RegExp;
    STATUTE_SUBDIV_GROUPED_REGEX: RegExp;
    STATUTE_SUBDIV_PLAIN_REGEX: RegExp;
    STATUTE_SUBDIV_STRINGS: {
      "art.": string;
      "bk.": string;
      "ch.": string;
      "subch.": string;
      "p.": string;
      "pp.": string;
      "para.": string;
      "subpara.": string;
      "pt.": string;
      "r.": string;
      "sec.": string;
      "subsec.": string;
      "sch.": string;
      "tit.": string;
      "col.": string;
      "fig.": string;
      "fol.": string;
      "l.": string;
      "n.": string;
      "no.": string;
      "op.": string;
      "sv.": string;
      "vrs.": string;
      "vol.": string;
    };
    STATUTE_SUBDIV_STRINGS_REVERSE: {
      article: string;
      book: string;
      chapter: string;
      subchapter: string;
      page: string;
      paragraph: string;
      subparagraph: string;
      part: string;
      rule: string;
      section: string;
      subsection: string;
      schedule: string;
      title: string;
      column: string;
      figure: string;
      folio: string;
      line: string;
      note: string;
      issue: string;
      opus: string;
      "sub-verbo": string;
      "sub verbo": string;
      verse: string;
      volume: string;
    };
    LOCATOR_LABELS_MAP: {
      art: string;
      bk: string;
      ch: string;
      subch: string;
      col: string;
      fig: string;
      fol: string;
      l: string;
      n: string;
      no: string;
      op: string;
      p: string;
      pp: string;
      para: string;
      subpara: string;
      pt: string;
      r: string;
      sec: string;
      subsec: string;
      sv: string;
      sch: string;
      tit: string;
      vrs: string;
      vol: string;
    };
    MODULE_MACROS: {
      "juris-pretitle": boolean;
      "juris-title": boolean;
      "juris-pretitle-short": boolean;
      "juris-title-short": boolean;
      "juris-main": boolean;
      "juris-main-short": boolean;
      "juris-tail": boolean;
      "juris-tail-short": boolean;
      "juris-locator": boolean;
    };
    MODULE_TYPES: {
      legal_case: boolean;
      legislation: boolean;
      bill: boolean;
      hearing: boolean;
      gazette: boolean;
      report: boolean;
      regulation: boolean;
      standard: boolean;
    };
    NestedBraces: string[][];
    checkNestedBrace: (state: any) => void;
    MULTI_FIELDS: string[];
    LangPrefsMap: {
      title: string;
      "title-short": string;
      event: string;
      genre: string;
      medium: string;
      "container-title": string;
      "collection-title": string;
      archive: string;
      publisher: string;
      authority: string;
      "publisher-place": string;
      "event-place": string;
      "archive-place": string;
      jurisdiction: string;
      number: string;
      edition: string;
      issue: string;
      volume: string;
    };
    AbbreviationSegments: () => void;
    FIELD_CATEGORY_REMAP: {
      title: string;
      "container-title": string;
      "collection-title": string;
      number: string;
      place: string;
      archive: string;
      "title-short": string;
      genre: string;
      event: string;
      medium: string;
      "archive-place": string;
      "publisher-place": string;
      "event-place": string;
      jurisdiction: string;
      "language-name": string;
      "language-name-original": string;
      "call-number": string;
      "chapter-number": string;
      "collection-number": string;
      edition: string;
      page: string;
      issue: string;
      locator: string;
      "number-of-pages": string;
      "number-of-volumes": string;
      volume: string;
      "citation-number": string;
      publisher: string;
    };
    parseLocator: (item: any) => any;
    normalizeLocaleStr: (str: any) => any;
    parseNoteFieldHacks: (
      Item: any,
      validFieldsForType: any,
      allowDateOverride: any
    ) => void;
    GENDERS: string[];
    ERROR_NO_RENDERED_FORM: number;
    PREVIEW: string;
    ASSUME_ALL_ITEMS_REGISTERED: number;
    START: number;
    END: number;
    SINGLETON: number;
    SEEN: number;
    SUCCESSOR: number;
    SUCCESSOR_OF_SUCCESSOR: number;
    SUPPRESS: number;
    SINGULAR: number;
    PLURAL: number;
    LITERAL: boolean;
    BEFORE: number;
    AFTER: number;
    DESCENDING: number;
    ASCENDING: number;
    ONLY_FIRST: number;
    ALWAYS: number;
    ONLY_LAST: number;
    FINISH: number;
    POSITION_FIRST: number;
    POSITION_SUBSEQUENT: number;
    POSITION_IBID: number;
    POSITION_IBID_WITH_LOCATOR: number;
    MARK_TRAILING_NAMES: boolean;
    POSITION_TEST_VARS: string[];
    AREAS: string[];
    CITE_FIELDS: string[];
    MINIMAL_NAME_FIELDS: string[];
    SWAPPING_PUNCTUATION: string[];
    TERMINAL_PUNCTUATION: string[];
    NONE: number;
    NUMERIC: number;
    POSITION: number;
    COLLAPSE_VALUES: string[];
    DATE_PARTS: string[];
    DATE_PARTS_ALL: string[];
    DATE_PARTS_INTERNAL: string[];
    NAME_PARTS: string[];
    DECORABLE_NAME_PARTS: string[];
    DISAMBIGUATE_OPTIONS: string[];
    GIVENNAME_DISAMBIGUATION_RULES: string[];
    NAME_ATTRIBUTES: string[];
    PARALLEL_MATCH_VARS: string[];
    PARALLEL_TYPES: string[];
    PARALLEL_COLLAPSING_MID_VARSET: string[];
    LOOSE: number;
    STRICT: number;
    TOLERANT: number;
    PREFIX_PUNCTUATION: RegExp;
    SUFFIX_PUNCTUATION: RegExp;
    NUMBER_REGEXP: RegExp;
    NAME_INITIAL_REGEXP: RegExp;
    ROMANESQUE_REGEXP: RegExp;
    ROMANESQUE_NOT_REGEXP: RegExp;
    STARTSWITH_ROMANESQUE_REGEXP: RegExp;
    ENDSWITH_ROMANESQUE_REGEXP: RegExp;
    ALL_ROMANESQUE_REGEXP: RegExp;
    VIETNAMESE_SPECIALS: RegExp;
    VIETNAMESE_NAMES: RegExp;
    NOTE_FIELDS_REGEXP: RegExp;
    NOTE_FIELD_REGEXP: RegExp;
    PARTICLE_GIVEN_REGEXP: RegExp;
    PARTICLE_FAMILY_REGEXP: RegExp;
    DISPLAY_CLASSES: string[];
    NAME_VARIABLES: string[];
    NUMERIC_VARIABLES: string[];
    DATE_VARIABLES: string[];
    TITLE_FIELD_SPLITS: (seg: any) => {};
    TAG_USEALL: (str: any) => any;
    demoteNoiseWords: (state: any, fld: any, drop_or_demote: any) => any;
    extractTitleAndSubtitle: (Item: any) => void;
    titlecaseSentenceOrNormal: (
      state: any,
      Item: any,
      seg: any,
      lang: any,
      sentenceCase: any
    ) => void;
    getSafeEscape: (state: any) => void;
    SKIP_WORDS: string[];
    FORMAT_KEY_SEQUENCE: string[];
    INSTITUTION_KEYS: string[];
    SUFFIX_CHARS: string;
    ROMAN_NUMERALS: string[][];
    CREATORS: string[];
    LANGS: {
      "af-ZA": string;
      ar: string;
      "bg-BG": string;
      "ca-AD": string;
      "cs-CZ": string;
      "da-DK": string;
      "de-AT": string;
      "de-CH": string;
      "de-DE": string;
      "el-GR": string;
      "en-GB": string;
      "en-US": string;
      "es-ES": string;
      "et-EE": string;
      eu: string;
      "fa-IR": string;
      "fi-FI": string;
      "fr-CA": string;
      "fr-FR": string;
      "he-IL": string;
      "hr-HR": string;
      "hu-HU": string;
      "is-IS": string;
      "it-IT": string;
      "ja-JP": string;
      "km-KH": string;
      "ko-KR": string;
      "lt-LT": string;
      "lv-LV": string;
      "mn-MN": string;
      "nb-NO": string;
      "nl-NL": string;
      "nn-NO": string;
      "pl-PL": string;
      "pt-BR": string;
      "pt-PT": string;
      "ro-RO": string;
      "ru-RU": string;
      "sk-SK": string;
      "sl-SI": string;
      "sr-RS": string;
      "sv-SE": string;
      "th-TH": string;
      "tr-TR": string;
      "uk-UA": string;
      "vi-VN": string;
      "zh-CN": string;
      "zh-TW": string;
    };
    LANG_BASES: {
      af: string;
      ar: string;
      bg: string;
      ca: string;
      cs: string;
      da: string;
      de: string;
      el: string;
      en: string;
      es: string;
      et: string;
      eu: string;
      fa: string;
      fi: string;
      fr: string;
      he: string;
      hr: string;
      hu: string;
      is: string;
      it: string;
      ja: string;
      km: string;
      ko: string;
      lt: string;
      lv: string;
      mn: string;
      nb: string;
      nl: string;
      nn: string;
      pl: string;
      pt: string;
      ro: string;
      ru: string;
      sk: string;
      sl: string;
      sr: string;
      sv: string;
      th: string;
      tr: string;
      uk: string;
      vi: string;
      zh: string;
    };
    SUPERSCRIPTS: {
      "\u00AA": string;
      "\u00B2": string;
      "\u00B3": string;
      "\u00B9": string;
      "\u00BA": string;
      "\u02B0": string;
      "\u02B1": string;
      "\u02B2": string;
      "\u02B3": string;
      "\u02B4": string;
      "\u02B5": string;
      "\u02B6": string;
      "\u02B7": string;
      "\u02B8": string;
      "\u02E0": string;
      "\u02E1": string;
      "\u02E2": string;
      "\u02E3": string;
      "\u02E4": string;
      "\u1D2C": string;
      "\u1D2D": string;
      "\u1D2E": string;
      "\u1D30": string;
      "\u1D31": string;
      "\u1D32": string;
      "\u1D33": string;
      "\u1D34": string;
      "\u1D35": string;
      "\u1D36": string;
      "\u1D37": string;
      "\u1D38": string;
      "\u1D39": string;
      "\u1D3A": string;
      "\u1D3C": string;
      "\u1D3D": string;
      "\u1D3E": string;
      "\u1D3F": string;
      "\u1D40": string;
      "\u1D41": string;
      "\u1D42": string;
      "\u1D43": string;
      "\u1D44": string;
      "\u1D45": string;
      "\u1D46": string;
      "\u1D47": string;
      "\u1D48": string;
      "\u1D49": string;
      "\u1D4A": string;
      "\u1D4B": string;
      "\u1D4C": string;
      "\u1D4D": string;
      "\u1D4F": string;
      "\u1D50": string;
      "\u1D51": string;
      "\u1D52": string;
      "\u1D53": string;
      "\u1D54": string;
      "\u1D55": string;
      "\u1D56": string;
      "\u1D57": string;
      "\u1D58": string;
      "\u1D59": string;
      "\u1D5A": string;
      "\u1D5B": string;
      "\u1D5C": string;
      "\u1D5D": string;
      "\u1D5E": string;
      "\u1D5F": string;
      "\u1D60": string;
      "\u1D61": string;
      "\u2070": string;
      "\u2071": string;
      "\u2074": string;
      "\u2075": string;
      "\u2076": string;
      "\u2077": string;
      "\u2078": string;
      "\u2079": string;
      "\u207A": string;
      "\u207B": string;
      "\u207C": string;
      "\u207D": string;
      "\u207E": string;
      "\u207F": string;
      "\u2120": string;
      "\u2122": string;
      "\u3192": string;
      "\u3193": string;
      "\u3194": string;
      "\u3195": string;
      "\u3196": string;
      "\u3197": string;
      "\u3198": string;
      "\u3199": string;
      "\u319A": string;
      "\u319B": string;
      "\u319C": string;
      "\u319D": string;
      "\u319E": string;
      "\u319F": string;
      "\u02C0": string;
      "\u02C1": string;
      "\u06E5": string;
      "\u06E6": string;
    };
    SUPERSCRIPTS_REGEXP: RegExp;
    UPDATE_GROUP_CONTEXT_CONDITION: (
      state: any,
      termtxt: any,
      valueTerm: any
    ) => void;
    locale: {};
    locale_opts: {};
    locale_dates: {};
  }

  /**
   * 0: `Bibmeta`
   *
   * 1: Array of raw formatted reference HTML.
   */
  export type GeneratedBibliography = [Bibmeta, string[]];

  interface Bibliography {
    tokens: Token[];
  }

  /**
   *
   * Source: https://github.com/Juris-M/citeproc-js/blob/master/src/obj_token.js
   */
  interface Token {
    /**
     * Name of the element.
     *
     * This corresponds to the element name of the relevant tag in the CSL file.
     */
    name: string;
  }

  interface CitationItem {
    locator?: string;
    label?: string;
    "suppress-author"?: boolean;
    "author-only"?: boolean;
    prefix?: string;
    suffix?: string;
    id: string;
  }

  /**
   * Tuple describing the "where", "what", and "id" details for a given citation after being
   * processed.
   *
   * 0: The index of the citation's `HTMLElement` within the document
   *
   * 1: An HTML string to be used for the inline citation
   *
   * 2: A string containing a unique ID which should be used for the citations `HTMLElement` ID
   */
  export type CitationResult = [number, string, string];

  /**
   * Enum describing either the citations occuring before or after a given citation in the
   * document.
   *
   * 0: ID of the `HTMLElement` containing the inline citation(s)
   *
   * 1: 0-based index of the location of the `HTMLElement` in the document
   */
  export type Locator = Array<[string, number]>;

  export interface CitationResultMeta {
    /**
     * Did the result of the operation result in a change in the structure of the bibliography?
     * @ignore This is highly inaccurate and buggy. Do not use.
     */
    bibchange: boolean;
    /**
     * Array of error messages that occurred during the operation, if they occurred.
     */
    citation_errors: string[];
  }

  /**
   * 0: A string containing a unique ID which should be used for the span element's ID.
   *
   * 1: The citation's "noteIndex" (relevant only if it's a "full-note" or "footnote" style citation)
   *
   * 2: An HTML string of the inline citation.
   */
  export type RebuildProcessorStateData = [string, number, string];

  /**
   * Where...
   *
   * `in-text` = regular inline citation type.
   *
   * `note` = footnote type.
   */
  export type CitationKind = "in-text" | "note";

  export interface Bibmeta {
    /**
     * An HTML string to be appended to the end of the finished bibliography string.
     * @ignore (unused by ABT)
     */
    bibend: string;
    /**
     * Array of error messages, or an empty array if no errors occurred.
     */
    bibliography_errors: string[];
    /**
     * An HTML string to be appended to the front of the finished bibliography string.
     * @ignore (unused by ABT)
     */
    bibstart: string;
    /**
     * Array of Array of CSL Citation IDs. As far as I know, the inner array should only ever
     * contain one string, which would equal the single ID for that individual citation entry.
     */
    entry_ids: Array<[string]>;
    /**
     * An integer representing the spacing between entries in the bibliography.
     */
    entryspacing: number;
    /**
     * The number of em-spaces to apply in hanging indents within the bibliography.
     */
    hangingindent?: number;
    /**
     * An integer representing the spacing between the lines within each bibliography entry.
     * i.e. padding above and below each line
     */
    linespacing: number;
    /**
     * The maximum number of characters that appear in any label used in the bibliography. The
     * client that controls the final rendering of the bibliography string should use this
     * value to calculate and apply a suitable indentation length.
     */
    maxoffset: number;
    /**
     * @see http://docs.citationstyles.org/en/stable/specification.html#bibliography-specific-options
     * @see https://github.com/citation-style-language/styles/issues/804#issuecomment-31467854
     */
    "second-field-align": "flush" | "margin" | false;
  }
  export interface Author {
    family?: string;
    given?: string;
    literal?: string;
    fullName?: string;
    "parse-names"?: boolean;
  }
  export interface MetaData {
    id: string;
    type: string;
    title: string;
    year?: number;

    issued?: Issued;
    accessed?: Date;
    mts?: any;
    number?: string;

    author?: Author[];
    editor?: Author[];
    composer?: Author[];
    recipient?: Author[];
    translator?: Author[];
    contributor?: Author[];
    interviewer?: Author[];
    "reviewed-author"?: Author[];

    volume?: string;
    genre?: string;
    page?: string;
    issue?: string;
    ISSN?: string;
    ISBN?: string;
    DOI?: string;
    PMID?: string;
    edition?: string;
    citekey?: string;
    URL?: string;
    publisher?: string;
    "publisher-place"?: string;
    "container-title"?: string;
    "container-title-short"?: string;
    "collection-title"?: string;
    "container-author"?: Author[];
    archive_location?: string;
    euId?: string;
    refId?: string;
    tags?: any[];
    note?: string;
    keyword?: string;
    notes?: any[];
    source?: string;
    creators?: string;
    etal?: string;
    ext?: PubExt;
    ownerTitle?: string;
    bMetaSync?: boolean;
  }
  export interface Issued {
    "date-parts"?: string[][];
  }
  export interface ImportInfo {
    dataUrl?: string;
    domain?: string;
    identifier?: string;
    identifierType?: string;
    index?: string;
    listingPage?: boolean;
    mobile?: boolean;
    openaccess?: boolean;
    pdfLink?: string;
    psp?: number;
    pubLink?: string;
    type?: string;
  }
  export interface PubExt {
    keywords?: string;
    url?: any[];
    idents?: any;
    description?: string;
    importId?: string;
    isRecommended?: boolean;
    isGroup?: boolean;
    myPub?: boolean;
    files?: any[];
    fileName?: string[];
    fileSize?: any[];
    inLibrary?: number; // 0: not in library, 1: in library, 2 has pending actions
    stars?: number;
    private?: boolean;
    read?: boolean;
    importInfo?: ImportInfo;
  }

  export interface Citation {
    /** ID of the HTMLSpanElement of the single citation element */
    citationID: string;
    /** Describes all citations that exist within the singe citation element */
    citationItems: Array<CitationItem>;
    properties: {
      /**
       * 0-based index of the citation group in the document
       */
      index: number;
      /**
       * Indicates the footnote number in which the citation is located
       * within the document. Citations within the main text of the
       * document have a noteIndex of 0.
       */
      noteIndex?: number;
    };
  }

  interface StatefulCitation extends Citation {
    sortedItems: Array<[CitationItem, CitationItem]>;
  }

  interface CitationRegistry {
    /**
     * Retrieve citation(s) by a HTMLSpanElement ID
     */
    citationById: Record<string, StatefulCitation>;
    /**
     * Array of `Citation` ordered ascending by use in the document
     */
    citationByIndex: StatefulCitation[];
    /**
     * Retrieve citation by the unique citation ID
     */
    citationsByItemId: Record<string, StatefulCitation[]>;
  }

  interface Registry {
    debug: boolean;
    state: CSL;
    citationreg: CitationRegistry;
    refhash: Record<string, CitationItem>;
    getSortedIds(): string[];
    getSortedRegistryItems(): CitationItem[];
  }

  export interface Sys {
    retrieveLocale(lang: string): string;
    retrieveItem(id: string | number): MetaData;
    abbreviations?: any;
    abbrevsname?: string;
    getAbbreviation?(
      styleID: string,
      cacheObject: any,
      jurisdiction: string,
      category: string,
      key: string,
      noHints: boolean
    ): string;
  }

  export class Engine {
    registry: Registry;
    sys: Sys;
    bibliography: Bibliography;
    opt: {
      development_extensions: {
        /**
         * @defaultValue true
         */
        allow_field_hack_date_override: boolean;
        /**
         * @defaultValue false
         */
        allow_force_lowercase: boolean;
        /**
         * @defaultValue false
         */
        apply_citation_wrapper: boolean;
        /**
         * @defaultValue true
         */
        clean_up_csl_flaws: boolean;
        /**
         * @defaultValue false
         */
        clobber_locator_if_no_statute_section: boolean;
        /**
         * @defaultValue false
         */
        csl_reverse_lookup_support: boolean;
        /**
         * @defaultValue false
         */
        expect_and_symbol_form: boolean;
        /**
         * @defaultValue true
         */
        field_hack: boolean;
        /**
         * @defaultValue true
         */
        flip_parentheses_to_braces: boolean;
        /**
         * @defaultValue false
         */
        force_jurisdiction: boolean;
        /**
         * @defaultValue false
         */
        handle_parallel_articles: boolean;
        /**
         * @defaultValue true
         */
        jurisdiction_subfield: boolean;
        /**
         * @defaultValue true
         */
        locator_date_and_revision: boolean;
        /**
         * @defaultValue true
         */
        locator_label_parse: boolean;
        /**
         * @defaultValue true
         */
        locator_parsing_for_plurals: boolean;
        /**
         * @defaultValue false
         */
        main_title_from_short_title: boolean;
        /**
         * @defaultValue false
         */
        normalize_lang_keys_to_lowercase: boolean;
        /**
         * @defaultValue true
         */
        parse_names: boolean;
        /**
         * @defaultValue true
         */
        raw_date_parsing: boolean;
        /**
         * @defaultValue false
         */
        require_explicit_legal_case_title_short: boolean;
        /**
         * @defaultValue false
         */
        rtl_support: boolean;
        /**
         * @defaultValue false
         */
        spoof_institutional_affiliations: boolean;
        /**
         * @defaultValue false
         */
        static_statute_locator: boolean;
        /**
         * @defaultValue false
         */
        strict_text_case_locales: boolean;
        /**
         * @defaultValue false
         */
        thin_non_breaking_space_html_hack: boolean;
        /**
         * @defaultValue false
         */
        uppercase_subtitles: boolean;
        /**
         * @defaultValue false
         */
        wrap_url_and_doi: boolean;
      };
      xclass: CitationKind;
    };
    constructor(sys: Sys, style: string, lang?: string, forceLang?: boolean);

    /**
     * Changesd the output format of the processor can be changed to any of the defined formats after instantiation
     * @param format string that defined output format
     */
    setOutputFormat(format: "rtf" | "text" | "html"): void;
    /**
     * Prunes all citations from the processor not listed in `idList`.
     *
     * @param idList An array of citation IDs to keep
     */
    updateItems(idList: string[]): void;
    /**
     * Prunes all citations (listed as "uncited") from the processor not listed in `idList`.
     *
     * @param idList An array of citation IDs to keep
     */
    updateUncitedItems(idList: string[]): void;
    /**
     * Returns a single bibliography object based on the current state of the processor registry.
     *
     * NOTE: This will return `false` if the current citation style doesn't support bibliographies (e.g. "Mercatus Center").
     */
    makeBibliography(): GeneratedBibliography | false;
    /**
     * Adds a citation to the registry and regenerates the document's citations.
     * @param citation The new citation to be added
     * @param citationsPre Citations occurring before the citation in the document
     * @param citationsPost Citations occurring after the citation in the document
     */
    processCitationCluster(
      citation: Citation,
      citationsPre: Locator,
      citationsPost: Locator
    ): [CitationResultMeta, CitationResult[]];
    /**
     * Rebuilds the state of the processor to match a given `CitationByIndex` object.
     *
     * Returns a list of [citationID,noteIndex,string] tuples in document order.
     * Set citation.properties.noteIndex to 0 for in-text citations.
     * It is not necessary to run updateItems() before this function.
     *
     * @param citationByIndex The new state that should be matched.
     * @param mode Citatation mode. (default: 'html')
     * @param uncitedItemIds An array of uncited item IDs.
     */
    rebuildProcessorState(
      citationByIndex: Citation[],
      mode?: "html" | "text" | "rtf",
      uncitedItemIds?: string[]
    ): RebuildProcessorStateData[];
  }
}
