import { useEffect } from "react";
import {
  Alert,
  Button,
  CloseButton,
  Container,
  Grid,
  Group,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MonsterCard } from "./components/MonsterCard";
import { formatMonsterTierLine } from "./formatMonsterTierLine";
import { useCatalogStore } from "./stores/catalogStore";
import { useEncounterStore } from "./stores/encounterStore";
import type { Monster } from "./types";

export function App(): JSX.Element {
  const monsters = useCatalogStore((s) => s.monsters);
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);
  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);

  const encounter = useEncounterStore((s) => s.encounter);
  const focusedId = useEncounterStore((s) => s.focusedId);
  const addMonster = useEncounterStore((s) => s.addMonster);
  const removeEntry = useEncounterStore((s) => s.removeEntry);
  const focusEntry = useEncounterStore((s) => s.focusEntry);

  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);

  useEffect(() => {
    void fetchCatalog();
  }, [fetchCatalog]);

  const focusedMonster =
    focusedId === null
      ? null
      : encounter.find((e) => e.instanceId === focusedId)?.monster ?? null;

  const pickMonster = (m: Monster) => {
    addMonster(m);
    closeAddModal();
  };

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
    <Container size="xl" py="md">
      <Group justify="space-between" align="flex-start" mb="lg" wrap="wrap" gap="sm">
        <Title order={1}>Каталог монстров</Title>
        <Button onClick={openAddModal}>Добавить в энкаунтер</Button>
      </Group>

      <Modal
        opened={addModalOpened}
        onClose={closeAddModal}
        title="Выберите монстра"
        size="lg"
        centered
      >
        <ScrollArea.Autosize mah="min(70vh, 480px)" type="auto">
          <Stack gap="xs">
            {monsters.length === 0 ? (
              <Text c="dimmed" size="sm">
                Нет записей. Добавьте монстров в data/monsters.yaml.
              </Text>
            ) : (
              monsters.map((m) => (
                <Button
                  key={m.id}
                  variant="light"
                  justify="flex-start"
                  fullWidth
                  onClick={() => pickMonster(m)}
                >
                  <Group
                    gap={2}
                    align="center"
                    justify="space-between"
                    wrap="nowrap"
                    style={{ width: "100%" }}
                  >
                    <Text
                      size="sm"
                      fw={600}
                      lh={1.3}
                      style={{ flex: 1, textAlign: "left" }}
                    >
                      {m.name}
                    </Text>
                    <Text size="xs" c="dimmed" lh={1.2} ta="right">
                      {formatMonsterTierLine(m)}
                    </Text>
                  </Group>
                </Button>
              ))
            )}
          </Stack>
        </ScrollArea.Autosize>
      </Modal>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <Paper p="md" withBorder>
            <Title order={3} size="h4" mb="sm">
              Энкаунтер
            </Title>
            {encounter.length === 0 ? (
              <Text c="dimmed" size="sm">
                Нажмите «Добавить в энкаунтер» в шапке, чтобы открыть список.
                Один и тот же монстр можно добавить несколько раз.
              </Text>
            ) : (
              <Stack gap="xs">
                {encounter.map((e) => (
                  <Group
                    key={e.instanceId}
                    wrap="nowrap"
                    gap="xs"
                    align="stretch"
                  >
                    <Button
                      variant={
                        focusedId === e.instanceId ? "filled" : "light"
                      }
                      justify="flex-start"
                      style={{ flex: 1 }}
                      onClick={() => focusEntry(e.instanceId)}
                    >
                      <Stack gap={2} align="flex-start">
                        <Text size="sm" fw={600} lh={1.3}>
                          {e.monster.name}
                        </Text>
                        <Text size="xs" c="dimmed" lh={1.2}>
                          {formatMonsterTierLine(e.monster)}
                        </Text>
                      </Stack>
                    </Button>
                    <CloseButton
                      aria-label="Убрать из энкаунтера"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        removeEntry(e.instanceId);
                      }}
                    />
                  </Group>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 7 }}>
          {!focusedMonster ? (
            <Paper p="md" withBorder>
              <Text c="dimmed" size="sm">
                {encounter.length === 0
                  ? "Энкаунтер пуст — добавьте монстров через кнопку в шапке."
                  : "Выберите экземпляр в энкаунтере, чтобы открыть карточку."}
              </Text>
            </Paper>
          ) : (
            <MonsterCard monster={focusedMonster} />
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
