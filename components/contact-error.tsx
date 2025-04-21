import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ContactErrorProps {
  error: string
  onRetry?: () => void
}

export function ContactError({ error, onRetry }: ContactErrorProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
      
      {onRetry && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="gap-2"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
} 