import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nós - The Retech | Florianópolis, SC',
  description: 'Conheça a The Retech, fundada em 2010 por Alan Rezende em Florianópolis. Mais de 20 anos democratizando acesso a dados públicos brasileiros através de APIs modernas.',
  keywords: [
    'the retech',
    'sobre retech core',
    'alan rezende',
    'empresa florianopolis',
    'api dados publicos',
    'desenvolvedores brasil'
  ],
  openGraph: {
    title: 'Sobre a The Retech - Fundador & História',
    description: 'Desde 2010 modernizando o acesso a dados públicos do Brasil. Fundada por Alan Rezende em Florianópolis.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://core.theretech.com.br/sobre',
  },
};

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





