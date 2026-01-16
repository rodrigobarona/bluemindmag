import type { IssueTranslation } from '../../types/content';

// ============================================
// PORTUGUESE ISSUE TRANSLATIONS
// ============================================

export const issueTranslations: Record<string, IssueTranslation> = {
  'issue-0': {
    title: 'Edição 0',
    subtitle: 'Janeiro 2026',
    description:
      'A nossa edição inaugural explorando onde o surf e a ciência se encontram. Com investigação inovadora, histórias inspiradoras de surfistas e cientistas, e perspetivas sobre o poder terapêutico do oceano.',
    highlights: {
      'editors-note': {
        title: 'Nota do Editor',
        author: 'Pedro Seixas, PT, PhD',
        excerpt:
          'O surf sempre foi mais do que um desporto. É uma ligação à natureza, uma forma de terapia e um estilo de vida que molda quem somos. Bem-vindos à Blue Mind Magazine.',
      },
      'meet-the-scientist': {
        title: 'Conheça o Cientista',
        author: 'Equipa Blue Mind',
        excerpt:
          'Descubra os investigadores que estão a expandir as fronteiras da ciência do surf e da saúde oceânica. O seu trabalho está a mudar a forma como entendemos a relação entre os humanos e o mar.',
      },
      'students-peak': {
        title: 'Pico do Estudante',
        author: 'Equipa Blue Mind',
        excerpt:
          'A próxima geração de cientistas do surf partilha as suas pesquisas e paixão por combinar rigor académico com a prática de ondas.',
      },
      'surf-science-explained': {
        title: 'Ciência do Surf Explicada',
        author: 'Equipa Blue Mind',
        excerpt:
          'Simplificando conceitos científicos complexos em conhecimentos acessíveis que qualquer surfista pode aplicar para melhorar a sua saúde e performance.',
      },
      'meet-the-surfer': {
        title: 'Conheça o Surfista',
        author: 'Equipa Blue Mind',
        excerpt:
          'Histórias pessoais da comunidade surfista sobre como o oceano transformou as suas vidas, saúde e perspetiva.',
      },
    },
  },
};

// Helper function
export function getIssueTranslation(
  issueId: string
): IssueTranslation | undefined {
  return issueTranslations[issueId];
}

