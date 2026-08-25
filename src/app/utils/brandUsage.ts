export const getStaticPeopleUsedToday = (brandKey: string): number => {
  let hash = 0;
  for (let i = 0; i < brandKey.length; i++) {
    hash = (hash << 5) - hash + brandKey.charCodeAt(i);
    hash |= 0;
  }
  return 100 + (Math.abs(hash) % 900);
};
