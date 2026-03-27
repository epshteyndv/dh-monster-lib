import "./style.css";

export interface Monster {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface Catalog {
  monsters: Monster[];
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Record<string, string | boolean>,
  children?: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") node.className = String(v);
      else if (k.startsWith("data-")) node.setAttribute(k, String(v));
      else if (typeof v === "boolean") {
        if (v) node.setAttribute(k, "");
      } else node.setAttribute(k, String(v));
    }
  }
  if (children) {
    for (const c of children) {
      node.append(typeof c === "string" ? document.createTextNode(c) : c);
    }
  }
  return node;
}

async function loadCatalog(): Promise<Catalog> {
  const url = `${import.meta.env.BASE_URL}monsters.json`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Не удалось загрузить каталог (${msg}). Проверьте сеть и путь к сайту.`);
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
    throw new Error("Неверный формат каталога: ожидался объект с полем monsters[].");
  }
  return data as Catalog;
}

function renderFields(monster: Monster): HTMLElement {
  const keys = Object.keys(monster).sort((a, b) => {
    if (a === "id") return -1;
    if (b === "id") return 1;
    if (a === "name") return -1;
    if (b === "name") return 1;
    return a.localeCompare(b);
  });
  const dl = el("dl", { class: "fields" });
  for (const key of keys) {
    const value = monster[key];
    const dt = el("dt", {}, [key]);
    const dd = el("dd", {});
    if (value !== null && typeof value === "object") {
      dd.append(el("pre", { class: "json" }, [JSON.stringify(value, null, 2)]));
    } else {
      dd.append(document.createTextNode(String(value)));
    }
    dl.append(dt, dd);
  }
  return dl;
}

function main(): void {
  const root = document.getElementById("app");
  if (!root) return;

  root.append(el("h1", {}, ["Каталог монстров"]));

  const loading = el("p", { class: "loading" }, ["Загрузка каталога…"]);
  root.append(loading);

  loadCatalog()
    .then((catalog) => {
      loading.remove();

      const layout = el("div", { class: "layout" });
      const listPanel = el("section", { class: "panel" });
      listPanel.append(el("h2", {}, ["Список"]));

      const ul = el("ul", { class: "monster-list" });
      const detailPanel = el("section", { class: "panel" });
      detailPanel.append(el("h2", {}, ["Карточка"]));
      const detailBody = el("div", { class: "detail-body" });
      detailPanel.append(detailBody);

      function showDetail(m: Monster): void {
        detailBody.replaceChildren(renderFields(m));
        for (const btn of ul.querySelectorAll("button")) {
          const id = btn.getAttribute("data-id");
          btn.setAttribute("aria-current", id === m.id ? "true" : "false");
        }
      }

      for (const m of catalog.monsters) {
        const btn = el(
          "button",
          { type: "button", "data-id": m.id },
          [m.name]
        );
        btn.addEventListener("click", () => showDetail(m));
        ul.append(el("li", {}, [btn]));
      }

      listPanel.append(ul);

      if (catalog.monsters.length > 0) {
        showDetail(catalog.monsters[0]);
      } else {
        detailBody.append(
          el("p", {}, ["Нет записей. Добавьте монстров в data/monsters.yaml."])
        );
      }

      layout.append(listPanel, detailPanel);
      root.append(layout);
    })
    .catch((err: unknown) => {
      loading.remove();
      const message = err instanceof Error ? err.message : String(err);
      root.append(
        el("div", { class: "error", role: "alert" }, [
          el("strong", {}, ["Ошибка загрузки"]),
          document.createTextNode(" " + message),
        ])
      );
    });
}

main();
