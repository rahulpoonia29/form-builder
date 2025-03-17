// Ignore ts errors
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FormComponentsCategory } from '@/types/form';

const componentCategories: FormComponentsCategory[] = [
  {
    name: 'Inputs',
    components: [
      () => import('./inputs/text-input').then((m) => m.default),
      () => import('./inputs/password-input').then((m) => m.default),
      () => import('./inputs/email-input').then((m) => m.default),
      () => import('./inputs/number-input').then((m) => m.default),
      () => import('./inputs/phone-input').then((m) => m.default),
      () => import('./inputs/textarea-input').then((m) => m.default),
      () => import('./inputs/otp-input').then((m) => m.default),
    ],
  },
  {
    name: 'Selectors',
    components: [
      () => import('./selectors/select-input').then((m) => m.default),
      () => import('./selectors/checkbox-input').then((m) => m.default),
      // () => import('./selectors/radio-input').then((m) => m.default),
      // () => import('./selectors/switch-input').then((m) => m.default),
    ],
  },
];

export async function getComponentCategories(): Promise<
  FormComponentsCategory[]
> {
  const loadedCategories = await Promise.all(
    componentCategories.map(async (category) => {
      const loadedComponents = await Promise.all(
        category.components.map((loader) => loader()),
      );

      return {
        name: category.name,
        components: loadedComponents,
      };
    }),
  );

  return loadedCategories;
}

// For initial sidebar rendering, we can export just the component metadata
export const getComponentMetadata = () => {
  return componentCategories.map((category) => ({
    name: category.name,
    componentsCount: category.components.length,
  }));
};
