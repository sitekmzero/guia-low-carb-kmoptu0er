import { Link } from 'react-router-dom'
import { FileText, Shield, Video, ShoppingBag, Scale, AlertCircle } from 'lucide-react'
import { useSEO } from '@/services/seo'

export default function TermosDeUso() {
  useSEO(
    'Termos de Uso | Guia Low Carb - Adriana Araújo',
    'Termos e condições gerais de uso do site Guia Low Carb, serviços de teleconsulta nutricional e produtos digitais.',
    'termos de uso, condicoes gerais, teleconsulta, guia low carb, adriana araujo',
    '/og-image.png',
    'https://www.guialowcarb.com.br/termos-de-uso',
    'https://www.guialowcarb.com.br/termos-de-uso',
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-20 border-b">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-6">
            <FileText className="w-4 h-4" /> Termos e Condições de Uso da Plataforma
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Termos de Uso
          </h1>
          <p className="text-muted-foreground font-subheading text-base md:text-lg max-w-2xl mx-auto">
            Por favor, leia atentamente estes termos antes de navegar, utilizar os conteúdos ou
            contratar serviços disponibilizados no Guia Low Carb.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Última atualização: Setembro de 2026 • Versão 2.0
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-slate dark:prose-invert max-w-none space-y-10 leading-relaxed text-foreground/90">
          {/* Seção 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                1
              </span>
              Identificação do Titular da Plataforma
            </h2>
            <p>
              Este site e seus subdomínios são mantidos e operados por{' '}
              <strong>Adriana de Freitas Oliveira Araújo</strong>, nutricionista clínica
              regularmente inscrita no{' '}
              <strong>Conselho Regional de Nutricionistas da 9ª Região sob o nº CRN-9 28762</strong>
              , atuante em Uberaba – MG, comercialmente identificada como{' '}
              <strong>Guia Low Carb</strong>.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                2
              </span>
              Aceitação dos Termos
            </h2>
            <p>
              Ao navegar pelo site, realizar downloads de materiais gratuitos, cadastrar-se na área
              de membros, adquirir produtos digitais ou agendar teleconsultas, você declara estar
              ciente e de pleno acordo com as disposições destes Termos de Uso e com a nossa{' '}
              <Link to="/politica-de-privacidade" className="text-primary font-semibold underline">
                Política de Privacidade
              </Link>
              . Caso não concorde com qualquer cláusula aqui disposta, solicitamos que não utilize
              nossos serviços.
            </p>
          </section>

          {/* Seção 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                3
              </span>
              Serviços de Teleconsulta Nutricional e Resolução CFN
            </h2>
            <p>
              Os serviços clínicos de teleconsulta nutricional são prestados em estrita observância
              à Resolução CFN nº 666/2020 (que regulamenta a teleconsulta durante e após a vigência
              da pandemia) e ao Código de Ética e de Conduta do Nutricionista (Resolução CFN nº
              599/2018):
            </p>
            <div className="p-4 rounded-xl border bg-card space-y-3">
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">
                    Plataformas de Teleatendimento e Sigilo:
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Os atendimentos em vídeo são realizados em salas virtuais seguras por meio do{' '}
                    <strong>Google Meet</strong> ou <strong>Zoom</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-border/60">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Não Gravação das Teleconsultas:</p>
                  <p className="text-muted-foreground mt-1">
                    <strong>Ressaltamos que as sessões de teleconsulta NÃO são gravadas</strong> por
                    nenhuma das partes, garantindo o sigilo médico-nutricional, a confidencialidade
                    e a privacidade estrita do paciente. É terminantemente proibida a gravação,
                    divulgação ou publicação das sessões por parte do paciente sem autorização
                    formal.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                4
              </span>
              Produtos Digitais e Intermediação de Pagamentos (Hotmart e Stripe)
            </h2>
            <p>
              O Guia Low Carb comercializa infoprodutos educativos (e-books, apostilas, mentorias em
              grupo e cursos digitais):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Hotmart:</strong> a plataforma <em>Hotmart</em> atua como operadora e
                intermediadora na venda de produtos digitais. As compras efetuadas via Hotmart
                submetem-se igualmente aos Termos de Compra e Política de Cancelamento/Reembolso
                próprios da Hotmart e às garantias legais do Código de Defesa do Consumidor (CDC).
              </li>
              <li>
                <strong>Stripe:</strong> pagamentos diretos de agendamentos ou serviços
                complementares são processados de forma criptografada pelo gateway Stripe,
                assegurando proteção aos dados de transação.
              </li>
              <li>
                <strong>Direito de Arrependimento (Art. 49 do CDC):</strong> nas compras realizadas
                pela internet, o consumidor tem o prazo incondicional de 7 (sete) dias corridos,
                contados da data da aprovação da compra, para solicitar o reembolso integral caso
                não se sinta satisfeito.
              </li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                5
              </span>
              Propriedade Intelectual e Direitos Autorais
            </h2>
            <p>
              Todo o conteúdo deste site — incluindo, mas não se limitando a: textos, artigos de
              blog, marcas, logotipos, materiais em PDF, e-books, vídeos, apostilas e código-fonte —
              é de titularidade exclusiva de Adriana Araújo ou devidamente licenciado por terceiros,
              sendo protegido pela Lei de Direitos Autorais (Lei nº 9.610/1998) e pela legislação de
              propriedade industrial.
            </p>
            <p>
              É estritamente proibido reproduzir, ratear, vender, compartilhar senhas de acesso à
              área de membros, republicar ou explorar comercialmente quaisquer materiais sem o
              consentimento prévio e por escrito da autora. O uso concedido é de caráter pessoal,
              individual e intransferível.
            </p>
          </section>

          {/* Seção 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                6
              </span>
              Natureza Educativa e Limitação de Responsabilidade
            </h2>
            <div className="p-4 rounded-xl bg-muted/50 border flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm leading-relaxed space-y-2">
                <p>
                  <strong>Conteúdo do site e artigos:</strong> Os textos, artigos e e-books têm
                  propósito exclusivamente educativo, de divulgação científica e esclarecimento
                  nutricional. Não devem ser interpretados como garantia de resultado estético, nem
                  como prescrição dietética individualizada ou substituto de diagnóstico médico e
                  nutricional.
                </p>
                <p>
                  Cada indivíduo possui particularidades metabólicas, comorbidades, uso de fármacos
                  e histórico de saúde que exigem acompanhamento clínico personalizado antes de
                  qualquer intervenção drástica na alimentação.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                7
              </span>
              Privacidade e Proteção de Dados (LGPD)
            </h2>
            <p>
              O tratamento dos dados pessoais coletados por este site é regido pela nossa{' '}
              <Link to="/politica-de-privacidade" className="text-primary font-semibold underline">
                Política de Privacidade
              </Link>
              , em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
            <p>
              Ao submeter formulários no site, o usuário declara a veracidade e exatidão das
              informações prestadas, sendo o único responsável por qualquer dado errôneo ou de
              titularidade de terceiros fornecido indevidamente.
            </p>
          </section>

          {/* Seção 8 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                8
              </span>
              Modificações Destes Termos
            </h2>
            <p>
              Reservamo-nos o direito de atualizar, revisar ou modificar estes Termos de Uso a
              qualquer momento, visando adequações legais, regulatórias do CFN ou aprimoramento de
              nossos serviços. A data da última versão sempre estará indicada no cabeçalho desta
              página. A continuidade no uso dos serviços após eventuais alterações implica plena
              aceitação dos novos termos.
            </p>
          </section>

          {/* Seção 9 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                9
              </span>
              Legislação Aplicável e Foro
            </h2>
            <p>
              Estes Termos são regidos pelas leis vigentes na República Federativa do Brasil. Para
              dirimir eventuais controvérsias oriundas do presente instrumento, fica eleito o Foro
              da Comarca de Uberaba, Estado de Minas Gerais, com renúncia expressa a qualquer outro,
              por mais privilegiado que seja, ressalvadas as hipóteses legais de competência
              inviolável previstas no Código de Defesa do Consumidor.
            </p>
          </section>

          {/* Seção 10 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                10
              </span>
              Contato e Dúvidas
            </h2>
            <p>
              Se você tiver dúvidas sobre estes Termos de Uso ou precisar de auxílio com produtos
              adquiridos, entre em contato:
            </p>
            <div className="p-4 rounded-xl border bg-card text-sm space-y-1">
              <p>
                <strong>Responsável:</strong> Adriana Araújo (CRN-9 28762)
              </p>
              <p>
                <strong>E-mail institucional:</strong> contato@guialowcarb.com.br
              </p>
              <p>
                <strong>Privacidade e Dados:</strong> privacidade@guialowcarb.com.br
              </p>
              <p>
                <strong>Localidade:</strong> Uberaba – MG, Brasil
              </p>
            </div>
          </section>

          {/* Links adicionais */}
          <div className="border-t pt-8 flex flex-wrap gap-4 justify-between items-center text-sm text-muted-foreground">
            <Link
              to="/politica-de-privacidade"
              className="text-primary hover:underline font-medium"
            >
              ← Leia nossa Política de Privacidade
            </Link>
            <Link to="/" className="hover:underline">
              Voltar à página inicial
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
