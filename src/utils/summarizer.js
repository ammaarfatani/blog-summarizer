export function summarizeText(text, mode) {
  if (!text) return "";

  const sentences = text
    .replace(/\n+/g, " ")
    .split(".")
    .map(s => s.trim())
    .filter(Boolean);

  if (mode === "short") {
    return sentences.slice(0, 2).join(". ") + ".";
  }

  if (mode === "medium") {
    return sentences.slice(0, 5).join(". ") + ".";
  }

  if (mode === "bullets") {
    return sentences.slice(0, 5).map(s => `• ${s}`).join("\n");
  }

  return "";
}
