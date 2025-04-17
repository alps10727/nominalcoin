
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Uygulamayı daha güvenli bir şekilde başlatmak için try-catch ekleyelim
try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error("Root element bulunamadı!");
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  console.log("Uygulama başarıyla başlatıldı");
} catch (error) {
  console.error("Uygulama başlatılırken hata oluştu:", error);
  
  // Kullanıcıya hata durumunu gösterecek basit bir arayüz
  const errorDiv = document.createElement('div');
  errorDiv.style.padding = '20px';
  errorDiv.style.backgroundColor = '#f8d7da';
  errorDiv.style.color = '#721c24';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.margin = '20px';
  errorDiv.style.textAlign = 'center';
  errorDiv.innerHTML = `
    <h2>Uygulama başlatılamadı</h2>
    <p>Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
    <button onclick="window.location.reload()" style="padding: 8px 16px; background: #721c24; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Sayfayı Yenile
    </button>
  `;
  
  document.body.appendChild(errorDiv);
}
