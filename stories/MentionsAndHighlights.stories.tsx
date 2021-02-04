import { Meta, Story } from '@storybook/react/types-6-0';
import Tippy, { TippyProps } from '@tippyjs/react';
import React, { useCallback, useMemo, useState } from 'react';
import { Descendant, Editor, Range, Text, Transforms } from 'slate';
import {
  Editable,
  RenderElementProps,
  Slate,
  useFocused,
  useSelected,
  useSlate,
} from 'slate-react';
import 'tippy.js/animations/scale.css';
import 'tippy.js/themes/light.css';
import { SlateExtension, useSlateState, useSlateWithExtensions } from '../.';

export default {
  title: 'Examples/MentionsAndHighlights',
} as Meta;

export const Default: Story = () => {
  const [value, onChange] = useSlateState(initialValue);

  // define the extensions
  const { getSearchBarProps, ...highlightExtension } = useHighlightExtension(
    'search'
  );
  const { getMentionSelectProps, ...mentionExtension } = useMentionExtension();

  // create slate with the extensions
  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    onChange,
    value,
    extensions: [highlightExtension, mentionExtension],
  });

  // render the search bar and the mention select
  return (
    <Slate {...getSlateProps()}>
      <SearchBar {...getSearchBarProps()} />
      <br />
      <Editable {...getEditableProps()} />
      <MentionSelect {...getMentionSelectProps()} />
    </Slate>
  );
};

const useHighlightExtension = (
  initialSearch?: string
): SlateExtension & {
  getSearchBarProps: () => SearchBarProps;
} => {
  // state for the search text
  const [search, setSearch] = useState<string | undefined>(initialSearch);

  // decorate function for highlighting search text
  const decorate = useCallback<NonNullable<SlateExtension['decorate']>>(
    ([node, path]) => {
      const ranges: Range[] = [];

      if (search && Text.isText(node)) {
        const { text } = node;
        const parts = text.split(search);
        let offset = 0;

        parts.forEach((part, i) => {
          if (i !== 0) {
            ranges.push({
              anchor: { path, offset: offset - search.length },
              focus: { path, offset },
              highlight: true,
            });
          }

          offset = offset + part.length + search.length;
        });
      }

      return ranges;
    },
    [search]
  );

  // render leaf for rendering search text
  const renderLeaf = useCallback<NonNullable<SlateExtension['renderLeaf']>>(
    ({ leaf, children }) => {
      if (leaf.highlight) {
        return <span style={{ backgroundColor: '#ffeeba' }}>{children}</span>;
      }
    },
    []
  );

  // create the search bar props
  const getSearchBarProps = useCallback<() => SearchBarProps>(
    () => ({
      onSearchChange: setSearch,
      search: search ?? '',
    }),
    [search]
  );

  return {
    decorate,
    decorateDeps: [decorate],
    renderLeaf,
    renderLeafDeps: [renderLeaf],
    getSearchBarProps,
  };
};

interface SearchBarProps {
  search: string;
  onSearchChange: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, onSearchChange }) => {
  return (
    <label>
      Search Text{'  '}
      <input
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
    </label>
  );
};

/**
 * All of the logic for adding and rendering mentions is encapsulated in this plugin
 */
const useMentionExtension = (): SlateExtension & {
  getMentionSelectProps: () => MentionSelectProps;
} => {
  // state for Mentions
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState<Range | undefined>();
  const chars = useMemo(
    () =>
      CHARACTERS.filter(c =>
        c.toLowerCase().startsWith(search.toLowerCase())
      ).slice(0, 10),
    [search]
  );

  // helper function for inserting a mention
  const insertMention = (editor: Editor, character: string) => {
    const mention = { type: 'mention', character, children: [{ text: '' }] };
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
  };

  // handle on key down
  const onKeyDown = useCallback<NonNullable<SlateExtension['onKeyDown']>>(
    (event, editor) => {
      if (target) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setIndex(index >= chars.length - 1 ? 0 : index + 1);
            break;
          case 'ArrowUp':
            event.preventDefault();
            setIndex(index <= 0 ? chars.length - 1 : index - 1);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index]);
            setTarget(undefined);
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(undefined);
            break;
        }
      }
    },
    [chars, index, target]
  );

  // handle on change
  const onChange = useCallback<NonNullable<SlateExtension['onChange']>>(
    editor => {
      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        const [start] = Range.edges(selection);
        const wordBefore = Editor.before(editor, start, { unit: 'word' });
        const before = wordBefore && Editor.before(editor, wordBefore);
        const beforeRange = before && Editor.range(editor, before, start);
        const beforeText = beforeRange && Editor.string(editor, beforeRange);
        const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
        const after = Editor.after(editor, start);
        const afterRange = Editor.range(editor, start, after);
        const afterText = Editor.string(editor, afterRange);
        const afterMatch = afterText.match(/^(\s|$)/);

        if (beforeMatch && afterMatch) {
          setTarget(beforeRange);
          setSearch(beforeMatch[1]);
          setIndex(0);
          return;
        }
      }

      setTarget(undefined);
    },
    []
  );

  // make mentions inline elements
  const isInline = useCallback<NonNullable<SlateExtension['isInline']>>(
    (editor, element) => {
      if (element.type === 'mention') {
        return true;
      }
    },
    []
  );

  // make mentions void elements
  const isVoid = useCallback<NonNullable<SlateExtension['isVoid']>>(
    (editor, element) => {
      if (element.type === 'mention') {
        return true;
      }
    },
    []
  );

  // render mentions with the MentionElement component
  const renderElement = useCallback<
    NonNullable<SlateExtension['renderElement']>
  >(props => {
    if (props.element.type === 'mention') {
      return <MentionElement {...props} />;
    }
  }, []);

  // function to get props for the mention select
  const getMentionSelectProps = useCallback<() => MentionSelectProps>(() => {
    return {
      items: chars,
      focusedItem: index,
      open: target !== undefined,
    };
  }, [chars, index, target]);

  return {
    onChange,
    onChangeDeps: [onChange],
    onKeyDown,
    onKeyDownDeps: [onKeyDown],
    renderElement,
    renderElementDeps: [renderElement],
    isInline,
    isInlineDeps: [isInline],
    isVoid,
    isVoidDeps: [isVoid],
    getMentionSelectProps,
  };
};

/**
 * Component which renders a mention element
 */
const MentionElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: '#eee',
        fontSize: '0.9em',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
    >
      @{element.character}
      {children}
    </span>
  );
};

// Functions from Tippy js used in the MentionSelect

// eslint-disable-next-line @typescript-eslint/ban-types
type OffsetFunc = Extract<TippyProps['offset'], Function>;
// eslint-disable-next-line @typescript-eslint/ban-types
type RectFunc = Extract<TippyProps['getReferenceClientRect'], Function>;

// default rect for positioning the mention select
const zeroRect: ClientRect = {
  top: 0,
  bottom: 0,
  height: 0,
  width: 0,
  left: 0,
  right: 0,
};

interface MentionSelectProps {
  items: string[];
  focusedItem: number;
  open: boolean;
}

/**
 * Mention Select which uses tippy js to position itself at the current selection
 */
const MentionSelect: React.FC<MentionSelectProps> = props => {
  // get the current selection
  const domSelection = window.getSelection();
  const editor = useSlate();
  const focused = useFocused();

  // determine visibility based on selection, range, focus, and props
  const visible =
    domSelection !== null &&
    domSelection.rangeCount === 1 &&
    editor.selection !== null &&
    Range.isCollapsed(editor.selection) &&
    focused &&
    props.open;

  // function which creates a virtual rectangle to position the tippy at the selection
  const getBoundingClientRect = useCallback<RectFunc>(() => {
    // if closed return something arbitrary
    if (!visible) {
      return zeroRect;
    }

    // return the location of the selection
    const domRange = window.getSelection()?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();
    return rect ?? zeroRect;
  }, [visible]);

  /**
   * function which offsets the tippy js portal so that it is positioned at the selection
   */
  const offsetFunc = useCallback<OffsetFunc>(
    ({ popper, reference, placement }) => {
      // we offset by the reference width which leads to the rect being
      // at the end of the selection, then we offset by popper width over 2
      // so the final pop up shows to the bottom right of the cursor
      if (placement === 'bottom' || placement === 'top') {
        return [reference.width + popper.width / 2, 0];
      }
      return [0, 0];
    },
    []
  );

  const Content = useMemo(
    () => (
      <div>
        {props.items.map((item, i) => (
          <div
            key={item}
            style={{
              backgroundColor: i === props.focusedItem ? '#c2dfe6' : undefined,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    ),
    [props.focusedItem, props.items]
  );

  return (
    <Tippy
      getReferenceClientRect={getBoundingClientRect}
      offset={offsetFunc}
      placement={'bottom'}
      // use popper options to control when tippy doesn't have room
      // defaults to going up
      popperOptions={{
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top'],
            },
          },
        ],
      }}
      visible={visible}
      appendTo={document.body}
      theme={'light'}
      animation={'scale'}
      duration={[75, 0]}
      content={Content}
    ></Tippy>
  );
};

const CHARACTERS = [
  'Aayla Secura',
  'Adi Gallia',
  'Admiral Dodd Rancit',
  'Admiral Firmus Piett',
  'Admiral Gial Ackbar',
  'Admiral Ozzel',
  'Admiral Raddus',
  'Admiral Terrinald Screed',
  'Admiral Trench',
  'Admiral U.O. Statura',
  'Agen Kolar',
  'Agent Kallus',
  'Aiolin and Morit Astarte',
  'Aks Moe',
  'Almec',
  'Alton Kastle',
  'Amee',
  'AP-5',
  'Armitage Hux',
  'Artoo',
  'Arvel Crynyd',
  'Asajj Ventress',
  'Aurra Sing',
  'AZI-3',
  'Bala-Tik',
  'Barada',
  'Bargwill Tomder',
  'Baron Papanoida',
  'Barriss Offee',
  'Baze Malbus',
  'Bazine Netal',
  'BB-8',
  'BB-9E',
  'Ben Quadinaros',
  'Berch Teller',
  'Beru Lars',
  'Bib Fortuna',
  'Biggs Darklighter',
  'Black Krrsantan',
  'Bo-Katan Kryze',
  'Boba Fett',
  'Bobbajo',
  'Bodhi Rook',
  'Borvo the Hutt',
  'Boss Nass',
  'Bossk',
  'Breha Antilles-Organa',
  'Bren Derlin',
  'Brendol Hux',
  'BT-1',
  'C-3PO',
  'C1-10P',
  'Cad Bane',
  'Caluan Ematt',
  'Captain Gregor',
  'Captain Phasma',
  'Captain Quarsh Panaka',
  'Captain Rex',
  'Carlist Rieekan',
  'Casca Panzoro',
  'Cassian Andor',
  'Cassio Tagge',
  'Cham Syndulla',
  'Che Amanwe Papanoida',
  'Chewbacca',
  'Chi Eekway Papanoida',
  'Chief Chirpa',
  'Chirrut Îmwe',
  'Ciena Ree',
  'Cin Drallig',
  'Clegg Holdfast',
  'Cliegg Lars',
  'Coleman Kcaj',
  'Coleman Trebor',
  'Colonel Kaplan',
  'Commander Bly',
  'Commander Cody (CC-2224)',
  'Commander Fil (CC-3714)',
  'Commander Fox',
  'Commander Gree',
  'Commander Jet',
  'Commander Wolffe',
  'Conan Antonio Motti',
  'Conder Kyl',
  'Constable Zuvio',
  'Cordé',
  'Cpatain Typho',
  'Crix Madine',
  'Cut Lawquane',
  'Dak Ralter',
  'Dapp',
  'Darth Bane',
  'Darth Maul',
  'Darth Tyranus',
  'Daultay Dofine',
  'Del Meeko',
  'Delian Mors',
  'Dengar',
  'Depa Billaba',
  'Derek Klivian',
  'Dexter Jettster',
  'Dineé Ellberger',
  'DJ',
  'Doctor Aphra',
  'Doctor Evazan',
  'Dogma',
  'Dormé',
  'Dr. Cylo',
  'Droidbait',
  'Droopy McCool',
  'Dryden Vos',
  'Dud Bolt',
  'Ebe E. Endocott',
  'Echuu Shen-Jon',
  'Eeth Koth',
  'Eighth Brother',
  'Eirtaé',
  'Eli Vanto',
  'Ellé',
  'Ello Asty',
  'Embo',
  'Eneb Ray',
  'Enfys Nest',
  'EV-9D9',
  'Evaan Verlaine',
  'Even Piell',
  'Ezra Bridger',
  'Faro Argyus',
  'Feral',
  'Fifth Brother',
  'Finis Valorum',
  'Finn',
  'Fives',
  'FN-1824',
  'FN-2003',
  'Fodesinbeed Annodue',
  'Fulcrum',
  'FX-7',
  'GA-97',
  'Galen Erso',
  'Gallius Rax',
  'Garazeb "Zeb" Orrelios',
  'Gardulla the Hutt',
  'Garrick Versio',
  'Garven Dreis',
  'Gavyn Sykes',
  'Gideon Hask',
  'Gizor Dellso',
  'Gonk droid',
  'Grand Inquisitor',
  'Greeata Jendowanian',
  'Greedo',
  'Greer Sonnel',
  'Grievous',
  'Grummgar',
  'Gungi',
  'Hammerhead',
  'Han Solo',
  'Harter Kalonia',
  'Has Obbit',
  'Hera Syndulla',
  'Hevy',
  'Hondo Ohnaka',
  'Huyang',
  'Iden Versio',
  'IG-88',
  'Ima-Gun Di',
  'Inquisitors',
  'Inspector Thanoth',
  'Jabba',
  'Jacen Syndulla',
  'Jan Dodonna',
  'Jango Fett',
  'Janus Greejatus',
  'Jar Jar Binks',
  'Jas Emari',
  'Jaxxon',
  'Jek Tono Porkins',
  'Jeremoch Colton',
  'Jira',
  'Jobal Naberrie',
  'Jocasta Nu',
  'Joclad Danva',
  'Joh Yowza',
  'Jom Barell',
  'Joph Seastriker',
  'Jova Tarkin',
  'Jubnuk',
  'Jyn Erso',
  'K-2SO',
  'Kanan Jarrus',
  'Karbin',
  'Karina the Great',
  'Kes Dameron',
  'Ketsu Onyo',
  'Ki-Adi-Mundi',
  'King Katuunko',
  'Kit Fisto',
  'Kitster Banai',
  'Klaatu',
  'Klik-Klak',
  'Korr Sella',
  'Kylo Ren',
  'L3-37',
  'Lama Su',
  'Lando Calrissian',
  'Lanever Villecham',
  'Leia Organa',
  'Letta Turmond',
  'Lieutenant Kaydel Ko Connix',
  'Lieutenant Thire',
  'Lobot',
  'Logray',
  'Lok Durd',
  'Longo Two-Guns',
  'Lor San Tekka',
  'Lorth Needa',
  'Lott Dod',
  'Luke Skywalker',
  'Lumat',
  'Luminara Unduli',
  'Lux Bonteri',
  'Lyn Me',
  'Lyra Erso',
  'Mace Windu',
  'Malakili',
  'Mama the Hutt',
  'Mars Guo',
  'Mas Amedda',
  'Mawhonic',
  'Max Rebo',
  'Maximilian Veers',
  'Maz Kanata',
  'ME-8D9',
  'Meena Tills',
  'Mercurial Swift',
  'Mina Bonteri',
  'Miraj Scintel',
  'Mister Bones',
  'Mod Terrik',
  'Moden Canady',
  'Mon Mothma',
  'Moradmin Bast',
  'Moralo Eval',
  'Morley',
  'Mother Talzin',
  'Nahdar Vebb',
  'Nahdonnis Praji',
  'Nien Nunb',
  'Niima the Hutt',
  'Nines',
  'Norra Wexley',
  'Nute Gunray',
  'Nuvo Vindi',
  'Obi-Wan Kenobi',
  'Odd Ball',
  'Ody Mandrell',
  'Omi',
  'Onaconda Farr',
  'Oola',
  'OOM-9',
  'Oppo Rancisis',
  'Orn Free Taa',
  'Oro Dassyne',
  'Orrimarko',
  'Osi Sobeck',
  'Owen Lars',
  'Pablo-Jill',
  'Padmé Amidala',
  'Pagetti Rook',
  'Paige Tico',
  'Paploo',
  'Petty Officer Thanisson',
  'Pharl McQuarrie',
  'Plo Koon',
  'Po Nudo',
  'Poe Dameron',
  'Poggle the Lesser',
  'Pong Krell',
  'Pooja Naberrie',
  'PZ-4CO',
  'Quarrie',
  'Quay Tolsite',
  'Queen Apailana',
  'Queen Jamillia',
  'Queen Neeyutnee',
  'Qui-Gon Jinn',
  'Quiggold',
  'Quinlan Vos',
  'R2-D2',
  'R2-KT',
  'R3-S6',
  'R4-P17',
  'R5-D4',
  'RA-7',
  'Rabé',
  'Rako Hardeen',
  'Ransolm Casterfo',
  'Rappertunie',
  'Ratts Tyerell',
  'Raymus Antilles',
  'Ree-Yees',
  'Reeve Panzoro',
  'Rey',
  'Ric Olié',
  'Riff Tamson',
  'Riley',
  'Rinnriyin Di',
  'Rio Durant',
  'Rogue Squadron',
  'Romba',
  'Roos Tarpals',
  'Rose Tico',
  'Rotta the Hutt',
  'Rukh',
  'Rune Haako',
  'Rush Clovis',
  'Ruwee Naberrie',
  'Ryoo Naberrie',
  'Sabé',
  'Sabine Wren',
  'Saché',
  'Saelt-Marae',
  'Saesee Tiin',
  'Salacious B. Crumb',
  'San Hill',
  'Sana Starros',
  'Sarco Plank',
  'Sarkli',
  'Satine Kryze',
  'Savage Opress',
  'Sebulba',
  'Senator Organa',
  'Sergeant Kreel',
  'Seventh Sister',
  'Shaak Ti',
  'Shara Bey',
  'Shmi Skywalker',
  'Shu Mai',
  'Sidon Ithano',
  'Sifo-Dyas',
  'Sim Aloo',
  'Siniir Rath Velus',
  'Sio Bibble',
  'Sixth Brother',
  'Slowen Lo',
  'Sly Moore',
  'Snaggletooth',
  'Snap Wexley',
  'Snoke',
  'Sola Naberrie',
  'Sora Bulq',
  'Strono Tuggs',
  'Sy Snootles',
  'Tallissan Lintra',
  'Tarfful',
  'Tasu Leech',
  'Taun We',
  'TC-14',
  'Tee Watt Kaa',
  'Teebo',
  'Teedo',
  'Teemto Pagalies',
  'Temiri Blagg',
  'Tessek',
  'Tey How',
  'Thane Kyrell',
  'The Bendu',
  'The Smuggler',
  'Thrawn',
  'Tiaan Jerjerrod',
  'Tion Medon',
  'Tobias Beckett',
  'Tulon Voidgazer',
  'Tup',
  'U9-C4',
  'Unkar Plutt',
  'Val Beckett',
  'Vanden Willard',
  'Vice Admiral Amilyn Holdo',
  'Vober Dand',
  'WAC-47',
  'Wag Too',
  'Wald',
  'Walrus Man',
  'Warok',
  'Wat Tambor',
  'Watto',
  'Wedge Antilles',
  'Wes Janson',
  'Wicket W. Warrick',
  'Wilhuff Tarkin',
  'Wollivan',
  'Wuher',
  'Wullf Yularen',
  'Xamuel Lennox',
  'Yaddle',
  'Yarael Poof',
  'Yoda',
  'Zam Wesell',
  'Zev Senesca',
  'Ziro the Hutt',
  'Zuckuss',
];

const initialValue: Descendant[] = [
  {
    children: [
      {
        text:
          'This example show you how you might implement a simple @-mentions feature along with a search highlight feature',
      },
    ],
  },
  {
    children: [
      { text: 'Try mentioning characters, like ' },
      {
        type: 'mention',
        character: 'R2-D2',
        children: [{ text: '' }],
      },
      { text: ' or ' },
      {
        type: 'mention',
        character: 'Mace Windu',
        children: [{ text: '' }],
      },
      { text: '!' },
    ],
  },
  {
    children: [{ text: 'Try searching by typing in the search box above!' }],
  },
];
