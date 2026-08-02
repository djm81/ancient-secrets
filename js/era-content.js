export const BABYLON_ID = 'babylon';

export const FINOPS_DOMAINS = Object.freeze({
  understand: 'Understand Usage & Cost',
  value: 'Quantify Business Value',
  optimize: 'Optimize Usage & Cost',
  practice: 'Manage the FinOps Practice'
});

export const BABYLON_CONTENT = Object.freeze({
  id: BABYLON_ID,
  title: 'Babylon, c. 1750 BCE',
  mentor: 'Nabu-etir, temple scribe of Esagila',
  invention: 'anemometer',
  art: Object.freeze({
    backdrop: 'assets/eras/babylon/temple-ledger.jpg?rev=v8',
    mentor: 'assets/eras/babylon/temple-scribe.jpg?rev=v8',
    tableau: 'assets/eras/babylon/grain-tablets.jpg?rev=v8',
    alt: Object.freeze({
      backdrop: 'A sunlit Babylonian temple storehouse, its mud-brick walls framing grain jars and a canal beyond.',
      mentor: 'A Babylonian temple scribe sits at a low table with a reed stylus and clay tablet.',
      tableau: 'Clay tablets, barley measures, balance stones, and a reed stylus arranged for a temple ledger audit.'
    })
  }),
  clues: Object.freeze([
    Object.freeze({ id: 'deliveries', title: 'Jar seals', text: 'Three sealed deliveries reached Esagila: 40, 30, and 20 gur of grain. The storehouse count should agree with the tablets.' }),
    Object.freeze({ id: 'ledger', title: 'The damp tablet', text: 'The copyist pressed one entry badly. A true ledger adds the three sealed deliveries, rather than trusting a blurred line.' }),
    Object.freeze({ id: 'law', title: 'The stele of the law', text: 'For silver, the lawful yearly charge is one fifth: 20 shekels on a loan of 100. A larger claim is not to be entered.' })
  ]),
  hints: Object.freeze({
    nudge: 'Begin with the jar seals. A temple ledger should agree with what actually arrived.',
    hint: 'Add the three deliveries, then compare the total to the offered tablet. Silver may grow by one fifth, not more.',
    reveal: 'Choose the tablet totaling 90 gur and the silver rate of 20 shekels per hundred.'
  }),
  failure: Object.freeze({
    'unbalanced-ledger': 'The seals and the tablet disagree. Before a steward can allocate grain, the record must describe what actually arrived.',
    'illegal-interest': 'The tablet asks more than the stele permits. A useful record is not enough when the rule that governs it is ignored.',
    'incomplete-plan': 'A scribe needs both a reconciled storehouse total and a lawful silver rate before the entry can be sealed.'
  }),
  debrief: Object.freeze([
    Object.freeze({ prompt: 'Why did the jar seals matter before any grain could be promised onward?', options: Object.freeze([
      Object.freeze({ text: 'They made the recorded amount trustworthy enough to allocate.', correct: true, feedback: 'Yes. The seals grounded the tablet in observed deliveries: the first discipline is knowing what is truly present.' }),
      Object.freeze({ text: 'They made the jars more valuable than silver.', correct: false, feedback: 'Not quite. The seals establish reliable evidence; they do not change the grain’s value.' }),
      Object.freeze({ text: 'They let the scribe avoid keeping a ledger.', correct: false, feedback: 'A ledger is still needed. The seals are evidence used to reconcile it.' })] ) }),
    Object.freeze({ prompt: 'What did the interest cap protect the temple from?', options: Object.freeze([
      Object.freeze({ text: 'A rule-free claim that shifted unfair cost onto a borrower.', correct: true, feedback: 'Exactly. The cap is governance: a shared rule that makes a charge inspectable and bounded.' }),
      Object.freeze({ text: 'The need to count grain.', correct: false, feedback: 'Counting remains essential; the cap governs the loan’s price, not the existence of the grain.' }),
      Object.freeze({ text: 'The weather at harvest.', correct: false, feedback: 'Weather affects supply, but the stele speaks to the terms of a silver loan.' })] ) }),
    Object.freeze({ prompt: 'Which practice carries the scribe’s work across centuries?', options: Object.freeze([
      Object.freeze({ text: 'Make observed cost and use visible before deciding.', correct: true, feedback: 'Yes. Clear evidence, allocation, and anomaly checks are the beginning of good financial operations.' }),
      Object.freeze({ text: 'Choose the most ornate tablet.', correct: false, feedback: 'An ornament may impress, but it cannot reconcile a storehouse.' }),
      Object.freeze({ text: 'Keep the rules secret from borrowers.', correct: false, feedback: 'The stele is public precisely so a claim can be judged against a shared rule.' })] ) })
  ])
});

export const ERAS = Object.freeze({ [BABYLON_ID]: BABYLON_CONTENT });
