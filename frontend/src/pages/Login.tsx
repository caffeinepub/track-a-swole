import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function Login() {
  const { login, isLoggingIn, isLoginSuccess, identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginSuccess && identity) {
      navigate({ to: '/' });
    }
  }, [isLoginSuccess, identity, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/swolegoat.gif"
              alt="Swole Goat mascot"
              className="h-40 w-40 object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.endsWith('/swolegoat.gif')) {
                  target.src = '/assets/swolegoat.gif';
                } else if (target.src.endsWith('/assets/swolegoat.gif')) {
                  target.src = '/assets/generated/swolegoat.gif';
                }
              }}
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Track-A-Swole
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Your personal workout tracking companion
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 text-center text-muted-foreground">
            <p>
              Sign in to save your workout data and access your history from any device.
            </p>
            <p className="text-sm">
              Your data is securely stored on the Internet Computer blockchain.
            </p>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-amber-500/20 transition-all"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you'll be redirected to Internet Identity to authenticate securely using passkeys, Google, Apple, or Microsoft.
          </p>
        </CardContent>
      </Card>

      {/* GeekGoat Footer */}
      <footer className="mt-8 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-md shadow-amber-500/20 flex-shrink-0">
          <img
            src="/assets/GeekGoat.png"
            alt="GeekGoat"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          A GeekDice Decentralized App on ICP
        </span>
      </footer>
    </div>
  );
}
