# MVP

What follows is an informal description
of the features that should definitely be present
in the MVP.
Don't worry, we can iterate quickly on that.
Just need to get the first version unleashed.

I did mark some things with asterisks,
consider those nice-to-haves-but-rather-sooner-than-later.

## In-app Only

- [x] Always hit perfect spinning pokeballs
- [ ] Automatically activate nearby pokestops
- [ ]

## UI

### Player

Really not that important,
I propose we throw in some data at most,
don't attempt anything fancy yet.

### Pokemon

This should be the bulk of the MVP.

#### Show Pokemon

- [ ] Show all pokemons along with relevant stats.
This includes CP and combat stats.
- [ ] Pokemons can be sorted by
  - CP
  - Name
  - Favorite
  - * Candy
  - * Evolution state (1st gens first except for one-offs)
- [ ] Pokemons can be selected for various operations


#### Transfer Pokemon
- [ ] Each pokemon has a Transfer button.
Transfer should have some weak client-sided logic
that requires a player to confirm the transfer
if it detects that it might not be wished for.
Each detection category can be turned off separately,
a decision which is saved locally.
Detection includes:
  - Is the Pokemon evolved
  - Is the Pokemon one of a kind in its evolutionary tree
  - Does the Pokemon have high CP
  (computed as over 1000 or over 80% of other CP)
- [ ] There is a bulk Transfer button.
For ease of implementation, this should always
confirm first, * though this too can be turned off.

#### Evolve Pokemon
- [ ] For now, Pokemon can only be evolved
using the Evolve button on a specific Pokemon card.
The Evolve button is only enabled when enough candy is present.


### Configuration
- [ ] Turn on/off catch enhancement
- [ ] Turn on/off auto-activation of pokestops
