<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SiteSense Widget</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    
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
    }
    #sitesense-widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
    #sitesense-widget-button svg {
      width: 28px;
      height: 28px;
    }
    
    #sitesense-widget-container {
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
    }
    #sitesense-widget-container.open {
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
      #sitesense-widget-container {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px);
        right: 20px;
        left: 20px;
      }
    }
  </style>
</head>
<body>
  <button id="sitesense-widget-button">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
  </button>
  <div id="sitesense-widget-container">
    <iframe id="sitesense-widget-iframe" allow="microphone"></iframe>
  </div>

  <script>
    (function() {
      // Get configuration from data attributes
      var script = document.currentScript;
      var chatbotId = script.getAttribute('data-chatbot-id') || '';
      var color = script.getAttribute('data-color') || '#6366f1';
      var title = script.getAttribute('data-title') || 'Chat with us';
      var baseUrl = script.getAttribute('data-base-url') || '';

      // Build widget URL
      var widgetUrl = baseUrl + '/widget?chatbot=' + encodeURIComponent(chatbotId) + 
                     '&color=' + encodeURIComponent(color) + 
                     '&title=' + encodeURIComponent(title);

      // Set up button
      var button = document.getElementById('sitesense-widget-button');
      var container = document.getElementById('sitesense-widget-container');
      var iframe = document.getElementById('sitesense-widget-iframe');

      button.style.backgroundColor = color;
      button.innerHTML = '<svg fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>';
      
      iframe.src = widgetUrl;

      button.addEventListener('click', function() {
        container.classList.toggle('open');
        if (container.classList.contains('open')) {
          iframe.contentWindow.postMessage({ type: 'init' }, '*');
        }
      });

      // Close on escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && container.classList.contains('open')) {
          container.classList.remove('open');
        }
      });
    })();
  </script>
</body>
</html>
