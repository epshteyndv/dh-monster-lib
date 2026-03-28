import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Group,
  Modal,
  MultiSelect,
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
  const [tierValues, setTierValues] = useState<string[]>([]);
  const [roleValues, setRoleValues] = useState<string[]>([]);

  useEffect(() => {
    if (!opened) {
      setTierValues([]);
      setRoleValues([]);
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
      const tierOk =
        tierValues.length === 0 || tierValues.includes(String(m.tier));
      const roleOk = roleValues.length === 0 || roleValues.includes(m.role);
      return tierOk && roleOk;
    });
  }, [monsters, tierValues, roleValues]);

  const hasCatalog = monsters.length > 0;
  const noMatchesFiltered =
    hasCatalog && filtered.length === 0 && (tierValues.length > 0 || roleValues.length > 0);

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
            <MultiSelect
              label="Tier"
              placeholder="Любой"
              data={tierOptions}
              value={tierValues}
              onChange={setTierValues}
              clearable
            />
            <MultiSelect
              label="Role"
              placeholder="Любой"
              data={roleOptions}
              value={roleValues}
              onChange={setRoleValues}
              clearable
            />
          </>
        ) : null}
        <ScrollArea.Autosize mah="min(70vh, 480px)" type="auto">
          <Stack gap="xs">
            {!hasCatalog ? (
              <Text c="dimmed" size="sm">
                Нет записей. Добавьте монстров в data/monsters.yaml.
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
