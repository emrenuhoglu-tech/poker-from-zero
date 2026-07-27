# Poker From Zero

*For someone who has never held a deck of cards. No fear, one small step at a time. No rush.*

---

## Chapter 1 — Welcome

Poker is a card game. It mixes a little **luck** with a lot of **skill**. In a single hand you can get lucky or unlucky — but over hundreds of hands, **the player who makes better decisions wins.** The good news: those "better decisions" can be learned. That's exactly what this app is for.

Here's the order we'll learn in — each part builds on the one before it:

- **Know the cards** — the deck, the suits, the ranks.
- **Which hand wins** — the hand rankings. The backbone of poker.
- **How a hand flows** — how cards are dealt and how the action moves.
- **When to play, when to fold** — position and starting hands.
- **How to win** — betting logic, pot odds, bluffing, discipline.

> 🎯 One rule: don't move on until a chapter clicks. Understanding beats finishing fast.

---

## Chapter 2 — The deck and the cards

A standard deck has **52 cards**. Each card is defined by two things: a **suit** and a **rank (value)**.

**There are 4 suits** — two red, two black:

- ♠ spades
- ♥ hearts
- ♦ diamonds
- ♣ clubs

> ⚠️ Important: no suit is **better** than another. Spades are not worth more than hearts. Suits only matter when you're checking "are these the same suit?" (that's a flush!).

**There are 13 ranks** — low to high:

**2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10 · J · Q · K · A**

- **J** = Jack, **Q** = Queen, **K** = King, **A** = Ace.
- To save space, this app writes **T** instead of 10.
- **The Ace is special:** it's both the highest card (A K Q...) and can act as the lowest (the A 2 3 4 5 straight). We'll see both.

Reading a card: rank + suit. Examples:

@cards As Kh Td 2c

Left to right: ace of spades, king of hearts, ten of diamonds, two of clubs.

---

## Chapter 3 — Hand rankings ⭐ (the most important chapter)

In poker, the winner is whoever makes the **best 5-card hand**. If you don't know which 5 cards beat which, you can't do anything — so this is the heart of it. From **weakest to strongest**, the 10 hands:

**1. High Card** — you made nothing; your highest card does the talking.
@cards Ah Jc 8d 5s 2h

**2. Pair** — two cards of the same rank.
@cards 9h 9s Kd 6c 3h

**3. Two Pair** — two different pairs.
@cards Qh Qs 7d 7c 4h

**4. Three of a Kind** — three cards of the same rank.
@cards 5h 5s 5d Kc 9h

**5. Straight** — five ranks in a row, **suits can be mixed**.
@cards 8h 7s 6d 5c 4h

**6. Flush** — five cards of the same suit, **they don't have to be in order**.
@cards Ah Jh 8h 5h 2h

**7. Full House** — three of a kind + a pair.
@cards Th Ts Td 6c 6h

**8. Four of a Kind** — four cards of the same rank.
@cards Jh Js Jd Jc 9h

**9. Straight Flush** — five cards that are both in a row and the same suit.
@cards 9c 8c 7c 6c 5c

**10. Royal Flush** — the top: 10-J-Q-K-A, all the same suit. The rarest and unbeatable hand.
@cards Th Jh Qh Kh Ah

### The kicker (side card)

What if two players both hold the same pair? The **side cards (kickers)** decide. If you both have a pair of Aces but you hold a K alongside and your opponent holds a Q — **you win**, because K beats Q.

> 🧠 Memorize this ranking. We'll drill it over and over in the "Hands" tab until it's automatic. Everything else sits neatly on top of it.

---

## Chapter 4 — How Texas Hold'em is played

When people say "poker," the most-played game in the world is **No-Limit Texas Hold'em**. That's the game this app teaches. The idea is simple:

- Everyone is dealt **2 private cards**. They're yours alone — nobody sees them. These are your **hole cards**.
- Over time, **5 shared cards** are dealt to the middle of the table. **Everyone** uses these.
- You pick the **best 5-card hand** out of **your 2 cards + the 5 shared cards** = 7 cards.

The shared cards come out in three stages:

- **Flop** — the first 3 shared cards, dealt at once.
- **Turn** — the 4th shared card.
- **River** — the 5th and final shared card.

@cards Ah Kd

Your hand (example: ace-king). Now the shared cards arrive:

@cards Ac 7h 2s Kh 9d

On this board your best 5 is: **A A K K + 9** = two pair (Aces and Kings). Your two cards combined with the board.

You win the pot (the money in the middle) in one of two ways:

- By showing the **best hand at showdown**, **or**
- By making everyone else **fold** — if no one else is left, you don't even have to show your cards.

---

## Chapter 5 — The table, the button, and the blinds

Poker is played in turn, clockwise. Who acts when is set by the **button**.

- **Dealer button (BTN):** each hand, a marker points to the "dealer" seat. The button moves one seat left every hand.
- **Small Blind (SB):** the player to the left of the button posts a **small forced bet** before seeing any cards.
- **Big Blind (BB):** the player to their left posts a **slightly bigger** forced bet.

Why are there forced blinds? Because if nobody puts money in, everyone just waits for the best hand and the game freezes. The blinds put **money worth winning** in the middle, and the action starts.

> 💡 Order of action: after cards are dealt, on the first round the player **left of the BB** starts; on later rounds it starts from the **SB**. The button acts **last** — which, as you'll see next, is a big advantage.

---

## Chapter 6 — A hand from start to finish

Every hand can pass through **four betting rounds**. When the action reaches you, you do one of these:

- **Fold:** throw your cards away, out of this hand. You pay nothing, but you can't win either.
- **Check:** if no one has bet, move on for free.
- **Bet:** put money in the middle, telling opponents "you have to pay to continue."
- **Call:** match an opponent's bet and stay in.
- **Raise:** increase an opponent's bet.
- **All-in:** push all of your chips in.

The flow of rounds:

1. **Preflop** — everyone sees their 2 cards, and a betting round goes around starting from the blinds.
2. **Flop** — 3 shared cards are dealt, new betting round.
3. **Turn** — the 4th card, new betting round.
4. **River** — the 5th card, final betting round.
5. **Showdown** — whoever is still in shows their cards; **the best 5-card hand wins.**

### A quick example hand

Your hand is @hand AKs. You bet preflop and one player calls. The flop comes:

@cards Ah 9d 4c

You made a pair of Aces — strong. You bet, your opponent calls. If the turn and river don't bring scary cards, you show your hand at the river and **take the pot with your pair of Aces.** That's a whole hand.

---

## Chapter 7 — Position: a free advantage

In poker, **whoever acts last has the advantage** — because they get to see what everyone else does before deciding. Information is power.

- **Early position:** the first to act. Many players still behind you, and you don't know what they'll do → **play carefully, strong hands only.**
- **Middle position:** a bit more comfortable.
- **Late position — especially the Button (BTN):** you act after seeing almost everyone → **the strongest seat.** You can play more hands.
- **The blinds (SB/BB):** you already put money in, but after the flop you're **always first** to act → actually a weak spot.

> 🪑 Simple rule: **the later your position, the wider you can play. If you're early, be tight.** One of the biggest beginner leaks is playing junk hands from early position.

---

## Chapter 8 — Starting hands: what to play

You start with two cards. There are **169 different starting hands** in total, and most of them are **junk**. The secret: play good hands, and **fold the bad ones without shame.**

Categories:

- **Premium (always play):** @hand AA @hand KK @hand QQ @hand AKs
- **Strong:** big pairs (JJ, TT), AQ, AJs, KQs and other big cards.
- **Speculative (in position, cheaply):** small pairs (like @hand 55), suited connectors (like @hand 87s — same-suit cards in a row). When they hit big they pay off huge; when they miss they're easy to let go.
- **Junk (throw it away):** @hand 72o — the worst hand in the deck. Different suits, far apart, unconnected cards.

> ✋ "suited" = both cards are the same suit (flush potential). "offsuit / o" = different suits. The same two ranks are a bit more valuable when suited.

The golden rule for a beginner: **play few, strong hands.** A tight beginner almost always does better than a loose one.

---

## Chapter 9 — Why you bet: value & bluffs

There are only **two** good reasons to put money in (bet/raise):

- **Value:** your hand is good and you want **a weaker hand to pay you off**. You have a pair of Aces, your opponent might have a pair of Kings → bet, let them pay.
- **Bluff:** your hand is weak but you want to **make a better hand fold**. If your opponent folds, you win the pot even with a bad hand.

> 🧩 Ask yourself: "If I make this bet, **which weaker hand will pay me**? Or **which better hand will fold**?" If the answer to both is "none" — that bet is wrong. Check instead.

Advice for a beginner: **bet for value most of the time.** Bluff rarely, and only in spots that make sense. The most common beginner mistake: not charging enough for good hands, and bluffing bad hands too much.

---

## Chapter 10 — Pot odds: keep the math simple

You have a draw — say you're one card away from a flush. Should you continue? The answer depends on the **price**: is your chance of winning worth the money you're paying?

**Counting outs:** the cards that make your hand are called "outs." On a flush draw there are **9 cards** of your suit left in the deck → 9 outs.

**The rule of 2 & 4 (roughly):**

- **1 card** left to come: outs × **2** ≈ your chance to hit (%).
- **2 cards** to come: outs × **4** ≈ your chance to hit (%).

A 9-out flush draw on the flop (2 cards to come) → 9 × 4 ≈ **36%** to hit.

Then compare that to the **price**: the pot is 100, your opponent bet 25. If you pay 25 to win 125, you roughly need to hit about **20%** of the time to break even. 36% > 20% → **calling makes sense.**

> 📐 You don't have to memorize it: the idea is — **take cheap draws, fold expensive ones.** The numbers just make "cheap or expensive?" clear.

---

## Chapter 11 — Bluffing and reading opponents

Bluffing is the coolest — and most misunderstood — part of poker. A good bluff tells a **story**: the way you play should represent a strong hand.

When bluffing **makes sense**:

- Few opponents are left (one player, not a crowd).
- The board supports the idea that you could have a strong hand (a believable story).
- You have a tight image (you've played few hands, so they believe you).

When bluffing is **foolish**:

- Bluffing a **calling station** (a player who calls everything and never folds) — you're burning money.
- Bluffing many people at once — someone has surely made a hand.
- Bluffing just because you're bored.

> 🕵️ The most profitable read for a beginner: **is this opponent folding or not?** Against someone who never folds, **never bluff — only bet for value.** That one observation alone lifts you above average.

---

## Chapter 12 — Discipline, bankroll, and 10 beginner mistakes

What makes poker profitable over the long run isn't flashy bluffs — it's **discipline.**

- **Bankroll:** only play with money you can **afford to lose**. Poker money is not rent money.
- **Tilt:** getting angry after a bad hand and playing too aggressively. Tilt sinks even good players. When you get angry, **stand up and take a break.**
- **Result ≠ decision:** you can lose with a right decision and win with a wrong one. Judge your decisions, not the result of one hand.

**The 10 classic beginner mistakes:**

1. Playing too many hands (being loose).
2. Playing junk from early position.
3. Not charging enough for good hands.
4. Not letting go of bad hands ("but there's a chance").
5. Bluffing a calling station.
6. Ignoring position.
7. Going on tilt over results.
8. Playing bigger than your bankroll.
9. Not watching opponents (everyone plays differently).
10. Never studying to improve.

> 🏆 Just avoiding these 10 mistakes is enough to beat most beginners. Poker isn't simple, but it isn't complicated either: **play good hands, fold bad ones, watch your opponents, stay calm.**

---

## Chapter 13 — A little glossary

- **Hole cards:** your 2 private cards.
- **Board:** the shared cards in the middle.
- **Preflop / Flop / Turn / River:** the betting rounds.
- **Pot:** the total money in the middle.
- **Blind:** the forced pre-bet (SB/BB).
- **Button (BTN):** the dealer marker, the best position.
- **Fold / Check / Call / Bet / Raise:** the basic actions.
- **Value bet:** a bet to get a weaker hand to pay.
- **Bluff:** a bet to make a better hand fold.
- **Draw:** an unfinished hand (waiting on a flush/straight).
- **Out:** a remaining card that makes your hand.
- **Pot odds:** the price you pay vs. what you can win.
- **Kicker:** the side card that breaks a tie.
- **Station:** a player who calls everything and never folds.
- **Tilt:** emotional, out-of-control play.
- **Suited / Offsuit:** cards of the same / different suit.
