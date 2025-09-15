document.addEventListener('DOMContentLoaded', () => {
  const synth = window.speechSynthesis;
  const voice = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = document.getElementById('language').value === 'en' ? 'en-US' : 'es-ES';
    synth.speak(u);
  };

  voice('Bienvenido al perfil del estudiante. Completa tus datos para comenzar.');

  const progressFill = document.getElementById('progressFill');
  const pointsLabel = document.getElementById('points');
  const emailInput = document.getElementById('email');
  let points = 0;

  // Lectura con reconocimiento de voz
  document.getElementById('startReading').addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('El reconocimiento de voz no está soportado');
      return;
    }
    const expected = document.getElementById('readingText').textContent.trim().toLowerCase();
    const recog = new SpeechRecognition();
    recog.lang = 'es-ES';
    recog.onresult = (e) => {
      const spoken = e.results[0][0].transcript.toLowerCase();
      document.getElementById('readingResult').textContent = spoken;
      const errors = expected.split(' ').filter((w, i) => w !== spoken.split(' ')[i]);
      if (errors.length === 0) {
        voice('Excelente lectura');
        addPoints(10);
      } else {
        voice('Revisa las palabras resaltadas');
        const resEl = document.getElementById('readingResult');
        resEl.innerHTML = '';
        expected.split(' ').forEach((word, i) => {
          const span = document.createElement('span');
          span.textContent = spoken.split(' ')[i] || '';
          if (word !== span.textContent) span.style.background='yellow';
          resEl.appendChild(span);
          resEl.appendChild(document.createTextNode(' '));
        });
      }
      updateProgress();
    };
    recog.start();
  });

  // Escritura simple con sugerencias
  const writingInput = document.getElementById('writingInput');
  writingInput.addEventListener('input', () => {
    const text = writingInput.value;
    if (text && text[0] === text[0].toLowerCase()) {
      document.getElementById('writingFeedback').textContent = 'Recuerda comenzar con mayúscula.';
    } else {
      document.getElementById('writingFeedback').textContent = '';
    }
  });

  // Generador de libros
  document.getElementById('generateBook').addEventListener('click', async () => {
    const theme = document.getElementById('bookTheme').value;
    const chars = document.getElementById('bookCharacters').value;
    if (!theme || !chars) {
      alert('Completa tema y personajes');
      return;
    }
    // Placeholder de llamada a OpenAI
    const content = `Había una vez ${chars} en una historia sobre ${theme}.`;
    document.getElementById('bookOutput').textContent = content;
    voice('Libro generado');
    addPoints(5);
    updateProgress();
  });

  function addPoints(n) {
    points += n;
    pointsLabel.textContent = `Puntos: ${points}`;
  }

  function updateProgress() {
    const percent = Math.min(points, 100);
    progressFill.style.width = percent + '%';
    const email = emailInput.value || 'anonimo';
    const data = JSON.parse(localStorage.getItem('lectuxProgress') || '[]');
    const existing = data.find(d => d.email === email);
    if (existing) {
      existing.progress = percent;
      existing.points = points;
    } else {
      data.push({ email, progress: percent, points });
    }
    localStorage.setItem('lectuxProgress', JSON.stringify(data));
  }
});
