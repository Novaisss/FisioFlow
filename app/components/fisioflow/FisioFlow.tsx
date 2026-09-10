'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type FisioFlowStatus =
  | 'idle'
  | 'listening'
  | 'recording'
  | 'paused'
  | 'confirming';

type Intent =
  | 'INICIAR_CONSULTA'
  | 'PAUSAR_GRAVACAO'
  | 'RETOMAR_GRAVACAO'
  | 'TERMINAR_CONSULTA'
  | 'CONSULTAR_CONSULTA_ATUAL'
  | 'CONSULTAR_PROXIMA_CONSULTA'
  | 'CONSULTAR_HISTORICO'
  | 'UNKNOWN';

type RecognitionEvent = Event & {
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
      isFinal?: boolean;
    };
    length: number;
  };
};

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type RecognitionConstructor = new () => Recognition;

const DEMO_APPOINTMENTS = [
  {
    time: '14:00',
    patient: 'Rodrigo Silva',
    episode: 'Lombalgia',
    therapist: 'Lara',
  },
  {
    time: '14:30',
    patient: 'Maria Silva',
    episode: 'Reabilitação do ombro',
    therapist: 'Lara',
  },
];

const DEMO_HISTORY = {
  patient: 'Maria Silva',
  lastTherapist: 'João',
  lastDate: '07/09/2026',
  sessions: 8,
  treatment: 'Terapia Manual + Exercício Clínico',
  evolution: 'Apresenta melhoria, mantendo ligeiro desconforto ao esforço.',
};

function normalize(text: string) {
  return text
    .toLocaleLowerCase('pt-PT')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function parseCommand(text: string): {
  intent: Intent;
  patient?: string;
  time?: string;
} {
  const value = normalize(text);

  if (/(termin|acaba|finaliz|encerra).*(consult|grav)|^(termin|acaba|finaliz)/.test(value)) {
    return { intent: 'TERMINAR_CONSULTA' };
  }

  if (/(pausa|para).*(grav|escut)|^pausa$|^para$/.test(value)) {
    return { intent: 'PAUSAR_GRAVACAO' };
  }

  if (/(retoma|continua|volta).*(grav|escut)|^(retoma|continua)$/.test(value)) {
    return { intent: 'RETOMAR_GRAVACAO' };
  }

  if (/(quem tenho agora|consulta atual|quem esta agora|quem e o paciente de agora)/.test(value)) {
    return { intent: 'CONSULTAR_CONSULTA_ATUAL' };
  }

  if (/(quem tenho a seguir|proxima consulta|quem vem depois|a que horas e a proxima)/.test(value)) {
    return { intent: 'CONSULTAR_PROXIMA_CONSULTA' };
  }

  if (/(historico|ultimas sessoes|ultima consulta|ultimo tratamento|ultimo fisioterapeuta)/.test(value)) {
    const patient = value.includes('maria') ? 'Maria Silva' : undefined;
    return { intent: 'CONSULTAR_HISTORICO', patient };
  }

  if (/(iniciar|comecar|comeca|comecamos|abrir|abre).*(consult|sessao)|vamos comecar/.test(value)) {
    const patient = value.includes('maria')
      ? 'Maria Silva'
      : value.includes('rodrigo')
        ? 'Rodrigo Silva'
        : undefined;

    const hourMatch = value.match(/\b(\d{1,2})(?:[:h](\d{2}))?\b/);
    const time = hourMatch
      ? `${hourMatch[1].padStart(2, '0')}:${hourMatch[2] ?? '00'}`
      : undefined;

    return { intent: 'INICIAR_CONSULTA', patient, time };
  }

  return { intent: 'UNKNOWN' };
}

function findAppointment(patient?: string, time?: string) {
  if (patient) {
    const byPatient = DEMO_APPOINTMENTS.find((item) => normalize(item.patient) === normalize(patient));
    if (byPatient) return byPatient;
  }

  if (time) {
    return DEMO_APPOINTMENTS.find((item) => item.time === time);
  }

  // Protótipo: 14:00 é a consulta "atual".
  return DEMO_APPOINTMENTS[0];
}

export default function FisioFlow() {
  const [status, setStatus] = useState<FisioFlowStatus>('idle');
  const [lastCommand, setLastCommand] = useState('');
  const [message, setMessage] = useState('Pronto para receber um comando.');
  const [pendingPatient, setPendingPatient] = useState<string | null>(null);
  const [activePatient, setActivePatient] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const recognitionRef = useRef<Recognition | null>(null);
  const elapsedRef = useRef<number | null>(null);

  const currentAppointment = useMemo(
    () => DEMO_APPOINTMENTS.find((item) => item.patient === activePatient),
    [activePatient]
  );

  useEffect(() => {
    if (status === 'recording') {
      elapsedRef.current = window.setInterval(() => {
        setElapsed((value) => value + 1);
      }, 1000);
    }

    return () => {
      if (elapsedRef.current) {
        window.clearInterval(elapsedRef.current);
        elapsedRef.current = null;
      }
    };
  }, [status]);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const processCommand = (command: string) => {
    setLastCommand(command);
    const parsed = parseCommand(command);

    if (parsed.intent === 'INICIAR_CONSULTA') {
      const appointment = findAppointment(parsed.patient, parsed.time);

      if (!appointment) {
        setMessage('Não encontrei uma consulta correspondente. Pode indicar o paciente ou a hora?');
        return;
      }

      if (
        parsed.patient &&
        normalize(parsed.patient) !== normalize(appointment.patient)
      ) {
        setPendingPatient(parsed.patient);
        setStatus('confirming');
        setMessage(
          `A consulta encontrada para agora é a de ${appointment.patient}, às ${appointment.time}. Pediu ${parsed.patient}. Tem a certeza que quer iniciar a consulta de ${parsed.patient}?`
        );
        return;
      }

      setActivePatient(appointment.patient);
      setStatus('recording');
      setElapsed(0);
      setMessage(
        `Consulta de ${appointment.patient} iniciada. Gravação em curso.`
      );
      return;
    }

    if (parsed.intent === 'PAUSAR_GRAVACAO') {
      if (status === 'recording') {
        setStatus('paused');
        setMessage('Gravação pausada. A consulta continua aberta.');
      } else {
        setMessage('Não existe uma gravação ativa para pausar.');
      }
      return;
    }

    if (parsed.intent === 'RETOMAR_GRAVACAO') {
      if (status === 'paused') {
        setStatus('recording');
        setMessage('Gravação retomada.');
      } else {
        setMessage('Não existe uma gravação pausada.');
      }
      return;
    }

    if (parsed.intent === 'TERMINAR_CONSULTA') {
      if (activePatient) {
        setStatus('idle');
        setMessage(
          `Consulta de ${activePatient} terminada. O próximo passo será preparar o registo clínico.`
        );
      } else {
        setMessage('Não existe nenhuma consulta ativa.');
      }
      return;
    }

    if (parsed.intent === 'CONSULTAR_CONSULTA_ATUAL') {
      const appointment = DEMO_APPOINTMENTS[0];
      setMessage(
        `A consulta atual é a de ${appointment.patient}, às ${appointment.time}.`
      );
      return;
    }

    if (parsed.intent === 'CONSULTAR_PROXIMA_CONSULTA') {
      const appointment = DEMO_APPOINTMENTS[1];
      setMessage(
        `A próxima consulta é a de ${appointment.patient}, às ${appointment.time}.`
      );
      return;
    }

    if (parsed.intent === 'CONSULTAR_HISTORICO') {
      setMessage(
        `Última sessão de ${DEMO_HISTORY.patient}: ${DEMO_HISTORY.lastTherapist}. ${DEMO_HISTORY.evolution}`
      );
      return;
    }

    setMessage(
      'Não consegui identificar a ação. Tente, por exemplo: “FisioFlow, iniciar consulta da Maria”, “pausa” ou “terminar consulta”.'
    );
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor })
        .SpeechRecognition ||
      (window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage(
        'O reconhecimento de voz não está disponível neste navegador. Pode testar os comandos através do campo de texto abaixo.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-PT';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      if (transcript) processCommand(transcript);
    };

    recognition.onend = () => {
      setStatus((current) => (current === 'listening' ? 'idle' : current));
    };

    recognition.onerror = () => {
      setStatus('idle');
      setMessage('Não consegui perceber o comando. Pode tentar novamente.');
    };

    recognitionRef.current = recognition;
    setStatus('listening');
    setMessage('Estou a ouvir... diga o comando.');
    recognition.start();
  };

  const confirmPending = (confirmed: boolean) => {
    if (!confirmed || !pendingPatient) {
      setPendingPatient(null);
      setStatus('idle');
      setMessage('Ação cancelada.');
      return;
    }

    setActivePatient(pendingPatient);
    setPendingPatient(null);
    setElapsed(0);
    setStatus('recording');
    setMessage(`Consulta de ${pendingPatient} iniciada. Gravação em curso.`);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-cyan-100/80 shadow-xl shadow-cyan-950/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                status === 'recording'
                  ? 'bg-rose-500 animate-pulse'
                  : status === 'paused'
                    ? 'bg-amber-400'
                    : 'bg-cyan-400'
              }`}
            />
            FisioFlow
          </h2>
          <span className="text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200/60 px-3 py-1 rounded-full">
            Assistente de Voz IA
          </span>
        </div>

        <div className="flex flex-col items-center gap-5 py-8 px-4 rounded-2xl bg-gradient-to-b from-cyan-50/50 via-teal-50/30 to-emerald-50/20 border border-cyan-100/80">
          <div className="relative flex items-center justify-center">
            {status === 'recording' && (
              <>
                <div className="absolute w-32 h-32 bg-cyan-400/20 rounded-full animate-ping" />
                <div className="absolute w-24 h-24 bg-teal-300/30 rounded-full animate-pulse" />
              </>
            )}
            <button
              onClick={status === 'recording' ? () => processCommand('pausa') : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all duration-500 shadow-xl ${
                status === 'recording'
                  ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-rose-500/30 scale-105'
                  : 'bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-cyan-500/30 hover:scale-105'
              }`}
              aria-label={status === 'recording' ? 'Pausar gravação' : 'Ativar FisioFlow'}
            >
              {status === 'recording' ? '⏸' : '🎙️'}
            </button>
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-slate-800">
              {status === 'recording'
                ? 'A gravar a consulta...'
                : status === 'paused'
                  ? 'Gravação pausada'
                  : status === 'listening'
                    ? 'A ouvir o comando...'
                    : status === 'confirming'
                      ? 'Confirmação necessária'
                      : 'Pronto para o seu comando'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm">{message}</p>
          </div>

          {status === 'recording' && (
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-white/70 border border-rose-100 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {formatTime(elapsed)}
            </div>
          )}

          {status === 'paused' && (
            <button
              onClick={() => processCommand('retoma')}
              className="px-5 py-2.5 rounded-xl bg-white border border-cyan-200 text-cyan-700 text-xs font-bold hover:bg-cyan-50 transition"
            >
              ▶ Retomar gravação
            </button>
          )}

          {status === 'confirming' && (
            <div className="flex gap-2">
              <button
                onClick={() => confirmPending(true)}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 transition"
              >
                Sim, iniciar
              </button>
              <button
                onClick={() => confirmPending(false)}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Não
              </button>
            </div>
          )}
        </div>

        {currentAppointment && status !== 'idle' && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Consulta ativa
            </p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-800">{currentAppointment.patient}</p>
                <p className="text-xs text-slate-500">
                  {currentAppointment.time} · {currentAppointment.episode}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">
                Último fisioterapeuta: {DEMO_HISTORY.lastTherapist}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-cyan-100">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Testar comando sem microfone
          </label>
          <div className="flex gap-2">
            <input
              id="fisioflow-command"
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Ex.: FisioFlow, iniciar consulta da Maria"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  const input = event.currentTarget;
                  processCommand(input.value);
                  input.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById('fisioflow-command') as HTMLInputElement | null;
                if (input?.value) {
                  processCommand(input.value);
                  input.value = '';
                }
              }}
              className="px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              Enviar
            </button>
          </div>
          {lastCommand && (
            <p className="mt-2 text-[10px] text-slate-400">
              Último comando: <span className="text-slate-600">{lastCommand}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
