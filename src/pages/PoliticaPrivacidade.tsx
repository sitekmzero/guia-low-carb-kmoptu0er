import { Link } from 'react-router-dom'
import { Shield, Lock, FileText, CheckCircle, Mail, AlertTriangle } from 'lucide-react'
import { useSEO } from '@/services/seo'
import { openConsentPreferences } from '@/services/consentService'
import { Button } from '@/components/ui/button'

export default function PoliticaPrivacidade() {
  useSEO(
    'Política de Privacidade | Guia Low Carb - Adriana Araújo',
    'Conheça nossa Política de Privacidade em conformidade com a LGPD (Lei nº 13.709/2018). Transparência e proteção dos seus dados pessoais e de saúde.',
    'politica de privacidade, lgpd, protecao de dados, guia low carb, adriana araujo',
    '/og-image.png',
    'https://www.guialowcarb.com.br/politica-de-privacidade',
    'https://www.guialowcarb.com.br/politica-de-privacidade',
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-20 border-b">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" /> Conformidade com a Lei Geral de Proteção de Dados (LGPD)
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground font-subheading text-base md:text-lg max-w-2xl mx-auto">
            Esta Política detalha como tratamos, protegemos e respeitamos os seus dados pessoais e
            informações de saúde na plataforma Guia Low Carb.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Última atualização: Setembro de 2026 • Versão 2.0 (LGPD e Resoluções CFN)
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
              Controladora dos Dados Pessoais
            </h2>
            <p>
              A controladora dos dados pessoais coletados neste site e nos serviços vinculados é{' '}
              <strong>Adriana de Freitas Oliveira Araújo</strong>, nutricionista clínica inscrita no{' '}
              <strong>CRN-9 sob o nº 28762</strong>, operando sob a marca{' '}
              <strong>Guia Low Carb</strong>, com atuação profissional e domicílio em Uberaba – MG.
            </p>
            <p>
              Para qualquer solicitação, dúvida ou exercício de direitos de titular previstos na Lei
              nº 13.709/2018 (LGPD), o canal oficial de contato com o encarregado de proteção de
              dados (DPO) é o e-mail:{' '}
              <a
                href="mailto:privacidade@guialowcarb.com.br"
                className="text-primary font-semibold underline"
              >
                privacidade@guialowcarb.com.br
              </a>
              .
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                2
              </span>
              Dados Pessoais Coletados e Formas de Coleta
            </h2>
            <p>Coletamos apenas os dados estritamente necessários para o atendimento solicitado:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Dados cadastrais e de contato:</strong> nome completo, e-mail,
                telefone/WhatsApp fornecidos espontaneamente em formulários de contato, download de
                e-books educativos ou cadastro na área de membros.
              </li>
              <li>
                <strong>Dados de navegação e técnicos:</strong> endereço IP, tipo de navegador,
                sistema operacional, páginas acessadas, data e hora de acesso, coletados via cookies
                técnicos ou ferramentas de estatística quando expressamente autorizados.
              </li>
              <li>
                <strong>Dados financeiros e de transação:</strong> processados diretamente pelas
                plataformas de pagamento e hospedagem de cursos (Hotmart e Stripe). O Guia Low Carb{' '}
                <em>não</em> armazena números completos de cartão de crédito.
              </li>
              <li>
                <strong>Dados de saúde (dados pessoais sensíveis):</strong> informações clínicas,
                histórico de saúde, hábitos alimentares e objetivos terapêuticos coletados
                exclusivamente durante a anamnese nutricional clínica e teleconsulta
                individualizada.
              </li>
            </ul>
          </section>

          {/* Seção 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                3
              </span>
              Finalidades e Bases Legais do Tratamento (Art. 7º e Art. 11 da LGPD)
            </h2>
            <p>
              Todo tratamento de dados realizado pelo Guia Low Carb possui respaldo em uma base
              legal válida prevista na LGPD:
            </p>
            <div className="grid gap-4 md:grid-cols-2 pt-2">
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-semibold text-primary mb-2">
                  Execução de Contrato ou Diligências Preliminares (Art. 7º, V)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Atendimento de pedidos de agendamento de teleconsulta, fornecimento de materiais
                  digitais adquiridos e disponibilização da área do aluno.
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-semibold text-primary mb-2">
                  Consentimento Livre e Informado (Art. 7º, I)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Envio de comunicações informativas por e-mail, novidades educativas e ativação de
                  cookies analíticos e de marketing.
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-semibold text-primary mb-2">
                  Tutela da Saúde e Procedimento Clínico (Art. 11, II, "f")
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tratamento de dados sensíveis de saúde estritamente para condução do prontuário e
                  conduta nutricional individualizada pela profissional de saúde habilitada.
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-semibold text-primary mb-2">
                  Cumprimento de Obrigação Legal e Regulatória (Art. 7º, II)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Guarda de prontuários nutricionais conforme determinado pelo Conselho Federal de
                  Nutricionistas (CFN) e emissão de notas fiscais.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                4
              </span>
              Tratamento de Dados de Saúde em Formulários Abertos
            </h2>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-foreground flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm leading-relaxed">
                <p className="font-semibold text-amber-800 dark:text-amber-400">
                  Atenção ao enviar mensagens no site:
                </p>
                <p className="mt-1">
                  Os formulários gerais de contato do site destinam-se exclusivamente a dúvidas
                  administrativas e agendamentos.{' '}
                  <strong>
                    Não envie laudos de exames, diagnósticos médicos ou dados clínicos confidenciais
                  </strong>{' '}
                  por esses canais.
                </p>
                <p className="mt-2">
                  Caso o usuário opte voluntariamente por inserir dados sobre seu estado de saúde no
                  campo de mensagem aberta, o envio configura manifestação expressa de consentimento
                  específico para o recebimento e análise inicial da mensagem pela nutricionista
                  clínica, nos termos do art. 11, inciso II, alínea "f" da LGPD.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                5
              </span>
              Cookies e Tecnologias de Rastreamento (Bloqueio Prévio)
            </h2>
            <p>
              Em respeito estrito à sua privacidade, adotamos a política conservadora de{' '}
              <strong>bloqueio prévio de scripts de rastreamento</strong>. Nenhum cookie de
              marketing ou de análise comportamental é carregado ou ativado antes de você manifestar
              sua escolha no banner de consentimento.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cookies Estritamente Necessários:</strong> essenciais para manter você
                conectado à área restrita, salvar suas preferências de consentimento e garantir a
                estabilidade do site. Não podem ser desativados.
              </li>
              <li>
                <strong>Cookies Analíticos (Google Analytics 4 / GA4):</strong> mensuram de forma
                anonimizada o volume de visitas e as páginas mais acessadas para aprimoramento da
                plataforma. Ativados apenas com seu consentimento.
              </li>
              <li>
                <strong>Cookies de Marketing (Meta Pixel, Google Ads, GTM):</strong> auxiliam a
                mensurar conversões de campanhas educativas e cursos, evitando que você veja
                anúncios repetitivos ou fora do seu interesse. Ativados apenas com seu
                consentimento.
              </li>
            </ul>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={openConsentPreferences}
              >
                Gerenciar minhas preferências de cookies
              </Button>
            </div>
          </section>

          {/* Seção 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                6
              </span>
              Operadores, Parceiros e Plataformas Utilizadas
            </h2>
            <p>
              Para operacionalizar as atividades digitais, o Guia Low Carb compartilha dados com
              operadores de tecnologia sob rigorosos padrões de confidencialidade e segurança da
              informação:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Hotmart:</strong> plataforma de comercialização, distribuição de produtos
                digitais (e-books, mentorias e cursos) e processamento de pagamentos.
              </li>
              <li>
                <strong>Stripe:</strong> gateway de pagamentos criptografado para transações diretas
                e teleconsultas.
              </li>
              <li>
                <strong>Supabase:</strong> infraestrutura em nuvem segura para autenticação de
                usuários, hospedagem de banco de dados e controle de leads.
              </li>
              <li>
                <strong>Google Meet e Zoom:</strong> plataformas de comunicação por videoconferência
                utilizadas exclusivamente para a realização das teleconsultas ao vivo.{' '}
                <strong>Ressaltamos expressamente que as teleconsultas NÃO são gravadas</strong>,
                preservando a intimidade e o sigilo profissional garantidos pelo Código de Ética do
                Nutricionista.
              </li>
              <li>
                <strong>Brevo / Ferramentas de E-mail:</strong> serviços seguros para envio de
                e-mails transacionais e informativos autorizados.
              </li>
              <li>
                <strong>Google e Meta:</strong> prestadores de serviços de estatística e mídia
                quando houver consentimento para ativação de tags.
              </li>
            </ul>
          </section>

          {/* Seção 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                7
              </span>
              Transferência Internacional de Dados
            </h2>
            <p>
              Determinados prestadores de infraestrutura tecnológica (como Supabase, Stripe, Google
              e Meta) possuem servidores hospedados fora do Brasil. Essas transferências ocorrem em
              conformidade com o Capítulo V da LGPD, amparadas por cláusulas contratuais padrão,
              certificações de segurança internacionais (como SOC 2, ISO 27001) e medidas técnicas
              de criptografia.
            </p>
          </section>

          {/* Seção 8 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                8
              </span>
              Retenção e Descarte de Dados
            </h2>
            <p>
              Os dados pessoais são conservados apenas pelo período necessário para atender às
              finalidades para as quais foram coletados:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Prontuários e dados clínicos:</strong> mantidos pelo prazo mínimo
                obrigatório estabelecido pelas resoluções do Conselho Federal de Nutricionistas
                (CFN) e normas sanitárias brasileiras.
              </li>
              <li>
                <strong>Dados cadastrais para marketing e e-books:</strong> retidos até que o
                titular solicite o descadastro (opt-out) ou revogue seu consentimento.
              </li>
              <li>
                <strong>Dados fiscais e contábeis:</strong> mantidos pelos prazos prescricionais
                legais exigidos pela legislação tributária.
              </li>
            </ul>
          </section>

          {/* Seção 9 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                9
              </span>
              Direitos do Titular de Dados (Art. 18 da LGPD)
            </h2>
            <p>
              Você, como titular de dados pessoais, pode a qualquer momento exercer seus direitos
              perante o Guia Low Carb:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              {[
                'Confirmação da existência de tratamento',
                'Acesso facilitado aos seus dados pessoais',
                'Correção de dados incompletos ou desatualizados',
                'Anonimização, bloqueio ou eliminação de dados desnecessários',
                'Portabilidade dos dados a outro fornecedor de serviço',
                'Eliminação dos dados tratados com base no consentimento',
                'Informação sobre entidades públicas e privadas com as quais houve compartilhamento',
                'Informação sobre a possibilidade de não fornecer consentimento e consequências',
                'Revogação do consentimento de forma simples e gratuita',
              ].map((direito, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-card border text-xs sm:text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{direito}</span>
                </div>
              ))}
            </div>
            <p className="pt-2">
              Para exercer qualquer um destes direitos, envie um e-mail para{' '}
              <a
                href="mailto:privacidade@guialowcarb.com.br"
                className="text-primary font-semibold underline"
              >
                privacidade@guialowcarb.com.br
              </a>
              . Responderemos à sua solicitação no prazo legal.
            </p>
          </section>

          {/* Seção 10 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                10
              </span>
              Segurança da Informação e Sigilo Profissional
            </h2>
            <p>
              Adotamos medidas técnicas e administrativas aptas a proteger seus dados contra acessos
              não autorizados, vazamentos, destruição ou qualquer forma de tratamento ilícito. Entre
              as medidas destacam-se:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia SSL/TLS em todas as comunicações do site;</li>
              <li>Controle rígido de acessos administrativos com autenticação segura;</li>
              <li>
                Sigilo profissional inegociável nos atendimentos nutricionais, em total alinhamento
                com o Código de Ética do Nutricionista (CFN).
              </li>
            </ul>
          </section>

          {/* Seção 11 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                11
              </span>
              Encarregado de Proteção de Dados (DPO) e Contato
            </h2>
            <div className="p-6 rounded-2xl bg-card border shadow-soft flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="w-7 h-7" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-heading font-bold text-lg text-primary">
                  Encarregado pelo Tratamento de Dados Pessoais
                </h3>
                <p className="text-sm text-muted-foreground">
                  Responsável: Adriana Araújo (CRN-9 28762)
                </p>
                <p className="text-sm font-medium text-foreground">
                  Canal direto de privacidade:{' '}
                  <a
                    href="mailto:privacidade@guialowcarb.com.br"
                    className="text-primary underline hover:text-primary/80"
                  >
                    privacidade@guialowcarb.com.br
                  </a>
                </p>
                <p className="text-xs text-muted-foreground pt-1">
                  Endereço profissional: Uberaba – MG, Brasil.
                </p>
              </div>
            </div>
          </section>

          {/* Links adicionais */}
          <div className="border-t pt-8 flex flex-wrap gap-4 justify-between items-center text-sm text-muted-foreground">
            <Link to="/termos-de-uso" className="text-primary hover:underline font-medium">
              Consulte também nossos Termos de Uso →
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
