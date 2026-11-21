PRIYANKA & SHIVA — A CELEBRATION OF FOREVER
Revision 14 · 22 November 2026

A mobile-first wedding invitation in HTML, CSS and JavaScript.
No framework, install step, paid API, or backend is required.

PREVIEW
Open index.html, or serve this folder with:
  python3 -m http.server 4173
Then visit http://localhost:4173.
Priyanka-and-Shiva-Invitation.html is the separate self-contained edition,
including illustrations, fonts and the music track.

EVENT DETAILS
Haldi: 25 January 2027, 10:00 AM IST.
Sangeet: 25 January 2027, 6:00 PM IST.
Wedding: 26 January 2027, 7:00 PM IST.
Venue: Blue Mountain Country Club & Resort, Siliguri.

DESIGN AND MOBILE READABILITY
The painted welcome cover opens with a gold glint and slow falling petals.
The original painted lotus, leaf and peacock border is restored in the hero.
The floral background is static, matching the welcome cover.

Main inner headings use Cormorant Garamond, with Pinyon Script accents and
DM Sans body text. Mobile text was audited at 320, 390 and 501 pixels wide.
Useful labels are at least 12px; body and form text are generally 14–16px.
Repeated tiny captions were removed. The countdown has a proper space
between “our” and “wedding” even when the line break disappears.

Mobile ceremony illustrations are 180–210px tall. Cards have SVG kurta icons
with matching rounded outline location icons,
and playful, clear outfit notes: every shade of yellow for Haldi; Indo-Western
for Sangeet; Indian festive wear for the wedding. There are no colour swatches.
Cards overlap only if all their content fits above the bottom navigation.
Short screens and enlarged text use ordinary scrolling to keep details readable.

The floating RSVP occupies the last mobile navigation slot and hides when
the form arrives. Music has its own navigation button. Both stay off the card
content. The RSVP floral background remains stable when attendance changes.
The venue uses the supplied photograph with AI-assisted cleanup and enhancement.

MUSIC
The user-supplied solitudes-embrace.mp3 replaces the original instrumental.
The welcome cover is silent until the guest opens the P&S seal, which starts
the track at 0:00. Music controls pause/resume, and the full track loops.
Mute is respected across navigation and other interactions. Playback pauses
in background tabs and resumes only when previously playing and not muted.
A cream pill in the hero and the mobile navigation control playback.
See MUSIC-NOTES.txt for the audio file details.

RSVP AND CALENDAR
Each reply is for one individual. All three celebrations are selected initially.
Guests review their reply before opening WhatsApp to +919711668419.
No RSVP is automatically sent or stored, and no test RSVP has been sent.
An attending review offers one all-day calendar reservation for 25 January,
26 January, or both dates according to the selected celebrations. Event times
and venue appear in its notes. Declining hides this option.

OTHER FEATURES
Live countdown, animated ceremony artwork, venue directions, share/copy,
FAQ, responsive navigation and reduced-motion support. The diya begins unlit
on every page load and lights only when tapped. Caption space is reserved
before lighting, so the lamp remains in place when its message changes.
No tracking scripts.

EDITING
Content: index.html
Typography, layout and motion: styles.css
Dates, RSVP, calendar, music controls and card fitting: app.js
Illustrations, photograph, music and self-hosted fonts: assets/

VALIDATION
DOM, interaction, opening, all seven calendar combinations, ceremony effects,
card fit and audio-state checks pass. Real browser checks cover small-phone
RSVP layout, readable labels, card stacking, the restored painted border, and sound activation
and mute. Mobile widths checked: 320px, 390px and 501px. Device viewport tests
do not substitute for testing on a physical iPhone. No external messages sent.

PUBLISH
Upload this folder to a static website project with no build command.
All assets use relative URLs. The original shipri.vercel.app deployment has
not been modified. Sites publishing is disabled for this workspace.

CREDITS
Wedding facts: https://shipri.vercel.app/
Garden and ceremony paintings: built-in ImageGen.
Venue photo: user-supplied photograph, retouched with built-in ImageGen.
Garment icons: original code-authored artwork.
Music: user-supplied solitudes-embrace.mp3.
Fonts are self-hosted and include their OFL licenses.
Design history and prompts: DESIGN-NOTES.txt and EVENT-ARTWORK.txt.
Venue photograph provenance: VENUE-PHOTO.txt.
