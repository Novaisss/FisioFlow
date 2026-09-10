'use client';

import { useState } from 'react';
import FisioFlow from './components/fisioflow/FisioFlow';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState<
    'inicio' | 'consultas' | 'diagnostico' | 'gestao'
  >('inicio');

  return (
    <div className="min-h-screen bg-[#F7FAFA] text-slate-900 font-sans selection:bg-cyan-200">
      {/* Luzes de Fundo Ciano & Verde Biofílico */}
      <div className="fixed top-0 left-1/4 w-[30rem] h-[30rem] bg-cyan-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-emerald-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navegação Superior Principal */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-cyan-100/60 px-8 py-4 flex justify-between items-center transition-all">
        <div
          onClick={() => setAbaAtiva('inicio')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-all">
            🌿
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-800 bg-clip-text text-transparent">
              Fisiomar
            </span>
            <span className="block text-[10px] uppercase tracking-widest font-semibold text-cyan-600"></span>
          </div>
        </div>

        {/* Menu de Navegação entre Abas */}
        <nav className="flex gap-1.5 bg-slate-200/50 p-1.5 rounded-full border border-cyan-100/80 backdrop-blur-sm">
          <button
            onClick={() => setAbaAtiva('inicio')}
            className={`px-5 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              abaAtiva === 'inicio'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-600 hover:text-cyan-900'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => setAbaAtiva('consultas')}
            className={`px-5 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              abaAtiva === 'consultas'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-600 hover:text-cyan-900'
            }`}
          >
            Consultas
          </button>
          <button
            onClick={() => setAbaAtiva('diagnostico')}
            className={`px-5 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              abaAtiva === 'diagnostico'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-600 hover:text-cyan-900'
            }`}
          >
            Apoio ao Diagnóstico
          </button>
          <button
            onClick={() => setAbaAtiva('gestao')}
            className={`px-5 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              abaAtiva === 'gestao'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-600 hover:text-cyan-900'
            }`}
          >
            Gestão
          </button>
        </nav>
      </header>

      {/* Conteúdo Principal Dinâmico */}
      <main className="p-8 max-w-7xl mx-auto">
        {/* ==================== 1. PÁGINA INICIAL (PORTAL CENTRAL) ==================== */}
        {abaAtiva === 'inicio' && (
          <div className="space-y-10 py-6">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 border border-cyan-200/60 px-4 py-1.5 rounded-full">
                Plataforma Integrada Fisiomar
              </span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Gestão Inteligente, Transcrição por Voz e Diagnóstico Preditivo
              </h1>
              <p className="text-slate-600 text-base">
                Selecione um dos módulos abaixo para iniciar o atendimento
                clínico, analisar dados do paciente ou acompanhar os indicadores
                de desempenho da clínica.
              </p>
            </div>

            {/* Cartões dos 3 Módulos Principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              {/* Card 1: Consultas */}
              <div
                onClick={() => setAbaAtiva('consultas')}
                className="group cursor-pointer bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-cyan-100 shadow-xl shadow-cyan-950/5 hover:border-cyan-400 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200/60 flex items-center justify-center text-2xl group-hover:bg-cyan-500 group-hover:text-white transition-all">
                    🎙️
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                    Consultas
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Escuta ativa durante o atendimento, transcrição por IA
                    automática e preenchimento instantâneo da ficha em formato
                    SOAP.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
                  <span>Aceder às consultas</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 2: Apoio ao Diagnóstico */}
              <div
                onClick={() => setAbaAtiva('diagnostico')}
                className="group cursor-pointer bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-cyan-100 shadow-xl shadow-cyan-950/5 hover:border-teal-400 hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-2xl group-hover:bg-teal-500 group-hover:text-white transition-all">
                    ✨
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    Apoio ao Diagnóstico
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Modelo preditivo de Machine Learning para cruzamento de
                    sintomas, testes iniciais e sugestões de patologias com grau
                    de confiança.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-teal-600 group-hover:text-teal-700">
                  <span>Analisar sintomas</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 3: Gestão */}
              <div
                onClick={() => setAbaAtiva('gestao')}
                className="group cursor-pointer bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-cyan-100 shadow-xl shadow-cyan-950/5 hover:border-emerald-400 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    📊
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Gestão
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Painel do proprietário com estatísticas demográficas, volume
                    de atendimentos por fisioterapeuta e flags automáticas de
                    produtividade.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                  <span>Ver estatísticas</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. ABA DE CONSULTAS ==================== */}
        {abaAtiva === 'consultas' && <FisioFlow />}

        {/* ==================== 3. ABA DE APOIO AO DIAGNÓSTICO ==================== */}
        {abaAtiva === 'diagnostico' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-cyan-100/80 shadow-xl shadow-cyan-950/5">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Modelo Preditivo de Diagnóstico (ML)
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Insira ou selecione os sintomas e testes iniciais do paciente
                para calcular a probabilidade de diagnósticos.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase text-slate-500">
                    Sintomas Selecionados
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold rounded-full">
                      Dor ao flexionar (+3 dias)
                    </span>
                    <span className="px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold rounded-full">
                      Edema ligeiro no tendão
                    </span>
                    <span className="px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold rounded-full">
                      Rigidez matinal
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition">
                    + Adicionar Sintoma / Teste
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase text-slate-500">
                    Diagnósticos Prováveis
                  </label>

                  <div className="p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200/60 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-cyan-950">
                        Tendinite Aquiliana
                      </p>
                      <p className="text-[11px] text-cyan-700">
                        Forte correspondência histórica
                      </p>
                    </div>
                    <span className="text-sm font-black bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-3.5 py-1.5 rounded-xl shadow-sm">
                      85%
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex justify-between items-center opacity-70">
                    <div>
                      <p className="font-medium text-sm text-slate-700">
                        Entorse Grau I
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Baixa probabilidade
                      </p>
                    </div>
                    <span className="text-sm font-semibold bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl">
                      12%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. ABA DE GESTÃO ==================== */}
        {abaAtiva === 'gestao' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-cyan-500/10 via-amber-500/10 to-transparent border border-cyan-200/60 p-6 rounded-3xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl"></span>
                <h3 className="text-sm font-bold text-slate-900">
                  System Flags{' '}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/60 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">
                    Dra. Sofia Mendes (Fisioterapeuta)
                  </p>
                  <p>Queda de 20% no volume de registos esta semana.</p>
                </div>
                <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/60 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">
                    Alerta de Abandono de Tratamento
                  </p>
                  <p>
                    3 pacientes de reabilitação sem reagendamento há +15 dias.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-cyan-100 shadow-xl shadow-cyan-950/5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Volume de Consultas
                </p>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl font-black text-slate-900">
                    342
                  </span>
                  <span className="text-xs font-bold text-cyan-700 bg-cyan-100/80 px-2.5 py-1 rounded-full">
                    +12% este mês
                  </span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-cyan-100 shadow-xl shadow-cyan-950/5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Novos Pacientes
                </p>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    48
                  </span>
                  <span className="text-xs font-bold text-teal-700 bg-teal-100/80 px-2.5 py-1 rounded-full">
                    Braga e Guimarães
                  </span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-cyan-100 shadow-xl shadow-cyan-950/5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tempo Médio p/ Sessão
                </p>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl font-black text-emerald-600">
                    42 min
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Dentro da meta
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
