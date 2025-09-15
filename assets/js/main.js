document.addEventListener('DOMContentLoaded', () => {
  const synth = window.speechSynthesis;
  const voiceGuide = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    synth.speak(utter);
  };

  voiceGuide('Bienvenido a LectuX. Selecciona si eres estudiante o docente.');

  document.getElementById('studentBtn').addEventListener('click', () => {
    voiceGuide('Has elegido el perfil de estudiante.');
    window.location.href = 'student.html';
  });

  document.getElementById('teacherBtn').addEventListener('click', () => {
    voiceGuide('Has elegido el perfil de docente.');
    window.location.href = 'teacher.html';
  });
});
