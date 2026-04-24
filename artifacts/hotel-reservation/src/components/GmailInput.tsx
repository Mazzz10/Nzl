import * as React from 'react';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

type GmailInputProps = Omit<React.ComponentProps<'input'>, 'type'>;

export default function GmailInput({ className, value, style, ...props }: GmailInputProps) {
    return (
        <div
            dir="ltr"
            className={cn(
                'relative flex h-9 w-full items-center rounded-md border border-input bg-transparent text-base shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring md:text-sm',
                props['aria-invalid'] ? 'border-destructive focus-within:ring-destructive' : '',
                className,
            )}
        >
            <Mail className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />

            <input
                {...props}
                type="text"
                inputMode="email"
                value={value}
                className="h-full w-full border-0 bg-transparent pb-0 pl-9 pr-3 pt-0 text-sm focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                style={style}
            />
        </div>
    );
}
