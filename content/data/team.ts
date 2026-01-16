import type { TeamMember } from '../types/content';

// ============================================
// BLUE MIND MAGAZINE - TEAM DATA
// ============================================

export const team: TeamMember[] = [
  {
    id: 'pedro-seixas',
    role: 'editor',
    image: '/images/team/pedro-seixas.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/pedro-seixas-31934230/',
      instagram: 'https://www.instagram.com/seixasbay/',
    },
  },
  {
    id: 'surfisio',
    role: 'publisher',
    image: '/images/team/surfisio-logo.png',
    social: {
      website: 'https://surfisio.pt',
      linkedin: 'https://www.linkedin.com/company/surfisio/',
      instagram: 'https://www.instagram.com/surfisio/',
    },
  },
];

// Helper functions
export function getTeamMemberById(id: string): TeamMember | undefined {
  return team.find((member) => member.id === id);
}

export function getTeamMembersByRole(role: TeamMember['role']): TeamMember[] {
  return team.filter((member) => member.role === role);
}

export function getEditor(): TeamMember | undefined {
  return team.find((member) => member.role === 'editor');
}

export function getPublisher(): TeamMember | undefined {
  return team.find((member) => member.role === 'publisher');
}

