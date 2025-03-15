import { Component } from '@/types/form';

export function generateSchemaCode(components: Component[]): string {
  if (components.length === 0) {
    return `// No components added yet`;
  }

  const schemaDefinitions = components
    .filter((c) => c.config && c.config.generateSchemaCode)
    .map((c) => c.config.generateSchemaCode(c));

  return `import * as z from "zod";\n\nexport const formSchema = z.object({
  ${schemaDefinitions.join(',\n  ')}
});`;
}
