import { useCallback, useEffect, useMemo, useState } from "react";
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
import { computeBalanceText } from "./encounterDifficulty";
import {
  ENCOUNTER_SHARE_URL_PARAM,
  encodeEncounterPayload,
  encounterToPayload,
  MAX_ENCOUNTER_URL_PARAM_LENGTH,
} from "./encounterUrlCodec";
import { useCatalogStore } from "./stores/catalogStore";
import { useEncounterStore } from "./stores/encounterStore";
import type { Monster } from "./types";
import { useEncounterUrlSync } from "./useEncounterUrlSync";

type EncounterGroup = {
  monster: Monster;
  instances: { instanceId: string }[];
};

export function EncounterPage(): JSX.Element {
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
  const [shareHint, setShareHint] = useState<string | null>(null);

  const shareUrlTooLong = useMemo(() => {
    const ids = encounter.map((e) => e.monster.id);
    const encoded = encodeEncounterPayload(encounterToPayload(ids));
    return encoded.length > MAX_ENCOUNTER_URL_PARAM_LENGTH;
  }, [encounter]);

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

  const copyShareLink = useCallback(async () => {
    if (shareUrlTooLong) return;
    const ids = encounter.map((e) => e.monster.id);
    const encoded = encodeEncounterPayload(encounterToPayload(ids));
    const url = new URL(
      `${window.location.origin}${window.location.pathname}`
    );
    url.searchParams.set(ENCOUNTER_SHARE_URL_PARAM, encoded);
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareHint("Ссылка скопирована");
    } catch {
      setShareHint("Не удалось скопировать в буфер");
    }
  }, [encounter, shareUrlTooLong]);

  useEffect(() => {
    if (!shareHint) return;
    const t = window.setTimeout(() => setShareHint(null), 2500);
    return () => window.clearTimeout(t);
  }, [shareHint]);

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
          <Button
            variant="default"
            disabled={shareUrlTooLong}
            title={
              shareUrlTooLong
                ? "Слишком длинный энкаунтер для ссылки в URL"
                : "Скопировать ссылку для открытия энкаунтера у других"
            }
            onClick={() => void copyShareLink()}
          >
            Поделиться
          </Button>
          <Button onClick={openAddModal}>Добавить</Button>
        </Group>
      </Group>

      {shareHint ? (
        <Text size="sm" mb="xs">
          {shareHint}
        </Text>
      ) : null}

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
