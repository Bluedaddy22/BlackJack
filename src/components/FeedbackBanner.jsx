function FeedbackBanner({ feedback }) {
  const resolvedFeedback = feedback ?? {
    type: 'neutral',
    text: 'Make a move to get feedback.',
    recommended: null,
  };

  const tone = resolvedFeedback.type;
  const label = 'Decision Feedback';
  const body =
    resolvedFeedback.type === 'correct'
      ? 'Correct move'
      : resolvedFeedback.type === 'mistake'
        ? 'Incorrect move'
        : resolvedFeedback.text;
  const secondaryMessage =
    resolvedFeedback.type === 'mistake' && resolvedFeedback.recommended
      ? `Basic strategy recommends ${resolvedFeedback.recommended}.`
      : resolvedFeedback.type === 'correct'
        ? 'Matched basic strategy.'
        : '';

  return (
    <section className={`feedback-banner ${tone}`} aria-live="polite">
      <div className="feedback-copy">
        <p className="panel-kicker">{label}</p>
        <h2 className="feedback-message">{body}</h2>
        <p className={`feedback-detail ${secondaryMessage ? 'visible' : ''}`}>
          {secondaryMessage || '\u00A0'}
        </p>
      </div>
    </section>
  );
}

export default FeedbackBanner;
