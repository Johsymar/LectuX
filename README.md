# LectuX
import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const supabase = createClient("https://<TU_URL>.supabase.co", "<TU_PUBLIC_ANON_KEY>");

export default function LectuXApp() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance("Bienvenido a LectuX. Por favor selecciona si eres estudiante o docente.");
    utterance.lang = "es-ES";
    utterance.voice = synth.getVoices().find(voice => voice.lang.includes("es") && voice.name.toLowerCase().includes("female"));
    synth.speak(utterance);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-3xl font-bold text-center mb-6">Bienvenido a LectuX</h1>
      {!role ? (
        <div className="flex justify-center gap-4">
          <Button onClick={() => setRole("estudiante")}>Soy Estudiante</Button>
          <Button onClick={() => setRole("docente")}>Soy Docente</Button>
        </div>
      ) : (
        <MainInterface role={role} />
      )}
    </div>
  );
}

function MainInterface({ role }) {
  return (
    <div className="mt-6">
      {role === "estudiante" ? <EstudianteUI /> : <DocenteUI />}
    </div>
  );
}

function EstudianteUI() {
  const [bookParams, setBookParams] = useState({ tema: '', personajes: '' });
  const [bookContent, setBookContent] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef(null);
  const [transcript, setTranscript] = useState('');
  const [respuestaOrtografia, setRespuestaOrtografia] = useState("");
  const [respuestaGramatica, setRespuestaGramatica] = useState("");
  const [respuestaComprension, setRespuestaComprension] = useState("");
  const [informe, setInforme] = useState([]);

  const generarLibro = () => {
    setBookContent(`Había una vez un libro sobre ${bookParams.tema} con personajes como ${bookParams.personajes}. Este libro fue creado para fomentar la lectoescritura.`);
  };

  const iniciarReconocimientoVoz = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Reconocimiento de voz no soportado en este navegador.");

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecognizing(true);
    recognition.onend = () => setRecognizing(false);
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(`Leíste: ${result}`);
      utterance.lang = "es-ES";
      synth.speak(utterance);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const validarRespuestas = async () => {
    const evaluacion = [];
    if (respuestaOrtografia.toLowerCase().includes("voy a ir a ver a mi abuela")) {
      evaluacion.push("Ortografía correcta");
    } else {
      evaluacion.push("Ortografía incorrecta");
    }
    if (respuestaGramatica.toLowerCase().includes("los niños juegan en el parque")) {
      evaluacion.push("Gramática correcta");
    } else {
      evaluacion.push("Gramática incorrecta");
    }
    if (respuestaComprension.trim().length > 20) {
      evaluacion.push("Comprensión aceptable");
    } else {
      evaluacion.push("Comprensión insuficiente");
    }
    setInforme(evaluacion);

    try {
      const { error } = await supabase.from("informes").insert([
        {
          estudiante: "Nombre del estudiante",
          correo: "Correo Gmail",
          ortografia: respuestaOrtografia,
          gramatica: respuestaGramatica,
          comprension: respuestaComprension,
          evaluacion: JSON.stringify(evaluacion)
        }
      ]);
      if (error) throw error;
    } catch (error) {
      console.error("Error al enviar informe a Supabase:", error);
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Gráfica de Evaluaciones</h3>
          <div className="w-full h-96">
            <BarChart width={600} height={300} data={reportes.filter(r => r.estudiante.toLowerCase().includes(filtroNombre.toLowerCase())).map(r => ({
              nombre: r.estudiante,
              Ortografía: r.ortografia.toLowerCase().includes("correcta") ? 1 : 0,
              Gramática: r.gramatica.toLowerCase().includes("correcta") ? 1 : 0,
              Comprensión: r.comprension.length > 20 ? 1 : 0
            }))}>
              <XAxis dataKey="nombre" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Ortografía" fill="#8884d8" />
              <Bar dataKey="Gramática" fill="#82ca9d" />
              <Bar dataKey="Comprensión" fill="#ffc658" />
            </BarChart>
          </div>
      </Card>
      {/* ...rest of UI remains unchanged... */}
    </div>
  );
}

function DocenteUI() {
  const [reportes, setReportes] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const obtenerInformes = async () => {
      let query = supabase.from("informes").select("*");
      if (fechaInicio && fechaFin) {
        query = query.gte("created_at", fechaInicio).lte("created_at", fechaFin);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error al cargar informes:", error);
      } else {
        setReportes(data);
      }
      }
    };
    obtenerInformes();
  }, []);

  const descargarInforme = () => {
    const csv = reportes.map(r => [r.estudiante, r.correo, r.ortografia, r.gramatica, r.comprension, JSON.parse(r.evaluacion).join(" | ")].join(",")).join("
");
    const blob = new Blob(["Estudiante,Correo,Ortografía,Gramática,Comprensión,Evaluación
" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "informes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">Panel del Docente</h2>
          <ul className="list-disc pl-6">
            <li>Seguimiento detallado de estudiantes</li>
            <li>Evaluación del desempeño individual y grupal</li>
            <li>Acceso y gestión de base de datos por grado</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Informes Recientes</h3>
          <div className="mb-4">
            <div className="flex flex-col gap-2 mb-2">
              <label>Filtrar por fecha</label>
              <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              <Button onClick={() => obtenerInformes()}>Aplicar Filtro</Button>
            </div>
            <Input
              placeholder="Filtrar por nombre del estudiante"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
            <Button className="mt-2" onClick={descargarInforme}>Descargar Informe CSV</Button>
          </div>
          <ul className="space-y-2">
            {reportes.filter(r => r.estudiante.toLowerCase().includes(filtroNombre.toLowerCase())).map((item, index) => (
              <li key={index} className="bg-white p-3 rounded shadow">
                <p><strong>Estudiante:</strong> {item.estudiante}</p>
                <p><strong>Correo:</strong> {item.correo}</p>
                <p><strong>Ortografía:</strong> {item.ortografia}</p>
                <p><strong>Gramática:</strong> {item.gramatica}</p>
                <p><strong>Comprensión:</strong> {item.comprension}</p>
                <p><strong>Evaluación:</strong> {JSON.parse(item.evaluacion).join(", ")}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
        </CardContent>
      </Card>
    </div>
  );
}
