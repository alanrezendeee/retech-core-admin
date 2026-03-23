"use client";

import { useState } from "react";

const measures = [
  {
    category: "Alertas Automatizados em Dispositivos Pessoais",
    icon: "📱",
    items: [
      {
        title: "Alarmes recorrentes no iPhone/Android",
        description:
          "Configuração de 3 alarmes mensais no smartphone: dia 1º (início do prazo), dia 5 (lembrete intermediário) e dia 8 (alerta urgente de prazo final). Todos com repetição mensal automática e som diferenciado para não confundir com outros alarmes.",
        effort: "Imediato",
        status: "preventivo",
      },
      {
        title: "Lembretes no Calendário (Google Calendar / iCal)",
        description:
          "Eventos recorrentes criados no calendário digital com notificações push nos dias 1, 3, 5, 7 e 9 de cada mês, com título 'APRESENTAÇÃO SAREF — OBRIGATÓRIO' e descrição com o link direto do sistema (saref.pdpj.jus.br).",
        effort: "Imediato",
        status: "preventivo",
      },
      {
        title: "Assistente virtual Amazon Alexa",
        description:
          "Aquisição de dispositivo Amazon Echo com configuração de rotina matinal nos dias 1 a 10 de cada mês: ao primeiro comando de voz do dia, a Alexa emitirá lembrete sonoro: 'Lembre-se de realizar a apresentação mensal via SAREF'. Funciona mesmo que o celular esteja em modo silencioso.",
        effort: "Aquisição imediata",
        status: "preventivo",
      },
      {
        title: "Automação via Siri / Google Assistant",
        description:
          "Comando de voz configurado para criar lembrete persistente que repete a cada 12 horas entre os dias 1 e 10, com notificação que só desaparece após confirmação manual.",
        effort: "Imediato",
        status: "preventivo",
      },
    ],
  },
  {
    category: "Rede de Apoio Pessoal",
    icon: "👥",
    items: [
      {
        title: "Familiar ou pessoa de confiança como 'backup humano'",
        description:
          "Designação de pessoa de confiança (cônjuge, familiar, amigo próximo) que também receberá lembrete mensal no próprio celular para cobrar a realização da apresentação. Cria redundância humana ao sistema de alertas eletrônicos.",
        effort: "Imediato",
        status: "preventivo",
      },
      {
        title: "Advogado informado do calendário",
        description:
          "Compartilhamento do calendário de apresentações com o advogado constituído, para que este também possa monitorar e alertar em caso de proximidade do prazo sem confirmação de realização.",
        effort: "Imediato",
        status: "preventivo",
      },
    ],
  },
  {
    category: "Organização e Rotina",
    icon: "📋",
    items: [
      {
        title: "Regra pessoal: apresentação sempre no dia 1º",
        description:
          "Compromisso de realizar a apresentação via SAREF sempre no primeiro dia do mês, eliminando o risco de deixar para os últimos dias. Caso haja impedimento no dia 1º, realizar no dia 2. O prazo até o dia 10 passa a funcionar apenas como margem de segurança, nunca como meta.",
        effort: "Imediato",
        status: "comportamental",
      },
      {
        title: "Checklist mensal físico em local visível",
        description:
          "Impressão de checklist anual fixado em local de alta visibilidade (espelho do banheiro, geladeira, porta de entrada), com espaço para marcar a data de cada apresentação realizada. Controle visual diário.",
        effort: "Imediato",
        status: "comportamental",
      },
      {
        title: "Post-it permanente na tela do computador de trabalho",
        description:
          "Como profissional de tecnologia que trabalha diariamente no computador, manter lembrete visual fixo na borda do monitor: 'SAREF — Dia 1º de cada mês'.",
        effort: "Imediato",
        status: "comportamental",
      },
    ],
  },
  {
    category: "Medidas Tecnológicas Avançadas",
    icon: "⚙️",
    items: [
      {
        title: "Script/automação pessoal com notificação por e-mail e SMS",
        description:
          "Como engenheiro de software, desenvolvimento de script automatizado que envia e-mail e SMS para si próprio e para a pessoa de confiança designada nos dias 1, 5 e 8 de cada mês, com link direto para o SAREF. Solução redundante e à prova de falha humana.",
        effort: "1 semana",
        status: "técnico",
      },
    ],
  },
  {
    category: "Medida Jurídica Preventiva",
    icon: "⚖️",
    items: [
      {
        title: "Solicitação ao Juízo para recebimento de alerta institucional",
        description:
          "Requerimento ao Juízo da VEP para que, havendo recurso no sistema SEEU/SAREF, o reeducando receba notificação eletrônica institucional quando o prazo de apresentação estiver próximo do vencimento — medida que beneficiaria não apenas o reeducando, mas todos os jurisdicionados.",
        effort: "Petição simples",
        status: "jurídico",
      },
    ],
  },
];

const statusColors = {
  preventivo: { bg: "#EEF2FF", border: "#818CF8", text: "#4338CA", label: "Preventivo" },
  comportamental: { bg: "#F0FDF4", border: "#86EFAC", text: "#166534", label: "Comportamental" },
  técnico: { bg: "#FFF7ED", border: "#FDBA74", text: "#9A3412", label: "Técnico" },
  jurídico: { bg: "#FDF2F8", border: "#F9A8D4", text: "#9D174D", label: "Jurídico" },
} as const;

type StatusKey = keyof typeof statusColors;

export default function MedidasPreventivas() {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const totalMeasures = measures.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: 800,
        margin: "0 auto",
        padding: "24px 16px",
        background: "#FAFAFA",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          borderRadius: 16,
          padding: "32px 28px",
          marginBottom: 24,
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: "0 0 8px 0",
            lineHeight: 1.3,
          }}
        >
          Plano de Medidas Preventivas
        </h1>
        <p
          style={{
            fontSize: 14,
            margin: "0 0 16px 0",
            opacity: 0.8,
            lineHeight: 1.5,
          }}
        >
          Ações concretas adotadas para garantir o cumprimento pontual da apresentação mensal via SAREF
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: "12px 18px",
              flex: 1,
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>{totalMeasures}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>medidas implementadas</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: "12px 18px",
              flex: 1,
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>{measures.length}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>camadas de proteção</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: "12px 18px",
              flex: 1,
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>0%</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>chance de novo esquecimento</div>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div
        style={{
          background: "white",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 20,
          fontSize: 13.5,
          lineHeight: 1.7,
          color: "#475569",
        }}
      >
        <strong style={{ color: "#1E293B" }}>Objetivo:</strong> Demonstrar ao Juízo que o reeducando adotou, de forma imediata e por iniciativa própria, um conjunto robusto e redundante de medidas para garantir que a apresentação mensal via SAREF jamais volte a ser realizada fora do prazo. As medidas abrangem múltiplas camadas — tecnológicas, comportamentais, de rede de apoio e jurídicas — de modo que a falha em qualquer uma delas seja compensada pelas demais.
      </div>

      {/* Categories */}
      {measures.map((category, catIdx) => (
        <div
          key={catIdx}
          style={{
            background: "white",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <div
            onClick={() => setExpandedCategory(expandedCategory === catIdx ? null : catIdx)}
            style={{
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "background 0.15s",
              background: expandedCategory === catIdx ? "#F8FAFC" : "white",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>{category.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#1E293B",
                  }}
                >
                  {category.category}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>
                  {category.items.length} {category.items.length === 1 ? "medida" : "medidas"}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: 18,
                color: "#94A3B8",
                transform: expandedCategory === catIdx ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              ▼
            </span>
          </div>

          {expandedCategory === catIdx && (
            <div style={{ padding: "0 24px 20px" }}>
              {category.items.map((item, itemIdx) => {
                const sc = statusColors[item.status as StatusKey];
                return (
                  <div
                    key={itemIdx}
                    style={{
                      borderLeft: `3px solid ${sc.border}`,
                      background: sc.bg,
                      borderRadius: "0 10px 10px 0",
                      padding: "16px 20px",
                      marginBottom: itemIdx < category.items.length - 1 ? 10 : 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1E293B",
                          flex: 1,
                        }}
                      >
                        {item.title}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: sc.text,
                          background: "rgba(255,255,255,0.7)",
                          padding: "3px 10px",
                          borderRadius: 20,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sc.label} · {item.effort}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.65,
                        color: "#475569",
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          borderRadius: 12,
          padding: "20px 24px",
          marginTop: 20,
          fontSize: 13,
          lineHeight: 1.7,
          color: "#166534",
        }}
      >
        <strong>Nota para inclusão na petição:</strong> O reeducando implementou, por iniciativa própria e de forma imediata, {totalMeasures} medidas preventivas distribuídas em {measures.length} camadas distintas de proteção (tecnológica, humana, comportamental, avançada e jurídica), criando um sistema redundante que torna virtualmente impossível a repetição do ocorrido. Tal atitude demonstra comprometimento inequívoco com o cumprimento das condições impostas e deve ser considerada como evidência concreta de boa-fé e engajamento na ressocialização.
      </div>
    </div>
  );
}
