"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Shield, 
  Folder, 
  Sparkles, 
  Image as ImageIcon, 
  Music, 
  Video, 
  FileText, 
  File, 
  Link as LinkIcon, 
  HelpCircle,
  Loader2
} from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/admin/dashboard/metrics");
        if (!res.ok) throw new Error("Failed to fetch metrics");
        const data = await res.json();
        setMetrics(data.metrics);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchMetrics();
  }, []);

  const getMediaTypeIcon = (type) => {
    switch (type.toUpperCase()) {
      case "IMAGE": return ImageIcon;
      case "AUDIO": return Music;
      case "VIDEO": return Video;
      case "PDF": return FileText;
      case "DOC": return File;
      case "LINK": return LinkIcon;
      default: return HelpCircle;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-light tracking-tight">
          <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
            Dashboard Overview
          </span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Monitor community contributions, user roles, and archive collection statuses.
        </p>
      </div>

      {!metrics ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Loading metrics...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/70 border-slate-200/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</h2>
                  <p className="text-3xl font-bold text-slate-950">{metrics.users}</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 border-slate-200/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Admins</h2>
                  <p className="text-3xl font-bold text-slate-950">{metrics.admins}</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl group-hover:scale-105 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 border-slate-200/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Collections</h2>
                  <p className="text-3xl font-bold text-slate-950">{metrics.collections}</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl group-hover:scale-105 transition-transform">
                  <Folder className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 border-slate-200/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Media Items</h2>
                  <p className="text-3xl font-bold text-slate-950">{metrics.mediaItems}</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-100 text-purple-600 rounded-2xl group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Types Grid Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">Media Types breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {metrics.mediaCounts &&
                Object.entries(metrics.mediaCounts).map(([type, count]) => {
                  const Icon = getMediaTypeIcon(type);
                  return (
                    <Card key={type} className="bg-white/50 border-slate-200/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
                      <CardContent className="p-5 flex flex-col items-center text-center justify-center space-y-2">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                          {type}
                        </h4>
                        <p className="text-2xl font-bold text-slate-950">{count}</p>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
