import type {
  AboutSectionTranslation,
  TeamMemberTranslation,
} from '../../types/content';

// ============================================
// PORTUGUESE PAGE TRANSLATIONS
// ============================================

// About Page Sections
export const aboutSections: Record<string, AboutSectionTranslation> = {
  magazine: {
    title: 'Sobre a Blue Mind',
    description:
      'A Blue Mind Magazine pretende explicar a ciência que se faz em torno do surf, numa linguagem acessível a todos os surfistas',
  },
  mission: {
    title: 'A Nossa Missão',
    description:
      'A Blue Mind Magazine faz a ponte entre a investigação científica e a comunidade surfista. Explicamos estudos complexos em linguagem acessível para que possas viver mais o teu surf.',
  },
};

// Team Members
export const teamTranslations: Record<string, TeamMemberTranslation> = {
  'pedro-seixas': {
    name: 'Pedro Seixas',
    title: 'Editor-Chefe & Fundador',
    bio: 'Pedro Seixas é Fisioterapeuta há mais de 20 anos, Professor Universitário Doutorado em Movimento Humano/ Treino Desportivo e Coordenador Científico da Surfing Medicine International (SMI). Mas é sobretudo um apaixonado pelo surf, o que o levou a idealizar a Blue Mind Magazine para criar uma plataforma que une as suas duas maiores paixões: ciência e surf.',
  },
  surfisio: {
    name: 'Surfisio',
    title: 'Editora',
    bio: 'A Surfisio é uma empresa especializada em fisioterapia e performance desportiva dedicada à comunidade surfista. Fundada em 2011, a Surfisio opera sob a filosofia "We Drop The Pain!": prevenção, tratamento de lesões e otimização de performance para surfistas de todos os níveis.',
  },
};

// Supporter Descriptions
export const supporterTranslations: Record<
  string,
  { name: string; description: string }
> = {
  'surfing-medicine-international': {
    name: 'Surfing Medicine International',
    description:
      'A SMI é uma organização sem fins lucrativos fundada por médicos surfistas dedicados à ciência da medicina do surf. Desenvolvem investigação, programas de prevenção de lesões e plataformas educacionais para tornar o surf mais seguro e reconhecer os surfistas como socorristas-chave em situações de afogamento.',
  },
};

// Page Meta
export const pageMeta = {
  about: {
    title: 'Sobre',
    description:
      'Conheça a Blue Mind Magazine, a nossa missão e a equipa por detrás da publicação.',
  },
  contact: {
    title: 'Contacto',
    description:
      'Entre em contacto com a Blue Mind Magazine. Adoraríamos ouvir de si.',
  },
  newsletter: {
    title: 'Newsletter',
    description:
      'Subscreva a newsletter da Blue Mind Magazine para as últimas novidades em ciência do surf.',
  },
  issues: {
    title: 'Edições',
    description:
      'Explore todas as edições da Blue Mind Magazine. Onde o surf e a ciência se encontram.',
  },
};

// Contact Page
export const contactContent = {
  title: 'Entre em Contacto',
  subtitle: 'Adoraríamos ouvir de si',
  description:
    'Se tem uma pergunta sobre a nossa revista, quer contribuir com um artigo, ou está interessado em oportunidades de parceria, estamos aqui para ajudar.',
  form: {
    name: 'Nome',
    namePlaceholder: 'O seu nome',
    email: 'Email',
    emailPlaceholder: 'seu@email.com',
    subject: 'Assunto',
    subjectPlaceholder: 'Como podemos ajudar?',
    message: 'Mensagem',
    messagePlaceholder: 'A sua mensagem...',
    submit: 'Enviar Mensagem',
    submitting: 'A enviar...',
    success: 'Obrigado! A sua mensagem foi enviada.',
    error: 'Algo correu mal. Por favor tente novamente.',
  },
  info: {
    email: 'info@bluemindmag.com',
    response: 'Normalmente respondemos dentro de 48 horas.',
  },
};

// Newsletter Page
export const newsletterContent = {
  title: 'Mantenha-se Informado',
  subtitle: 'Onde surf & ciência se encontram, entregue na sua caixa de correio',
  description:
    'Junte-se à nossa comunidade de surfistas, cientistas e entusiastas do oceano. Receba conteúdo exclusivo, acesso antecipado a novas edições e conhecimentos do mundo da ciência do surf.',
  cta: 'Subscrever Agora',
  features: [
    'Anúncios de novas edições',
    'Conhecimentos exclusivos de ciência do surf',
    'Histórias e eventos da comunidade',
    'Acesso antecipado a conteúdos',
  ],
};

