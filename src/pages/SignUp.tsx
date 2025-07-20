import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Train, User, Mail, Lock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pincode: "",
    agreeToTerms: false,
    userType: "commuter" as "commuter" | "tourist" | "senior"
  });

  const userTypes = [
    { value: "commuter", label: "Daily Commuter", icon: "🏢", description: "Regular bus, train & tram user" },
    { value: "tourist", label: "Tourist/Visitor", icon: "🎒", description: "Exploring Ludwigsburg" },
    { value: "senior", label: "Senior Citizen", icon: "👵", description: "Accessible transit options" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Welcome to LiveLink!",
      description: "Your account has been created successfully.",
    });
    
    // Store user data in localStorage for now
    localStorage.setItem('livelink_user', JSON.stringify({
      name: formData.name,
      email: formData.email,
      userType: formData.userType,
      pincode: formData.pincode,
      signedUp: true
    }));
    
    setIsLoading(false);
    navigate('/dashboard');
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Train className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              LiveLink
            </h1>
          </div>
          <p className="text-muted-foreground">
            Join Ludwigsburg's smart transit community
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Get personalized transit updates and route planning
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">I am a...</Label>
                <div className="grid gap-2">
                  {userTypes.map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={formData.userType === type.value ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => setFormData(prev => ({ ...prev, userType: type.value as any }))}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-lg">{type.icon}</span>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                  />
                </div>
              </div>

              {/* Pincode Field */}
              <div className="space-y-2">
                <Label htmlFor="pincode">Postal Code (PLZ)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="71634"
                    className="pl-10"
                    value={formData.pincode}
                    onChange={handleInputChange('pincode')}
                    maxLength={5}
                    pattern="[0-9]{5}"
                    title="Please enter a 5-digit postal code"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll show transit options near your location
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    required
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    By signing up, you consent to receive transit alerts and updates.
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button variant="link" className="p-0 h-auto font-medium text-primary">
                  Sign In
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Footer */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>Serving Ludwigsburg & surrounding areas</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="text-xs">Real-time Updates</Badge>
            <Badge variant="outline" className="text-xs">Smart Routes</Badge>
            <Badge variant="outline" className="text-xs">Personalized Alerts</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}