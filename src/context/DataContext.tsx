import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  MarketplaceItem,
  RepairTechnician,
  WaterPoint,
  ShelterSupply,
  SkillItem,
  SmartRequest,
  GroupPurchase,
  ReusableGood,
  AuditLog,
  OfflineMutation,
  RequestStatus,
} from '../types';

interface DataContextType {
  isOnline: boolean;
  lowDataMode: boolean;
  toggleLowDataMode: () => void;
  isSyncing: boolean;
  offlineQueueCount: number;
  syncOfflineQueue: () => Promise<void>;

  // Data Collections
  marketplaceItems: MarketplaceItem[];
  repairTechnicians: RepairTechnician[];
  waterPoints: WaterPoint[];
  shelterSupplies: ShelterSupply[];
  skills: SkillItem[];
  requests: SmartRequest[];
  groupPurchases: GroupPurchase[];
  reusableGoods: ReusableGood[];
  auditLogs: AuditLog[];

  // Mutations
  createRequest: (req: Partial<SmartRequest>) => Promise<SmartRequest>;
  updateRequestStatus: (id: string, status: RequestStatus, note?: string) => Promise<void>;
  createMarketplaceItem: (item: Partial<MarketplaceItem>) => Promise<MarketplaceItem>;
  joinGroupBuy: (id: string, qty: number) => Promise<void>;
  reportWaterIssue: (issue: { location: string; details: string; type: string; neighborhood: string }) => Promise<void>;
  createSkillListing: (skill: Partial<SkillItem>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lowDataMode, setLowDataMode] = useState<boolean>(() => {
    return localStorage.getItem('madar_low_data') === 'true';
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineMutation[]>(() => {
    try {
      const q = localStorage.getItem('madar_offline_queue');
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  });

  // Main collections state initialized from local cache or defaults
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [repairTechnicians, setRepairTechnicians] = useState<RepairTechnician[]>([]);
  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>([]);
  const [shelterSupplies, setShelterSupplies] = useState<ShelterSupply[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [requests, setRequests] = useState<SmartRequest[]>([]);
  const [groupPurchases, setGroupPurchases] = useState<GroupPurchase[]>([]);
  const [reusableGoods, setReusableGoods] = useState<ReusableGood[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Connectivity tracking
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save offline queue whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('madar_offline_queue', JSON.stringify(offlineQueue));
    } catch (e) {
      console.warn('Failed to save offline queue to localStorage', e);
    }
  }, [offlineQueue]);

  // Low data mode class toggle
  useEffect(() => {
    if (lowDataMode) {
      document.documentElement.classList.add('low-data-mode');
    } else {
      document.documentElement.classList.remove('low-data-mode');
    }
    localStorage.setItem('madar_low_data', String(lowDataMode));
  }, [lowDataMode]);

  // Bootstrap data from server or localStorage cache
  useEffect(() => {
    const loadData = async () => {
      // 1. Load from cache first for instantaneous offline render
      try {
        const cached = localStorage.getItem('madar_bootstrap_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.marketplaceItems) setMarketplaceItems(parsed.marketplaceItems);
          if (parsed.repairTechnicians) setRepairTechnicians(parsed.repairTechnicians);
          if (parsed.waterPoints) setWaterPoints(parsed.waterPoints);
          if (parsed.shelterSupplies) setShelterSupplies(parsed.shelterSupplies);
          if (parsed.skills) setSkills(parsed.skills);
          if (parsed.requests) setRequests(parsed.requests);
          if (parsed.groupPurchases) setGroupPurchases(parsed.groupPurchases);
          if (parsed.reusableGoods) setReusableGoods(parsed.reusableGoods);
          if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        }
      } catch (err) {
        console.warn('Error reading local cache:', err);
      }

      // 2. Refresh from server if online
      if (navigator.onLine) {
        try {
          const res = await fetch('/api/bootstrap');
          if (res.ok) {
            const data = await res.json();
            setMarketplaceItems(data.marketplaceItems || []);
            setRepairTechnicians(data.repairTechnicians || []);
            setWaterPoints(data.waterPoints || []);
            setShelterSupplies(data.shelterSupplies || []);
            setSkills(data.skills || []);
            setRequests(data.requests || []);
            setGroupPurchases(data.groupPurchases || []);
            setReusableGoods(data.reusableGoods || []);
            setAuditLogs(data.auditLogs || []);

            localStorage.setItem('madar_bootstrap_cache', JSON.stringify(data));
          }
        } catch (e) {
          console.warn('Network fetch failed, relying on cached data:', e);
        }
      }
    };

    loadData();
  }, []);

  // Offline Synchronization Runner
  const syncOfflineQueue = useCallback(async () => {
    const queue = [...offlineQueue];
    if (queue.length === 0 || !navigator.onLine || isSyncing) return;

    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mutations: queue }),
      });

      if (res.ok) {
        // Clear synced items
        setOfflineQueue([]);
        localStorage.removeItem('madar_offline_queue');

        // Refresh latest server state
        const refresh = await fetch('/api/bootstrap');
        if (refresh.ok) {
          const freshData = await refresh.json();
          setRequests(freshData.requests || []);
          setMarketplaceItems(freshData.marketplaceItems || []);
          localStorage.setItem('madar_bootstrap_cache', JSON.stringify(freshData));
        }
      }
    } catch (err) {
      console.warn('Sync failed, will retry next connectivity event:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [offlineQueue, isSyncing]);

  // Mutations
  const createRequest = async (reqData: Partial<SmartRequest>): Promise<SmartRequest> => {
    // Calculate urgency score
    let score = 50;
    if (reqData.urgency === 'urgent') score += 40;
    else if (reqData.urgency === 'high') score += 25;
    if (reqData.hasInfants) score += 15;
    if (reqData.hasSickOrElderly) score += 15;
    if (reqData.floodedTent) score += 20;
    const urgencyScore = Math.min(100, score);

    const newRequest: SmartRequest = {
      id: 'req-' + Date.now(),
      title: reqData.title || 'طلب مجتمعي غير معنون',
      module: reqData.module || 'wasel',
      category: reqData.category || 'general',
      neighborhood: reqData.neighborhood || 'Deir al-Balah',
      neighborhoodAr: reqData.neighborhoodAr || reqData.neighborhood || 'دير البلح',
      status: 'New',
      urgency: reqData.urgency || 'medium',
      urgencyScore,
      requesterName: reqData.requesterName || 'عضو مجتمعي',
      requesterRole: reqData.requesterRole || 'resident',
      createdAt: new Date().toISOString(),
      description: reqData.description || '',
      hasInfants: reqData.hasInfants,
      hasSickOrElderly: reqData.hasSickOrElderly,
      floodedTent: reqData.floodedTent,
      timeline: [
        {
          status: 'New',
          time: new Date().toISOString(),
          note: navigator.onLine ? 'تم استلام وتوثيق الطلب في منظومة مدار' : 'تم حفظ الطلب محلياً (سيتم الرفع تلقائياً عند توفر الشبكة)',
        },
      ],
    };

    // Optimistically update local state immediately
    setRequests((prev) => [newRequest, ...prev]);

    if (navigator.onLine) {
      try {
        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRequest),
        });
        if (res.ok) {
          const created = await res.json();
          return created;
        }
      } catch (err) {
        console.warn('Failed to post request to server, saving to offline queue:', err);
      }
    }

    // If offline or network error, enqueue mutation
    const mutation: OfflineMutation = {
      id: 'mut-' + Date.now(),
      type: 'CREATE_REQUEST',
      payload: newRequest,
      timestamp: new Date().toISOString(),
      retries: 0,
      status: 'pending',
    };
    setOfflineQueue((prev) => [...prev, mutation]);
    return newRequest;
  };

  const updateRequestStatus = async (id: string, status: RequestStatus, note?: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newTimeline = [
            ...r.timeline,
            {
              status,
              time: new Date().toISOString(),
              note: note || `تغيرت حالة الطلب إلى: ${status}`,
            },
          ];
          return { ...r, status, timeline: newTimeline };
        }
        return r;
      })
    );

    if (navigator.onLine) {
      try {
        await fetch(`/api/requests/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, statusNote: note }),
        });
      } catch (e) {
        console.warn('Failed to update status on server, enqueuing:', e);
        setOfflineQueue((prev) => [
          ...prev,
          {
            id: 'mut-' + Date.now(),
            type: 'UPDATE_REQUEST_STATUS',
            payload: { id, status, note },
            timestamp: new Date().toISOString(),
            retries: 0,
            status: 'pending',
          },
        ]);
      }
    } else {
      setOfflineQueue((prev) => [
        ...prev,
        {
          id: 'mut-' + Date.now(),
          type: 'UPDATE_REQUEST_STATUS',
          payload: { id, status, note },
          timestamp: new Date().toISOString(),
          retries: 0,
          status: 'pending',
        },
      ]);
    }
  };

  const createMarketplaceItem = async (itemData: Partial<MarketplaceItem>): Promise<MarketplaceItem> => {
    const newItem: MarketplaceItem = {
      id: 'wasel-' + Date.now(),
      titleAr: itemData.titleAr || 'منتج جديد',
      titleEn: itemData.titleEn || 'New Listing',
      category: itemData.category || 'solar',
      price: itemData.price || 50,
      currency: itemData.currency || 'ILS',
      merchantId: itemData.merchantId || 'm-custom',
      merchantName: itemData.merchantName || 'مورد محلي معتمد',
      neighborhood: itemData.neighborhood || 'Deir al-Balah',
      neighborhoodAr: itemData.neighborhoodAr || 'دير البلح',
      availableQty: itemData.availableQty || 1,
      isAvailable: true,
      lastVerified: new Date().toISOString(),
      descriptionAr: itemData.descriptionAr || '',
      descriptionEn: itemData.descriptionEn || '',
      alternatives: itemData.alternatives || [],
      groupBuyEligible: itemData.groupBuyEligible ?? true,
      groupBuyDiscount: itemData.groupBuyDiscount ?? 15,
      minGroupQty: itemData.minGroupQty ?? 5,
      rating: 5.0,
      reviewCount: 1,
    };

    setMarketplaceItems((prev) => [newItem, ...prev]);

    if (navigator.onLine) {
      try {
        const res = await fetch('/api/marketplace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Online marketplace post failed, queued:', e);
      }
    }

    setOfflineQueue((prev) => [
      ...prev,
      {
        id: 'mut-' + Date.now(),
        type: 'CREATE_PRODUCT',
        payload: newItem,
        timestamp: new Date().toISOString(),
        retries: 0,
        status: 'pending',
      },
    ]);
    return newItem;
  };

  const joinGroupBuy = async (id: string, qty: number) => {
    setGroupPurchases((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newQty = g.currentQty + qty;
          return {
            ...g,
            currentQty: newQty,
            status: newQty >= g.targetQty ? 'fulfilled' : g.status,
          };
        }
        return g;
      })
    );

    if (navigator.onLine) {
      try {
        await fetch(`/api/group-purchases/${id}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qty }),
        });
      } catch (e) {
        console.warn('Group buy join sync failed:', e);
      }
    }
  };

  const reportWaterIssue = async (issue: { location: string; details: string; type: string; neighborhood: string }) => {
    if (navigator.onLine) {
      try {
        await fetch('/api/water/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(issue),
        });
      } catch (e) {
        console.warn('Water report failed:', e);
      }
    }

    // Also auto-create a high-priority request in unified request center
    await createRequest({
      title: `بلاغ مياه: ${issue.location}`,
      module: 'qatra',
      category: 'water_shortage',
      neighborhood: issue.neighborhood,
      urgency: 'urgent',
      description: issue.details,
    });
  };

  const createSkillListing = async (skillData: Partial<SkillItem>) => {
    const newSkill: SkillItem = {
      id: 'skill-' + Date.now(),
      titleAr: skillData.titleAr || 'خدمة مهنية جديدة',
      titleEn: skillData.titleEn || 'New Professional Service',
      providerName: skillData.providerName || 'مستقل مدار',
      category: skillData.category || 'tech',
      rate: skillData.rate || 'أجر رمزي أو تبادل خبرات',
      rating: 5.0,
      reviewsCount: 1,
      neighborhood: skillData.neighborhood || 'Deir al-Balah',
      neighborhoodAr: skillData.neighborhoodAr || 'دير البلح',
      bioAr: skillData.bioAr || '',
      bioEn: skillData.bioEn || '',
      badges: ['مبادر جديد'],
    };
    setSkills((prev) => [newSkill, ...prev]);
  };

  const toggleLowDataMode = () => {
    setLowDataMode((prev) => !prev);
  };

  return (
    <DataContext.Provider
      value={{
        isOnline,
        lowDataMode,
        toggleLowDataMode,
        isSyncing,
        offlineQueueCount: offlineQueue.length,
        syncOfflineQueue,
        marketplaceItems,
        repairTechnicians,
        waterPoints,
        shelterSupplies,
        skills,
        requests,
        groupPurchases,
        reusableGoods,
        auditLogs,
        createRequest,
        updateRequestStatus,
        createMarketplaceItem,
        joinGroupBuy,
        reportWaterIssue,
        createSkillListing,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
