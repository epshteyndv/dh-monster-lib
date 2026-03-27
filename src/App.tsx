import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Code,
  Container,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { loadCatalog } from "./catalog";
import type { Monster } from "./types";

function sortedKeys(monster: Monster): string[] {
  return Object.keys(monster).sort((a, b) => {
    if (a === "id") return -1;
    if (b === "id") return 1;
    if (a === "name") return -1;
    if (b === "name") return 1;
    return a.localeCompare(b);
  });
}

export function App(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [selected, setSelected] = useState<Monster | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCatalog()
      .then((catalog) => {
        if (cancelled) return;
        setMonsters(catalog.monsters);
        setSelected(catalog.monsters[0] ?? null);
        setLoading(false);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Container py="xl">
        <Group justify="center" py="xl">
          <Loader size="md" />
          <Text c="dimmed">Загрузка каталога…</Text>
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py="xl">
        <Alert variant="light" color="red" title="Ошибка загрузки" role="alert">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Title order={1} mb="lg">
        Каталог монстров
      </Title>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <Paper p="md" withBorder>
            <Title order={3} size="h4" mb="sm">
              Список
            </Title>
            <Stack gap="xs">
              {monsters.length === 0 ? (
                <Text c="dimmed" size="sm">
                  Нет записей. Добавьте монстров в data/monsters.yaml.
                </Text>
              ) : (
                monsters.map((m) => (
                  <Button
                    key={m.id}
                    variant={selected?.id === m.id ? "filled" : "light"}
                    justify="flex-start"
                    fullWidth
                    onClick={() => setSelected(m)}
                  >
                    {m.name}
                  </Button>
                ))
              )}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 7 }}>
          <Paper p="md" withBorder>
            <Title order={3} size="h4" mb="sm">
              Карточка
            </Title>
            {!selected ? (
              <Text c="dimmed" size="sm">
                Выберите монстра в списке.
              </Text>
            ) : (
              <Stack gap="sm">
                {sortedKeys(selected).map((key) => {
                  const value = selected[key];
                  return (
                    <div key={key}>
                      <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                        {key}
                      </Text>
                      {value !== null && typeof value === "object" ? (
                        <Code block mt={4}>
                          {JSON.stringify(value, null, 2)}
                        </Code>
                      ) : (
                        <Text mt={4}>{String(value)}</Text>
                      )}
                    </div>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
