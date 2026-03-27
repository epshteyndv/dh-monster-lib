import { Card, Group, Paper, Stack, Text, Title } from "@mantine/core";
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
      <Text size="sm" fw={600}>
        {head}
      </Text>
      <Text size="sm" mt={6} style={{ whiteSpace: "pre-wrap" }}>
        {f.description}
      </Text>
    </div>
  );
}

export function MonsterCard({ monster }: { monster: Monster }): JSX.Element {
  const { stats } = monster;
  const atk = stats.attack;
  const atkStr = `${atk.atk >= 0 ? "+" : ""}${atk.atk}`;
  const flavor = monster.flavor?.trim();
  const motives = monster.motives?.trim();
  const experienceLines = monster.experience?.filter((s) => s.trim()) ?? [];

  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      <Stack gap="sm">
        <Title order={2} tt="uppercase" fw={800} size="h3">
          {monster.name}
        </Title>
        <Text fw={700}>
          Tier {monster.tier} {monster.role}
        </Text>
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
          </Stack>
        </Paper>

        {experienceLines.length > 0 ? (
          <Stack gap={4}>
            <Text size="sm" fw={700}>
              Experience:
            </Text>
            <Stack gap={2} pl="md">
              {experienceLines.map((line, i) => (
                <Text key={i} size="sm">
                  • {line.trim()}
                </Text>
              ))}
            </Stack>
          </Stack>
        ) : null}

        <Title order={5} tt="uppercase" size="sm" mt="xs">
          Features
        </Title>
        <Stack gap="md">
          {monster.features.map((f, i) => (
            <FeatureBlock key={`${f.name}-${i}`} f={f} />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
