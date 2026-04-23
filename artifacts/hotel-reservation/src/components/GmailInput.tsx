import * as React from 'react';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

type GmailInputProps = Omit<React.ComponentProps<'input'>, 'type'>;

export default function GmailInput({ className, value, style, ...props }: GmailInputProps) {
    const username = typeof value === 'string' ? value : '';
    const placeholderText = typeof props.placeholder === 'string' ? props.placeholder : '';
    const measureRef = React.useRef<HTMLSpanElement>(null);
    const [inputWidthPx, setInputWidthPx] = React.useState(8);

    React.useLayoutEffect(() => {
        if (!measureRef.current) return;
        const measuredWidth = Math.ceil(measureRef.current.getBoundingClientRect().width);
        setInputWidthPx(Math.max(measuredWidth, 8));
    }, [username, placeholderText]);

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

            <span ref={measureRef} aria-hidden className="invisible absolute whitespace-pre pl-9 pr-0 text-sm">
                {username || placeholderText || ' '}
            </span>

            <input
                {...props}
                type="text"
                inputMode="email"
                value={value}
                className="h-full min-w-[1ch] border-0 bg-transparent pb-0 pl-9 pr-0 pt-0 text-sm focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                style={{ width: `${inputWidthPx}px`, maxWidth: 'calc(100% - 86px)', ...style }}
            />

            <span className="pointer-events-none pr-3 text-sm text-foreground">@gmail.com</span>
        </div>
    );
}
