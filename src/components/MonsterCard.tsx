import { Card, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { Monster, MonsterFeature } from "../types";

const TYPE_LABEL: Record<string, string> = {
  passive: "Passive",
  action: "Action",
  reaction: "Reaction",
};

function FeatureBlock({ f }: { f: MonsterFeature }): JSX.Element {
  const ty = TYPE_LABEL[f.type] ?? f.type;
  const head =
    f.cost !== undefined
      ? `${f.name} (${f.cost}) - ${ty}:`
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

  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      <Stack gap="sm">
        <Title order={2} tt="uppercase" fw={800} size="h3">
          {monster.name}
        </Title>
        <Text fw={700}>{monster.tier}</Text>
        <Text fs="italic" c="dimmed" size="sm">
          {monster.flavor}
        </Text>
        <Text size="sm">
          <Text span fw={700}>
            Motives & Tactics:
          </Text>{" "}
          {monster.motives}
        </Text>

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

        <Text size="sm">
          <Text span fw={700}>
            Experience:
          </Text>{" "}
          {monster.experience}
        </Text>

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
