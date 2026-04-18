import { Card, CloseButton, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { Fragment } from "react";
import { formatMonsterTierLine } from "../formatMonsterTierLine";
import type { Monster, MonsterFeature } from "../types";

const TYPE_LABEL: Record<string, string> = {
  passive: "Passive",
  action: "Action",
  reaction: "Reaction",
};

const FEATURE_DESC_KEYWORD_RE = /\b(Stress|Fear)\b/g;

type FeatureDescriptionSegment =
  | { kind: "text"; text: string }
  | { kind: "keyword"; keyword: "Stress" | "Fear" };

/** Splits feature description for whole-word Stress/Fear highlighting (exact case). */
function splitFeatureDescriptionForHighlights(description: string): FeatureDescriptionSegment[] {
  const segments: FeatureDescriptionSegment[] = [];
  let lastIndex = 0;
  const re = new RegExp(FEATURE_DESC_KEYWORD_RE.source, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(description)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "text", text: description.slice(lastIndex, match.index) });
    }
    segments.push({ kind: "keyword", keyword: match[1] as "Stress" | "Fear" });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < description.length) {
    segments.push({ kind: "text", text: description.slice(lastIndex) });
  }
  if (segments.length === 0) {
    segments.push({ kind: "text", text: description });
  }
  return segments;
}

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
        {splitFeatureDescriptionForHighlights(f.description).map((seg, i) =>
          seg.kind === "keyword" ? (
            <Text key={i} component="span" span size="sm" fw={700} fs="italic">
              {seg.keyword}
            </Text>
          ) : (
            <Fragment key={i}>{seg.text}</Fragment>
          )
        )}
      </Text>
    </div>
  );
}

export function MonsterCard({
  monster,
  encounterInstances,
}: {
  monster: Monster;
  encounterInstances: { instanceId: string; onRemove: () => void }[];
}): JSX.Element {
  const { stats } = monster;
  const atk = stats.attack;
  const atkStr = `${atk.atk >= 0 ? "+" : ""}${atk.atk}`;
  const flavor = monster.flavor?.trim();
  const motives = monster.motives?.trim();
  const experienceLines = monster.experience?.filter((s) => s.trim()) ?? [];

  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      {encounterInstances.map((instance, index) => (
        <Card.Section key={instance.instanceId} withBorder inheritPadding py="xs">
          <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
            <Title
              order={2}
              tt="uppercase"
              fw={800}
              size="h4"
              style={{ flex: 1, minWidth: 0 }}
            >
              {monster.name} #{index + 1}
            </Title>
  
            <CloseButton
              aria-label="Убрать из энкаунтера"
              onClick={instance.onRemove}
            />
          </Group>
        </Card.Section>
      ))}

      <Stack gap="xs" pt="xs">
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

        <Stack gap="xs">
          {monster.features.map((f, i) => (
            <FeatureBlock key={`${f.name}-${i}`} f={f} />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
