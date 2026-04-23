import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-start gap-2">
            <AlertCircle className="h-7 w-7 shrink-0 text-red-500 sm:h-8 sm:w-8" />
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
