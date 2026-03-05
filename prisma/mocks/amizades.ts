// Referência de usuários:
// 2 = Prof. Ana Lima | 3 = Prof. Carlos Rocha | 4 = Prof. Mariana Souza
// 5 = João Silva | 6 = Maria Santos | 7 = Pedro Costa | 8 = Fernanda Alves | 9 = Lucas Pereira

export const amizadesMock = [
  // Amizades aceitas
  {
    id: 1,
    solicitanteId: 2,
    receptorId: 5,
    status: 'ACEITO',
    createdAt: new Date('2025-02-15 10:00:00'),
    updatedAt: new Date('2025-02-15 10:30:00'),
  },
  {
    id: 2,
    solicitanteId: 2,
    receptorId: 6,
    status: 'ACEITO',
    createdAt: new Date('2025-02-15 10:05:00'),
    updatedAt: new Date('2025-02-15 10:35:00'),
  },
  {
    id: 3,
    solicitanteId: 3,
    receptorId: 5,
    status: 'ACEITO',
    createdAt: new Date('2025-02-16 09:00:00'),
    updatedAt: new Date('2025-02-16 09:20:00'),
  },
  {
    id: 4,
    solicitanteId: 5,
    receptorId: 6,
    status: 'ACEITO',
    createdAt: new Date('2025-02-17 14:00:00'),
    updatedAt: new Date('2025-02-17 14:10:00'),
  },
  {
    id: 5,
    solicitanteId: 5,
    receptorId: 7,
    status: 'ACEITO',
    createdAt: new Date('2025-02-18 11:00:00'),
    updatedAt: new Date('2025-02-18 11:45:00'),
  },
  {
    id: 6,
    solicitanteId: 6,
    receptorId: 8,
    status: 'ACEITO',
    createdAt: new Date('2025-02-19 16:00:00'),
    updatedAt: new Date('2025-02-19 16:20:00'),
  },
  // Solicitações pendentes
  {
    id: 7,
    solicitanteId: 7,
    receptorId: 9,
    status: 'PENDENTE',
    createdAt: new Date('2025-03-01 09:00:00'),
    updatedAt: new Date('2025-03-01 09:00:00'),
  },
  {
    id: 8,
    solicitanteId: 4,
    receptorId: 9,
    status: 'PENDENTE',
    createdAt: new Date('2025-03-02 14:00:00'),
    updatedAt: new Date('2025-03-02 14:00:00'),
  },
  // Solicitação rejeitada
  {
    id: 9,
    solicitanteId: 8,
    receptorId: 9,
    status: 'REJEITADO',
    createdAt: new Date('2025-02-20 10:00:00'),
    updatedAt: new Date('2025-02-20 10:30:00'),
  },
]
