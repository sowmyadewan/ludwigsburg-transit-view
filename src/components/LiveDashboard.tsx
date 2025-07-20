import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransportCard } from "./TransportCard";
import { AlertsBanner } from "./AlertsBanner";
import { RouteSearch } from "./RouteSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Train, Bus, Navigation } from "lucide-react";

interface DepartureData {
  id: string;
  type: "bus" | "train" | "tram";
  line: string;
  destination: string;
  departure: string;
  platform?: string;
  status: "on-time" | "delayed" | "cancelled" | "boarding";
  delay?: number;
  nextDepartures?: string[];
}

export function LiveDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Simulated live departure data
  const [departures, setDepartures] = useState<DepartureData[]>([
    {
      id: "1",
      type: "train",
      line: "S4",
      destination: "Stuttgart Hauptbahnhof",
      departure: "14:32",
      platform: "2",
      status: "delayed",
      delay: 5,
      nextDepartures: ["14:47", "15:02", "15:17"]
    },
    {
      id: "2", 
      type: "bus",
      line: "443",
      destination: "Schlossstraße",
      departure: "14:28",
      status: "on-time",
      nextDepartures: ["14:43", "14:58", "15:13"]
    },
    {
      id: "3",
      type: "tram",
      line: "1",
      destination: "Hauptbahnhof",
      departure: "14:30",
      status: "cancelled",
      nextDepartures: ["Replacement bus available"]
    },
    {
      id: "4",
      type: "train",
      line: "S5",
      destination: "Bietigheim-Bissingen",
      departure: "14:35",
      platform: "1",
      status: "boarding",
      nextDepartures: ["14:50", "15:05", "15:20"]
    },
    {
      id: "5",
      type: "bus", 
      line: "42",
      destination: "Marienplatz",
      departure: "14:25",
      status: "on-time",
      nextDepartures: ["14:40", "14:55", "15:10"]
    }
  ]);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusCounts = () => {
    const onTime = departures.filter(d => d.status === "on-time").length;
    const delayed = departures.filter(d => d.status === "delayed").length;
    const cancelled = departures.filter(d => d.status === "cancelled").length;
    return { onTime, delayed, cancelled };
  };

  const { onTime, delayed, cancelled } = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            LiveLink Ludwigsburg
          </h1>
          <p className="text-muted-foreground">Real-time transit information for the greater Ludwigsburg area</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Time</p>
                  <p className="text-2xl font-bold text-status-on-time">{onTime}</p>
                </div>
                <Train className="w-8 h-8 text-status-on-time" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delayed</p>
                  <p className="text-2xl font-bold text-status-delayed">{delayed}</p>
                </div>
                <Bus className="w-8 h-8 text-status-delayed" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disrupted</p>
                  <p className="text-2xl font-bold text-status-cancelled">{cancelled}</p>
                </div>
                <Navigation className="w-8 h-8 text-status-cancelled" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="departures" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="departures">Live Departures</TabsTrigger>
            <TabsTrigger value="planner">Route Planner</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="departures" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Next Departures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departures.map((departure) => (
                  <TransportCard key={departure.id} {...departure} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planner">
            <RouteSearch />
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Service Alerts & Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertsBanner />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}