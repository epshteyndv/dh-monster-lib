import { useEffect, useMemo } from "react";
import {
  Alert,
  Button,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AddMonsterModal } from "./components/AddMonsterModal";
import { MonsterCard } from "./components/MonsterCard";
import { SettingsDrawer } from "./components/SettingsDrawer";
import {
  computeEncounterDifficulty,
  computePartyStrength,
} from "./encounterDifficulty";
import { useCatalogStore } from "./stores/catalogStore";
import { useEncounterStore } from "./stores/encounterStore";
import { useSettingsStore } from "./stores/settingsStore";
import type { Monster } from "./types";
import { useEncounterUrlSync } from "./useEncounterUrlSync";

export function App(): JSX.Element {
  const monsters = useCatalogStore((s) => s.monsters);
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);
  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);

  const encounter = useEncounterStore((s) => s.encounter);
  const addMonster = useEncounterStore((s) => s.addMonster);
  const removeEntry = useEncounterStore((s) => s.removeEntry);
  const partySize = useSettingsStore((s) => s.partySize);
  const setPartySize = useSettingsStore((s) => s.setPartySize);

  const encounterRoles = useMemo(
    () => encounter.map((e) => e.monster.role),
    [encounter]
  );
  const encounterDifficulty = useMemo(
    () => computeEncounterDifficulty(encounterRoles, partySize),
    [encounterRoles, partySize]
  );
  const partyStrength = useMemo(
    () => computePartyStrength(partySize),
    [partySize]
  );

  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);

  useEffect(() => {
    void fetchCatalog();
  }, [fetchCatalog]);

  useEncounterUrlSync({ loading, monsters });

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
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Title order={1}>
          Энкаунтер
        </Title>

        <Text size="sm">
          Сложность:{" "}
          <Text span fw={700} component="span">
            {encounterDifficulty}
          </Text>
        </Text>

        <Text size="sm">
          Сила группы:{" "}
          <Text span fw={700} component="span">
            {partyStrength}
          </Text>
        </Text>

        <Group>
          <Button variant="default" onClick={openSettings}>
            Настройки
          </Button>
          <Button onClick={openAddModal}>Добавить</Button>
        </Group>
      </Group>

      <AddMonsterModal
        opened={addModalOpened}
        onClose={closeAddModal}
        monsters={monsters}
        onPick={pickMonster}
      />
      <SettingsDrawer
        opened={settingsOpened}
        onClose={closeSettings}
        partySize={partySize}
        onPartySizeChange={setPartySize}
      />

      {encounter.length === 0 ? (
        <Text c="dimmed" size="sm">
          Энкаунтер пуст. Нажмите «Добавить в энкаунтер», чтобы выбрать монстров.
          Один и тот же монстр можно добавить несколько раз.
        </Text>
      ) : (
        <Stack gap="lg">
          {encounter.map((e) => (
            <MonsterCard
              key={e.instanceId}
              monster={e.monster}
              onRemoveFromEncounter={() => removeEntry(e.instanceId)}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
