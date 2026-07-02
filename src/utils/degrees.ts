export const DEGREES_MAP: Record<number, string> = {
  1: 'Aprendiz',
  2: 'Companheiro',
  3: 'Mestre',
  4: 'Mestre Secreto',
  5: 'Mestre Perfeito',
  6: 'Preboste e Juiz',
  7: 'Primeiro Eleito ou Eleito dos Nove',
  8: 'Segundo Eleito ou Eleito Pérpignan',
  9: 'Terceiro Eleito ou Eleito dos Quinze',
  10: 'Aprendiz Escocês ou pequeno Arquitecto',
  11: 'Companheiro Escocês ou Grão Mestre Arquiteto',
  12: 'Mestre Escocês ou Grão-Mestre Arquiteto',
  13: 'Cavaleiro do Real Arco',
  14: 'Grande Eleito ou Perfeito e Sublime Maçom',
  15: 'Cavaleiro do Oriente, da Espada ou da Águia',
  16: 'Príncipe de Jerusalém',
  17: 'Cavaleiro do Oriente e do Ocidente',
  18: 'Cavaleiro Rosa+Cruz',
  19: 'Grande Pontífice ou Sublime Escocês',
  20: 'Venerável Mestre das Lojas Regulares ou Mestre Ad Vitam',
  21: 'Cavaleiro Noaquita ou Cavaleiro Prussiano',
  22: 'Cavaleiro do Real Machado ou Príncipe do Líbano',
  23: 'Chefe do Tabernáculo',
  24: 'Príncipe do Tabernáculo',
  25: 'Cavaleiro da Serpente de Bronze',
  26: 'Príncipe da Mercê ou Escocês Trinitário',
  27: 'Grande Comendador do Templo',
  28: 'Cavaleiro do Sol ou Príncipe Adepto',
  29: 'Cavaleiro de Santo André',
  30: 'Cavaleiro Kadosch',
  31: 'Sublime Iniciado e Grande Preceptor',
  32: 'Prelado Corregedor e Ouvidor Geral',
  33: 'Patriarca Inspetor Geral'
};

export const getDegreeName = (level: number): string => {
  return DEGREES_MAP[level] || `Grau ${level}`;
};

export const getDegreeLabel = (level: number): string => {
  const name = DEGREES_MAP[level];
  if (name) {
    return `Grau ${level} – ${name}`;
  }
  return `Grau ${level}`;
};
