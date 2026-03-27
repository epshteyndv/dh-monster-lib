import type { Catalog } from "./types";

export async function loadCatalog(): Promise<Catalog> {
  const url = `${import.meta.env.BASE_URL}monsters.json`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Не удалось загрузить каталог (${msg}). Проверьте сеть и путь к сайту.`
    );
  }
  if (!res.ok) {
    throw new Error(
      `Каталог недоступен (HTTP ${res.status}). Убедитесь, что сборка создала monsters.json и base path совпадает с URL GitHub Pages.`
    );
  }
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Ответ сервера не является корректным JSON.");
  }
  if (
    !data ||
    typeof data !== "object" ||
    !Array.isArray((data as Catalog).monsters)
  ) {
    throw new Error(
      "Неверный формат каталога: ожидался объект с полем monsters[]."
    );
  }
  return data as Catalog;
}
