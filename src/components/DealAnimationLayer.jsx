import PlayingCard from './PlayingCard.jsx';

function buildAnimationTransform(animation, isActive) {
  const x = isActive ? animation.toX : animation.fromX;
  const y = isActive ? animation.toY : animation.fromY;
  const rotate = isActive ? (animation.toRotate ?? 0) : (animation.fromRotate ?? 0);
  const scale = isActive ? (animation.toScale ?? 1) : (animation.fromScale ?? 1);

  return `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
}

function DealAnimationLayer({ animations }) {
  if (!animations.length) {
    return null;
  }

  return (
    <div className="deal-animation-layer" aria-hidden="true">
      {animations.map((animation) => {
        return (
          <PlayingCard
            key={animation.id}
            card={{ ...animation.card, isFaceDown: animation.faceDown }}
            className={`deal-fly-card ${animation.variant ?? 'deal'} ${animation.isActive ? 'active' : ''}`}
            style={{
              transform: buildAnimationTransform(animation, animation.isActive),
              transitionDuration: `${animation.durationMs}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

export default DealAnimationLayer;
