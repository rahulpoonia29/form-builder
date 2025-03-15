import { Component } from '@/types/form';

export function generateFormCode(components: Component[]): string {
  if (components.length === 0) {
    return `// No components added yet`;
  }

  const imports = Array.from(
    new Set(
      components
        .filter((c) => c.config && c.config.generateImportCode)
        .map((c) => c.config.generateImportCode()),
    ),
  ).join('\n');

  // Generate form JSX with proper indentation
  const formJSX = components
    .filter((c) => c.config && c.config.generateJSXCode)
    .map((c) => c.config.generateJSXCode(c))
    .join('\n\n')
    .split('\n')
    .map((line) => `      ${line}`) // Add consistent indentation
    .join('\n');

  return `"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
${imports}

// Define form schema
const formSchema = z.object({
  // Schema will be populated based on your form fields
});

export function ExampleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
${formJSX}
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}`;
}
