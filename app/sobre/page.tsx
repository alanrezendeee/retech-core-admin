'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Code, Zap, Users, Target, Heart } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-blue-600">Sobre Nós</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Retech
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Democratizando o acesso a dados públicos brasileiros através de APIs de alta performance
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* História */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Nossa História</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-slate-700 mb-4">
                A <strong>The Retech</strong> nasceu da frustração de desenvolvedores brasileiros que precisavam integrar 
                dados públicos em seus sistemas. APIs fragmentadas, instáveis, lentas ou inexistentes tornavam o trabalho 
                muito mais difícil do que deveria ser.
              </p>
              <p className="text-lg text-slate-700 mb-4">
                Fundada em 2010 por <strong>Alan Rezende</strong>, arquiteto e engenheiro de software com mais de 20 anos 
                de experiência, a The Retech tem uma missão clara: <strong>centralizar e modernizar o acesso a dados 
                públicos brasileiros</strong>.
              </p>
              <p className="text-lg text-slate-700">
                Sediados em <strong>Florianópolis, Santa Catarina</strong>, desenvolvemos soluções de alta performance 
                que combinam cache inteligente, fallback automático e múltiplas fontes de dados para garantir confiabilidade 
                e velocidade aos nossos clientes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fundador */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Fundador & CEO</h2>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  AR
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Alan Rezende</h3>
                  <p className="text-blue-600 font-semibold mb-4">CEO & Fundador</p>
                  <p className="text-slate-700 mb-4">
                    Com 40 anos e mais de 20 anos de experiência como arquiteto e engenheiro de software, 
                    Alan trabalhou em dezenas de projetos de integração de dados, sempre enfrentando as mesmas 
                    dificuldades com APIs públicas brasileiras.
                  </p>
                  <p className="text-slate-700 mb-4">
                    Cansado de soluções fragmentadas, decidiu criar a The Retech: uma plataforma que unifica 
                    todas as APIs essenciais em um único lugar, com cache inteligente, fallback automático e 
                    performance de nível enterprise.
                  </p>
                  <div className="flex gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Florianópolis, SC</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      <span>20+ anos de experiência</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missão, Visão, Valores */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Missão, Visão & Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Missão</h3>
                <p className="text-slate-600">
                  Democratizar o acesso a dados públicos brasileiros através de APIs modernas, 
                  rápidas e confiáveis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Visão</h3>
                <p className="text-slate-600">
                  Ser a principal plataforma de APIs de dados públicos do Brasil, 
                  presente em milhares de aplicações.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Valores</h3>
                <p className="text-slate-600">
                  Performance, Confiabilidade, Transparência, Simplicidade e 
                  Compromisso com desenvolvedores.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Localização */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Sede</h3>
              <p className="text-lg text-slate-700 mb-1">Florianópolis, Santa Catarina, Brasil</p>
              <p className="text-slate-600">
                Orgulhosamente desenvolvido na Ilha da Magia 🏝️
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Quer fazer parte da nossa história?</h3>
              <p className="text-lg text-blue-100 mb-6">
                Comece a usar nossas APIs gratuitamente hoje mesmo
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/painel/register">
                    Criar Conta Grátis
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <Link href="/contato">
                    Falar Conosco
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}





