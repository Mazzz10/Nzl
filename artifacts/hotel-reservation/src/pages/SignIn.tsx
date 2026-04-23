import React, { useState } from 'react';
import { useAppState } from '../hooks/use-app-state';
import Navbar from '../components/Navbar';
import GmailInput from '../components/GmailInput';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { KeyRound } from 'lucide-react';
import { useLocale } from '../lib/i18n';
import { getGmailUsername, normalizeGmailEmail } from '../lib/email';

export default function SignIn({ navigateTo }: { navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
    const { t } = useLocale();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEmail((prev) => normalizeGmailEmail(prev));
        navigateTo({ name: 'dashboard' });
    };

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <Navbar navigateTo={navigateTo} />

            <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-6 sm:py-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                >
                    <Card className="border-border/70 shadow-md" data-testid="card-signin">
                        <CardHeader className="space-y-2">
                            <CardTitle className="font-serif text-2xl sm:text-3xl">{t('signInTitle')}</CardTitle>
                            <CardDescription>{t('signInDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-signin">
                                <div className="space-y-2">
                                    <Label htmlFor="signin-email">{t('signInEmail')}</Label>
                                    <GmailInput
                                        id="signin-email"
                                        value={email}
                                        onChange={(event) => setEmail(getGmailUsername(event.target.value))}
                                        placeholder={t('signInEmailPlaceholder')}
                                        required
                                        data-testid="input-signin-email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signin-password">{t('signInPassword')}</Label>
                                    <div className="relative">
                                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signin-password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t('signInPasswordPlaceholder')}
                                            className="pl-9"
                                            required
                                            data-testid="input-signin-password"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="remember-me"
                                            checked={rememberMe}
                                            onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                                            data-testid="checkbox-remember-me"
                                        />
                                        <Label htmlFor="remember-me" className="text-sm font-normal">{t('signInRememberMe')}</Label>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-sm text-primary hover:underline sm:text-right"
                                        onClick={() => navigateTo({ name: 'home' })}
                                        data-testid="button-signin-forgot"
                                    >
                                        {t('signInForgot')}
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full transition-colors duration-200 hover:bg-primary/90"
                                    data-testid="button-signin-submit"
                                >
                                    {t('signInSubmit')}
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => navigateTo({ name: 'home' })}
                                    data-testid="button-signin-cancel"
                                >
                                    {t('signInGuest')}
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    {t('signInNoAccount')}{' '}
                                    <button
                                        type="button"
                                        className="font-medium text-primary hover:underline"
                                        onClick={() => navigateTo({ name: 'sign_up' })}
                                        data-testid="button-go-to-signup"
                                    >
                                        {t('signInGoToSignUp')}
                                    </button>
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
