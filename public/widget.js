(function() {
  'use strict';

  // Get configuration from script data attributes
  var script = document.currentScript || document.querySelector('script[data-chatbot-id]');
  if (!script) {
    console.error('SiteSense Widget: Script tag not found');
    return;
  }

  var chatbotId = script.getAttribute('data-chatbot-id') || '';
  var color = script.getAttribute('data-color') || '#6366f1';
  var title = script.getAttribute('data-title') || 'Chat with us';
  var baseUrl = script.getAttribute('data-base-url') || window.location.origin;

  if (!chatbotId) {
    console.error('SiteSense Widget: Missing chatbot ID');
    return;
  }

  // Prevent multiple initializations
  if (window.__sitesenseWidgetInitialized) return;
  window.__sitesenseWidgetInitialized = true;

  // Build widget iframe URL
  var widgetUrl = baseUrl + '/widget?chatbot=' + encodeURIComponent(chatbotId) + 
                  '&color=' + encodeURIComponent(color) + 
                  '&title=' + encodeURIComponent(title);

  // Create widget container
  var container = document.createElement('div');
  container.id = 'sitesense-widget-container';
  container.innerHTML = `
    <style>
      #sitesense-widget-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        transition: transform 0.2s, box-shadow 0.2s;
        background-color: ${color};
      }
      #sitesense-widget-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
      }
      #sitesense-widget-button svg {
        width: 28px;
        height: 28px;
      }
      #sitesense-widget-chat {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 380px;
        height: 520px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 999999;
        display: none;
        background: white;
      }
      #sitesense-widget-chat.open {
        display: block;
        animation: sitesense-slide-up 0.3s ease;
      }
      @keyframes sitesense-slide-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      #sitesense-widget-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
      @media (max-width: 480px) {
        #sitesense-widget-chat {
          width: calc(100vw - 40px);
          height: calc(100vh - 120px);
          right: 20px;
          left: 20px;
        }
      }
    </style>
    <button id="sitesense-widget-button" aria-label="Open chat">
      <svg fill="none" stroke="white" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </button>
    <div id="sitesense-widget-chat">
      <iframe id="sitesense-widget-iframe" src="${widgetUrl}" allow="microphone" title="${title}"></iframe>
    </div>
  `;

  document.body.appendChild(container);

  // Set up event handlers
  var button = container.querySelector('#sitesense-widget-button');
  var chat = container.querySelector('#sitesense-widget-chat');
  var iframe = container.querySelector('#sitesense-widget-iframe');

  button.addEventListener('click', function() {
    chat.classList.toggle('open');
    if (chat.classList.contains('open') && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'init' }, '*');
    }
  });

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && chat.classList.contains('open')) {
      chat.classList.remove('open');
    }
  });

  // Listen for messages from iframe
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'widget-resize') {
      // Handle resize if needed
    }
  });
})();
// Deployment: Thu Mar  5 19:40:33 IST 2026
