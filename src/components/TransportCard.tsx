import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, MapPin, AlertCircle } from "lucide-react";

interface TransportCardProps {
  type: "bus" | "train" | "tram";
  line: string;
  destination: string;
  departure: string;
  platform?: string;
  status: "on-time" | "delayed" | "cancelled" | "boarding";
  delay?: number;
  nextDepartures?: string[];
}

const transportIcons = {
  bus: "🚌",
  train: "🚆", 
  tram: "🚋"
};

const statusConfig = {
  "on-time": { 
    color: "bg-status-on-time text-white", 
    text: "On Time" 
  },
  delayed: { 
    color: "bg-status-delayed text-white", 
    text: "Delayed" 
  },
  cancelled: { 
    color: "bg-status-cancelled text-white", 
    text: "Cancelled" 
  },
  boarding: { 
    color: "bg-status-boarding text-white", 
    text: "Boarding" 
  }
};

export function TransportCard({ 
  type, 
  line, 
  destination, 
  departure, 
  platform, 
  status, 
  delay,
  nextDepartures = []
}: TransportCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{transportIcons[type]}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-primary">{line}</span>
                <Badge variant="outline" className="text-xs">
                  {type.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="w-3 h-3" />
                <span>{destination}</span>
              </div>
            </div>
          </div>
          <Badge className={statusConfig[status].color}>
            {statusConfig[status].text}
            {delay && delay > 0 && ` +${delay}min`}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-lg">{departure}</span>
            {platform && (
              <span className="text-sm text-muted-foreground">
                Platform {platform}
              </span>
            )}
          </div>
          
          {status === "delayed" || status === "cancelled" ? (
            <AlertCircle className="w-4 h-4 text-accent" />
          ) : null}
        </div>
        
        {nextDepartures.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Next: </span>
            <span className="text-sm">{nextDepartures.join(", ")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}