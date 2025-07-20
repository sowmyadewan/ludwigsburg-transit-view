import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, Clock, Route } from "lucide-react";

interface RouteOption {
  id: string;
  duration: string;
  transfers: number;
  steps: Array<{
    type: "bus" | "train" | "tram" | "walk";
    line?: string;
    from: string;
    to: string;
    time: string;
    duration: string;
  }>;
  totalWalkTime: string;
}

export function RouteSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routes, setRoutes] = useState<RouteOption[]>([]);

  const searchRoutes = () => {
    // Simulate route search with dummy data
    const dummyRoutes: RouteOption[] = [
      {
        id: "1",
        duration: "23 min",
        transfers: 1,
        totalWalkTime: "5 min",
        steps: [
          { type: "walk", from: "Start", to: "Ludwigsburg Bahnhof", time: "14:25", duration: "3 min" },
          { type: "train", line: "S4", from: "Ludwigsburg Bahnhof", to: "Stuttgart Hbf", time: "14:28", duration: "15 min" },
          { type: "bus", line: "42", from: "Stuttgart Hbf", to: "Marienplatz", time: "14:45", duration: "3 min" },
          { type: "walk", from: "Marienplatz", to: "Destination", time: "14:48", duration: "2 min" }
        ]
      },
      {
        id: "2", 
        duration: "31 min",
        transfers: 0,
        totalWalkTime: "8 min",
        steps: [
          { type: "walk", from: "Start", to: "Arsenalplatz", time: "14:22", duration: "5 min" },
          { type: "bus", line: "443", from: "Arsenalplatz", to: "Schlossstraße", time: "14:27", duration: "23 min" },
          { type: "walk", from: "Schlossstraße", to: "Destination", time: "14:50", duration: "3 min" }
        ]
      }
    ];
    setRoutes(dummyRoutes);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "bus": return "🚌";
      case "train": return "🚆";
      case "tram": return "🚋";
      case "walk": return "🚶";
      default: return "📍";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5 text-primary" />
            Plan Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Ludwigsburg Bahnhof"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Stuttgart Hauptbahnhof"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <Button onClick={searchRoutes} className="w-full" size="lg">
            Find Routes
          </Button>
        </CardContent>
      </Card>

      {routes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Route Options</h3>
          {routes.map((route) => (
            <Card key={route.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{route.duration}</div>
                      <div className="text-xs text-muted-foreground">total time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{route.transfers}</div>
                      <div className="text-xs text-muted-foreground">transfers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary">{route.totalWalkTime}</div>
                      <div className="text-xs text-muted-foreground">walking</div>
                    </div>
                  </div>
                  <Badge variant="outline">Best Route</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {route.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex flex-col items-center text-center min-w-16">
                        <span className="text-lg">{getStepIcon(step.type)}</span>
                        {step.line && (
                          <Badge variant="secondary" className="text-xs">
                            {step.line}
                          </Badge>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          <div>{step.time}</div>
                          <div>({step.duration})</div>
                        </div>
                      </div>
                      {index < route.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}