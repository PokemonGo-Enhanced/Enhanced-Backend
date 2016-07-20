# Pokemon Go Enhanced

## The Dream

While this repository does not come with a lot of content,
it does come with a dream.

It's simple in essence.
Make Pokemon Go more awesome
by giving an edge over others
(face it, that's why most are here)
but still making it fun to play
by actually going out there.

This repository will contain a single-deploy suite
of nifty little things that together
will make up Pokemon Go Enhanced.
What follows is a little overview of dreams
(or as devs like to call it, a TODO list).

### Will definitely happen
- [ ] Extended visibility within the app
- [ ] Auto-interacting with Pokestops in range 
- [ ] Pokeballs always hit
- [ ] Web-based UI to configure everything listed here.
Hosted on a per-person basis.
- [ ] UI includes a map of all nearby pokemon
- [ ] Bulk transfer pokemon through UI

### Brainstorming
- [ ] Auto-dodge attacks
- [ ] Auto-catch everything within range
- [ ] UI allows walking to/fixing a location e.g. by tapping a location
- [ ] Auto-occupy empty gyms

As you should see from these lists,
the goal is to augment the Pokemon Go experience
but still keeping it an experience.
The player will get to decide in how far
she wants to cheat.

## How: The Tech
Woah so how will we accomplish all of these magnificent things?
We've got it all figured out right here, just need to implement it.
The proof of concept will exist of:

- mitmproxy: Man In The Middle attack program.
This will sit in between the player on location
and Niantic through a VPN or the like.
This is how we can sniff and change everything that comes through
in either direction.
- python 2.7: Because of mitmproxy
- flask: We'll probably use flask as a small web dev framework
to get something up and running right away.
- front-end: ???
- community libs for manipulating the protobufs (think binary data)
that come through

- Node.js `v6.3`
- MITM attacks: [rastapasta's pokemongo-mitm](https://github.com/rastapasta/pokemon-go-mitm-node.git)
- Automated API calls: No decent lib out yet so generating my own
- UI: Still need basic scaffolding! Whatever the contributor would prefer to work with

## Contribution
Where do you come in you ask?
Well we would love your help!

Join us on [Slack](https://pkre.slack.com) 
([invite](https://shielded-earth-81203.herokuapp.com))
in the channel `#enhanced`
to have a chat on what part of the project you'd love to help with.
Everyone's welcome: from web dev to TCP sleuth.

Even unsollicited PRs are welcome.
You know what to do!

## In-depth TODO
### UI
- [ ] Scaffold the UI. Can be anything, Angular 2 with bootstrap, whatever.
- [ ] Create a page for displaying player details, can start out basic.
Player info will be gotten over a REST API at `/api/player`
- [ ] Create a page for basic config: turning on/off functionality.
We can hash this API out together, should be at `/api/config`
- [ ] Create a page for bulk transfer. Think on the design.
It should have at least a way of fetching all current pokemons,
then have something to multi-select them, then hit a button to transfer them.
API can be something like `GET /api/player/pokemon` for now
and `POST /api/rpc/release`, I'm thinking.

### MITM

### Ideas
You've got an original idea?
Sure, throw it in the Issues section.
