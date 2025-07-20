import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, Construction, X } from "lucide-react";
import { useState } from "react";

interface AlertItem {
  id: string;
  type: "warning" | "info" | "disruption";
  title: string;
  description: string;
  affectedLines: string[];
  severity: "low" | "medium" | "high";
  timestamp: string;
}

const alertConfig = {
  warning: {
    icon: AlertTriangle,
    color: "border-l-status-delayed bg-status-delayed/10"
  },
  info: {
    icon: Info,
    color: "border-l-primary bg-primary/10"
  },
  disruption: {
    icon: Construction,
    color: "border-l-status-cancelled bg-status-cancelled/10"
  }
};

export function AlertsBanner() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      type: "warning",
      title: "Delays on S4 Line",
      description: "S4 trains running 5-10 minutes late due to signal maintenance between Ludwigsburg and Stuttgart.",
      affectedLines: ["S4"],
      severity: "medium",
      timestamp: "14:20"
    },
    {
      id: "2", 
      type: "info",
      title: "Weekend Service Changes",
      description: "Bus line 443 will have modified schedule this weekend. Additional service on line 42.",
      affectedLines: ["443", "42"],
      severity: "low",
      timestamp: "09:00"
    },
    {
      id: "3",
      type: "disruption",
      title: "Tram Line 1 Suspended",
      description: "Service suspended between Hauptbahnhof and Schlossstraße due to track work. Replacement bus service available.",
      affectedLines: ["Tram 1"],
      severity: "high", 
      timestamp: "13:45"
    }
  ]);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Current Alerts</h3>
      {alerts.map((alert) => {
        const config = alertConfig[alert.type];
        const Icon = config.icon;
        
        return (
          <Alert key={alert.id} className={`${config.color} border-l-4 relative`}>
            <div className="flex items-start gap-3">
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.title}</span>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <AlertDescription className="text-sm mb-2">
                      {alert.description}
                    </AlertDescription>
                    <div className="flex flex-wrap gap-1">
                      {alert.affectedLines.map((line) => (
                        <Badge key={line} variant="outline" className="text-xs">
                          {line}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Alert>
        );
      })}
    </div>
  );
}