import { useEffect, useMemo } from "react";
import {
  Alert,
  Button,
  Container,
  Group,
  Loader,
  NumberInput,
  Stack,
  Slider,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AddMonsterModal } from "./components/AddMonsterModal";
import { MonsterCard } from "./components/MonsterCard";
import {
  computeEncounterDifficulty,
  computePartyStrength,
  PARTY_SIZE_MAX,
  PARTY_SIZE_MIN,
} from "./encounterDifficulty";
import { useCatalogStore } from "./stores/catalogStore";
import { useEncounterStore } from "./stores/encounterStore";
import type { Monster } from "./types";
import { useEncounterUrlSync } from "./useEncounterUrlSync";

export function App(): JSX.Element {
  const monsters = useCatalogStore((s) => s.monsters);
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);
  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);

  const encounter = useEncounterStore((s) => s.encounter);
  const partySize = useEncounterStore((s) => s.partySize);
  const setPartySize = useEncounterStore((s) => s.setPartySize);
  const addMonster = useEncounterStore((s) => s.addMonster);
  const removeEntry = useEncounterStore((s) => s.removeEntry);

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

        <Group align="center">
          <Text span fw={700} component="span">
            Группа{" "}
          </Text>
          
          <div style={{ width: 100 }}>
            <Slider
              color="blue"
              defaultValue={4}
              min={3}
              max={5}
              marks={[
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
              ]}
              value={partySize}
              onChange={(v) => {
                if (typeof v === "number") setPartySize(v);
              }}
            />
          </div>
        </Group>

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

        <Button onClick={openAddModal}>Добавить</Button>
      </Group>

      <AddMonsterModal
        opened={addModalOpened}
        onClose={closeAddModal}
        monsters={monsters}
        onPick={pickMonster}
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
