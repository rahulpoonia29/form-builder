import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateFormCode } from '@/lib/generateForm';
import { generateSchemaCode } from '@/lib/generateSchema';
import { useFormBuilderStore } from '@/store/formBuilder';
import { CheckIcon, Code2Icon, CopyIcon, FileTextIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

export function CodeModal() {
  const { components } = useFormBuilderStore();
  const [copied, setCopied] = useState<{ tab: string; status: boolean }>({
    tab: '',
    status: false,
  });

  const [activeTab, setActiveTab] = useState('form-code');

  // Generate code for the form and schema
  const [formCode, setFormCode] = useState<{ code: string; html: string }>({
    code: '',
    html: '',
  });
  const [schemaCode, setSchemaCode] = useState<{ code: string; html: string }>({
    code: '',
    html: '',
  });

  useEffect(() => {
    async function generateCode() {
      try {
        const rawFormCode = generateFormCode(components);
        const highlightedFormHTML = await codeToHtml(rawFormCode, {
          lang: 'tsx',
          theme: 'github-dark',
        });
        setFormCode({
          code: rawFormCode,
          html: highlightedFormHTML,
        });

        // Generate schema code with syntax highlighting
        const rawSchemaCode = generateSchemaCode(components);
        const highlightedSchemaCode = await codeToHtml(rawSchemaCode, {
          lang: 'typescript',
          theme: 'github-dark',
        });
        setSchemaCode({
          code: rawSchemaCode,
          html: highlightedSchemaCode,
        });
      } catch (error) {
        console.error('Error generating code:', error);
        setFormCode({
          code: 'Error generating code. Please try again.',
          html: '<p className="text-red-500">Error generating code</p>',
        });
        setSchemaCode({
          code: 'Error generating code. Please try again.',
          html: '<p className="text-red-500">Error generating code</p>',
        });
      }
    }

    generateCode();
  }, [components]);

  const copyToClipboard = (code: string, tab: string) => {
    navigator.clipboard.writeText(code);
    setCopied({ tab, status: true });
    setTimeout(() => setCopied({ tab: '', status: false }), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Code2Icon size={16} />
          Generate Code
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Generated Code</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="form-code"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="h-auto gap-2 px-2 py-1 [&>*]:cursor-pointer">
            <TabsTrigger value="form-code" className="px-3 py-1.5">
              <FileTextIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              JSX Code
            </TabsTrigger>
            <TabsTrigger value="zod-schema" className="px-3 py-1.5">
              <Code2Icon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Zod Schema
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 h-[calc(80vh-150px)] overflow-hidden rounded-md">
            <TabsContent value="form-code" className="relative mt-0 h-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formCode.code, 'form-code')}
                className="bg-secondary/80 hover:bg-secondary absolute top-3 right-4 z-10 h-8 cursor-pointer gap-1"
              >
                {copied.tab === 'form-code' && copied.status ? (
                  <>
                    <CheckIcon />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    <span>Copy</span>
                  </>
                )}
              </Button>
              <ScrollArea className="h-[calc(80vh-150px)]">
                <div
                  className="overflow-hidden rounded-md"
                  dangerouslySetInnerHTML={{ __html: formCode.html }}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="zod-schema" className="relative mt-0 h-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(schemaCode.code, 'zod-schema')}
                className="bg-secondary/80 hover:bg-secondary absolute top-3 right-4 z-10 h-8 cursor-pointer gap-1"
              >
                {copied.tab === 'zod-schema' && copied.status ? (
                  <>
                    <CheckIcon />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    <span>Copy</span>
                  </>
                )}
              </Button>
              <ScrollArea className="h-[calc(80vh-150px)]">
                <div
                  className="overflow-hidden rounded-md"
                  dangerouslySetInnerHTML={{ __html: schemaCode.html }}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
