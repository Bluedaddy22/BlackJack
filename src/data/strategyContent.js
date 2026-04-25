export const dealerUpCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

export const strategyTableSections = [
  {
    key: 'hard',
    kicker: 'Hard Totals',
    title: 'Hard Totals',
    description: 'Hands without a usable ace.',
    rows: [
      { label: '17+', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
      { label: '16', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
      { label: '15', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
      { label: '14', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
      { label: '13', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
      { label: '12', actions: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
      { label: '11', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'] },
      { label: '10', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
      { label: '9', actions: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
      { label: '8-', actions: ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'] },
    ],
  },
  {
    key: 'soft',
    kicker: 'Soft Totals',
    title: 'Soft Totals',
    description: 'Hands with a usable ace.',
    rows: [
      { label: 'A,9', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
      { label: 'A,8', actions: ['S', 'S', 'S', 'S', 'D', 'S', 'S', 'S', 'S', 'S'] },
      { label: 'A,7', actions: ['S', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'] },
      { label: 'A,6', actions: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
      { label: 'A,5', actions: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
      { label: 'A,4', actions: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
      { label: 'A,3', actions: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
      { label: 'A,2', actions: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
    ],
  },
  {
    key: 'pairs',
    kicker: 'Pairs',
    title: 'Pairs',
    description: 'Recommended pair decisions before fallback play.',
    rows: [
      { label: 'A,A', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'] },
      { label: '10,10', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
      { label: '9,9', actions: ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'] },
      { label: '8,8', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'] },
      { label: '7,7', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
      { label: '6,6', actions: ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
      { label: '5,5', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
      { label: '4,4', actions: ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
      { label: '3,3', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
      { label: '2,2', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
    ],
  },
];

export const strategyLegend = [
  { code: 'H', label: 'Hit', className: 'hit' },
  { code: 'S', label: 'Stand', className: 'stand' },
  { code: 'D', label: 'Double', className: 'double' },
  { code: 'P', label: 'Split', className: 'split' },
];

export const howToPlaySections = [
  {
    kicker: 'Core Rules',
    title: 'What you are trying to do',
    items: [
      { term: 'Goal', copy: 'Finish with a total closer to 21 than the dealer without going over.' },
      { term: 'Card Values', copy: 'Number cards are face value, face cards are 10, and aces count as 1 or 11.' },
      { term: 'Blackjack', copy: 'An ace plus a 10-value card on the initial two cards is a blackjack and pays 3:2.' },
      { term: 'Bust', copy: 'If your hand goes over 21, you lose immediately.' },
    ],
  },
  {
    kicker: 'Player Decisions',
    title: 'What each button means',
    items: [
      { term: 'Hit', copy: 'Take one more card to improve your total.' },
      { term: 'Stand', copy: 'Keep your current hand and end your turn.' },
      { term: 'Double', copy: 'Double your bet, take exactly one card, and then stand.' },
      { term: 'Split', copy: 'If you have a pair, separate it into two hands and play them one at a time.' },
    ],
  },
  {
    kicker: 'Dealer Rules',
    title: 'How the dealer plays',
    items: [
      { term: 'Dealer Hits Soft 17', copy: 'In this trainer, the dealer must draw on soft 17 such as Ace-6.' },
      { term: 'Dealer Stands on Hard 17+', copy: 'Once the dealer reaches a hard 17 or more, the dealer stops drawing.' },
      { term: 'Push', copy: 'If you and the dealer finish with the same total, the hand is a push.' },
    ],
  },
];
