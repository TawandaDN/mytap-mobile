function pickReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('spend') || t.includes('money') || t.includes('month')) return canned.spend;
  if (t.includes('data') || t.includes('bundle') || t.includes('gb')) return canned.data;
  if (t.includes('save') || t.includes('tip') || t.includes('budget')) return canned.save;
  return canned.default;
}