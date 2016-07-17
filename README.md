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
- flask: We'll probably use flask as a small web dev framework
to get something up and running right away.
- community libs for manipulating the protobufs (think binary data)
that come through

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

### Ideas
You've got an original idea?
Sure, throw it in the Issues section.
