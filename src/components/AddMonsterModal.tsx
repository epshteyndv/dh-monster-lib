import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Group,
  Modal,
  Select,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { formatMonsterTierLine } from "../formatMonsterTierLine";
import type { Monster } from "../types";

export type AddMonsterModalProps = {
  opened: boolean;
  onClose: () => void;
  monsters: Monster[];
  onPick: (monster: Monster) => void;
};

export function AddMonsterModal({
  opened,
  onClose,
  monsters,
  onPick,
}: AddMonsterModalProps): JSX.Element {
  const [tierValue, setTierValue] = useState<string | null>(null);
  const [roleValue, setRoleValue] = useState<string | null>(null);

  useEffect(() => {
    if (!opened) {
      setTierValue(null);
      setRoleValue(null);
    }
  }, [opened]);

  const tierOptions = useMemo(() => {
    const tiers = new Set<number>();
    for (const m of monsters) tiers.add(m.tier);
    return [...tiers]
      .sort((a, b) => a - b)
      .map((t) => ({ value: String(t), label: `Tier ${t}` }));
  }, [monsters]);

  const roleOptions = useMemo(() => {
    const roles = new Set<string>();
    for (const m of monsters) roles.add(m.role);
    return [...roles]
      .sort((a, b) => a.localeCompare(b))
      .map((r) => ({ value: r, label: r }));
  }, [monsters]);

  const filtered = useMemo(() => {
    return monsters.filter((m) => {
      const tierOk = tierValue === null || String(m.tier) === tierValue;
      const roleOk = roleValue === null || m.role === roleValue;
      return tierOk && roleOk;
    });
  }, [monsters, tierValue, roleValue]);

  const hasCatalog = monsters.length > 0;
  const noMatchesFiltered =
    hasCatalog && filtered.length === 0 && (tierValue !== null || roleValue !== null);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Выберите монстра"
      size="lg"
      centered
    >
      <Stack gap="sm">
        {hasCatalog ? (
          <>
            <Select
              label="Tier"
              placeholder="Любой"
              data={tierOptions}
              value={tierValue}
              onChange={setTierValue}
              clearable
            />
            <Select
              label="Role"
              placeholder="Любой"
              data={roleOptions}
              value={roleValue}
              onChange={setRoleValue}
              clearable
            />
          </>
        ) : null}
        <ScrollArea.Autosize mah="min(70vh, 480px)" type="auto">
          <Stack gap="xs">
            {!hasCatalog ? (
              <Text c="dimmed" size="sm">
                Нет записей. Добавьте YAML с карточками в data/monsters/.
              </Text>
            ) : noMatchesFiltered ? (
              <Text c="dimmed" size="sm">
                Нет монстров по выбранным фильтрам. Измените фильтры.
              </Text>
            ) : (
              filtered.map((m) => (
                <Button
                  key={m.id}
                  variant="light"
                  justify="flex-start"
                  fullWidth
                  onClick={() => onPick(m)}
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
      </Stack>
    </Modal>
  );
}
