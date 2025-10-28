import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato - Fale Conosco | WhatsApp e Email',
  description: 'Entre em contato com a equipe da Retech Core API. WhatsApp: (48) 99961-6679 | Email: suporte@theretech.com.br | Florianópolis, Santa Catarina, Brasil',
  keywords: [
    'contato retech',
    'suporte api',
    'whatsapp suporte',
    'email suporte',
    'falar com retech'
  ],
  openGraph: {
    title: 'Contato - Retech Core API',
    description: 'WhatsApp: (48) 99961-6679 | Email: suporte@theretech.com.br',
    type: 'website',
  },
  alternates: {
    canonical: 'https://core.theretech.com.br/contato',
  },
};

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

