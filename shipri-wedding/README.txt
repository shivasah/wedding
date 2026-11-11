PRIYANKA & SHIVA — A CELEBRATION OF FOREVER

A mobile-first wedding invitation built with HTML, CSS and JavaScript.
No framework, install step, paid API, or backend is required.

PREVIEW
Open index.html, or serve this folder with:
  python3 -m http.server 4173
Then visit http://localhost:4173.
Priyanka-and-Shiva-Invitation.html is the separate self-contained edition.

EVENT DETAILS
Haldi: 25 January 2027, 10:00 AM IST.
Sangeet: 25 January 2027, 6:00 PM IST.
Wedding: 26 January 2027, 7:00 PM IST.
Venue: Blue Mountain Country Club & Resort, Siliguri.

CURRENT DESIGN
Static Pichwai floral artwork on the opening and cover. Tapping the seal
releases a gold glint and rose-petal burst, then unfolds the two cover leaves.
The short opening sequence respects reduced motion and can be skipped with Escape.
Petal showers use rose, vermilion and plum for contrast against the gold paper.
Only Haldi has colour swatches; other dress notes describe garment types.
Compact mobile ceremony cards show the date, time, venue and dress note.
Cards overlap like photographs only when every card fits fully above the
navigation. Short screens, enlarged text and reduced motion use normal
vertical scrolling so no details are trapped under a card.

On phones, the floating RSVP occupies the RSVP slot in the bottom navigation,
with a subtle heartbeat inside its seal. It hides when the form arrives,
revealing the regular RSVP navigation item. It does not cover card content.
The RSVP background repeats at a stable width-based scale; changing attendance
cannot stretch its flowers. The venue uses the supplied photograph with
AI-assisted watermark cleanup and clarity enhancement, rather than a painting.

RSVP AND CALENDAR
Each reply is for one individual. There is no party size or guest counter.
Guests select attendance and celebrations, then review their reply before
opening WhatsApp to +919711668419. No RSVP is automatically sent or stored.
No test RSVP was sent. Only the diya state is remembered locally.

Calendar saving appears with an attending RSVP review. One all-day calendar
reservation covers 25 January, 26 January, or both dates according to the
reviewed choices. Haldi and Sangeet together count as one day. Ceremony times
and the venue appear in the notes. Declining hides the calendar option.

OTHER FEATURES
Live countdown, animated ceremony artwork, tap-to-light diya, petal showers,
optional ambient chimes, venue directions, share/copy,
FAQ, responsive navigation and reduced-motion support. No tracking scripts.

EDITING
Content: index.html
Colours, fonts, responsive layout and motion: styles.css
Dates, RSVP, calendar, ceremony effects and card fitting: app.js
Illustrations, photograph and self-hosted fonts: assets/

VALIDATION
JavaScript syntax, DOM interactions and all seven RSVP calendar combinations
passed. Checks cover individual replies, WhatsApp destination, validation,
text escaping, dates, calendar folding, three ceremony effects, reduced-motion/
offscreen behavior, and complete-card fit logic for phone and desktop geometries.
Opening checks cover timing, replay, repeated taps, keyboard focus, Escape,
reduced motion and bounded petal cleanup.
Short-screen, landscape and enlarged-text fallback were also checked.
Canvas and layout geometry are mocked in these checks. Browser launch remains
blocked in this environment; rendered device screenshots are not verified.

PUBLISH
This is a static site. Upload this folder to your website project with no build
command. All assets use relative URLs. The original shipri.vercel.app deployment
has not been modified. Sites publishing is disabled for this workspace.

CREDITS
Wedding facts: https://shipri.vercel.app/
Garden and ceremony artwork: built-in ImageGen.
Venue photo: user-supplied photograph, retouched with built-in ImageGen.
Typography: Cormorant Garamond and Manrope on the cover; Bodoni Moda,
Pinyon Script and DM Sans inside. Fonts include their OFL licenses.
Design references and original prompts: DESIGN-NOTES.txt and EVENT-ARTWORK.txt.
Venue photo edit prompt and provenance: VENUE-PHOTO.txt.
