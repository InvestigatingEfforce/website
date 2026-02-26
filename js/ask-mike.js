/* ============================================================
   ASK MIKE — Floating Chat Popup Widget
   Self-contained: injects own HTML + CSS into the DOM.
   Requires: mike-config.js loaded first (provides MIKE_CONFIG).
   Auto-hides on detective.html (full page version).
   ============================================================ */

(function () {
  'use strict';

  // Don't show on detective.html (full chat page already exists)
  if (location.pathname.indexOf('detective.html') !== -1) return;

  // Detect depth for resolving page links in AI responses
  var depth = 0;
  var path = location.pathname;
  if (path.indexOf('/pages/entities/') !== -1 || path.indexOf('/pages/individuals/') !== -1) {
    depth = 2;
  } else if (path.indexOf('/pages/') !== -1) {
    depth = 1;
  }
  var pagePrefix = depth === 0 ? 'pages/' : depth === 2 ? '../' : '';

  // ── INJECT CSS ───────────────────────────────────────────────
  var css = `
    .mike-bubble{position:fixed;bottom:24px;right:24px;z-index:9999;width:64px;height:64px;border-radius:50%;background:var(--black,#111);border:3px solid var(--accent-red,#c41e1e);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.25);transition:transform .2s,box-shadow .2s}
    .mike-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(0,0,0,.35)}
    .mike-bubble img{width:38px;height:38px;border-radius:50%;object-fit:cover}
    .mike-bubble__pulse{position:absolute;top:-3px;right:-3px;width:16px;height:16px;background:#22c55e;border:2px solid var(--black,#111);border-radius:50%;animation:mike-pulse 2s infinite}
    @keyframes mike-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}

    .mike-panel{position:fixed;bottom:100px;right:24px;z-index:9998;width:380px;max-height:520px;background:var(--white,#fff);border:1px solid var(--grey-200,#e5e5e5);box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;opacity:0;visibility:hidden;transform:translateY(16px);transition:opacity .25s,transform .25s,visibility .25s}
    .mike-panel--open{opacity:1;visibility:visible;transform:translateY(0)}

    .mike-panel__head{background:var(--black-soft,#1a1a1a);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0}
    .mike-panel__avatar{width:36px;height:36px;background:var(--accent-red,#c41e1e);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    .mike-panel__info{flex:1}
    .mike-panel__name{font-family:var(--font-display,Georgia,serif);font-weight:900;font-size:14px}
    .mike-panel__sub{font-family:var(--font-mono,monospace);font-size:9px;color:var(--grey-400,#aaa);text-transform:uppercase;letter-spacing:.06em}
    .mike-panel__status{width:7px;height:7px;background:#22c55e;border-radius:50%;display:inline-block;margin-left:5px;animation:mike-pulse 2s infinite}
    .mike-panel__close{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:0 4px;line-height:1;opacity:.6;transition:opacity .15s}
    .mike-panel__close:hover{opacity:1}

    .mike-panel__msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:200px;max-height:320px}
    .mike-msg{max-width:88%;line-height:1.55;font-size:13px}
    .mike-msg--bot{align-self:flex-start;background:var(--grey-50,#f9f9f9);border:1px solid var(--grey-200,#e5e5e5);padding:10px 14px;border-radius:0 12px 12px 12px}
    .mike-msg--user{align-self:flex-end;background:var(--black-soft,#1a1a1a);color:#fff;padding:10px 14px;border-radius:12px 0 12px 12px}
    .mike-msg--typing{align-self:flex-start;background:var(--grey-50,#f9f9f9);border:1px solid var(--grey-200,#e5e5e5);padding:10px 14px;border-radius:0 12px 12px 12px;color:var(--grey-400,#aaa);font-style:italic;font-size:12px}
    .mike-msg a{color:var(--accent-red,#c41e1e);text-decoration:underline;font-weight:600}
    .mike-msg strong{color:var(--accent-red,#c41e1e)}
    .mike-msg code{font-family:var(--font-mono,monospace);font-size:10px;background:var(--grey-100,#f3f3f3);padding:1px 5px}

    .mike-panel__quick{padding:0 16px 12px;display:flex;flex-direction:column;gap:4px;flex-shrink:0}
    .mike-quick-btn{display:block;width:100%;text-align:left;padding:7px 10px;border:1px solid var(--grey-200,#e5e5e5);background:var(--white,#fff);font-family:var(--font-body,Arial,sans-serif);font-size:11px;color:var(--grey-700,#444);cursor:pointer;transition:border-color .15s,color .15s}
    .mike-quick-btn:hover{border-color:var(--accent-red,#c41e1e);color:var(--accent-red,#c41e1e)}

    .mike-panel__input{display:flex;gap:0;border-top:1px solid var(--grey-200,#e5e5e5);flex-shrink:0}
    .mike-panel__input input{flex:1;border:none;padding:12px 14px;font-family:var(--font-body,Arial,sans-serif);font-size:13px;outline:none;background:transparent}
    .mike-panel__input input::placeholder{color:var(--grey-400,#aaa)}
    .mike-panel__input button{background:var(--accent-red,#c41e1e);color:#fff;border:none;padding:0 16px;font-family:var(--font-mono,monospace);font-size:10px;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;font-weight:700;transition:background .15s}
    .mike-panel__input button:hover{background:#c0392b}
    .mike-panel__input button:disabled{background:var(--grey-300,#ccc);cursor:not-allowed}

    .mike-panel__foot{padding:6px 16px 10px;font-family:var(--font-mono,monospace);font-size:8px;color:var(--grey-400,#aaa);text-align:center;flex-shrink:0;border-top:1px solid var(--grey-100,#f3f3f3)}
    .mike-panel__foot a{color:var(--accent-red,#c41e1e)}

    @media(max-width:480px){
      .mike-panel{right:0;bottom:0;width:100%;max-height:80vh;border:none;border-top:1px solid var(--grey-200,#e5e5e5)}
      .mike-bubble{bottom:16px;right:16px;width:56px;height:56px}
      .mike-bubble img{width:32px;height:32px}
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Resolve favicon path ─────────────────────────────────────
  var iconPath = depth === 0 ? 'images/favicon.png' : depth === 1 ? '../images/favicon.png' : '../../images/favicon.png';

  // ── INJECT HTML ──────────────────────────────────────────────
  var widget = document.createElement('div');
  widget.id = 'mike-widget';
  widget.innerHTML = `
    <div class="mike-bubble" id="mike-bubble" title="Ask Mike — AI Investigation Assistant">
      <img src="${iconPath}" alt="Ask Mike">
      <span class="mike-bubble__pulse"></span>
    </div>
    <div class="mike-panel" id="mike-panel">
      <div class="mike-panel__head">
        <div class="mike-panel__avatar">&#128373;</div>
        <div class="mike-panel__info">
          <div class="mike-panel__name">Ask Mike <span class="mike-panel__status"></span></div>
          <div class="mike-panel__sub">AI Investigation Assistant</div>
        </div>
        <button class="mike-panel__close" id="mike-close">&times;</button>
      </div>
      <div class="mike-panel__msgs" id="mike-msgs">
        <div class="mike-msg mike-msg--bot">
          <strong>&#128373; Hey, I'm Mike.</strong><br><br>
          I'm an AI trained on the complete Efforce/WOZX investigation. What are you looking for?
        </div>
      </div>
      <div class="mike-panel__quick" id="mike-quick">
        <button class="mike-quick-btn" data-q="Who are the key people involved?">Who are the key people involved?</button>
        <button class="mike-quick-btn" data-q="What happened to the treasury wallet?">What happened to the treasury wallet?</button>
        <button class="mike-quick-btn" data-q="How much did investors lose?">How much did investors lose?</button>
      </div>
      <div class="mike-panel__input">
        <input type="text" id="mike-input" placeholder="Ask about the investigation&hellip;" autocomplete="off">
        <button id="mike-send">Send</button>
      </div>
      <div class="mike-panel__foot">
        AI assistant &mdash; may contain errors. <a href="${pagePrefix}evidence.html">Verify evidence</a> &middot; <a href="${pagePrefix}detective.html">Full chat</a>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // ── ELEMENTS ─────────────────────────────────────────────────
  var bubble = document.getElementById('mike-bubble');
  var panel = document.getElementById('mike-panel');
  var closeBtn = document.getElementById('mike-close');
  var msgsEl = document.getElementById('mike-msgs');
  var inputEl = document.getElementById('mike-input');
  var sendBtn = document.getElementById('mike-send');
  var quickWrap = document.getElementById('mike-quick');

  var conversation = [];
  var isProcessing = false;
  var isOpen = false;

  // ── TOGGLE ───────────────────────────────────────────────────
  bubble.addEventListener('click', function () {
    isOpen = !isOpen;
    panel.classList.toggle('mike-panel--open', isOpen);
    if (isOpen) inputEl.focus();
  });

  closeBtn.addEventListener('click', function () {
    isOpen = false;
    panel.classList.remove('mike-panel--open');
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      panel.classList.remove('mike-panel--open');
    }
  });

  // ── SEND MESSAGE ─────────────────────────────────────────────
  function send() {
    var text = inputEl.value.trim();
    if (!text || isProcessing) return;

    inputEl.value = '';
    addMsg(text, 'user');
    conversation.push({ role: 'user', content: text });

    // Hide quick questions after first message
    if (quickWrap) {
      quickWrap.style.display = 'none';
    }

    isProcessing = true;
    sendBtn.disabled = true;

    var typingEl = addMsg('\u{1F575} Mike is investigating...', 'typing');

    callAPI().then(function (response) {
      typingEl.remove();
      addMsg(response, 'bot');
      conversation.push({ role: 'assistant', content: response });
    }).catch(function (err) {
      typingEl.remove();
      addMsg('Sorry, I hit a snag. ' + (err.message || 'Try again in a moment.'), 'bot');
    }).finally(function () {
      isProcessing = false;
      sendBtn.disabled = false;
    });
  }

  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  // ── QUICK QUESTIONS ──────────────────────────────────────────
  quickWrap.addEventListener('click', function (e) {
    var btn = e.target.closest('.mike-quick-btn');
    if (!btn) return;
    inputEl.value = btn.dataset.q;
    send();
  });

  // ── API CALL ─────────────────────────────────────────────────
  async function callAPI() {
    var cfg = window.MIKE_CONFIG || {};
    var endpoint = cfg.endpoint || 'https://api.anthropic.com/v1/messages';
    var msgs = conversation.slice(-10);

    var body = {
      model: cfg.model || 'claude-sonnet-4-20250514',
      max_tokens: cfg.maxTokens || 1000,
      system: cfg.systemPrompt || '',
      messages: msgs
    };

    var response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error('API error: ' + response.status);
    }

    var data = await response.json();
    var text = data.content
      .filter(function (item) { return item.type === 'text'; })
      .map(function (item) { return item.text; })
      .join('\n');

    return text || "I couldn't generate a response. Try rephrasing your question.";
  }

  // ── ADD MESSAGE TO UI ────────────────────────────────────────
  function addMsg(text, type) {
    var div = document.createElement('div');
    div.className = 'mike-msg mike-msg--' + type;

    if (type === 'bot') {
      var html = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, label, url) {
          // Resolve relative page links based on depth
          if (url.indexOf('http') !== 0 && url.indexOf('/') !== 0) {
            url = pagePrefix + url;
          }
          return '<a href="' + url + '">' + label + '</a>';
        })
        .replace(/\n/g, '<br>');
      div.innerHTML = html;
    } else if (type === 'typing') {
      div.innerHTML = '<em>' + text + '</em>';
    } else {
      div.textContent = text;
    }

    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

})();
