import { useEffect, useMemo } from "react";
import {
  Alert,
  Button,
  Container,
  Group,
  HoverCard,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AddMonsterModal } from "./components/AddMonsterModal";
import { MonsterCard } from "./components/MonsterCard";
import {
  computeBalanceText,
  computeEncounterDifficulty,
  computePartyStrength,
} from "./encounterDifficulty";
import { useCatalogStore } from "./stores/catalogStore";
import { useEncounterStore } from "./stores/encounterStore";
import type { Monster } from "./types";
import { useEncounterUrlSync } from "./useEncounterUrlSync";

type EncounterGroup = {
  monster: Monster;
  instances: { instanceId: string }[];
};

export function App(): JSX.Element {
  const partySizes = [3, 4, 5] as const;

  const monsters = useCatalogStore((s) => s.monsters);
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);
  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);

  const encounter = useEncounterStore((s) => s.encounter);
  const addMonster = useEncounterStore((s) => s.addMonster);
  const removeEntry = useEncounterStore((s) => s.removeEntry);

  const encounterRoles = useMemo(
    () => encounter.map((e) => e.monster.role),
    [encounter]
  );
  const hoverMetrics = useMemo(
    () =>
      partySizes.map((size) => ({
        size,
        balanceText: computeBalanceText(encounterRoles, size),
      })),
    [encounterRoles]
  );
  const encounterGroups = useMemo(() => {
    const groups: EncounterGroup[] = [];
    const byMonsterId = new Map<string, EncounterGroup>();
    for (const entry of encounter) {
      const key = entry.monster.id;
      const existing = byMonsterId.get(key);
      if (existing) {
        existing.instances.push({ instanceId: entry.instanceId });
        continue;
      }
      const nextGroup: EncounterGroup = {
        monster: entry.monster,
        instances: [{ instanceId: entry.instanceId }],
      };
      byMonsterId.set(key, nextGroup);
      groups.push(nextGroup);
    }
    return groups;
  }, [encounter]);

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
      <Group justify="space-between" align="center" wrap="wrap" gap="sm" pb={16}>
        <HoverCard shadow="md" openDelay={100} closeDelay={100} position="bottom-start">
          <HoverCard.Target>
            <Title order={1} style={{ cursor: "help" }}>
              Энкаунтер
            </Title>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Stack gap={4}>
              {hoverMetrics.map((m) => (
                <Text size="sm" key={m.size}>
                  Для {m.size} - {" "} {m.balanceText}
                </Text>
              ))}
            </Stack>
          </HoverCard.Dropdown>
        </HoverCard>

        <Group>
          <Button onClick={openAddModal}>Добавить</Button>
        </Group>
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
          {encounterGroups.map((group) => (
            <MonsterCard
              key={group.monster.id}
              monster={group.monster}
              encounterInstances={group.instances.map((instance) => ({
                instanceId: instance.instanceId,
                onRemove: () => removeEntry(instance.instanceId),
              }))}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
