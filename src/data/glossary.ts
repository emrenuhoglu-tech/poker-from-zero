// Poker terms — surfaced from Chapter 13 as a searchable reference.
export interface Term {
  term: string;
  def: string;
}

export const GLOSSARY: Term[] = [
  { term: "Hole cards", def: "Your 2 private cards, dealt face down — only you see them." },
  { term: "Board", def: "The shared (community) cards dealt face up in the middle." },
  { term: "Preflop", def: "The first betting round, before any board cards are dealt." },
  { term: "Flop", def: "The first 3 board cards, dealt at once." },
  { term: "Turn", def: "The 4th board card." },
  { term: "River", def: "The 5th and final board card." },
  { term: "Pot", def: "All the chips bet so far — what you're playing to win." },
  { term: "Blind", def: "A forced bet posted before the cards (small blind / big blind)." },
  { term: "Button (BTN)", def: "The dealer marker — the best position, acts last after the flop." },
  { term: "Fold", def: "Give up the hand. You put in no more money and can't win the pot." },
  { term: "Check", def: "Pass the action with no bet, staying in for free." },
  { term: "Call", def: "Match the current bet to stay in the hand." },
  { term: "Bet / Raise", def: "Put chips in (bet), or increase someone else's bet (raise)." },
  { term: "All-in", def: "Bet all of your remaining chips." },
  { term: "Value bet", def: "A bet made so a weaker hand will pay you off." },
  { term: "Bluff", def: "A bet made to push a better hand into folding." },
  { term: "Draw", def: "An unfinished hand hoping to complete (e.g. a flush or straight draw)." },
  { term: "Out", def: "A remaining card that would complete your hand." },
  { term: "Pot odds", def: "The price you pay to call vs. the size of the pot you can win." },
  { term: "Kicker", def: "The side card that breaks a tie when two hands are otherwise equal." },
  { term: "Position", def: "Where you sit relative to the button — acting later is a big edge." },
  { term: "Station", def: "A player who calls almost everything and rarely folds. Don't bluff them." },
  { term: "Tilt", def: "Playing emotionally after a bad hand — the fastest way to lose chips." },
  { term: "Bankroll", def: "The money set aside for poker — only ever play what you can lose." },
  { term: "Suited / Offsuit", def: "Two cards of the same suit (flush potential) / different suits." },
];
