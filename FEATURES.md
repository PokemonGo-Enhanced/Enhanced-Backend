# MVP

What follows is an informal description
of the features that should definitely be present
in the MVP.
Don't worry, we can iterate quickly on that.
Just need to get the first version unleashed.

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
