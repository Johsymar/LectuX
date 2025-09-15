document.addEventListener('DOMContentLoaded', () => {
  const synth = window.speechSynthesis;
  const speak = (t) => { const u = new SpeechSynthesisUtterance(t); u.lang='es-ES'; synth.speak(u); };
  speak('Bienvenido al panel del docente. Aquí podrás revisar el progreso de tus estudiantes.');

  // Datos de ejemplo almacenados en localStorage
  const tableBody = document.querySelector('#progressTable tbody');
  const data = JSON.parse(localStorage.getItem('lectuxProgress') || '[]');
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.email}</td><td>${item.progress}%</td><td>${item.points}</td>`;
    tableBody.appendChild(tr);
  });
});
