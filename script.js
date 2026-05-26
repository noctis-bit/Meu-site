document.addEventListener('DOMContentLoaded', () => {
  
  // 1. TOUCH-DEVICE-SAFE CUSTOM CURSOR
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');

  if (!isTouchDevice && cursor && ring) {
    document.body.classList.add('custom-cursor-active');
    
    let mx = 0, my = 0; // Mouse coords
    let rx = 0, ry = 0; // Ring coords

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
      cursor.style.transform = 'translate(-50%, -50%)';
    });

    // Smooth lerp animation for the cursor ring
    function animateRing() {
      const lerpFactor = 0.15;
      rx += (mx - rx) * lerpFactor;
      ry += (my - ry) * lerpFactor;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      ring.style.transform = 'translate(-50%, -50%)';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Scale cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .social-btn, .project-link, #about .terminal');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        ring.style.width = '52px';
        ring.style.height = '52px';
        ring.style.borderColor = 'rgba(0, 229, 160, 0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'var(--accent)';
      });
    });
  }

  // 2. PAGE SCROLL PROGRESS BAR
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const percentage = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${percentage}%`;
    }
  });

  // 3. AUTO-TYPING SUBHEADING
  const words = ['Front-end.', 'Back-end.', 'Full Stack.', 'APIs.', 'UI/UX.'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingEl = document.getElementById('typing');

  function typeEffect() {
    if (!typingEl) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000); // pause at full word
        return;
      }
    }
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
  typeEffect();

  // 4. INTERACTIVE TERMINAL EMULATOR
  const terminalBody = document.getElementById('terminal-body');
  const hiddenInput = document.getElementById('terminal-hidden-input');
  const inputBuffer = document.getElementById('t-input');
  const currentInputLine = document.getElementById('current-input-line');

  if (terminalBody && hiddenInput && inputBuffer) {
    // Focus hidden input on clicking terminal
    terminalBody.addEventListener('click', () => {
      hiddenInput.focus();
    });

    // Update input buffer on typing
    hiddenInput.addEventListener('input', () => {
      inputBuffer.textContent = hiddenInput.value;
    });

    // Command handling
    hiddenInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const command = hiddenInput.value.trim().toLowerCase();
        hiddenInput.value = '';
        inputBuffer.textContent = '';
        
        executeCommand(command);
      }
    });

    function executeCommand(cmd) {
      // 1. Create a snapshot of the current line with command entered
      const lineEcho = document.createElement('div');
      lineEcho.className = 'terminal-line';
      lineEcho.innerHTML = `<span class="t-prompt">guest@endel:~$</span> <span class="t-cmd">${escapeHTML(cmd)}</span>`;
      
      // Insert command echo before the input line
      terminalBody.insertBefore(lineEcho, currentInputLine);

      // 2. Generate response block
      const responseBlock = document.createElement('div');
      responseBlock.className = 'terminal-output';

      if (cmd !== '') {
        switch (cmd) {
          case 'help':
            responseBlock.innerHTML = `
Comandos disponíveis:
  <span class="t-key">about</span>     - Quem é Endel Azevedo?
  <span class="t-key">skills</span>    - Stack técnica e ferramentas
  <span class="t-key">projects</span>  - Principais projetos recentes
  <span class="t-key">contact</span>   - Links de contato
  <span class="t-key">cat</span>       - Ler arquivos (ex: <span class="t-val">cat welcome.txt</span>, <span class="t-val">cat profile.json</span>)
  <span class="t-key">clear</span>     - Limpar o terminal
            `.trim().replace(/\n/g, '<br/>');
            break;
          
          case 'about':
          case 'sobre':
            responseBlock.innerHTML = `
Endel Azevedo é um Full Stack Developer brasileiro focado em engenharia de software de ponta.
Gosta de resolver problemas reais, criar interfaces fluidas (UX) e arquitetar APIs de alta performance.
            `.trim().replace(/\n/g, '<br/>');
            break;

          case 'skills':
          case 'stack':
            responseBlock.innerHTML = `
<span class="t-key">Frontend:</span> React, TypeScript, JavaScript, HTML5, CSS3
<span class="t-key">Backend:</span> Node.js, Python, Express, REST APIs
<span class="t-key">Bancos de Dados:</span> PostgreSQL, MySQL, MongoDB, SQL
<span class="t-key">DevOps:</span> Git, Docker, Linux, VS Code, CI/CD
            `.trim().replace(/\n/g, '<br/>');
            break;

          case 'projects':
          case 'projetos':
            responseBlock.innerHTML = `
Projetos principais:
  1. <span class="t-key">PromoVIPBR</span> - Cupom & Descontos (Vercel: <a href="https://promovip-br.vercel.app/" target="_blank" class="t-url">link</a>)
  2. <span class="t-key">Palavra+</span> - Bíblia + IA (Vercel: <a href="https://palavra-premium.vercel.app/" target="_blank" class="t-url">link</a>)
  3. <span class="t-key">Amanda Ribeiro</span> - Moda Premium (Vercel: <a href="https://amanda-ribeiro-feminina.vercel.app/" target="_blank" class="t-url">link</a>)
  4. <span class="t-key">VLG Moda</span> - E-commerce (Vercel: <a href="https://projeto-vgl.vercel.app/" target="_blank" class="t-url">link</a>)
            `.trim().replace(/\n/g, '<br/>');
            break;

          case 'contact':
          case 'contato':
            responseBlock.innerHTML = `
Contatos:
  - GitHub: <a href="https://github.com/noctis-bit" target="_blank" class="t-url">github.com/noctis-bit</a>
  - LinkedIn: <a href="https://www.linkedin.com/in/endel-azevedo-842690319/" target="_blank" class="t-url">linkedin.com/in/endel-azevedo-842690319</a>
  - WhatsApp: <a href="https://wa.me/5521993564564" target="_blank" class="t-url">+55 21 99356-4564</a>
            `.trim().replace(/\n/g, '<br/>');
            break;

          case 'cat welcome.txt':
            responseBlock.innerHTML = `Bem-vindo ao terminal interativo do Endel! Digite <span class="t-val">help</span> para listar os comandos.`;
            break;

          case 'cat profile.json':
            responseBlock.innerHTML = `
{
  <span class="t-key">"name"</span>: <span class="t-str">"Endel Azevedo"</span>,
  <span class="t-key">"role"</span>: <span class="t-str">"Full Stack Developer"</span>,
  <span class="t-key">"location"</span>: <span class="t-str">"Brasil 🇧🇷"</span>,
  <span class="t-key">"focus"</span>: [<span class="t-str">"Web Dev"</span>, <span class="t-str">"APIs & Backend"</span>, <span class="t-str">"UX/UI"</span>],
  <span class="t-key">"open_to_work"</span>: <span class="t-val">true</span>
}
            `.trim().replace(/\n/g, '<br/>');
            break;

          case 'cat':
            responseBlock.innerHTML = `Uso: <span class="t-val">cat [nome_do_arquivo]</span>. Arquivos: <span class="t-str">welcome.txt</span>, <span class="t-str">profile.json</span>`;
            break;

          case 'clear':
          case 'limpar':
            // Delete all previous echoes and output blocks
            const elements = Array.from(terminalBody.children);
            elements.forEach(el => {
              if (el !== currentInputLine) {
                el.remove();
              }
            });
            return;

          default:
            responseBlock.innerHTML = `Comando não reconhecido: <span class="t-str">${escapeHTML(cmd)}</span>. Digite <span class="t-val">help</span> para ajuda.`;
        }
        
        terminalBody.insertBefore(responseBlock, currentInputLine);
      }
      
      // Auto-scroll to the bottom
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
      );
    }
  }

  // 5. 3D TILT EFFECT ON CARDS
  const cards = document.querySelectorAll('.project-card[data-tilt]');
  if (!isTouchDevice) {
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position inside element
        const y = e.clientY - rect.top;  // y position inside element
        
        const width = rect.width;
        const height = rect.height;
        
        // Convert coords to percentage rotation values
        const rotateY = ((x / width) - 0.5) * 12; // tilt max 12deg
        const rotateX = -((y / height) - 0.5) * 12; 

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.transition = 'transform 0.05s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.5s ease';
      });
    });
  }

  // 6. INTERSECTION OBSERVER FOR FADE-IN
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Add a slight delay staggering the animations
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});
