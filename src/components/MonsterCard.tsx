import { Card, CloseButton, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { formatMonsterTierLine } from "../formatMonsterTierLine";
import type { Monster, MonsterFeature } from "../types";

const TYPE_LABEL: Record<string, string> = {
  passive: "Passive",
  action: "Action",
  reaction: "Reaction",
};

function FeatureBlock({ f }: { f: MonsterFeature }): JSX.Element {
  const ty = TYPE_LABEL[f.type] ?? f.type;
  const v = f.value?.trim();
  const head =
    v !== undefined && v.length > 0
      ? `${f.name} (${v}) - ${ty}:`
      : `${f.name} - ${ty}:`;
  return (
    <div>
      <Text span size="sm" fw={600}>
        {head}
      </Text>
      {" "}
      <Text span size="sm" mt={6} style={{ whiteSpace: "pre-wrap" }}>
        {f.description}
      </Text>
    </div>
  );
}

export function MonsterCard({
  monster,
  onRemoveFromEncounter,
}: {
  monster: Monster;
  onRemoveFromEncounter?: () => void;
}): JSX.Element {
  const { stats } = monster;
  const atk = stats.attack;
  const atkStr = `${atk.atk >= 0 ? "+" : ""}${atk.atk}`;
  const flavor = monster.flavor?.trim();
  const motives = monster.motives?.trim();
  const experienceLines = monster.experience?.filter((s) => s.trim()) ?? [];

  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
          <Title
            order={2}
            tt="uppercase"
            fw={800}
            size="h3"
            style={{ flex: 1, minWidth: 0 }}
          >
            {monster.name}
          </Title>
          {onRemoveFromEncounter ? (
            <CloseButton
              aria-label="Убрать из энкаунтера"
              onClick={onRemoveFromEncounter}
            />
          ) : null}
        </Group>
        <Text fw={700}>{formatMonsterTierLine(monster)}</Text>
        {flavor ? (
          <Text fs="italic" c="dimmed" size="sm">
            {monster.flavor}
          </Text>
        ) : null}
        {motives ? (
          <Text size="sm">
            <Text span fw={700}>
              Motives & Tactics:
            </Text>{" "}
            {motives}
          </Text>
        ) : null}

        <Paper withBorder p="sm" bg="var(--mantine-color-body)">
          <Stack gap="xs">
            <Group gap={6} wrap="wrap">
              <Text size="sm">
                <Text span fw={700}>
                  Difficulty
                </Text>{" "}
                {stats.difficulty}
              </Text>
              <Text c="dimmed" size="sm">
                |
              </Text>
              <Text size="sm">
                <Text span fw={700}>
                  Thresholds
                </Text>{" "}
                {stats.thresholds}
              </Text>
              <Text c="dimmed" size="sm">
                |
              </Text>
              <Text size="sm">
                <Text span fw={700}>
                  HP
                </Text>{" "}
                {stats.hp}
              </Text>
              <Text c="dimmed" size="sm">
                |
              </Text>
              <Text size="sm">
                <Text span fw={700}>
                  Stress
                </Text>{" "}
                {stats.stress}
              </Text>
            </Group>
            <Group gap={6} wrap="wrap">
              <Text size="sm">
                <Text span fw={700}>
                  ATK
                </Text>{" "}
                {atkStr}
              </Text>
              <Text c="dimmed" size="sm">
                |
              </Text>
              <Text size="sm">
                <Text span fw={700}>
                  {atk.name}
                </Text>
                : {atk.range}
              </Text>
              <Text c="dimmed" size="sm">
                |
              </Text>
              <Text size="sm">{atk.damage}</Text>
            </Group>
            {experienceLines.length > 0 ? (
              <Group gap={6} wrap="wrap">
                <Text size="sm">
                  <Text span fw={700}>
                    Experience
                  </Text>{" "}
                  {experienceLines.join(", ")}
                </Text>
              </Group>
            ) : null}
          </Stack>
        </Paper>

        <Title order={5} tt="uppercase" size="sm" mt="xs">
          Features
        </Title>
        <Stack gap="sm">
          {monster.features.map((f, i) => (
            <FeatureBlock key={`${f.name}-${i}`} f={f} />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
