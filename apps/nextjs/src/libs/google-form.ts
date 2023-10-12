function generateFormUrl(name?: string): string {
  const baseUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSefrWOE4gGzpWu-6MkRTsIYKUYCyWt1eoaplQb_huGJ7zfkqg/viewform?usp=pp_url";
  const entryParam = name ? `&entry.230693734=${encodeURIComponent(name)}` : "";
  return baseUrl + entryParam;
}

export { generateFormUrl };
