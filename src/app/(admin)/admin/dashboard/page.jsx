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
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-serif italic font-bold text-slate-950 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1.5 font-medium">
          Monitor community contributions, user roles, and archive collection statuses.
        </p>
      </div>

      {!metrics ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <span className="text-xs text-slate-400 font-medium tracking-wide">Loading metrics...</span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-[1.5rem] overflow-hidden group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Total Users</h2>
                  <p className="text-3xl font-black text-black">{metrics.users}</p>
                </div>
                <div className="p-3 bg-black text-white border border-black rounded-xl group-hover:scale-105 transition-transform duration-200">
                  <Users className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-[1.5rem] overflow-hidden group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Admins</h2>
                  <p className="text-3xl font-black text-black">{metrics.admins}</p>
                </div>
                <div className="p-3 bg-black text-white border border-black rounded-xl group-hover:scale-105 transition-transform duration-200">
                  <Shield className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-[1.5rem] overflow-hidden group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Collections</h2>
                  <p className="text-3xl font-black text-black">{metrics.collections}</p>
                </div>
                <div className="p-3 bg-black text-white border border-black rounded-xl group-hover:scale-105 transition-transform duration-200">
                  <Folder className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-[1.5rem] overflow-hidden group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Total Media Items</h2>
                  <p className="text-3xl font-black text-black">{metrics.mediaItems}</p>
                </div>
                <div className="p-3 bg-black text-white border border-black rounded-xl group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Types Grid Section */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 pl-1">Media Types breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {metrics.mediaCounts &&
                Object.entries(metrics.mediaCounts).map(([type, count]) => {
                  const Icon = getMediaTypeIcon(type);
                  return (
                    <Card key={type} className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group">
                      <CardContent className="p-5 flex flex-col items-center text-center justify-center space-y-3">
                        <div className="p-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                            {type}
                          </h4>
                          <p className="text-xl font-black text-slate-900">{count}</p>
                        </div>
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
