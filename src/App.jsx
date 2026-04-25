import { useEffect, useRef, useState } from 'react';
import BlackjackTable from './components/BlackjackTable.jsx';
import CardBackSelector from './components/CardBackSelector.jsx';
import Controls from './components/Controls.jsx';
import FeedbackBanner from './components/FeedbackBanner.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import StatsTab from './components/StatsTab.jsx';
import StrategyGuideTab from './components/StrategyGuideTab.jsx';
import StrategyHelper from './components/StrategyHelper.jsx';
import TopNav from './components/TopNav.jsx';
import {
  canSplitHand,
  createInitialRoundState,
  drawIntoHand,
  formatOutcomeLabel,
  getDealerDisplayTotal,
  getVisibleDealerHand,
  hasAvailableDecision,
  moveToNextHand,
  playDealerHandDetailed,
  resolveCompletedRound,
  shouldAutoStand,
} from './utils/game.js';
import { getBasicStrategyDecision } from './utils/basicStrategy.js';

const DEAL_ANIMATION_MS = 380;
const DISCARD_ANIMATION_MS = 640;
const ROUND_END_PAUSE_MS = 240;
const tabs = ['Play', 'Strategy', 'Stats'];

const initialStats = {
  handsPlayed: 0,
  correctDecisions: 0,
  mistakes: 0,
  wins: 0,
  losses: 0,
  pushes: 0,
  currentStreak: 0,
  bestStreak: 0,
  mistakesByActionType: {
    Hit: 0,
    Stand: 0,
    Double: 0,
    Split: 0,
  },
};

function createPreviewHand(baseHand, cards) {
  return {
    ...baseHand,
    cards,
    outcome: null,
    payout: 0,
    hasActed: false,
    isStanding: false,
    isBusted: false,
  };
}

function App() {
  const [shoe, setShoe] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHands, setPlayerHands] = useState([]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [activeTab, setActiveTab] = useState('Play');
  const [statusText, setStatusText] = useState('Press Deal to start a new round.');
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState(initialStats);
  const [showStrategyCoach, setShowStrategyCoach] = useState(true);
  const [autoDeal, setAutoDeal] = useState(false);
  const [cardBackColor, setCardBackColor] = useState('red');
  const [tableAnimations, setTableAnimations] = useState([]);
  const [discardPileCount, setDiscardPileCount] = useState(0);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const tableRef = useRef(null);
  const shoeRef = useRef(null);
  const discardPileRef = useRef(null);
  const dealerTargetRef = useRef(null);
  const playerTargetRef = useRef(null);
  const dealAnimationIdRef = useRef(0);
  const animationTimeoutsRef = useRef(new Map());
  const animationFrameRef = useRef(new Map());

  const activeHand = playerHands[activeHandIndex];
  const canAct = phase === 'player-turn' && Boolean(activeHand) && !isAnimating;
  const canDeal = (phase === 'idle' || phase === 'round-over') && !isAnimating;
  const canHit = canAct && hasAvailableDecision(activeHand);
  const canStand = canAct && hasAvailableDecision(activeHand);
  const canDouble = canAct && activeHand.cards.length === 2 && !activeHand.hasActed;
  const canSplit = canAct && activeHand.cards.length === 2 && canSplitHand(activeHand.cards);
  const totalDecisions = stats.correctDecisions + stats.mistakes;
  const accuracy = totalDecisions === 0 ? 0 : Math.round((stats.correctDecisions / totalDecisions) * 100);
  const strategyRecommendation =
    canAct && dealerHand[0]
      ? getBasicStrategyDecision(activeHand.cards, dealerHand[0], {
          canDouble,
          canSplit,
        })
      : null;

  const updateDecisionFeedback = (decision, hand, dealerCards, options) => {
    const recommended = getBasicStrategyDecision(hand.cards, dealerCards[0], options);
    const isCorrect = recommended === decision;

    setFeedback({
      type: isCorrect ? 'correct' : 'mistake',
      text: isCorrect
        ? 'Correct move'
        : `Incorrect move — Basic strategy recommends ${recommended}.`,
      recommended,
      actual: decision,
    });

    setStats((current) => ({
      ...current,
      correctDecisions: current.correctDecisions + (isCorrect ? 1 : 0),
      mistakes: current.mistakes + (isCorrect ? 0 : 1),
      currentStreak: isCorrect ? current.currentStreak + 1 : 0,
      bestStreak: isCorrect ? Math.max(current.bestStreak, current.currentStreak + 1) : current.bestStreak,
      mistakesByActionType: isCorrect
        ? current.mistakesByActionType
        : {
            ...current.mistakesByActionType,
            [decision]: current.mistakesByActionType[decision] + 1,
          },
    }));
  };

  const wait = (durationMs) =>
    new Promise((resolve) => {
      window.setTimeout(resolve, durationMs);
    });

  const waitForNextPaint = () =>
    new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(resolve);
      });
    });

  const finishRound = async (roundDealerHand, roundPlayerHands) => {
    const outcomes = resolveCompletedRound(roundDealerHand, roundPlayerHands);

    setDealerHand(roundDealerHand);
    setPlayerHands(outcomes);
    setPhase('round-over');

    const summary = outcomes.map((hand, index) => `Hand ${index + 1}: ${formatOutcomeLabel(hand.outcome)}`);
    setStatusText(summary.join(' | '));

    setStats((current) => {
      const next = { ...current, handsPlayed: current.handsPlayed + outcomes.length };

      for (const hand of outcomes) {
        if (hand.outcome === 'win' || hand.outcome === 'blackjack') {
          next.wins += 1;
        } else if (hand.outcome === 'loss') {
          next.losses += 1;
        } else if (hand.outcome === 'push') {
          next.pushes += 1;
        }
      }

      return next;
    });

    await wait(ROUND_END_PAUSE_MS);
    await animateCardsToDiscard(roundDealerHand, outcomes);
    setDealerHand([]);
    setPlayerHands([]);
    setActiveHandIndex(0);
  };

  const clearAnimationEffect = (animationId) => {
    const timeoutId = animationTimeoutsRef.current.get(animationId);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      animationTimeoutsRef.current.delete(animationId);
    }

    const frameId = animationFrameRef.current.get(animationId);
    if (frameId) {
      window.cancelAnimationFrame(frameId);
      animationFrameRef.current.delete(animationId);
    }
  };

  const activateAnimation = (animationId) => {
    setTableAnimations((current) =>
      current.map((animation) =>
        animation.id === animationId ? { ...animation, isActive: true } : animation,
      ),
    );
  };

  const queueCardAnimation = (event) =>
    new Promise((resolve) => {
      setTableAnimations((current) => [...current, { ...event, isActive: false }]);

      const frameId = window.requestAnimationFrame(() => {
        const nestedFrameId = window.requestAnimationFrame(() => {
          animationFrameRef.current.delete(event.id);
          activateAnimation(event.id);
        });

        animationFrameRef.current.set(event.id, nestedFrameId);
      });

      animationFrameRef.current.set(event.id, frameId);

      const timeoutId = window.setTimeout(() => {
        clearAnimationEffect(event.id);
        setTableAnimations((current) => current.filter((animation) => animation.id !== event.id));
        resolve();
      }, event.durationMs);

      animationTimeoutsRef.current.set(event.id, timeoutId);
    });

  const getTargetElement = (target) => {
    const normalizedTarget = typeof target === 'string' ? { seat: target } : target;

    if (normalizedTarget.seat === 'dealer') {
      return dealerTargetRef.current?.querySelector('.cards-row') ?? dealerTargetRef.current;
    }

    const handPanels = playerTargetRef.current?.querySelectorAll('.hand-panel');
    const handPanel =
      typeof normalizedTarget.handIndex === 'number'
        ? handPanels?.[normalizedTarget.handIndex]
        : playerTargetRef.current?.querySelector('.hand-panel.active') ?? handPanels?.[0];

    return handPanel?.querySelector('.cards-row') ?? handPanel ?? playerTargetRef.current;
  };

  const getDealCoordinates = (target, options = {}) => {
    const normalizedTarget = typeof target === 'string' ? { seat: target } : target;
    const tableRect = tableRef.current?.getBoundingClientRect();
    const shoeRect = shoeRef.current?.getBoundingClientRect();
    const targetRect = getTargetElement(normalizedTarget)?.getBoundingClientRect();
    const seat = normalizedTarget.seat ?? 'player';
    const finalCount = Math.max(1, options.finalCount ?? (options.cardIndex ?? 0) + 1);
    const cardIndex = Math.min(options.cardIndex ?? finalCount - 1, finalCount - 1);
    const slotOffset = (cardIndex - (finalCount - 1) / 2) * (seat === 'dealer' ? 32 : 36);
    const slotLift = Math.abs(cardIndex - (finalCount - 1) / 2) * (seat === 'dealer' ? 6 : 8);

    if (!tableRect || !shoeRect || !targetRect) {
      return {
        fromX: 760,
        fromY: 72,
        toX: seat === 'dealer' ? 430 : 430,
        toY: seat === 'dealer' ? 170 : 590,
      };
    }

    return {
      fromX: shoeRect.left - tableRect.left + shoeRect.width / 2 - 56,
      fromY: shoeRect.top - tableRect.top + shoeRect.height / 2 - 80,
      toX: targetRect.left - tableRect.left + targetRect.width / 2 - 56 + slotOffset,
      toY: targetRect.top - tableRect.top + targetRect.height / 2 - 80 + slotLift,
    };
  };

  const animateCardFromShoe = (card, target, options = {}) =>
    queueCardAnimation({
      id: `deal-${dealAnimationIdRef.current += 1}`,
      card,
      target,
      variant: 'deal',
      faceDown: Boolean(options.faceDown),
      durationMs: options.durationMs ?? DEAL_ANIMATION_MS,
      ...getDealCoordinates(target, options),
    });

  const getDiscardCoordinates = (cardRect, stackIndex = 0) => {
    const tableRect = tableRef.current?.getBoundingClientRect();
    const pileRect = discardPileRef.current?.getBoundingClientRect();
    const stackOffsetX = Math.min(stackIndex, 4) * 3;
    const stackOffsetY = Math.min(stackIndex, 4) * 2;

    if (!tableRect || !pileRect || !cardRect) {
      return {
        fromX: 420,
        fromY: 320,
        toX: 86 + stackOffsetX,
        toY: 58 + stackOffsetY,
      };
    }

    return {
      fromX: cardRect.left - tableRect.left,
      fromY: cardRect.top - tableRect.top,
      toX: pileRect.left - tableRect.left + stackOffsetX,
      toY: pileRect.top - tableRect.top + stackOffsetY,
    };
  };

  const animateCardsToDiscard = async (roundDealerHand, roundPlayerHands) => {
    const cardsToDiscard = [
      ...roundDealerHand,
      ...roundPlayerHands.flatMap((hand) => hand.cards),
    ];

    if (!cardsToDiscard.length) {
      return;
    }

    await waitForNextPaint();

    const dealerCardNodes = Array.from(
      dealerTargetRef.current?.querySelectorAll('.playing-card') ?? [],
    );
    const playerCardNodes = Array.from(
      playerTargetRef.current?.querySelectorAll('.playing-card') ?? [],
    );
    const allCardNodes = [...dealerCardNodes, ...playerCardNodes];

    setIsDiscarding(true);

    await Promise.all(
      cardsToDiscard.map((card, index) =>
        queueCardAnimation({
          id: `discard-${dealAnimationIdRef.current += 1}`,
          card,
          target: 'discard',
          variant: 'discard',
          durationMs: DISCARD_ANIMATION_MS,
          fromRotate: 0,
          toRotate: -8 + (index % 3) * 5,
          fromScale: 1,
          toScale: 0.97,
          ...getDiscardCoordinates(allCardNodes[index]?.getBoundingClientRect(), index),
        }),
      ),
    );

    setDiscardPileCount((current) => current + cardsToDiscard.length);
    setIsDiscarding(false);
  };

  const animateDealerResolution = async (startingDealerHand, startingShoe, resolvedHands) => {
    const dealerResult = playDealerHandDetailed(startingDealerHand, startingShoe);
    let currentDealerHand = [...startingDealerHand];

    setPhase('dealer-turn');
    setDealerHand(currentDealerHand);

    for (const card of dealerResult.drawnCards) {
      await animateCardFromShoe(card, { seat: 'dealer' }, {
        cardIndex: currentDealerHand.length,
        finalCount: currentDealerHand.length + 1,
      });
      currentDealerHand = [...currentDealerHand, card];
      setDealerHand(currentDealerHand);
    }

    await finishRound(dealerResult.dealerHand, resolvedHands);
    setShoe(dealerResult.shoe);
    setIsAnimating(false);
  };

  const handleDeal = async () => {
    if (isAnimating) {
      return;
    }

    const round = createInitialRoundState(shoe);
    const playerCards = round.playerHands[0]?.cards ?? [];
    const dealerCards = round.dealerHand;

    setFeedback(null);
    setIsAnimating(true);
    setPhase('dealing');
    setDealerHand([]);
    setPlayerHands([]);
    setActiveHandIndex(0);

    if (playerCards[0]) {
      await animateCardFromShoe(playerCards[0], { seat: 'player', handIndex: 0 }, {
        cardIndex: 0,
        finalCount: 1,
      });
      setPlayerHands([createPreviewHand(round.playerHands[0], [playerCards[0]])]);
    }

    if (dealerCards[0]) {
      await animateCardFromShoe(dealerCards[0], { seat: 'dealer' }, {
        cardIndex: 0,
        finalCount: 1,
      });
      setDealerHand([dealerCards[0]]);
    }

    if (playerCards[1]) {
      await animateCardFromShoe(playerCards[1], { seat: 'player', handIndex: 0 }, {
        cardIndex: 1,
        finalCount: 2,
      });
      setPlayerHands([createPreviewHand(round.playerHands[0], playerCards)]);
    }

    if (dealerCards[1]) {
      await animateCardFromShoe(dealerCards[1], { seat: 'dealer' }, {
        faceDown: true,
        cardIndex: 1,
        finalCount: 2,
      });
      setDealerHand(dealerCards);
    }

    setShoe(round.shoe);
    setDealerHand(round.dealerHand);
    setPlayerHands(round.playerHands);
    setActiveHandIndex(0);

    if (round.status === 'player-turn') {
      setPhase('player-turn');
      setIsAnimating(false);
      return;
    }

    await finishRound(round.dealerHand, round.playerHands);
    setIsAnimating(false);
  };

  const handleHit = async () => {
    if (!activeHand || isAnimating) {
      return;
    }

    updateDecisionFeedback('Hit', activeHand, dealerHand, {
      canDouble,
      canSplit,
    });

    const drawn = drawIntoHand(shoe, activeHand);

    setIsAnimating(true);
    await animateCardFromShoe(
      drawn.hand.cards[drawn.hand.cards.length - 1],
      { seat: 'player', handIndex: activeHandIndex },
      {
        cardIndex: drawn.hand.cards.length - 1,
        finalCount: drawn.hand.cards.length,
      },
    );

    const nextHands = playerHands.map((hand, index) =>
      index === activeHandIndex ? { ...drawn.hand, hasActed: true } : hand,
    );

    setShoe(drawn.shoe);
    setPlayerHands(nextHands);

    if (drawn.hand.isBusted || shouldAutoStand(drawn.hand)) {
      const advance = moveToNextHand(nextHands, activeHandIndex);

      if (advance.nextHandIndex !== -1) {
        setActiveHandIndex(advance.nextHandIndex);
        setIsAnimating(false);
        return;
      }

      await animateDealerResolution(dealerHand, drawn.shoe, advance.playerHands);
      return;
    }

    setIsAnimating(false);
  };

  const handleStand = async () => {
    if (!activeHand || isAnimating) {
      return;
    }

    updateDecisionFeedback('Stand', activeHand, dealerHand, {
      canDouble,
      canSplit,
    });

    const nextHands = playerHands.map((hand, index) =>
      index === activeHandIndex ? { ...hand, isStanding: true, hasActed: true } : hand,
    );
    const advance = moveToNextHand(nextHands, activeHandIndex);

    setPlayerHands(nextHands);

    if (advance.nextHandIndex !== -1) {
      setActiveHandIndex(advance.nextHandIndex);
      return;
    }

    setIsAnimating(true);
    await animateDealerResolution(dealerHand, shoe, advance.playerHands);
  };

  const handleDouble = async () => {
    if (!activeHand || !canDouble || isAnimating) {
      return;
    }

    updateDecisionFeedback('Double', activeHand, dealerHand, {
      canDouble: true,
      canSplit,
    });

    const doubledHand = { ...activeHand, bet: activeHand.bet * 2, isDoubled: true };
    const drawn = drawIntoHand(shoe, doubledHand);

    setIsAnimating(true);
    await animateCardFromShoe(
      drawn.hand.cards[drawn.hand.cards.length - 1],
      { seat: 'player', handIndex: activeHandIndex },
      {
        cardIndex: drawn.hand.cards.length - 1,
        finalCount: drawn.hand.cards.length,
      },
    );

    const nextHands = playerHands.map((hand, index) =>
      index === activeHandIndex
        ? {
            ...drawn.hand,
            hasActed: true,
            isStanding: !drawn.hand.isBusted,
          }
        : hand,
    );
    const advance = moveToNextHand(nextHands, activeHandIndex);

    setShoe(drawn.shoe);
    setPlayerHands(nextHands);

    if (advance.nextHandIndex !== -1) {
      setActiveHandIndex(advance.nextHandIndex);
      setIsAnimating(false);
      return;
    }

    await animateDealerResolution(dealerHand, drawn.shoe, advance.playerHands);
  };

  const handleSplit = async () => {
    if (!activeHand || !canSplit || isAnimating) {
      return;
    }

    updateDecisionFeedback('Split', activeHand, dealerHand, {
      canDouble,
      canSplit: true,
    });

    const [firstCard, secondCard] = activeHand.cards;
    const firstDraw = drawIntoHand(shoe, {
      ...activeHand,
      cards: [firstCard],
      hasActed: false,
      isSplitHand: true,
    });
    const secondDraw = drawIntoHand(firstDraw.shoe, {
      ...activeHand,
      cards: [secondCard],
      hasActed: false,
      isSplitHand: true,
    });

    setIsAnimating(true);
    await animateCardFromShoe(
      firstDraw.hand.cards[firstDraw.hand.cards.length - 1],
      { seat: 'player', handIndex: activeHandIndex },
      {
        cardIndex: firstDraw.hand.cards.length - 1,
        finalCount: firstDraw.hand.cards.length,
      },
    );
    await animateCardFromShoe(
      secondDraw.hand.cards[secondDraw.hand.cards.length - 1],
      { seat: 'player', handIndex: activeHandIndex + 1 },
      {
        cardIndex: secondDraw.hand.cards.length - 1,
        finalCount: secondDraw.hand.cards.length,
      },
    );

    const replacementHands = [
      { ...firstDraw.hand, handId: `${activeHand.handId}-a` },
      { ...secondDraw.hand, handId: `${activeHand.handId}-b` },
    ];
    const nextHands = [
      ...playerHands.slice(0, activeHandIndex),
      ...replacementHands,
      ...playerHands.slice(activeHandIndex + 1),
    ];

    const firstPlayableIndex = nextHands.findIndex(
      (hand, index) => index >= activeHandIndex && hasAvailableDecision(hand),
    );

    setShoe(secondDraw.shoe);
    setPlayerHands(nextHands);

    if (firstPlayableIndex === -1) {
      await animateDealerResolution(dealerHand, secondDraw.shoe, nextHands);
      return;
    }

    setActiveHandIndex(firstPlayableIndex);
    setIsAnimating(false);
  };

  const handleResetSession = () => {
    setStats(initialStats);
    setFeedback(null);
  };

  const dealerCardsToShow = phase === 'player-turn' ? getVisibleDealerHand(dealerHand) : dealerHand;
  const roundResult = phase === 'round-over' ? statusText : null;

  useEffect(() => {
    if (!autoDeal || phase !== 'round-over' || activeTab !== 'Play' || isAnimating) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      handleDeal();
    }, 750);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [activeTab, autoDeal, phase, shoe, isAnimating]);

  useEffect(
    () => () => {
      for (const animationId of animationTimeoutsRef.current.keys()) {
        clearAnimationEffect(animationId);
      }
    },
    [],
  );

  return (
    <div className="app-shell casino-theme">
      <header className="top-bar">
        <div className="brand-lockup">
          <p className="brand-kicker">Blackjack Trainer</p>
          <h1>Blackjack Table Practice</h1>
        </div>
        <TopNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </header>

      {activeTab === 'Play' ? (
        <div className={`play-layout ${showStrategyCoach ? '' : 'coach-hidden'}`}>
          <div className="sidebar-stack">
            <StatsPanel stats={stats} accuracy={accuracy} onReset={handleResetSession} />
            <CardBackSelector selectedColor={cardBackColor} onSelect={setCardBackColor} />
          </div>

          <main className="play-stage">
            <FeedbackBanner feedback={feedback} />

            <BlackjackTable
              tableRef={tableRef}
              shoeRef={shoeRef}
              discardPileRef={discardPileRef}
              dealerTargetRef={dealerTargetRef}
              playerTargetRef={playerTargetRef}
              remainingCards={shoe.length}
              discardPileCount={discardPileCount}
              dealerCards={dealerCardsToShow}
              dealerTotalLabel={getDealerDisplayTotal(dealerHand, phase)}
              playerHands={playerHands}
              activeHandIndex={activeHandIndex}
              phase={phase}
              roundResult={roundResult}
              animations={tableAnimations}
              isDiscarding={isDiscarding}
              cardBackColor={cardBackColor}
            />

            <Controls
              canDeal={canDeal}
              canHit={canHit}
              canStand={canStand}
              canDouble={canDouble}
              canSplit={canSplit}
              onDeal={handleDeal}
              onHit={handleHit}
              onStand={handleStand}
              onDouble={handleDouble}
              onSplit={handleSplit}
              autoDeal={autoDeal}
              onToggleAutoDeal={() => setAutoDeal((current) => !current)}
              showStrategyCoach={showStrategyCoach}
              onToggleStrategyCoach={() => setShowStrategyCoach((current) => !current)}
            />
          </main>

          {showStrategyCoach ? (
            <StrategyHelper
              activeHand={activeHand}
              dealerUpCard={dealerHand[0]}
              recommendation={strategyRecommendation}
              canAct={canAct}
            />
          ) : null}
        </div>
      ) : null}

      {activeTab === 'Strategy' ? <StrategyGuideTab /> : null}
      {activeTab === 'Stats' ? <StatsTab stats={stats} accuracy={accuracy} /> : null}
    </div>
  );
}

export default App;
