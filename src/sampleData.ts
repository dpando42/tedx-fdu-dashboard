import type { TedxProjectState } from './types'

export const sampleData: TedxProjectState = {
  event: {
    name: 'TEDxFDU 2026',
    date: '2026-04-23',
    summary: 'First annual TEDxFDU, live on all three North American campuses — Thursday, April 23. 6 PM ET / 3 PM PT.',
    venues: [
      { campus: 'Florham', venue: 'The Orangerie, Monninger Center', localTime: '6:00 PM ET' },
      { campus: 'Metro', venue: 'Wilson Auditorium, Dickinson Hall', localTime: '6:00 PM ET' },
      { campus: 'Vancouver', venue: 'Room 130', localTime: '3:00 PM PT' },
    ],
  },

  members: [
    { id: 'member-scott', name: 'Scott Behson', campus: 'Florham', email: 'behson@fdu.edu', role: 'Event organizer. Owns speaker coordination, budget approvals, and run-of-show.' },
    { id: 'member-daniel', name: 'Daniel Pando', campus: 'Teaneck', email: 'danielpando@fdu.edu', role: 'Technical and production lead. Capture, Riverside, gear, setup, staffing.' },
    { id: 'member-estref', name: 'Estref Resuli', campus: 'Vancouver', email: 'e.resuli@fdu.edu', role: 'Senior IT specialist. Vancouver tech lead; owns local equipment and setup.' },
    { id: 'member-lester', name: 'Lester DeGuzman', campus: 'Vancouver', email: 'l.deguzman@fdu.edu', role: 'Director of marketing and communications. Vancouver room and promotion.' },
    { id: 'member-cory', name: 'Cory Palacios', campus: 'Vancouver', email: '', role: 'Vancouver execution group. Day-of logistics.' },
    { id: 'member-joevy', name: 'Joevy Leong', campus: 'Vancouver', email: '', role: 'Vancouver execution group. Day-of logistics.' },
    { id: 'member-angelo', name: 'Angelo Carfagna', campus: 'Florham', email: 'Angelo@fdu.edu', role: 'VP of University Communications. Scoped Brandon to editorial/highlights only.' },
    { id: 'member-brandon', name: 'Brandon Ferriero', campus: 'Florham', email: 'b.ferriero@fdu.edu', role: "Videographer on Angelo's team. Handling Florham filming." },
    { id: 'member-viellee', name: 'John Viellee', campus: 'New Jersey', email: '', role: 'Potential Florham camera operator. Adjunct referral via Derek Larson.' },
    { id: 'member-ippolito', name: 'Frank Ippolito', campus: 'New Jersey', email: '', role: 'Potential Florham camera operator. Adjunct referral via Derek Larson.' },
    { id: 'member-bobby', name: 'Bobby', campus: 'New Jersey', email: '', role: 'Camera operator candidate. Has gone silent.' },
    { id: 'member-clara', name: 'Clara Wong', campus: 'Vancouver', email: 'c.wong@fdu.edu', role: 'Marketing and communications coordinator. Vancouver promo support.' },
  ],

  tasks: [
    {
      id: 'task-call-scott',
      title: 'Call Scott about the budget.',
      description: 'This is the conversation Scott asked for on Monday. Come with specific asks — gear rentals, operator rates, whether Riverside needs a paid plan. Jim Almeida has already authorized real spend; this call is where you pin the number.',
      assigneeId: 'member-daniel',
      coordinateWith: ['member-scott'],
      campus: 'Cross-campus',
      dueDate: '2026-04-14',
      priority: 'critical',
      category: 'coordination',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Scott Behson — email, Mon Apr 13',
      sourceTranscript: `From: Scott Behson <behson@fdu.edu>
To: Daniel Pando
Subject: Budget — let's pin this down
Date: Mon, Apr 13, 2026, 4:47 PM

Daniel —

Jim got back to me. We have real spend authorized, so I don't want to
keep hand-waving the budget. Can you call me tomorrow or Tuesday with
specific numbers? Rentals, operator rates, whatever you need for
Riverside. I'd rather over-ask now than scramble the week of.

Also — happy to buy you a set of lav mics out of this. Pick the model.

— S`,
      subtasks: [
        { id: 'cs-1', title: 'List specific gear rental asks with prices', completed: false },
        { id: 'cs-2', title: 'Confirm your recommended rates for Bobby, Viellee, Ippolito', completed: false },
        { id: 'cs-3', title: 'Decide on Riverside (free trial vs. paid)', completed: false },
      ],
    },
    {
      id: 'task-lav-rec',
      title: 'Send Scott a lav mic recommendation.',
      description: "Scott offered to buy a set of lav mics that stay with you afterward. Pick a model — DJI Mic Mini or Rode Wireless GO II are both fine — and send him the unit price and how many you need. This is prep for the budget call so it's already in writing.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-scott'],
      campus: 'Cross-campus',
      dueDate: '2026-04-14',
      priority: 'high',
      category: 'production',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Scott Behson — email, Mon Apr 13',
      sourceTranscript: `[Tail of the same Apr 13 thread, Scott's closing line:]

"Also — happy to buy you a set of lav mics out of this. Pick the model.
Send me the unit cost and how many you need before we talk tomorrow."

[Your note-to-self, Apr 13 evening:]
Options: DJI Mic Mini (~$170/pair), Rode Wireless GO II (~$300/set).
Need at least 3 channels for Metro. 2 sets of GO II = 4 channels, fine.`,
      subtasks: [
        { id: 'lr-1', title: 'Pick a model and look up pricing', completed: false },
        { id: 'lr-2', title: 'Email Scott: model, quantity, per-unit cost', completed: false },
      ],
    },
    {
      id: 'task-nj-operators',
      title: 'Reach out to Viellee and Ippolito about Florham.',
      description: "Bobby has gone quiet. John Viellee and Frank Ippolito are the adjuncts Derek Larson referred — they're your primary alternatives for the third Florham camera slot. Short introductory notes first, rates conversation later once you have Scott's go-ahead.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-viellee', 'member-ippolito'],
      campus: 'Florham',
      dueDate: '2026-04-15',
      priority: 'critical',
      category: 'production',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Derek Larson — text, Fri Apr 10',
      sourceTranscript: `Derek Larson — iMessage, Fri Apr 10

> If Bobby flakes on you, two of my adjuncts do wedding/event camera
> on the side and are usually open: John Viellee and Frank Ippolito.
> Both solid, both have their own kit. Tell them I sent you.

[Bobby thread — last message from Bobby, Mar 31:]
"sounds good, lmk"
[No reply to your Apr 6 or Apr 11 follow-ups.]`,
      subtasks: [
        { id: 'no-1', title: 'Draft a short intro note to John Viellee', completed: false },
        { id: 'no-2', title: 'Draft a short intro note to Frank Ippolito', completed: false },
        { id: 'no-3', title: 'Send both — keep Scott on thread', completed: false },
      ],
    },
    {
      id: 'task-riverside',
      title: 'Decide on Riverside.',
      description: "Verify whether Riverside's free trial covers a three-hour recording at the quality you need. If it doesn't, the paid plan needs to go into Scott's budget ask. This decision unblocks the Vancouver setup.",
      assigneeId: 'member-daniel',
      coordinateWith: [],
      campus: 'Cross-campus',
      dueDate: '2026-04-15',
      priority: 'critical',
      category: 'production',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Your own notes — Apr 12',
      sourceTranscript: `Personal working doc, Apr 12:

Riverside — open questions before the budget call:
  • Free trial: 2 hours/month? Need to confirm exact cap.
  • Does free tier cap resolution (720p vs 1080p+)?
  • Local-record-then-upload means network hiccups are OK, but
    recording length matters — we need ~3 hrs continuous per campus.
  • Paid plan is ~$24/mo for 5 hrs. Trivially within budget IF Scott
    signs off. Need to fold that into the call.`,
      subtasks: [
        { id: 'rs-1', title: 'Check trial recording duration and output quality limits', completed: false },
        { id: 'rs-2', title: 'If paid: add the plan cost to the budget ask', completed: false },
      ],
    },
    {
      id: 'task-van-meeting',
      title: 'Set up the Vancouver coordination meeting.',
      description: 'One meeting with Estref, Lester, Cory, and Joevy unblocks the whole west-coast plan — room, Riverside walkthrough, dry run scheduling, day-of ownership. Send the invite and propose a time. Scott flagged this as critical on Monday.',
      assigneeId: 'member-daniel',
      coordinateWith: ['member-estref', 'member-lester', 'member-cory', 'member-joevy'],
      campus: 'Vancouver',
      dueDate: '2026-04-16',
      priority: 'critical',
      category: 'coordination',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Scott Behson — call notes, Mon Apr 13',
      sourceTranscript: `Call with Scott, Mon Apr 13, ~3 PM (your notes):

  Scott: "West coast is your biggest unknown. You've been emailing
  Estref and Lester separately — get them all on one call. Cory and
  Joevy too. Room, walkthrough, dry run, who-does-what day of.
  One meeting. Don't let this drift into next week."

  Action: I own scheduling. Proposed Thursday or Friday.`,
      subtasks: [
        { id: 'vm-1', title: 'Pick two candidate time slots and send invite', completed: false },
        { id: 'vm-2', title: 'Draft an agenda: room, Riverside, dry run, day-of roles', completed: false },
      ],
    },
    {
      id: 'task-estref-followup',
      title: 'Ask Estref for the camera tests and room photos.',
      description: "You asked about 4K long-form recording, lens focal lengths, and four room photos back in March — none of those answers have landed. Without them you can't plan camera positions or decide on rentals. One email covers both.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-estref'],
      campus: 'Vancouver',
      dueDate: '2026-04-16',
      priority: 'high',
      category: 'production',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Your email to Estref — Wed Mar 25 (no reply)',
      sourceTranscript: `From: Daniel Pando
To: Estref Resuli
Subject: Vancouver capture — a few questions
Date: Wed, Mar 25, 2026, 10:12 AM

Estref —

Three things before I spec rentals:
  1. Can your Canon 90D record 60+ continuous minutes without
     overheating? (4K or 1080p, whichever is stable.)
  2. What lenses / focal lengths do you have on hand?
  3. Could you send four photos of Room 130 — front, back, left, right,
     from eye level? It'll help me plan camera positions.

No rush, but ideally before the end of the month.

— D

[No reply as of Apr 14.]`,
      subtasks: [
        { id: 'ef-1', title: 'Can the 90D record 60+ min without overheating?', completed: false },
        { id: 'ef-2', title: 'What lenses / focal lengths are available?', completed: false },
        { id: 'ef-3', title: 'Four photos of Room 130: front, back, left, right', completed: false },
      ],
    },
    {
      id: 'task-brandon-gear',
      title: "Pin down Brandon's Florham kit.",
      description: "Angelo scoped Brandon's role to editorial/highlights — so any production gaps at Florham are yours to fill. You need the exact camera model, lens set, mic situation, and whether Brandon is running Riverside himself or just recording locally.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-brandon', 'member-angelo'],
      campus: 'Florham',
      dueDate: '2026-04-17',
      priority: 'high',
      category: 'coordination',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Angelo Carfagna — email, Fri Apr 10',
      sourceTranscript: `From: Angelo Carfagna
To: Daniel Pando, Scott Behson
Subject: Re: Brandon's role at Florham
Date: Fri, Apr 10, 2026, 2:04 PM

Daniel —

Brandon's on board but I want his role scoped: he's handling editorial
footage and highlights for university comms, not running the full talk
capture. You'll need to own the long-form record side. Please coordinate
with him directly on what kit he's bringing — if there are gaps, fill
them on your end.

Thanks,
Angelo`,
      subtasks: [
        { id: 'bg-1', title: "Email Brandon: camera, lenses, mic", completed: false },
        { id: 'bg-2', title: "Ask: Riverside or local record?", completed: false },
        { id: 'bg-3', title: "Fill any gaps with rental spec — loop Angelo in", completed: false },
      ],
    },
    {
      id: 'task-van-room',
      title: 'Confirm Vancouver room 130 is booked.',
      description: 'Room 130 is the quieter, better-suited choice over the student lounge. Both you and Scott agreed on it, but Lester still needs to confirm it is officially held for April 23, 3–6 PM PT, with setup access an hour or two before.',
      assigneeId: 'member-daniel',
      coordinateWith: ['member-lester'],
      campus: 'Vancouver',
      dueDate: '2026-04-17',
      priority: 'high',
      category: 'logistics',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Lester DeGuzman — email, Tue Apr 7',
      sourceTranscript: `From: Lester DeGuzman
To: Daniel Pando
Subject: Re: Vancouver venue — room vs. lounge
Date: Tue, Apr 7, 2026, 6:31 PM PT

Daniel —

Agreed, Room 130 is better. Quieter, cleaner sight lines, we control the
doors. Student lounge is too open.

I'll put the hold in this week. Will confirm once it's official in our
system. Plan on setup access starting 1 PM PT that day.

Lester

[Still no written "officially held" confirmation as of Apr 14.]`,
      subtasks: [
        { id: 'vr-1', title: 'Get a written yes from Lester for room 130', completed: false },
        { id: 'vr-2', title: 'Confirm setup access time before the show', completed: false },
      ],
    },
    {
      id: 'task-ear-mics',
      title: 'Check speakers are OK with ear-worn mics.',
      description: "Scott was supposed to relay your ear-worn mic guidance to the speakers. If anyone pushed back you need a backup plan — handheld or podium — so make sure there's no surprise the week of.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-scott'],
      campus: 'Cross-campus',
      dueDate: '2026-04-17',
      priority: 'medium',
      category: 'coordination',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Slack note to Scott — Tue Apr 8',
      sourceTranscript: `You → Scott, Slack DM, Apr 8:

> Heads up: default plan is ear-worn lavs for every speaker. Cleaner
> audio, hands-free, no visible capsule. Can you sanity-check with the
> speakers in your next round of emails? If anyone's uncomfortable I'd
> rather know now than on show day.

[No reply. Need to poke him.]`,
      subtasks: [
        { id: 'em-1', title: 'Ask Scott whether any speaker objected', completed: false },
        { id: 'em-2', title: 'If yes: plan a handheld backup', completed: false },
      ],
    },
    {
      id: 'task-gear-plan',
      title: 'Write the per-campus gear sheet.',
      description: "One document: who brings what to Florham, Metro, and Vancouver. You've got a laptop, two cameras, and a wireless mic on the NJ side. Vancouver has two cameras and two Macs. Whatever's missing becomes a rental ask. Keep it one page.",
      assigneeId: 'member-daniel',
      coordinateWith: [],
      campus: 'Cross-campus',
      dueDate: '2026-04-20',
      priority: 'high',
      category: 'production',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Personal working doc — Apr 9',
      sourceTranscript: `Gear inventory scratch — Apr 9:

  NJ side (yours):
    - MacBook Pro M2
    - Canon R6 + 24-105
    - Sony A7III + 50mm + 85mm
    - Rode Wireless GO II (1 set, 2 ch)
    - HDMI/USB-C capture (Elgato)

  Vancouver (Estref, unconfirmed):
    - 2× Canon 90D
    - 2× iMac or MacBook
    - Unknown mic situation
    - Unknown HDMI capture

  Florham (Brandon, per Angelo's scope):
    - Brandon's kit (editorial only — confirm details)
    - FDU fills the production gap → you

  Rentals likely needed: 3rd camera for Florham, extra lav kit.`,
      subtasks: [
        { id: 'gp-1', title: "Florham: Brandon's kit + what FDU needs to bring", completed: false },
        { id: 'gp-2', title: "Metro: your kit — laptop, camera, wireless mic", completed: false },
        { id: 'gp-3', title: "Vancouver: Estref's inventory + rental gaps", completed: false },
      ],
    },
    {
      id: 'task-branding',
      title: 'Send branding assets to Vancouver.',
      description: "Lester has been asking for the licensed TEDx logo and any signage templates so Vancouver can run its own local promotion. You offered to own branding cross-campus — so this goes to Lester and Clara in one email.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-lester', 'member-clara'],
      campus: 'Vancouver',
      dueDate: '2026-04-20',
      priority: 'medium',
      category: 'comms',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Lester DeGuzman — email, Thu Apr 2',
      sourceTranscript: `From: Lester DeGuzman
To: Daniel Pando
Subject: Promo assets for Vancouver push
Date: Thu, Apr 2, 2026, 11:47 AM PT

Daniel —

Do you have the licensed TEDx logo pack + any signage templates you can
share? Clara's teeing up social posts and signage for the lobby. We'll
do our own local layout but we need the brand-safe assets to start from.

Thanks,
Lester`,
      subtasks: [
        { id: 'br-1', title: 'Gather logo pack + usage guidelines', completed: false },
        { id: 'br-2', title: 'Send to Lester and Clara', completed: false },
      ],
    },
    {
      id: 'task-van-details',
      title: 'Send Lester the audience details.',
      description: "Lester asked for registration info, speaker bios, topics, and success metrics so his team can do proper local promo. Scott partially answered some of it — fill the remaining gaps so Lester has what he needs.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-lester', 'member-scott'],
      campus: 'Vancouver',
      dueDate: '2026-04-20',
      priority: 'medium',
      category: 'comms',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Lester DeGuzman — email, Mon Apr 6',
      sourceTranscript: `From: Lester DeGuzman
To: Daniel Pando, Scott Behson
Subject: Audience + speaker details for promo
Date: Mon, Apr 6, 2026, 3:22 PM PT

Scott, Daniel —

For Vancouver promo we need:
  • Registration link (public-facing)
  • Speaker bios + headshots for all campuses
  • Topics / talk titles as they'll appear on the poster
  • What "success" looks like — seats filled? livestream views? both?

Scott partially answered the first two. Daniel — can you fill the rest?

Thanks`,
      subtasks: [
        { id: 'vd-1', title: "Check with Scott what's already been sent", completed: false },
        { id: 'vd-2', title: 'Fill gaps: registration link, bios, goals', completed: false },
      ],
    },
    {
      id: 'task-van-dryrun',
      title: 'Run the Vancouver dry run.',
      description: "The full one-way capture loop, live from Vancouver to an NJ endpoint. This is where you catch camera overheating, audio levels, HDMI adapter surprises, and lighting problems while there's still time to fix them.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-estref', 'member-cory'],
      campus: 'Vancouver',
      dueDate: '2026-04-21',
      priority: 'critical',
      category: 'production',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Your own planning notes — Apr 11',
      sourceTranscript: `Dry-run plan, Apr 11:

Goal: prove the Vancouver → Riverside → NJ capture chain end-to-end,
with at least one camera running 30+ min continuous.

Must validate:
  • 90D heat behavior under long record
  • HDMI→USB adapter stability on Mac
  • Riverside local-record + upload on Vancouver's connection
  • Lav mic placement + levels in Room 130 acoustics
  • Room lighting at 3 PM PT (windows? glare? practical fix?)

Block: need Estref to commit to a slot. Ideally Tue Apr 21 morning PT.`,
      subtasks: [
        { id: 'dr-1', title: 'Confirm a dry-run slot with Estref', completed: false },
        { id: 'dr-2', title: 'Test 90D for 30+ min recording', completed: false },
        { id: 'dr-3', title: 'Validate HDMI converters + Riverside on Mac', completed: false },
        { id: 'dr-4', title: 'Audio check — lav mic levels in room 130', completed: false },
        { id: 'dr-5', title: 'Eyeball the room lighting', completed: false },
      ],
    },
    {
      id: 'task-ros',
      title: 'Lock the final run of show.',
      description: "Vancouver's speakers are tentatively slots 3 and 5, with Louai possibly moving to 4 to spread camera load. Florham and Metro orders still need a final sign-off from Scott. Get it locked and distributed so everyone runs from the same sheet.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-scott'],
      campus: 'Cross-campus',
      dueDate: '2026-04-21',
      priority: 'high',
      category: 'content',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Scott Behson — call notes, Mon Apr 13',
      sourceTranscript: `Call with Scott, Apr 13 (ROS discussion, abridged):

  Scott: "Vancouver goes 3 and 5. If we can move Louai to slot 4 instead
  that gives you a breather between Ramin and the next long-form talk.
  Florham and Metro order — I'll decide by the 20th. Push me if I drift."

  Action on you: write the final one-pager once Scott confirms Florham +
  Metro order. Send to all campus leads same day.`,
      subtasks: [
        { id: 'ros-1', title: 'Get final speaker order for all three campuses', completed: false },
        { id: 'ros-2', title: 'Write a one-page run-of-show', completed: false },
        { id: 'ros-3', title: 'Send to campus leads', completed: false },
      ],
    },
    {
      id: 'task-metro',
      title: 'Lock in your Metro day-of plan.',
      description: "You're running Metro yourself at Wilson Auditorium. Confirm your arrival time, room access, the Riverside setup order, the local room contact, and a stream-drop fallback. Nothing here should be improvised on Thursday.",
      assigneeId: 'member-daniel',
      coordinateWith: [],
      campus: 'Metro',
      dueDate: '2026-04-21',
      priority: 'high',
      category: 'logistics',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Personal working doc — Apr 12',
      sourceTranscript: `Metro day-of — questions to close out:

  • Wilson Auditorium access: what time does AV let me in? Need 3+ hrs.
  • Local contact on site — who do I call if something's locked?
  • Setup order: Riverside up → cameras → audio → test record → done.
  • Stream drop plan: local redundancy record on SD card + laptop,
    independent of network. If Riverside upload dies we still have the
    talk in two places.
  • Coffee. You forget to eat on show days. Put it on the list.`,
      subtasks: [
        { id: 'mp-1', title: 'Confirm Wilson Auditorium access time', completed: false },
        { id: 'mp-2', title: 'Sequence the Riverside setup', completed: false },
        { id: 'mp-3', title: 'Identify the local room contact', completed: false },
        { id: 'mp-4', title: 'Define the stream-drop fallback', completed: false },
      ],
    },
    {
      id: 'task-florham-setup',
      title: 'Set up the Orangerie.',
      description: "Evening of the 22nd at Florham. Lock camera positions, run a Riverside test, mic check, and cable routing while you have access starting 6 PM. Leave Brandon a short setup note for the next day so handoff is clean.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-brandon'],
      campus: 'Florham',
      dueDate: '2026-04-22',
      priority: 'critical',
      category: 'production',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Scott Behson — email, Tue Apr 14',
      sourceTranscript: `From: Scott Behson
To: Daniel Pando
Subject: Orangerie access — night before
Date: Tue, Apr 14, 2026, 9:18 AM

Daniel —

You're cleared to be in the Orangerie from 6 PM on the 22nd. Plan to be
out by 10 so the cleaners can do their thing. Take the night to nail
camera positions, cables, audio. Leave Brandon a one-page so he can
walk in at 8 AM without you there.

— S`,
      subtasks: [
        { id: 'fs-1', title: 'Camera positions set and tested', completed: false },
        { id: 'fs-2', title: 'Riverside test from the Orangerie', completed: false },
        { id: 'fs-3', title: 'Mic check in the room', completed: false },
        { id: 'fs-4', title: "Write tomorrow's handoff note for Brandon", completed: false },
      ],
    },
    {
      id: 'task-brandon-brief',
      title: 'Brief Brandon on Florham day-of.',
      description: "One page: where the cameras are, Riverside already up, what to watch, who to call if something goes sideways. Send it before you leave the Orangerie so he has it first thing in the morning.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-brandon', 'member-angelo'],
      campus: 'Florham',
      dueDate: '2026-04-22',
      priority: 'high',
      category: 'coordination',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Derived from Scott Apr 14 + Angelo Apr 10 threads',
      sourceTranscript: `Synthesis of two threads:

  Scott (Apr 14): "Leave Brandon a one-page so he can walk in at 8 AM."
  Angelo (Apr 10): "Brandon = editorial/highlights. You own long-form."

The brief needs to make that boundary explicit. Brandon should know
what he's doing (his stuff) and what's running without him (Riverside
long-form, your camera positions). If Riverside needs a nudge mid-show,
Brandon calls you — not the other way around.`,
      subtasks: [
        { id: 'bb-1', title: 'Write the one-page brief', completed: false },
        { id: 'bb-2', title: 'Send to Brandon, CC Angelo', completed: false },
      ],
    },
    {
      id: 'task-post-edit',
      title: 'Plan the post-event edit workflow.',
      description: "Scott's son can edit but can't be on site. Each campus will produce raw Riverside recordings. Decide who cuts what and by when. This can wait until the week after the event — put it down so you don't forget.",
      assigneeId: 'member-daniel',
      coordinateWith: ['member-scott'],
      campus: 'Cross-campus',
      dueDate: '2026-04-25',
      priority: 'low',
      category: 'production',
      status: 'Not started',
      createdAt: '2026-04-14T00:00:00.000Z',
      attachments: [],
      sourceLabel: 'Scott Behson — call notes, Mon Apr 13',
      sourceTranscript: `Call with Scott, Apr 13 (post-event tail):

  Scott: "My son can edit — he's fast, reasonable, but can't be on site.
  We'll get raw Riverside files per campus. Don't solve this now. Put it
  down for the week after so it doesn't fall off."

  Defer until Apr 25+. Scope: who cuts which talks, turnaround, who
  reviews before YouTube.`,
      subtasks: [
        { id: 'pe-1', title: 'Decide who edits which campus', completed: false },
        { id: 'pe-2', title: 'Set a delivery date for finished talks', completed: false },
      ],
    },
  ],

  speakers: [
    { id: 'spk-mclary', name: 'Marion McClary', campus: 'Metro', venue: 'Wilson Auditorium, Dickinson Hall', title: 'Professor of Biological Sciences; Chair, Biological Sciences — Gregory H. Olsen College of Engineering and Science' },
    { id: 'spk-parsons', name: 'Scott Parsons', campus: 'Metro', venue: 'Wilson Auditorium, Dickinson Hall', title: 'Executive Director, Institute for Character and Leadership' },
    { id: 'spk-peabody', name: 'Bruce Peabody', campus: 'Metro', venue: 'Wilson Auditorium, Dickinson Hall', title: 'Professor of Government and Politics, Maxwell Becton College' },
    { id: 'spk-ramirez', name: 'Paulaska Ramirez', campus: 'Metro', venue: 'Wilson Auditorium, Dickinson Hall', title: "MAS'11 — Founder & Executive Director, Generation Fearless" },
    { id: 'spk-shadmehr', name: 'Ramin Shadmehr', campus: 'Vancouver', venue: 'Room 130', title: 'Associate Provost, FDU Vancouver' },
    { id: 'spk-rahal', name: 'Louai Rahal', campus: 'Vancouver', venue: 'Room 130', title: 'Assistant Professor of Administrative Science, Silberman College of Business' },
    { id: 'spk-baker', name: 'Uchenna Baker', campus: 'Florham', venue: 'The Orangerie, Monninger Center', title: 'VP for Student Affairs and Division III Athletics; Dean of Students' },
    { id: 'spk-iwuchukwu', name: 'Otito Iwuchukwu', campus: 'Florham', venue: 'The Orangerie, Monninger Center', title: 'Professor of Pharmaceutical Sciences; author' },
    { id: 'spk-lents', name: 'Stacie Lents', campus: 'Florham', venue: 'The Orangerie, Monninger Center', title: 'Professor of Theater and Communication; Director of Theater' },
    { id: 'spk-nader', name: 'Micheline Nader', campus: 'Florham', venue: 'The Orangerie, Monninger Center', title: 'FDU Board of Trustees; entrepreneur, author, speaker' },
  ],
}
