import React, { useState } from 'react';
import { useAppState } from '../hooks/use-app-state';
import Navbar from '../components/Navbar';
import GmailInput from '../components/GmailInput';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, User } from 'lucide-react';
import { useLocale } from '../lib/i18n';
import { getGmailUsername, normalizeGmailEmail } from '../lib/email';

export default function SignUp({ navigateTo }: { navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
    const { t } = useLocale();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const trimmedFullName = fullName.trim();
    const normalizedEmail = normalizeGmailEmail(email);
    const trimmedEmail = normalizedEmail.trim();
    const emailUsername = getGmailUsername(email);
    const isEmailValid = /^[^\s@]+@gmail\.com$/i.test(trimmedEmail);
    const isPasswordLongEnough = password.length >= 6;
    const isPasswordMatch = password === confirmPassword;

    const showNameError = submitted && trimmedFullName.length < 2;
    const showEmailError = submitted || emailUsername.length > 0;
    const showPasswordError = submitted || password.length > 0;
    const showConfirmPasswordError = submitted || confirmPassword.length > 0;

    const nameError = showNameError ? t('signUpErrName') : '';
    const emailError = showEmailError
        ? !emailUsername
            ? t('signUpErrEmailRequired')
            : !isEmailValid
                ? t('signUpErrEmailInvalid')
                : ''
        : '';
    const passwordError = showPasswordError
        ? !password
            ? t('signUpErrPasswordRequired')
            : !isPasswordLongEnough
                ? t('signUpErrPasswordLength')
                : ''
        : '';
    const confirmPasswordError = showConfirmPasswordError
        ? !confirmPassword
            ? t('signUpErrConfirmRequired')
            : !isPasswordMatch
                ? t('signUpErrPasswordMismatch')
                : ''
        : '';

    const isFormValid =
        trimmedFullName.length > 1 &&
        isEmailValid &&
        isPasswordLongEnough &&
        isPasswordMatch;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
        setEmail(normalizedEmail);
        if (!isFormValid) return;
        navigateTo({ name: 'dashboard' });
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(getGmailUsername(event.target.value));
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
                    <Card className="border-border/70 shadow-md" data-testid="card-signup">
                        <CardHeader className="space-y-2">
                            <CardTitle className="font-serif text-2xl sm:text-3xl">{t('signUpTitle')}</CardTitle>
                            <CardDescription>{t('signUpDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} noValidate className="space-y-4" data-testid="form-signup">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-fullname">{t('signUpFullName')}</Label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signup-fullname"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder={t('signUpFullNamePlaceholder')}
                                            className={`pl-9 ${nameError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            aria-invalid={Boolean(nameError)}
                                            required
                                            data-testid="input-signup-fullname"
                                        />
                                    </div>
                                    {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">{t('signUpEmail')}</Label>
                                    <GmailInput
                                        id="signup-email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder={t('signUpEmailPlaceholder')}
                                        aria-invalid={Boolean(emailError)}
                                        required
                                        data-testid="input-signup-email"
                                    />
                                    {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">{t('signUpPassword')}</Label>
                                    <div className="relative">
                                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t('signUpPasswordPlaceholder')}
                                            className={`pl-9 ${passwordError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            aria-invalid={Boolean(passwordError)}
                                            required
                                            data-testid="input-signup-password"
                                        />
                                    </div>
                                    {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-confirm-password">{t('signUpConfirmPassword')}</Label>
                                    <div className="relative">
                                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signup-confirm-password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder={t('signUpConfirmPlaceholder')}
                                            className={`pl-9 ${confirmPasswordError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            aria-invalid={Boolean(confirmPasswordError)}
                                            required
                                            data-testid="input-signup-confirm-password"
                                        />
                                    </div>
                                    {confirmPasswordError && <p className="text-xs text-destructive">{confirmPasswordError}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full transition-colors duration-200 hover:bg-primary/90"
                                    data-testid="button-signup-submit"
                                >
                                    {t('signUpCreateAccount')}
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    {t('signUpAlreadyHave')}{' '}
                                    <button
                                        type="button"
                                        className="font-medium text-primary hover:underline"
                                        onClick={() => navigateTo({ name: 'sign_in' })}
                                        data-testid="button-go-to-signin"
                                    >
                                        {t('signUpGoToSignIn')}
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
