/**
 * Investigating Efforce — Site Search
 * Predictive search with fuzzy matching across pages, people, entities, topics, evidence
 */
(function() {
  'use strict';

  // ── SEARCH INDEX ──────────────────────────────────────────────────
  var INDEX = [
    // PAGES
    {t:"Home",d:"Investigation overview, key metrics, hub navigation",u:"index.html",c:"page",k:"home investigation overview key metrics hub navigation"},
    {t:"Ask Mike (AI Detective)",d:"AI investigation assistant — ask questions, get evidence-cited answers",u:"pages/detective.html",c:"page",k:"ask mike detective ai chatbot assistant investigation questions tips"},
    {t:"Key Claims",d:"Every allegation with evidence sourcing and rebuttal status",u:"pages/key-claims.html",c:"page",k:"key claims allegation evidence sourcing rebuttal status"},
    {t:"Timeline",d:"705 events from Sep 2017 to present, searchable and filterable",u:"pages/timeline.html",c:"page",k:"timeline 705 events 2017 searchable filterable chronological"},
    {t:"Entities",d:"All companies and organisations in the investigation",u:"pages/entities.html",c:"page",k:"entities companies organisations corporate structure"},
    {t:"Individuals",d:"All people involved in the Efforce investigation",u:"pages/individuals.html",c:"page",k:"individuals people persons profiles"},
    {t:"Evidence Index",d:"430 numbered exhibits — court-ready evidence repository",u:"pages/evidence.html",c:"page",k:"evidence index 430 exhibits court repository gyazo screenshots"},
    {t:"Chat Evidence",d:"6,270+ Discord & Telegram messages analysed",u:"pages/chat-evidence.html",c:"page",k:"chat evidence discord telegram messages 6270 general holders"},
    {t:"Legal Threats",d:"34 legal communications from 3 law firms",u:"pages/legal-threats.html",c:"page",k:"legal threats 34 communications law firms cease desist gdpr"},
    {t:"Class Action",d:"Case 25CV459519 — Join the class action lawsuit",u:"pages/class-action.html",c:"page",k:"class action lawsuit case 25cv459519 santa clara california join"},
    {t:"Private Investors",d:"MPI identification, $283M profits, HTX Ventures nexus",u:"pages/private-investors.html",c:"page",k:"private investors mpi 283 million profits htx ventures wallet"},
    {t:"Treasury Wallet",d:"ETW analysis, $68M+ unaccounted transfers",u:"pages/treasury-wallet.html",c:"page",k:"treasury wallet etw 68 million unaccounted transfers"},
    {t:"Vesting Analysis",d:"Vesting schedule violations, retroactive start date",u:"pages/vesting.html",c:"page",k:"vesting analysis violations retroactive start date schedule breach"},
    {t:"Public Interest",d:"Defamation Act 2013 s.4, right of reply, legal basis",u:"pages/public-interest.html",c:"page",k:"public interest defamation act 2013 right reply legal basis"},
    {t:"U.S. Nexus",d:"U.S. connections, SEC jurisdiction, California venue",u:"pages/us-nexus.html",c:"page",k:"us nexus connections sec jurisdiction california venue united states"},
    {t:"Press & Media",d:"Media coverage and press resources",u:"pages/press.html",c:"page",k:"press media coverage resources journalists"},
    {t:"Regulatory Complaints",d:"SEC, DOJ, MFSA, Malta Police complaints filed",u:"pages/regulatory-complaints.html",c:"page",k:"regulatory complaints sec doj mfsa malta police filed"},
    {t:"Aither Response",d:"Response to Aither Group communications",u:"pages/aither-response.html",c:"page",k:"aither response group communications reply"},
    {t:"Visetti Call Transcript",d:"Nov 18, 2023 call — 27 key admissions",u:"pages/visetti-call.html",c:"page",k:"visetti call transcript november 2023 27 admissions phone"},

    // INDIVIDUALS
    {t:"Jacopo Visetti",d:"Chairman & CEO, Efforce Ltd",u:"pages/individuals/jacopo-visetti.html",c:"person",k:"visetti chairman ceo jackaither discord 1609 messages profitable claim audit malta"},
    {t:"Paolo Pastore",d:"Managing Director, Efforce Ltd",u:"pages/individuals/paolo-pastore.html",c:"person",k:"pastore md managing director staylamb mr_server telegram pump dump 50 deleted messages insider"},
    {t:"Steve Wozniak",d:"Co-founder (claimed), Apple co-founder",u:"pages/individuals/steve-wozniak.html",c:"person",k:"wozniak woz apple co-founder shares abandoned ship huobi hbtc"},
    {t:"Ken Hardesty",d:"Co-founder (claimed), Gerbsman Partners",u:"pages/individuals/ken-hardesty.html",c:"person",k:"hardesty gerbsman partners auditor malta pm prime minister"},
    {t:"Jacopo Vanetti",d:"40% Shareholder & CTO",u:"pages/individuals/jacopo-vanetti.html",c:"person",k:"vanetti cto shareholder crypto keys wallet control jusp seele technology"},
    {t:"Andrea Castiglione",d:"COO & Public Spokesperson",u:"pages/individuals/andrea-castiglione.html",c:"person",k:"castiglione coo spokesperson telegram 78 quotes lies seele aither"},
    {t:"Sergio Carloni",d:"Secretary & Legal Representative",u:"pages/individuals/sergio-carloni.html",c:"person",k:"carloni secretary legal representative"},
    {t:"Corrado Catania",d:"Nominated Director",u:"pages/individuals/corrado-catania.html",c:"person",k:"catania director nominated"},
    {t:"Stefano Scozzese",d:"Advisory Board",u:"pages/individuals/stefano-scozzese.html",c:"person",k:"scozzese advisory board"},

    // ENTITIES
    {t:"Efforce Ltd (Malta)",d:"Operating entity, C 94737 — €342K losses, 0 employees",u:"pages/entities/efforce-malta.html",c:"entity",k:"efforce malta c94737 company registry zero employees revenue losses operating"},
    {t:"Efforce Ltd (Bahamas)",d:"Token issuer — no filings since 2022",u:"pages/entities/efforce-bahamas.html",c:"entity",k:"efforce bahamas token issuer scb no filings wozx"},
    {t:"AitherCO2 S.p.A.",d:"Italian parent — €319.9M tax liability, €408M losses",u:"pages/entities/aitherco2.html",c:"entity",k:"aither aitherco2 italy tax liability losses italian carbon credits spa"},
    {t:"Aither Group AG",d:"Swiss parent entity — rebranded from AitherCO2",u:"pages/entities/aither-group.html",c:"entity",k:"aither group switzerland swiss parent rebranded ag"},
    {t:"MBM Holdings AG",d:"Swiss entity — 42.5% Efforce for €510",u:"pages/entities/mbm-holding.html",c:"entity",k:"mbm holdings switzerland shares acquisition 510 euros 42.5"},
    {t:"HTX Ventures",d:"Major Private Investor — $283M profit from WOZX dumping",u:"pages/entities/htx-ventures.html",c:"entity",k:"htx ventures huobi private investor mpi 283 million dump profit major"},
    {t:"HBTC / BHEX",d:"First exchange listing — arranged by Wozniak",u:"pages/entities/hbtc.html",c:"entity",k:"hbtc bhex exchange listing first wozniak huobi closure"},
    {t:"SEELE / Digital Cash",d:"Chinese entity — Ponzi scheme connection",u:"pages/entities/seele.html",c:"entity",k:"seele digital cash chinese ponzi scheme yuanyi connection"},
    {t:"DWF Labs",d:"Market maker — token transaction patterns",u:"pages/entities/dwf-labs.html",c:"entity",k:"dwf labs market maker token transactions"},
    {t:"Ellipti",d:"Token holder entity — wallet analysis",u:"pages/entities/ellipti.html",c:"entity",k:"ellipti token holder wallet"},

    // KEY TOPICS
    {t:"Pump and Dump",d:"MPI dumped $283M in WOZX — Pastore confirmed privately",u:"pages/private-investors.html",c:"topic",k:"pump dump dumped private investor mpi selling 283 million"},
    {t:"Vesting Violations",d:"No smart contract enforcement, retroactive start date, breached schedule",u:"pages/vesting.html",c:"topic",k:"vesting violation breach schedule retroactive smart contract enforcement"},
    {t:"Treasury Wallet (ETW)",d:"$68M+ unaccounted transfers from Efforce Treasury",u:"pages/treasury-wallet.html",c:"topic",k:"etw treasury wallet 68 million unaccounted transfers efforce"},
    {t:"Buyback Promises",d:"6 promises, zero executed — admitted no profits to fund them",u:"pages/chat-evidence.html",c:"topic",k:"buyback promise buy back token revenue profits never executed six"},
    {t:"Bithumb Delisting",d:'WOZX delisted Nov 2023 after team said "no reason to be delisted"',u:"pages/chat-evidence.html",c:"topic",k:"bithumb delisting delisted exchange november 2023 warning reconfirmed"},
    {t:"Whitepaper Removal",d:"Founding document removed (404), no replacement published",u:"pages/chat-evidence.html",c:"topic",k:"whitepaper removal deleted 404 founding document removed"},
    {t:"Zero Employees",d:"Malta filings: 0 employees, €0 staff costs (2019-2022)",u:"pages/entities/efforce-malta.html",c:"topic",k:"zero employees staff costs none nobody payroll malta filings"},
    {t:"Zero Revenue",d:"€0 platform revenue recorded in any filing",u:"pages/entities/efforce-malta.html",c:"topic",k:"zero revenue no income no earnings no profit platform"},
    {t:"$50M Off-Take Agreement",d:'"Never drew the funds, as not needed" — Visetti',u:"pages/individuals/jacopo-visetti.html#discord-chat",c:"topic",k:"50 million offtake off-take agreement funds not needed visetti"},
    {t:"SEELE Connection",d:"Chinese Ponzi scheme linked to WOZX through wallet analysis",u:"pages/entities/seele.html",c:"topic",k:"seele ponzi chinese connection digital cash yuanyi wallet"},
    {t:'Wozniak "Abandoned Ship"',d:"Pastore privately confirmed Woz completely disengaged",u:"pages/individuals/steve-wozniak.html",c:"topic",k:"wozniak abandoned ship disengaged left quit pastore"},
    {t:"Deleted Messages (50)",d:"Pastore deleted 50 Telegram messages between exports — spoliation",u:"pages/individuals/paolo-pastore.html#deleted-messages",c:"topic",k:"deleted messages 50 telegram spoliation evidence destruction pastore"},
    {t:"1,609 Discord Messages",d:"Visetti private chat — 22 bombshell revelations",u:"pages/individuals/jacopo-visetti.html#discord-chat",c:"topic",k:"discord 1609 messages private chat visetti bombshell revelations 22"},
    {t:"Visetti Call (Nov 2023)",d:"27 key admissions in phone call with Copley",u:"pages/visetti-call.html",c:"topic",k:"visetti call phone november 2023 27 admissions transcript copley"},
    {t:"No Blockchain",d:'Visetti: "we are not a crypto as we do not have a blockchain"',u:"pages/individuals/jacopo-visetti.html#discord-chat",c:"topic",k:"no blockchain not crypto admission visetti"},
    {t:"PI Identity — US Citizens",d:'"Shareholders and directors are US citizens" — Visetti',u:"pages/individuals/jacopo-visetti.html#discord-chat",c:"topic",k:"private investor identity us citizens american shareholders directors visetti"},
    {t:"California Class Action",d:"Case 25CV459519 — Superior Court, Santa Clara County",u:"pages/class-action.html",c:"topic",k:"california class action lawsuit case 25cv459519 santa clara court legal"},
    {t:"Token Holders Not Investors",d:'Team gaslighting: "token holders are not investors"',u:"pages/chat-evidence.html",c:"topic",k:"token holders not investors gaslighting rights stock wozniak"},
    {t:"Unanswered Questions",d:"8 of 9 formal questions remain unanswered",u:"pages/chat-evidence.html",c:"topic",k:"unanswered questions 9 point questionnaire formal copley eight"},
    {t:"Channel Death",d:"Discord General Holders went silent Aug 2024",u:"pages/chat-evidence.html",c:"topic",k:"channel death discord dead silent zero messages august 2024"},
    {t:"Staylamb Account",d:"WizX/Efforce community manager — 529 messages, used by Pastore",u:"pages/individuals/paolo-pastore.html#discord-public",c:"topic",k:"staylamb wizx community manager discord account pastore 529"},
    {t:"Wozniak Outreach (12+ Emails)",d:"15 months of direct emails to Wozniak — zero responses, one block",u:"pages/individuals/steve-wozniak.html#outreach",c:"topic",k:"wozniak outreach emails cameo blocked silence kenh woz seamus inquiry"},
    {t:"Hardesty Gatekeeper",d:"kenh@woz.org — Wozniak redirected all contact through Hardesty",u:"pages/individuals/ken-hardesty.html#outreach",c:"topic",k:"hardesty gatekeeper kenh woz email filter redirect contact"},

    // EVIDENCE CATEGORIES
    {t:"ACT — Company Accounts",d:"17 exhibits: registry filings from Malta, Bahamas, Italy, Switzerland",u:"pages/evidence.html",c:"evidence",k:"act accounts filings registry exhibits company malta bahamas italy switzerland"},
    {t:"CHN — On-Chain Evidence",d:"25 exhibits: Etherscan records, wallet analysis, token transfers",u:"pages/evidence.html",c:"evidence",k:"chn on-chain blockchain etherscan wallet exhibits transfers"},
    {t:"PUB — Public Communications",d:"196 exhibits: Telegram, Discord, tweets, social media",u:"pages/evidence.html",c:"evidence",k:"pub public communications telegram discord tweets exhibits social media"},
    {t:"PRI — Private Disclosures",d:"32 exhibits: Discord DMs, Telegram DMs, call transcripts",u:"pages/evidence.html",c:"evidence",k:"pri private disclosures dm direct message exhibits call transcript"},
    {t:"LGL — Legal Correspondence",d:"29 exhibits: C&D letters, GDPR demands, solicitor correspondence",u:"pages/evidence.html",c:"evidence",k:"lgl legal correspondence cease desist gdpr exhibits solicitor"},
    {t:"TML — Timeline Evidence",d:"87 exhibits: chronological evidence screenshots",u:"pages/evidence.html",c:"evidence",k:"tml timeline evidence chronological exhibits screenshots"},
    {t:"GEN — General Evidence",d:"44 exhibits: cross-referenced evidence library items",u:"pages/evidence.html",c:"evidence",k:"gen general evidence library exhibits cross-referenced"}
  ];

  // ── CATEGORY LABELS & ICONS ───────────────────────────────────────
  var CAT_META = {
    page:     {label:'PAGE',     color:'#64748b', icon:'◻'},
    person:   {label:'PERSON',   color:'#dc2626', icon:'●'},
    entity:   {label:'ENTITY',   color:'#16a34a', icon:'◆'},
    topic:    {label:'TOPIC',    color:'#7c3aed', icon:'▲'},
    evidence: {label:'EXHIBIT',  color:'#92400e', icon:'■'}
  };

  // ── FUZZY MATCH ───────────────────────────────────────────────────
  function fuzzyScore(query, text) {
    query = query.toLowerCase();
    text = text.toLowerCase();

    // Exact substring match — highest score
    if (text.indexOf(query) !== -1) return 100;

    // Word-start match (each query word starts a word in text)
    var qWords = query.split(/\s+/);
    var tWords = text.split(/\s+/);
    var wordMatches = 0;
    for (var i = 0; i < qWords.length; i++) {
      for (var j = 0; j < tWords.length; j++) {
        if (tWords[j].indexOf(qWords[i]) === 0) { wordMatches++; break; }
      }
    }
    if (wordMatches === qWords.length) return 80;
    if (wordMatches > 0) return 40 + (wordMatches / qWords.length) * 30;

    // Character sequence match (all chars appear in order)
    var qi = 0;
    for (var ci = 0; ci < text.length && qi < query.length; ci++) {
      if (text[ci] === query[qi]) qi++;
    }
    if (qi === query.length) return 20 + (query.length / text.length) * 20;

    return 0;
  }

  function search(query) {
    if (!query || query.length < 2) return [];

    var results = [];
    for (var i = 0; i < INDEX.length; i++) {
      var item = INDEX[i];
      // Score against title, description, and keywords
      var titleScore = fuzzyScore(query, item.t) * 2; // title weighted 2x
      var descScore = fuzzyScore(query, item.d);
      var kwScore = fuzzyScore(query, item.k);
      var best = Math.max(titleScore, descScore, kwScore);

      if (best > 20) {
        results.push({item: item, score: best});
      }
    }

    results.sort(function(a, b) { return b.score - a.score; });
    return results.slice(0, 8);
  }

  // ── URL RESOLUTION ────────────────────────────────────────────────
  function resolveUrl(rawUrl) {
    // Detect current page depth from the search container's data attribute
    var depth = (document.getElementById('site-search') || {}).getAttribute('data-depth') || '0';
    depth = parseInt(depth, 10);

    // rawUrl is always relative to site root (e.g. "pages/timeline.html")
    if (depth === 0) return rawUrl;                          // root
    if (depth === 1) return '../' + rawUrl;                  // pages/
    if (depth === 2) return '../../' + rawUrl;               // pages/individuals/
    return rawUrl;
  }

  // ── RENDER ────────────────────────────────────────────────────────
  function renderResults(results) {
    var dropdown = document.getElementById('search-dropdown');
    if (!dropdown) return;

    if (results.length === 0) {
      dropdown.innerHTML = '<div class="ss-empty">No results found</div>';
      dropdown.classList.add('open');
      return;
    }

    var html = '';
    for (var i = 0; i < results.length; i++) {
      var r = results[i].item;
      var meta = CAT_META[r.c] || CAT_META.page;
      var url = resolveUrl(r.u);

      html += '<a href="' + url + '" class="ss-result" tabindex="0">' +
        '<span class="ss-cat" style="background:' + meta.color + ';">' + meta.icon + ' ' + meta.label + '</span>' +
        '<span class="ss-title">' + escapeHtml(r.t) + '</span>' +
        '<span class="ss-desc">' + escapeHtml(r.d) + '</span>' +
        '</a>';
    }

    dropdown.innerHTML = html;
    dropdown.classList.add('open');
  }

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── KEYBOARD NAV ──────────────────────────────────────────────────
  var activeIdx = -1;

  function handleKeydown(e) {
    var dropdown = document.getElementById('search-dropdown');
    if (!dropdown || !dropdown.classList.contains('open')) return;

    var items = dropdown.querySelectorAll('.ss-result');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
      updateActive(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      updateActive(items);
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      items[activeIdx].click();
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  }

  function updateActive(items) {
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('ss-active', i === activeIdx);
    }
  }

  function closeDropdown() {
    var dropdown = document.getElementById('search-dropdown');
    if (dropdown) dropdown.classList.remove('open');
    activeIdx = -1;
  }

  // ── INIT ──────────────────────────────────────────────────────────
  function init() {
    var container = document.getElementById('site-search');
    if (!container) return;

    var input = container.querySelector('.ss-input');
    if (!input) return;

    input.addEventListener('input', function() {
      activeIdx = -1;
      var q = this.value.trim();
      if (q.length < 2) { closeDropdown(); return; }
      var results = search(q);
      renderResults(results);
    });

    input.addEventListener('keydown', handleKeydown);
    input.addEventListener('focus', function() {
      if (this.value.trim().length >= 2) {
        var results = search(this.value.trim());
        renderResults(results);
      }
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!container.contains(e.target)) closeDropdown();
    });

    // Keyboard shortcut: / to focus search
    document.addEventListener('keydown', function(e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        input.focus();
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
