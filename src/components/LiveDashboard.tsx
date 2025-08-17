import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransportCard } from "./TransportCard";
import { AlertsBanner } from "./AlertsBanner";
import { RouteSearch } from "./RouteSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Train, Bus, Navigation } from "lucide-react";
import { apiService } from "@/services/api";
import { ApiDeparture } from "@/types/api";
import { toast } from "@/hooks/use-toast";

// Remove old interface, using ApiDeparture from types

export function LiveDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [departures, setDepartures] = useState<ApiDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load user data and initial departures
  useEffect(() => {
    const stored = localStorage.getItem('livelink_user');
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  // Fetch departures when userData changes
  useEffect(() => {
    if (userData?.pincode) {
      fetchDepartures(userData.pincode);
    } else {
      fetchDepartures("71634"); // Default to central Ludwigsburg
    }
  }, [userData]);

  const fetchDepartures = async (pincode: string) => {
    try {
      setLoading(true);
      const data = await apiService.getDeparturesByPincode(pincode);
      setDepartures(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch departures:', error);
      toast({
        title: "Connection Error",
        description: "Failed to fetch live departures. Please check if the backend is running.",
        variant: "destructive",
      });
      // Fallback to empty array
      setDepartures([]);
    } finally {
      setLoading(false);
    }
  };

  // Convert ApiDeparture to DepartureData format for existing components
  const convertToDepartureData = (apiDep: ApiDeparture) => ({
    id: apiDep.id,
    type: apiDep.transportType as "bus" | "train" | "tram",
    line: apiDep.lineNumber,
    destination: apiDep.destination,
    departure: apiDep.scheduledDeparture,
    platform: apiDep.platform,
    status: apiDep.status as "on-time" | "delayed" | "cancelled" | "boarding",
    delay: apiDep.delayMinutes,
    nextDepartures: apiDep.nextDepartures
  });
  
  // Convert API departures to component format
  const departureData = departures.map(convertToDepartureData);

  const getAreaName = (pincode: string) => {
    const areaNames: Record<string, string> = {
      "71634": "Central Ludwigsburg",
      "71636": "West Ludwigsburg", 
      "71638": "East Ludwigsburg",
      "71640": "South Ludwigsburg"
    };
    return areaNames[pincode] || "Ludwigsburg Area";
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    const pincode = userData?.pincode || "71634";
    await fetchDepartures(pincode);
    setIsRefreshing(false);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const pincode = userData?.pincode || "71634";
      fetchDepartures(pincode);
    }, 30000);
    return () => clearInterval(interval);
  }, [userData]);

  const getStatusCounts = () => {
    const onTime = departureData.filter(d => d.status === "on-time").length;
    const delayed = departureData.filter(d => d.status === "delayed").length;
    const cancelled = departureData.filter(d => d.status === "cancelled").length;
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
          {userData && (
            <div className="space-y-1">
              <p className="text-lg font-medium text-foreground">
                Welcome back, {userData.name}! 👋
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-sm">
                  📍 {getAreaName(userData.pincode)} ({userData.pincode})
                </Badge>
                <Badge variant="outline" className="text-sm capitalize">
                  {userData.userType}
                </Badge>
              </div>
            </div>
          )}
          <p className="text-muted-foreground">
            {userData ? `Live departures near you in ${getAreaName(userData?.pincode || "71634")}` : "Real-time transit information for the greater Ludwigsburg area"}
          </p>
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
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading departures...</p>
                  </div>
                ) : departureData.length > 0 ? (
                  departureData.map((departure) => (
                    <TransportCard key={departure.id} {...departure} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No departures found for this area.</p>
                  </div>
                )}
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