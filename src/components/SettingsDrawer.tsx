import { Drawer, NumberInput, Stack, Text } from "@mantine/core";
import {
  PARTY_SIZE_MAX,
  PARTY_SIZE_MIN,
} from "../encounterDifficulty";

export type SettingsDrawerProps = {
  opened: boolean;
  onClose: () => void;
  partySize: number;
  onPartySizeChange: (n: number) => void;
};

export function SettingsDrawer({
  opened,
  onClose,
  partySize,
  onPartySizeChange,
}: SettingsDrawerProps): JSX.Element {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Настройки"
      position="left"
      size="sm"
    >
      <Stack gap="xs">
        <NumberInput
          label="Размер группы"
          description="Влияет на сложность и силу группы"
          min={PARTY_SIZE_MIN}
          max={PARTY_SIZE_MAX}
          value={partySize}
          onChange={(v) => {
            if (typeof v === "number") onPartySizeChange(v);
          }}
        />
        <Text c="dimmed" size="xs">
          Значение сохраняется в браузере.
        </Text>
      </Stack>
    </Drawer>
  );
}
