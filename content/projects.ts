export type Category = "fintech" | "travel" | "wellbeing";

export type Shot = { src: string; alt: string; caption?: string };
export type Pin = { x: string; y: string; text: string };

type Base = { id: string; nav: string; title: string };

export type Section =
  | (Base & { type: "notes"; paragraphs: string[]; notes: string[] })
  | (Base & { type: "assumptions"; intro: string; items: string[]; after?: string })
  | (Base & { type: "list"; intro?: string; items: string[] })
  | (Base & { type: "chips"; intro?: string; items: string[]; numbered?: boolean; after?: string })
  | (Base & { type: "gallery"; intro?: string[]; shots: Shot[] })
  | (Base & { type: "annotated"; intro: string; steps: { id: string; label: string; src: string; alt: string; pins: Pin[] }[]; note?: string })
  | (Base & { type: "system"; intro: string; swatches?: { name: string; hex: string; ink: string }[]; numbers: { big: string; small: string }[]; specimen?: { display: string; displayUse: string; body: string; bodyUse: string }; note?: string })
  | (Base & { type: "stats"; paragraphs: string[]; stats: { value: string; label: string; source?: string; href?: string }[]; note?: string })
  | (Base & { type: "live"; intro: string; disclaimer: string })
  | (Base & { type: "checks"; intro: string; items: string[]; next?: string[] })
  | (Base & { type: "sources"; items: { label: string; href: string }[] })
  | (Base & { type: "text"; paragraphs: string[] });

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  cat: Category;
  color: string;
  glow: string;
  size: "wide" | "narrow" | "full";
  status: { label: string; tested: boolean };
  card: { line: string; img: string; alt: string; facts: string[]; stats?: { big: string; small: string }[] };
  phone?: { light: string; dark: string; alt: string; line: string };
  liveUrl?: string;
  figmaUrl?: string;
  tryLabel: string;
  seo: { title: string; description: string };
  hero: {
    lede: string;
    meta: [string, string][];
    bg: string;
    ink: string;
    muted: string;
    ctaBg: string;
    ctaInk: string;
    palette?: { name: string; hex: string }[];
    mosaic: Shot[];
  };
  sections: Section[];
  next: string;
};

export const projects: Project[] = [
  {
    slug: "atlas",
    name: "ATLAS",
    kind: "Travel planning app",
    year: "2026",
    cat: "travel",
    color: "#1F4E62",
    glow: "#5FC4B8",
    size: "wide",
    status: { label: "Not yet tested with users", tested: false },
    card: {
      line: "Plan a trip, reshape each day by dragging stops and see the new times before you let go.",
      img: "/projects/atlas.webp",
      alt: "ATLAS screens: Explore, a stop being dragged in day 2, and Today in Tokyo",
      facts: ["Coded prototype", "123 screens in Figma"],
    },
    phone: {
      light: "/work/atlas/light-drag.webp",
      dark: "/work/atlas/dark-drag.webp",
      alt: "ATLAS: a stop being dragged in day 2, showing its new start time",
      line: "ATLAS: drag a stop and see its new start time before you let go.",
    },
    liveUrl: "/atlas.html",
    figmaUrl: "https://www.figma.com/proto/zSLpBSIlO67JMKtTmlyadM/ATLAS?node-id=54-2&starting-point-node-id=54-2&page-id=1%3A6&scaling=scale-down",
    tryLabel: "Try the app",
    seo: {
      title: "ATLAS case study",
      description: "ATLAS is a travel planner that keeps the whole trip in one place, and is honest about what it can’t know. A coded prototype, a design system and a wired Figma prototype by Adam Calliste.",
    },
    hero: {
      lede: "A travel planner that keeps the whole trip in one place, and is honest about what it can’t know.",
      meta: [["Role", "Solo, end to end"], ["Platform", "Phone-first web app"], ["Year", "2026"], ["Status", "Not yet tested with users"]],
      bg: "#1F4E62",
      ink: "#FFFFFF",
      muted: "#D3E2E8",
      ctaBg: "#F28C75",
      ctaInk: "#17243A",
      palette: [
        { name: "Paper", hex: "#FAF9F6" },
        { name: "Navy ink", hex: "#17243A" },
        { name: "Harbour", hex: "#245C73" },
        { name: "Teal", hex: "#36A69A" },
        { name: "Coral", hex: "#F28C75" },
      ],
      mosaic: [
        { src: "/projects/atlas.webp", alt: "ATLAS screens: Explore, a stop being dragged in day 2, and Today in Tokyo in dark mode" },
        { src: "/work/atlas/light-map.webp", alt: "The day 2 map with numbered stops joined in visiting order" },
        { src: "/work/atlas/light-today.webp", alt: "Today in Tokyo during the trip, with Meiji Jingu up next in 50 minutes" },
      ],
    },
    sections: [
      {
        type: "notes",
        id: "problem",
        nav: "The problem",
        title: "The problem",
        paragraphs: [
          "A trip lives in too many places, plans change on the way, and when something goes wrong, like a cancelled flight, it’s hard to see what it affects.",
          "ATLAS holds the whole trip in one place and makes change feel safe: it shows what a change will do before you make it, and lets you undo it.",
        ],
        notes: ["Bookings in email", "Ideas in screenshots", "The plan in a spreadsheet", "Costs in a group chat"],
      },
      {
        type: "assumptions",
        id: "assumed",
        nav: "What I assumed",
        title: "What I assumed",
        intro: "No research has run yet, so these are assumptions for testing to prove wrong.",
        items: [
          "Seeing start times change while dragging lets people reshape a day without opening each stop.",
          "An Undo on every change makes people more willing to try a different plan.",
          "On the day itself, people want what’s next and when to leave before anything else.",
          "Labelling estimates and illustrative photos makes the rest of the plan easier to trust.",
        ],
      },
      {
        type: "annotated",
        id: "drag",
        nav: "Drag to reorder",
        title: "Drag to reorder",
        intro: "The signature interaction. A stop moves by its handle, and the day recalculates as you go, so you see the effect before you commit.",
        steps: [
          {
            id: "drag",
            label: "While dragging",
            src: "/work/atlas/light-drag.webp",
            alt: "A stop mid-drag in day 2, labelled Starts 10:05 AM, check timing, with a striped gap where it was",
            pins: [
              { x: "85%", y: "26%", text: "The new start time, and a warning to check timing, show before you let go." },
              { x: "30%", y: "41%", text: "A striped gap keeps the stop’s old place visible." },
              { x: "12%", y: "21.5%", text: "Other days light up as places to drop it." },
            ],
          },
          {
            id: "drop",
            label: "After the drop",
            src: "/work/atlas/light-dropped.webp",
            alt: "After the drop: a message says Ramen lunch now starts at 10:05 AM, travel 4 minutes less, opens at 11:00 AM, with Undo",
            pins: [
              { x: "60%", y: "52%", text: "Problems are explained in words on the card, not only in colour." },
              { x: "88%", y: "84%", text: "The confirmation says what changed and how travel time moved, with Undo for exactly that change." },
            ],
          },
        ],
        note: "Space picks a stop up, the arrow keys move it, Space drops it, and each step is announced to screen readers.",
      },
      {
        type: "gallery",
        id: "screens",
        nav: "Around the trip",
        title: "Around the trip",
        intro: ["Explore leads to a destination, a destination to a trip, and a trip opens on its itinerary, with the map, bookings, budget and people one tab away. During the trip, Today leads."],
        shots: [
          { src: "/work/atlas/light-explore.webp", alt: "Explore: Good morning, Alex, with search and the Tokyo Escape trip coming up in 173 days", caption: "Explore" },
          { src: "/work/atlas/light-trip.webp", alt: "Tokyo Escape, 13–19 April 2027: 173 days to go, £1,420 of £2,000, 3 people and 1 thing to check", caption: "Trip overview" },
          { src: "/work/atlas/light-itinerary.webp", alt: "Day 2, Wednesday 14 April: a route map, 9 stops and a timeline starting with landing at Haneda at 7:15 AM", caption: "Itinerary" },
          { src: "/work/atlas/light-budget.webp", alt: "Budget: your share is £1,420 of £2,000, split into paid, confirmed, estimated and refunded, with settle up", caption: "Budget" },
          { src: "/work/atlas/light-people.webp", alt: "People on the trip: Alex as owner, Sam who can edit, Mia who can view, and a pending invite", caption: "People and roles" },
          { src: "/work/atlas/dark-today.webp", alt: "Today in Tokyo in dark mode, with Meiji Jingu up next", caption: "Today, dark mode" },
        ],
      },
      {
        type: "system",
        id: "system",
        nav: "Design system",
        title: "Design system",
        intro: "Warm paper, navy ink, harbour blue for actions, teal for routes and coral for the one thing that matters right now.",
        swatches: [
          { name: "Paper", hex: "#FAF9F6", ink: "#17243A" },
          { name: "Navy ink", hex: "#17243A", ink: "#FFFFFF" },
          { name: "Harbour", hex: "#245C73", ink: "#FFFFFF" },
          { name: "Teal", hex: "#36A69A", ink: "#0D1A1F" },
          { name: "Coral", hex: "#F28C75", ink: "#17243A" },
        ],
        numbers: [
          { big: "171", small: "Colour variables, light and dark" },
          { big: "115", small: "Components, plus 116 icons" },
          { big: "109", small: "Text styles" },
          { big: "123", small: "Screens, sheets and dialogs" },
        ],
        specimen: { display: "Playfair Display", displayUse: "Trip names, Today and the recap", body: "Inter", bodyUse: "Everything else" },
      },
      {
        type: "live",
        id: "live",
        nav: "Try it",
        title: "Try it",
        intro: "The coded prototype is the same app, running in your browser on demo data.",
        disclaimer: "Demo data only. Nothing is booked or sent.",
      },
      {
        type: "checks",
        id: "checked",
        nav: "Checks and next steps",
        title: "What was checked",
        intro: "Nothing has been tested with users yet. What has been checked is the work itself.",
        items: [
          "120 automated checks on the trip engine pass, from time zones to splitting costs to the penny.",
          "All 37 text colour pairings meet WCAG 2.2 AA in light and dark.",
          "Building the Figma file turned up two small bugs, now fixed in the app.",
        ],
        next: [
          "Moderated sessions with about five people who have planned a trip with someone else in the last year.",
          "Test drag to reorder on real phones, by touch, keyboard and screen reader.",
          "Fix the worst problems, retest with new people, and update this page.",
        ],
      },
    ],
    next: "kivo",
  },
  {
    slug: "kivo",
    name: "KIVO",
    kind: "Subscription manager",
    year: "2026",
    cat: "fintech",
    color: "#4A31CF",
    glow: "#A493FF",
    size: "narrow",
    status: { label: "Not yet tested with users", tested: false },
    card: {
      line: "See every subscription and what’s due next, with guided cancelling that never pretends to cancel for you.",
      img: "/projects/kivo.png",
      alt: "KIVO screens: subscriptions, Home with £101.82 a month, and spending by category",
      facts: ["Coded prototype", "237 frames in Figma"],
    },
    phone: {
      light: "/work/kivo/light-home.png",
      dark: "/work/kivo/dark-home.png",
      alt: "KIVO Home: £101.82 a month across 11 subscriptions",
      line: "KIVO: every subscription, what it costs and what’s due next.",
    },
    liveUrl: "/kivo.html",
    figmaUrl: "https://www.figma.com/proto/QVzt4ygQoITrjWHEIAM5Sq/KIVO?node-id=14-2&starting-point-node-id=14-2&page-id=2%3A2&scaling=scale-down",
    tryLabel: "Try the app",
    seo: {
      title: "KIVO case study",
      description: "KIVO is a subscription manager that shows what you pay, what’s coming next and how to cancel, without pretending it can cancel for you. A coded prototype and a wired Figma prototype by Adam Calliste.",
    },
    hero: {
      lede: "A subscription manager that shows what you pay, what’s coming next and how to cancel, without pretending it can cancel for you.",
      meta: [["Role", "Solo, end to end"], ["Platform", "Phone-first web app"], ["Year", "2026"], ["Status", "Not yet tested with users"]],
      bg: "#4A31CF",
      ink: "#FFFFFF",
      muted: "#E2DCFF",
      ctaBg: "#C4B5FF",
      ctaInk: "#170F45",
      palette: [
        { name: "Night", hex: "#0E0B1F" },
        { name: "Violet", hex: "#6547F5" },
        { name: "Lilac", hex: "#C4B5FF" },
        { name: "Mist", hex: "#F5F3FF" },
      ],
      mosaic: [
        { src: "/projects/kivo.png", alt: "Three KIVO screens: the subscriptions list, Home with £101.82 a month across 11 active subscriptions, and spending by category in dark mode" },
        { src: "/work/kivo/light-timeline.png", alt: "Coming up next: £204.57 expected in the next 30 days" },
        { src: "/work/kivo/light-insights.png", alt: "Subscription spending: £1,221.83 a year across 8 categories" },
      ],
    },
    sections: [
      {
        type: "notes",
        id: "problem",
        nav: "The problem",
        title: "The problem",
        paragraphs: [
          "Subscriptions are easy to start and easy to lose track of. They charge on different days, on different cards and sometimes in different currencies, and cancelling happens somewhere else, often several screens deep in another app.",
          "KIVO gives one honest picture of what you pay and what’s coming, and helps you act on it. It’s clear about what it can’t see or do: it can’t see how much you use a service, it can’t cancel for you, and an expected charge is not a confirmed one.",
        ],
        notes: ["Charges on different days", "Trials that turn into paid plans", "Prices that creep up", "Cancelling in another app"],
      },
      {
        type: "assumptions",
        id: "assumed",
        nav: "What I assumed",
        title: "What I assumed",
        intro: "No user research has run yet, so the design rests on assumptions. They are listed so that testing can prove them wrong.",
        items: [
          "The first number people want is a monthly total that counts annual plans as a twelfth, with the yearly figure next to it.",
          "A countdown with the expected first charge gets people to deal with a free trial before it turns into a paid plan.",
          "Step-by-step guidance that saves progress helps people finish cancelling with the provider.",
          "Keeping expected charges visibly apart from recorded ones makes the calendar easier to trust.",
          "People trust detection more when KIVO asks before adding anything it found.",
          "A what-if scenario helps people decide what to keep without feeling pushed either way.",
        ],
      },
      {
        type: "list",
        id: "principles",
        nav: "Principles",
        title: "Principles",
        items: [
          "KIVO never claims to cancel anything. It shows where and how, keeps your progress, and only marks a subscription as cancelled when you confirm it.",
          "Recorded and expected stay apart. Expected charges and estimates are labelled, and plans that vary show an average with a “~”.",
          "No invented links. If KIVO hasn’t checked a provider’s account page, it says so and gives general steps instead of guessing a link.",
          "Ask before acting. Detected subscriptions and possible duplicates wait for your decision, because detection can be wrong.",
          "Scenarios, not promises. The what-if calculator is labelled as a scenario, and for shared plans it shows your own share separately.",
          "Accessible by default: every chart has a text version, colour is never the only cue, and text size and reduced motion are settings.",
        ],
      },
      {
        type: "gallery",
        id: "screens",
        nav: "Key screens",
        title: "Key screens",
        intro: ["Home leads with the monthly total and anything that needs attention. Every subscription has the same detail page, and every one can be cancelled with the same guided steps."],
        shots: [
          { src: "/work/kivo/light-home.png", alt: "Home: £101.82 a month across 11 active subscriptions, a free trial ending in 3 days and items that need attention", caption: "Home" },
          { src: "/work/kivo/light-subs.png", alt: "Your subscriptions: 11 active, 2 trials and 1 cancelled, with search and filters", caption: "Subscriptions" },
          { src: "/work/kivo/light-detail.png", alt: "Netflix Standard at £12.99 a month, next payment Saturday 24 October, with billing details", caption: "Subscription detail" },
          { src: "/work/kivo/light-trials.png", alt: "Your free trials: Figma Professional with 3 days remaining and an expected charge of £15.00 on 17 October", caption: "Free trials" },
          { src: "/work/kivo/light-cancel.png", alt: "Manage cancellation for Stillwater: cancellation started but not confirmed", caption: "Guided cancellation" },
          { src: "/work/kivo/light-calendar.png", alt: "Your payment calendar for October 2026, with £100.05 expected", caption: "Payment calendar" },
        ],
      },
      {
        type: "system",
        id: "system",
        nav: "Design system",
        title: "Design system",
        intro: "A design system in Figma, with every colour defined for light and dark. The screens are built from instances of its components, and the dark mode is the same frames with the Dark mode switched on.",
        numbers: [
          { big: "81", small: "Colour variables, light and dark" },
          { big: "86", small: "Text styles" },
          { big: "92", small: "Components" },
          { big: "104", small: "Icons" },
        ],
        note: "The app’s 70 text and control colour pairings meet WCAG 2.2 AA contrast in both light and dark.",
      },
      {
        type: "gallery",
        id: "final",
        nav: "Final experience",
        title: "The final experience",
        intro: ["237 frames in Figma: 154 screen states, 68 sheets and 15 dialogs, each in light and dark. The Figma prototype wires about 1,900 interactions, from tabs and back buttons to sheets, dialogs and switches."],
        shots: [
          { src: "/work/kivo/light-timeline.png", alt: "Coming up next: £204.57 expected in the next 30 days, with a notice about a large annual payment", caption: "Coming up next" },
          { src: "/work/kivo/light-trends.png", alt: "How your costs change: monthly commitments over time, recorded and expected", caption: "Cost trends" },
          { src: "/work/kivo/light-whatif.png", alt: "What if you cancelled: pick subscriptions to see how recurring costs would change, labelled as a scenario", caption: "What-if calculator" },
          { src: "/work/kivo/light-shared.png", alt: "Shared plans: Household Streaming with £4.33 outstanding and Family Cloud all paid", caption: "Shared plans" },
          { src: "/work/kivo/light-review.png", alt: "Your monthly review: 13 subscriptions to look at, about 3 minutes", caption: "Monthly review" },
          { src: "/work/kivo/dark-cancel.png", alt: "Guided cancellation in dark mode", caption: "Cancellation, dark mode" },
        ],
      },
      {
        type: "live",
        id: "live",
        nav: "Try it",
        title: "Try it",
        intro: "The coded prototype is the same app, running in your browser on demo data.",
        disclaimer: "Demo data only. No real bank is connected.",
      },
      {
        type: "checks",
        id: "checked",
        nav: "Checks and next steps",
        title: "What was checked",
        intro: "Nothing here has been tested with users yet. What has been checked so far is the work itself.",
        items: [
          "27 automated tests on the subscription engine pass, covering totals, annual and weekly plans, trials, other currencies, plans that vary, cancellations, duplicates, shared plans and the check-up score.",
          "All 70 colour pairings meet WCAG 2.2 AA contrast in light and dark.",
          "The Figma screens were built from the finished app, state by state, and every frame in the prototype leads somewhere.",
        ],
        next: [
          "Write a usability test plan around six journeys, with a task for each assumption above.",
          "Run a first round of moderated sessions with about five people who pay for several subscriptions.",
          "Fix the most severe problems, then retest the changed screens with new people.",
        ],
      },
    ],
    next: "daymark",
  },
  {
    slug: "daymark",
    name: "DAYMARK",
    kind: "Budgeting and savings",
    year: "2026",
    cat: "fintech",
    color: "#12483A",
    glow: "#B8E86A",
    size: "narrow",
    status: { label: "Usability testing planned", tested: false },
    card: {
      line: "See what’s left to spend and what’s due before payday, with the working shown for every estimate.",
      img: "/projects/daymark.png",
      alt: "DAYMARK screens: budgets, Home with £5,239.92, and looking ahead to payday",
      facts: ["Coded prototype", "Lo-fi to final UI"],
    },
    phone: {
      light: "/work/daymark/light-home.png",
      dark: "/work/daymark/dark-home.png",
      alt: "DAYMARK Home: £5,239.92 across 3 accounts",
      line: "DAYMARK: what’s left to spend before payday, with the working shown.",
    },
    liveUrl: "/daymark.html",
    figmaUrl: "https://www.figma.com/proto/bWCqBeiryO7JvaeEoV4YqT/DAYMARK?node-id=49-8&starting-point-node-id=49-8&page-id=3%3A13&scaling=scale-down",
    tryLabel: "Try the app",
    seo: {
      title: "DAYMARK case study",
      description: "DAYMARK is a budgeting and savings app that tells you what’s left, what’s coming before payday, and how it worked that out. Lo-fi to final UI and a coded prototype by Adam Calliste.",
    },
    hero: {
      lede: "A budgeting and savings app that tells you what’s left, what’s coming before payday, and how it worked that out.",
      meta: [["Role", "Solo, end to end"], ["Platform", "Phone-first web app"], ["Year", "2026"], ["Status", "Usability testing planned"]],
      bg: "#12483A",
      ink: "#FFFFFF",
      muted: "#CFE8DE",
      ctaBg: "#C9F27A",
      ctaInk: "#0F231C",
      palette: [
        { name: "Forest", hex: "#0F231C" },
        { name: "Green", hex: "#176B57" },
        { name: "Leaf", hex: "#2E8B6E" },
        { name: "Lime", hex: "#C9F27A" },
        { name: "Mist", hex: "#F2F7F3" },
      ],
      mosaic: [
        { src: "/projects/daymark.png", alt: "Three DAYMARK screens: the budgets list, Home with the cash balance and spending this month, and Looking ahead in dark mode" },
        { src: "/work/daymark/light-ahead.png", alt: "Looking ahead: an estimated £973 before payday" },
        { src: "/work/daymark/light-goal.png", alt: "Japan holiday goal, 62% saved" },
      ],
    },
    sections: [
      {
        type: "notes",
        id: "problem",
        nav: "The problem",
        title: "The problem",
        paragraphs: [
          "Banking apps are good at showing what has already happened. The questions people bring to their money are mostly about what happens next.",
          "DAYMARK answers those questions directly and shows the working behind every estimate. It’s honest when it doesn’t know: a month with no data says “No data” instead of £0, and an estimate is always labelled as one.",
        ],
        notes: ["How much is left this month?", "What goes out before payday?", "Is my savings goal on track?"],
      },
      {
        type: "assumptions",
        id: "assumed",
        nav: "What I assumed",
        title: "What I assumed",
        intro: "No user research has run yet, so the design rests on hypotheses. Each one is tied to a usability task that could prove it wrong.",
        items: [
          "Budgets should lead with what’s left, not what’s been spent.",
          "Showing the effect of a new budget amount before saving prevents mistakes.",
          "“Before payday” is the frame people use for short-term planning.",
          "Suggesting a monthly amount makes a savings goal realistic.",
          "Fixing a wrong category has to be quick, undoable and offer to apply to future payments.",
          "People trust an estimate more when they can see how it was worked out.",
        ],
        after: "Instead of personas, which would need research behind them, the screens are designed around five situations: six months of history, a new user with two weeks of data, nothing connected, a refresh that fails, and a bank connection that fails.",
      },
      {
        type: "chips",
        id: "tasks",
        nav: "Tasks",
        title: "Eight tasks",
        intro: "Eight usability tasks set the main flows, and the Figma prototype covers all of them.",
        items: ["What’s left for groceries", "Raise the eating-out budget", "Top category last month", "Create a holiday goal", "What’s due before payday", "Fix a wrong category", "Monthly subscription cost", "Explain the forecast"],
      },
      {
        type: "list",
        id: "principles",
        nav: "Principles",
        title: "Principles",
        items: [
          "Lead with what’s left and what’s next.",
          "Keep recorded and estimated figures visibly apart: solid lines and exact amounts for what happened, dotted lines, ranges and rounding for estimates.",
          "No data is not zero.",
          "Every number can explain itself, with a “How we worked this out” that shows the actual sums.",
          "Undo instead of “Are you sure?”. Dialogs are only for things that can’t be undone.",
          "Never pretend: demo data is labelled on every screen and simulated bank screens say they are simulated.",
        ],
      },
      {
        type: "gallery",
        id: "process",
        nav: "Lo-fi to hi-fi",
        title: "Lo-fi to hi-fi",
        intro: [
          "Lo-fi wireframes compared structures before any visual design. Mid-fi then settled the words and numbers using the demo data, still in greyscale.",
          "Bars won over rings for budgets because they compare at a glance and leave room for a marker showing how far through the month you are. Rings were kept for savings goals, where one percentage is the point.",
        ],
        shots: [
          { src: "/work/daymark/lofi-home.png", alt: "Lo-fi wireframe of Home with grey boxes for the balance, spending and bills", caption: "Lo-fi: balance first" },
          { src: "/work/daymark/midfi-home.png", alt: "Mid-fi wireframe of Home with real figures in greyscale", caption: "Mid-fi: real content, no colour" },
          { src: "/work/daymark/light-home.png", alt: "Final Home screen with the dark green balance card and spending this month", caption: "Hi-fi" },
        ],
      },
      {
        type: "system",
        id: "system",
        nav: "Design system",
        title: "Design system",
        intro: "Variables across colour, chart and layout collections, each colour with its own light and dark value. The 12 spending categories were checked for colour-blind separation, and every category also has an icon and a name.",
        numbers: [
          { big: "158", small: "Variables, light and dark" },
          { big: "39", small: "Text styles" },
          { big: "55", small: "Components, with 230 variants" },
          { big: "108", small: "Icons" },
        ],
        note: "All 21 text and control colour pairs in the accessibility check meet WCAG 2.2 AA in both themes.",
      },
      {
        type: "gallery",
        id: "final",
        nav: "Final experience",
        title: "The final experience",
        intro: ["33 phone screens in light and dark, 7 desktop layouts, 15 edge-state screens and 17 sheets, dialogs, toasts and modals."],
        shots: [
          { src: "/work/daymark/light-budgets.png", alt: "Budgets with £300.18 left across five budgets", caption: "Budgets" },
          { src: "/work/daymark/light-budget-detail.png", alt: "Groceries budget with £137.65 remaining and a projection of about £326 by 31 October", caption: "Budget detail" },
          { src: "/work/daymark/light-category.png", alt: "Choose a category sheet with an option to change 11 other Tesco payments", caption: "Fixing a category" },
          { src: "/work/daymark/light-ahead.png", alt: "Looking ahead: an estimated £973 before payday", caption: "Looking ahead" },
          { src: "/work/daymark/light-insights.png", alt: "Insights with links to Looking ahead, Recurring payments and Reports", caption: "Insights" },
          { src: "/work/daymark/dark-budgets.png", alt: "Budgets in dark mode", caption: "Budgets, dark mode" },
        ],
      },
      {
        type: "live",
        id: "live",
        nav: "Try it",
        title: "Try it",
        intro: "The coded prototype is the same app, running in your browser on demo data.",
        disclaimer: "Demo data only. No real bank is connected.",
      },
      {
        type: "checks",
        id: "checked",
        nav: "Testing",
        title: "Testing and review",
        intro: "The plan is a first round of about five moderated, think-aloud sessions on the coded prototype at phone size, using the eight tasks. Review so far changed these:",
        items: [
          "“Coming up” moved directly under the forecast chart on phones, so the payments due before payday don’t need a long scroll.",
          "Forecast axis labels no longer collide; they are placed by priority and skipped if they would overlap.",
          "Testing caught switches that never looked switched on, wide tables keyboard users couldn’t scroll, and radio buttons with the wrong ARIA; all were fixed.",
        ],
        next: [
          "Each session records task completion, time on task, wrong turns and a Single Ease Question rating.",
          "Three issues are still open: a settings label cut off on narrow phones, suggested questions that don’t adapt to a new user, and an error screen that shows a technical message.",
        ],
      },
    ],
    next: "global",
  },
  {
    slug: "global",
    name: "GLOBAL",
    kind: "International money transfer",
    year: "2026",
    cat: "fintech",
    color: "#1B2160",
    glow: "#8C93FF",
    size: "wide",
    status: { label: "Usability testing in progress", tested: false },
    card: {
      line: "Send money abroad and know exactly what arrives, and when.",
      img: "/projects/global.png",
      alt: "GLOBAL screens: a transfer breakdown, Home with £4,285.60, and transfer tracking",
      facts: ["Coded prototype", "28 screens, light and dark"],
    },
    phone: {
      light: "/work/global/light-home.png",
      dark: "/work/global/dark-home.png",
      alt: "GLOBAL Home: a total balance of £4,285.60",
      line: "GLOBAL: know exactly what arrives abroad, and when.",
    },
    liveUrl: "/global.html",
    figmaUrl: "https://www.figma.com/proto/BoeF9E7Ug9TG1ufPnzuhEw/GLOBAL?node-id=66-13700&starting-point-node-id=66-13700&page-id=1%3A10&scaling=scale-down",
    tryLabel: "Try the app",
    seo: {
      title: "GLOBAL case study",
      description: "GLOBAL is an international money transfer app that shows exactly what arrives, and when. A research plan, design system, coded prototype and Figma prototype by Adam Calliste.",
    },
    hero: {
      lede: "An international money transfer app that shows exactly what arrives, and when.",
      meta: [["Role", "Solo, end to end"], ["Platform", "Mobile app, coded as a web prototype"], ["Year", "2026"], ["Status", "Usability testing in progress"]],
      bg: "#1B2160",
      ink: "#FFFFFF",
      muted: "#D3D6F7",
      ctaBg: "#F59E0B",
      ctaInk: "#1B1300",
      palette: [
        { name: "Ink", hex: "#0B0D13" },
        { name: "Iris", hex: "#5B5FEF" },
        { name: "Brand", hex: "#6358FF" },
        { name: "Amber", hex: "#F59E0B" },
      ],
      mosaic: [
        { src: "/projects/global.png", alt: "Three GLOBAL screens: the transfer breakdown, the home screen and transfer tracking in dark mode" },
        { src: "/work/global/light-quote.png", alt: "Transfer breakdown with a guaranteed rate timer" },
        { src: "/work/global/light-tracking.png", alt: "Tracking screen with a dated timeline" },
      ],
    },
    sections: [
      {
        type: "stats",
        id: "problem",
        nav: "The problem",
        title: "The problem",
        paragraphs: [
          "Sending money abroad asks people to commit before they can see the whole picture. The cost is split across a visible fee, an exchange rate and sometimes a margin hidden inside that rate. Arrival is promised as a range of working days, and one wrong character in an account number can send money to the wrong place, or nowhere.",
        ],
        stats: [
          { value: "6.49%", label: "Average cost of sending $200 abroad, Q1 2025", source: "World Bank", href: "https://remittanceprices.worldbank.org/sites/default/files/rpw_main_report_and_annex_q125_1_0.pdf" },
          { value: "35.4%", label: "Share of retail cross-border payments that arrived within an hour in 2025", source: "FSB, via FXC Intelligence", href: "https://www.fxcintel.com/research/reports/ct-retail-payments-g20-cross-border-roadmap-2025" },
          { value: "£450.7m", label: "Lost to authorised push payment scams in the UK in 2024", source: "UK Finance", href: "https://www.ukfinance.org.uk/news-and-insight/press-release/fraud-report-2025-press-release" },
        ],
        note: "These published figures describe the market, not GLOBAL’s users. They frame the problem; the interviews will test it.",
      },
      {
        type: "assumptions",
        id: "assumed",
        nav: "What I assumed",
        title: "What I assumed",
        intro: "The research plan is ready: six to eight interviews with people who have sent, or tried to send, money abroad in the past year. Until those run, the design rests on assumptions.",
        items: [
          "People judge a provider by what the recipient gets, more than by the fee.",
          "The exchange-rate margin is the least understood cost.",
          "Some transfers must land as an exact amount, such as rent.",
          "Named stages with times reduce “where is my money?” worry.",
        ],
      },
      {
        type: "chips",
        id: "flow",
        nav: "The flow",
        title: "The flow",
        intro: "Twelve low-fidelity wireframes mapped the flow before any visual design. Showing what you send and what they receive side by side, with either one editable, came out of this stage.",
        items: ["Choose recipient", "Amount", "Quote", "Payment", "Review", "Authorise", "Track"],
        numbered: true,
      },
      {
        type: "list",
        id: "principles",
        nav: "Principles",
        title: "Principles",
        items: [
          "Show the total cost and the amount that arrives before anyone commits.",
          "Give a date, not a range of working days.",
          "Catch mistakes while typing: IBAN format and checksum, plus a name check with the recipient’s bank.",
          "Guarantee the rate for a visible two minutes, and say plainly when it has expired.",
          "Interrupt with a specific scam warning when a payment looks risky.",
        ],
      },
      {
        type: "gallery",
        id: "screens",
        nav: "Key screens",
        title: "Key screens",
        shots: [
          { src: "/work/global/light-recipient.png", alt: "Add a recipient screen with country, name, IBAN and BIC fields", caption: "Add a recipient" },
          { src: "/work/global/light-amount.png", alt: "Amount screen showing £250 sent and €290 received", caption: "Amount" },
          { src: "/work/global/light-quote.png", alt: "Transfer breakdown with a guaranteed rate timer", caption: "Breakdown" },
          { src: "/work/global/light-review.png", alt: "Review screen before confirming the transfer", caption: "Review" },
          { src: "/work/global/light-tracking.png", alt: "Tracking screen with a dated timeline", caption: "Tracking" },
          { src: "/work/global/dark-tracking.png", alt: "Tracking screen in dark mode", caption: "Tracking, dark mode" },
        ],
      },
      {
        type: "system",
        id: "system",
        nav: "Design system",
        title: "Design system",
        intro: "A design system in Figma with light and dark modes and a type scale. 28 screens, 18 edge states and 48 sheets, dialogs and toasts are built from it.",
        numbers: [
          { big: "136", small: "Variables, light and dark" },
          { big: "54", small: "Components" },
          { big: "391", small: "Prototype interactions" },
          { big: "20", small: "Prototype flows" },
        ],
        note: "Every colour pair used for text is checked against WCAG 2.2 AA, and all 19 token pairs pass in both themes.",
      },
      {
        type: "live",
        id: "live",
        nav: "Try it",
        title: "Try it",
        intro: "The coded prototype is the same app, running in your browser with sample data only.",
        disclaimer: "Sample data only. No real money moves.",
      },
      {
        type: "checks",
        id: "checked",
        nav: "Testing",
        title: "Testing and fixes",
        intro: "Round one is five moderated think-aloud sessions built on six tasks, from sending £250 to France to fixing a wrong account detail. Fixes made so far:",
        items: [
          "Four colour pairs that failed WCAG AA contrast were fixed; all 19 now pass.",
          "List rows wrap instead of cutting off text at 150% text size.",
          "A full 27-character IBAN now fits its field on a small phone.",
          "The duplicate-recipient notice scrolls into view and is announced to screen readers.",
        ],
        next: [
          "Run six to eight interviews and turn the findings into a revised problem statement.",
          "Run round one of usability testing with five people.",
          "Fix the most severe issues first, then retest the changed screens with three to five new people.",
        ],
      },
      {
        type: "sources",
        id: "sources",
        nav: "Sources",
        title: "Sources",
        items: [
          { label: "World Bank — Remittance Prices Worldwide, Q1 2025", href: "https://remittanceprices.worldbank.org/sites/default/files/rpw_main_report_and_annex_q125_1_0.pdf" },
          { label: "FSB — G20 Roadmap for Cross-border Payments: progress report for 2025", href: "https://www.fsb.org/2025/10/g20-roadmap-for-cross-border-payments-consolidated-progress-report-for-2025/" },
          { label: "FXC Intelligence — G20 cross-border payments roadmap KPIs, 2025", href: "https://www.fxcintel.com/research/reports/ct-retail-payments-g20-cross-border-roadmap-2025" },
          { label: "UK Finance — Annual Fraud Report 2025", href: "https://www.ukfinance.org.uk/news-and-insight/press-release/fraud-report-2025-press-release" },
        ],
      },
    ],
    next: "mindspace",
  },
  {
    slug: "mindspace",
    name: "MINDSPACE",
    kind: "Therapeutic games for students",
    year: "LCC",
    cat: "wellbeing",
    color: "#E9EAEE",
    glow: "#7FE0B8",
    size: "full",
    status: { label: "Tested with users", tested: true },
    card: {
      line: "Six short games matched to how you feel, for London College of Communication students facing waits of around 16 weeks for counselling.",
      img: "/projects/mindspace.png",
      alt: "MindSpace screens on phones, including the insights view",
      facts: ["Primary research", "Live web app"],
      stats: [
        { big: "−2.3", small: "Average fall in PSS-4 stress scores, before and after, with 15 students" },
        { big: "152", small: "Students surveyed before any design started" },
      ],
    },
    figmaUrl: "https://www.figma.com/design/G0t1JySY61M9XGD37L0eBc/mindspace?node-id=0-1",
    tryLabel: "View in Figma",
    seo: {
      title: "MindSpace case study",
      description: "MindSpace is a set of short therapeutic games for London College of Communication students, matched to how they feel. Researched with 152 students and tested with 15. By Adam Calliste.",
    },
    hero: {
      lede: "Short, calming games for students waiting for counselling, each one matched to how you feel.",
      meta: [["Role", "Research, design and build"], ["Platform", "Web app"], ["Context", "London College of Communication"], ["Status", "Tested with users"]],
      bg: "#BFEBD8",
      ink: "#0B2A1F",
      muted: "#1D4A3A",
      ctaBg: "#0B2A1F",
      ctaInk: "#FFFFFF",
      mosaic: [{ src: "/projects/mindspace.png", alt: "MindSpace screens on phones, including the insights view" }],
    },
    sections: [
      {
        type: "stats",
        id: "problem",
        nav: "The problem",
        title: "The problem",
        paragraphs: ["Students who need support often wait a long time for it. MindSpace offers something small and calming to do in the meantime, without pretending to replace counselling."],
        stats: [
          { value: "42%", label: "Students needing counselling support" },
          { value: "12%", label: "Satisfied with the service" },
          { value: "16 weeks", label: "Average wait for counselling" },
        ],
        note: "Figures from the project’s research at London College of Communication.",
      },
      {
        type: "text",
        id: "research",
        nav: "Research",
        title: "Research",
        paragraphs: [
          "Primary research surveyed 152 students at London College of Communication before any design started.",
          "The design draws on Self-Determination Theory and cozy game design, inside a responsible design framework that explicitly rules out dark patterns.",
        ],
      },
      {
        type: "notes",
        id: "games",
        nav: "Six games",
        title: "Six games, six feelings",
        paragraphs: ["MindSpace starts by asking how you feel, then offers the game made for that feeling."],
        notes: ["Breathing Bubbles, for anxiety", "Zen Garden, for burnout", "Bubble Pop Rage, for anger", "Grow a Garden, for low mood", "One Thing at a Time, for overwhelm", "Kindness Notes, for loneliness"],
      },
      {
        type: "stats",
        id: "results",
        nav: "Results",
        title: "What testing showed",
        paragraphs: ["Students took the four-item Perceived Stress Scale (PSS-4) before and after using MindSpace, alongside a nine-question usability framework."],
        stats: [
          { value: "−2.3", label: "Average fall in PSS-4 stress scores, before and after" },
          { value: "15", label: "Students in the pre and post test" },
          { value: "152", label: "Students surveyed before designing" },
        ],
        note: "Fifteen students is a small sample, so this is an early signal rather than proof.",
      },
    ],
    next: "atlas",
  },
];

export const appProjects = projects.filter((p) => p.phone);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
