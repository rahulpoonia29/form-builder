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
import { memo, Suspense, useCallback, useState } from 'react';
import { codeToHtml } from '@/lib/shiki';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

// Use a memo wrapper for code content to prevent unnecessary re-renders
const CodeContentView = memo(
  ({
    html,
    code,
    tab,
    copied,
    onCopy,
  }: {
    html: string;
    code: string;
    tab: string;
    copied: { tab: string; status: boolean };
    onCopy: (code: string, tab: string) => void;
  }) => {
    return (
      <div className="relative h-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(code, tab)}
          className="bg-secondary/80 hover:bg-secondary absolute top-3 right-4 z-10 h-8 cursor-pointer gap-1"
        >
          {copied.tab === tab && copied.status ? (
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
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  },
);

export function CodeModal() {
  const { components } = useFormBuilderStore();
  const [copied, setCopied] = useState<{ tab: string; status: boolean }>({
    tab: '',
    status: false,
  });
  const [activeTab, setActiveTab] = useState('form-code');

  // Only generate code when needed (dialog open)
  const [isOpen, setIsOpen] = useState(false);
  const [formCode, setFormCode] = useState<{ code: string; html: string }>({
    code: '',
    html: '',
  });
  const [schemaCode, setSchemaCode] = useState<{ code: string; html: string }>({
    code: '',
    html: '',
  });

  // Memoize the copy function to prevent unnecessary re-renders
  const copyToClipboard = useCallback((code: string, tab: string) => {
    navigator.clipboard.writeText(code);
    setCopied({ tab, status: true });
    setTimeout(() => setCopied({ tab: '', status: false }), 2000);
  }, []);

  // Generate code only when the dialog is opened
  const handleOpenChange = useCallback(
    async (open: boolean) => {
      setIsOpen(open);

      if (open && components.length > 0) {
        try {
          // Generate form code
          const rawFormCode = generateFormCode(components);
          const highlightedFormHTML = await codeToHtml(rawFormCode, {
            lang: 'tsx',
            theme: 'github-dark',
          });

          setFormCode({
            code: rawFormCode,
            html: highlightedFormHTML,
          });

          // Generate schema code
          const rawSchemaCode = generateSchemaCode(components);
          const highlightedSchemaHTML = await codeToHtml(rawSchemaCode, {
            lang: 'tsx',
            theme: 'github-dark',
          });

          setSchemaCode({
            code: rawSchemaCode,
            html: highlightedSchemaHTML,
          });
        } catch (error) {
          console.error('Error generating code:', error);
          setFormCode({
            code: 'Error generating code. Please try again.',
            html: '<p class="text-red-500">Error generating code</p>',
          });
          setSchemaCode({
            code: 'Error generating code. Please try again.',
            html: '<p class="text-red-500">Error generating code</p>',
          });
        }
      }
    },
    [components],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
            {isOpen ? (
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center">
                    Generating code...
                  </div>
                }
              >
                <TabsContent value="form-code" className="relative mt-0 h-full">
                  <CodeContentView
                    html={formCode.html}
                    code={formCode.code}
                    tab="form-code"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                </TabsContent>

                <TabsContent
                  value="zod-schema"
                  className="relative mt-0 h-full"
                >
                  <CodeContentView
                    html={schemaCode.html}
                    code={schemaCode.code}
                    tab="zod-schema"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                </TabsContent>
              </Suspense>
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                Open dialog to generate code
              </div>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
