import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';
import { CodeModal } from './code-modal';

interface HeaderProps {
  reset: () => void;
}

export function Header({ reset }: HeaderProps) {
  return (
    <>
      <header className="bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Form Builder</h1>

          <div className="flex items-center space-x-2">
            <CodeModal />
            <Button
              variant="outline"
              size="icon"
              onClick={reset}
              title="Reset Form"
            >
              <RefreshCwIcon size={16} />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
