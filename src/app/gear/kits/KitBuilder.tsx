"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getKitPreset } from "@/lib/gear-kit-presets";
import {
  buildKit,
  type BuiltKit,
  type GearItem,
  type RetailerLink,
} from "@/lib/gear-kit-builder";
import { loadKitById, saveNewKit, updateKit } from "@/lib/kit-sync";
import {
  loadPublicKitBySlug,
  publishKit as publishPublicKit,
  unpublishKit as unpublishPublicKit,
} from "@/lib/public-kit-sync";
import { generateKitId } from "@/lib/kit-types";
import type { PublicKit, PublicShare, SavedKit, SavedKitItem } from "@/lib/kit-types";
import type { Answers } from "@/types/gear";
import {
  CheckCircle,
  DollarSign,
  Droplets,
  Dumbbell,
  Flag,
  Flashlight,
  Footprints,
  HardHat,
  Medal,
  Moon,
  Mountain,
  Package,
  Salad,
  Shirt,
  Shield,
  ShoppingCart,
  Target,
  Thermometer,
  Zap,
} from "lucide-react";
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type AnalyticsEvent =
  | { event: "product_click"; product_name: string; retailer: string; price: number; category: string; kit_type: string; position: number }
  | { event: "bulk_purchase_click"; retailer: string; total_price: number; kit_type: string }
  | { event: "specs_viewed"; product_name: string; category: string; kit_type: string }
  | { event: "price_comparison_viewed"; product_name: string; cheapest_retailer: string; savings: number }
  | { event: "purchase_tracked"; product_name: string; category: string; marked_purchased: boolean; kit_type: string };

function trackEvent(payload: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    const { event, ...params } = payload;
    window.gtag("event", event, params);
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }
  if (process.env.NODE_ENV === "development") {
    console.log("[FinishUltra Analytics]", payload);
  }
}

const QUESTIONS: { id: keyof Answers; section: string; question: string; icon: React.ReactNode; options: { label: string; value: string }[] }[] = [
  {
    id: "distance",
    section: "Race Details",
    question: "What's your race distance?",
    icon: <Flag className="w-5 h-5 text-primary" />,
    options: [
      { label: "50K (~31 miles)", value: "50k" },
      { label: "50 Miles", value: "50m" },
      { label: "100K (~62 miles)", value: "100k" },
      { label: "100 Miles", value: "100m" },
    ],
  },
  {
    id: "terrain",
    section: "Race Details",
    question: "Primary course terrain?",
    icon: <Mountain className="w-5 h-5 text-primary" />,
    options: [
      { label: "Mountain / alpine (technical, rocky)", value: "mountain" },
      { label: "Desert / open (heat, flat to rolling)", value: "desert" },
      { label: "Forest trails / mixed (rooted, muddy)", value: "forest" },
      { label: "Groomed / road-mixed (runnable, fast)", value: "road" },
    ],
  },
  {
    id: "temp",
    section: "Race Details",
    question: "Expected race-day temperature?",
    icon: <Thermometer className="w-5 h-5 text-primary" />,
    options: [
      { label: "Hot — 75°F+ (sun, humidity, heat index)", value: "hot" },
      { label: "Moderate — 50–75°F (ideal conditions)", value: "moderate" },
      { label: "Cold — 20–50°F (frost, cold nights)", value: "cold" },
      { label: "Extreme — below 20°F (winter, alpine)", value: "extreme" },
    ],
  },
  {
    id: "night",
    section: "Race Details",
    question: "Will you run through the night?",
    icon: <Moon className="w-5 h-5 text-primary" />,
    options: [
      { label: "Yes — night sections required", value: "yes" },
      { label: "No — day finish expected", value: "no" },
    ],
  },
  {
    id: "experience",
    section: "Runner Profile",
    question: "How many ultras have you finished?",
    icon: <Medal className="w-5 h-5 text-primary" />,
    options: [
      { label: "0 — this is my first ultra", value: "first" },
      { label: "1–3 — still learning the game", value: "beginner" },
      { label: "4–10 — I know what I need", value: "intermediate" },
      { label: "10+ — veteran, just want the best", value: "veteran" },
    ],
  },
  {
    id: "budget",
    section: "Runner Profile",
    question: "What's your total gear budget?",
    icon: <DollarSign className="w-5 h-5 text-primary" />,
    options: [
      { label: "Under $400 — budget conscious", value: "budget" },
      { label: "$400–$800 — balanced value", value: "standard" },
      { label: "$800–$1,500 — performance focus", value: "premium" },
      { label: "No limit — best of the best", value: "elite" },
    ],
  },
  {
    id: "sweat",
    section: "Personal Factors",
    question: "How much do you sweat?",
    icon: <Droplets className="w-5 h-5 text-primary" />,
    options: [
      { label: "Light — barely glistening", value: "light" },
      { label: "Moderate — noticeably wet", value: "moderate" },
      { label: "Heavy — soaking through shirts", value: "heavy" },
    ],
  },
  {
    id: "stomach",
    section: "Personal Factors",
    question: "How's your stomach during long efforts?",
    icon: <Salad className="w-5 h-5 text-primary" />,
    options: [
      { label: "Iron gut — I can eat anything while running", value: "iron" },
      { label: "Average — occasional nausea at mile 40+", value: "average" },
      { label: "Sensitive — GI issues are my biggest limiter", value: "sensitive" },
    ],
  },
  {
    id: "feetWidth",
    section: "Personal Factors",
    question: "What's your foot width?",
    icon: <Footprints className="w-5 h-5 text-primary" />,
    options: [
      { label: "Narrow to standard (B–D width)", value: "standard" },
      { label: "Wide (2E width)", value: "wide" },
      { label: "Extra wide / high volume (4E+)", value: "xwide" },
    ],
  },
  {
    id: "priority",
    section: "Personal Factors",
    question: "What's your #1 gear priority?",
    icon: <Target className="w-5 h-5 text-primary" />,
    options: [
      { label: "Foot comfort — blisters ruined past races", value: "feet" },
      { label: "Nutrition — fueling is my weakness", value: "nutrition" },
      { label: "Weather protection — I run in bad conditions", value: "weather" },
      { label: "Minimalism — I want to carry as little as possible", value: "minimal" },
    ],
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Footwear: <Footprints className="w-5 h-5 text-primary" />,
  "Footwear (Drop Bag)": <Footprints className="w-5 h-5 text-primary" />,
  "Hydration Pack": <Package className="w-5 h-5 text-primary" />,
  "Lighting — Headlamp": <Flashlight className="w-5 h-5 text-primary" />,
  "Lighting — Backup": <Flashlight className="w-5 h-5 text-primary" />,
  "Base Layer — Top": <Shirt className="w-5 h-5 text-primary" />,
  "Insulation Layer": <Shirt className="w-5 h-5 text-primary" />,
  "Bottom — Tights": <Shirt className="w-5 h-5 text-primary" />,
  "Bottom — Shorts": <Shirt className="w-5 h-5 text-primary" />,
  "Rain / Wind Shell": <Shirt className="w-5 h-5 text-primary" />,
  Socks: <Footprints className="w-5 h-5 text-primary" />,
  "Foot Care": <Footprints className="w-5 h-5 text-primary" />,
  "Nutrition — Gels": <Zap className="w-5 h-5 text-primary" />,
  "Nutrition — Real Food": <Salad className="w-5 h-5 text-primary" />,
  Electrolytes: <Droplets className="w-5 h-5 text-primary" />,
  "Hydration Mix": <Droplets className="w-5 h-5 text-primary" />,
  Safety: <Shield className="w-5 h-5 text-primary" />,
  Head: <HardHat className="w-5 h-5 text-primary" />,
  Gloves: <Shield className="w-5 h-5 text-primary" />,
  Recovery: <Dumbbell className="w-5 h-5 text-primary" />,
};


const PURCHASED_STORAGE_KEY = "finishultra_kit_purchased";

function itemKey(item: { category: string; product: string }) {
  return `${item.category}::${item.product}`;
}

function snapshotToBuiltKit(snapshot: {
  raceDetails: SavedKit["raceDetails"];
  kitTitle: string;
  kitSubtitle: string;
  items: Array<{
    category: string;
    product: string;
    brand: string;
    price: number;
    why: string;
    tier: GearItem["tier"];
    specs: string[];
    links: GearItem["links"];
  }>;
  packingChecklist: string[];
  dropBagEssentials: string[];
  testingTimeline: string[];
}): BuiltKit {
  const rebuilt = buildKit(snapshot.raceDetails);
  return {
    title: snapshot.kitTitle,
    subtitle: snapshot.kitSubtitle,
    items: snapshot.items.map((item) => ({
      category: item.category,
      product: item.product,
      brand: item.brand,
      price: item.price,
      why: item.why,
      tier: item.tier,
      specs: item.specs,
      links: item.links,
    })),
    packingChecklist: snapshot.packingChecklist,
    dropBagEssentials: snapshot.dropBagEssentials,
    testingTimeline: snapshot.testingTimeline,
    impactBadges: rebuilt.impactBadges,
    selectedTier: rebuilt.selectedTier,
  };
}

function savedKitToBuiltKit(savedKit: SavedKit): BuiltKit {
  return snapshotToBuiltKit(savedKit);
}

function publicKitToBuiltKit(publicKit: PublicKit): BuiltKit {
  return snapshotToBuiltKit(publicKit);
}

function ProductCard({
  item,
  purchased,
  onToggle,
  position,
  kitType,
}: {
  item: GearItem;
  purchased: boolean;
  onToggle: () => void;
  position: number;
  kitType: string;
}) {
  const [showSpecs, setShowSpecs] = useState(false);

  return (
    <div className={`rounded-xl border transition-all ${purchased ? "border-green-200 bg-green-50/50 opacity-80" : "border-gray-200 bg-white"}`}>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
            {CATEGORY_ICONS[item.category] ?? <Package className="w-5 h-5 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-headline font-bold text-dark text-sm leading-snug">{item.brand} {item.product}</p>
                <p className="text-xs text-gray mt-0.5">{item.category}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-accent text-base">${item.price}</span>
                <button
                  onClick={() => {
                    trackEvent({ event: "purchase_tracked", product_name: `${item.brand} ${item.product}`, category: item.category, marked_purchased: !purchased, kit_type: kitType });
                    onToggle();
                  }}
                  title={purchased ? "Mark as not purchased" : "Mark as purchased"}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${purchased ? "border-green-500 bg-green-500 text-white" : "border-gray-300 hover:border-primary"}`}
                >
                  {purchased ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray leading-relaxed mb-3">{item.why}</p>

        {item.specs.length > 0 && (
          <button
            onClick={() => {
              const next = !showSpecs;
              setShowSpecs(next);
              if (next) {
                trackEvent({ event: "specs_viewed", product_name: `${item.brand} ${item.product}`, category: item.category, kit_type: kitType });
              }
            }}
            className="text-xs text-primary font-medium mb-3 hover:underline"
          >
            {showSpecs ? "Hide specs ↑" : "View specs ↓"}
          </button>
        )}

        {showSpecs && item.specs.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mb-3">
            {item.specs.map((spec) => (
              <div key={spec} className="text-xs text-dark bg-gray-50 rounded px-2 py-1 border border-gray-100">
                {spec}
              </div>
            ))}
          </div>
        )}

        {/* Buy button */}
        <a
          href={item.links.amazon.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent({ event: "product_click", product_name: `${item.brand} ${item.product}`, retailer: "Amazon", price: item.links.amazon.price, category: item.category, kit_type: kitType, position })}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all hover:shadow-md"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Buy on Amazon — ${item.links.amazon.price}</span>
          <span>→</span>
        </a>

        {purchased && (
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-green-700 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            Purchased
          </div>
        )}
      </div>

      <div className="px-4 pb-3">
        <p className="text-[10px] text-gray/60 italic">As an affiliate, we earn from qualifying purchases at no cost to you.</p>
      </div>
    </div>
  );
}

export default function KitBuilder() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const presetSlug = searchParams.get("preset");
  const queryKitId = searchParams.get("kit");
  const publicKitSlug = searchParams.get("publicKit");

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [kit, setKit] = useState<BuiltKit | null>(null);
  const [activeTab, setActiveTab] = useState<"gear" | "packing" | "dropbag" | "timeline">("gear");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error" | "login-prompt">("idle");
  const [shareState, setShareState] = useState<"idle" | "publishing" | "unpublishing" | "error">("idle");
  const [savedKitId, setSavedKitId] = useState<string | null>(null);
  const [kitCreatedAt, setKitCreatedAt] = useState<string | null>(null);
  const [sourcePresetId, setSourcePresetId] = useState<string | null>(null);
  const [contextKind, setContextKind] = useState<"saved" | "preset" | "public" | null>(null);
  const [publicShare, setPublicShare] = useState<PublicShare | null>(null);
  const [contextBanner, setContextBanner] = useState<{ title: string; body: string } | null>(null);
  const [isHydrating, setIsHydrating] = useState(Boolean(queryKitId || presetSlug || publicKitSlug));
  const [purchased, setPurchasedRaw] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set<string>();
    try {
      const stored = localStorage.getItem(PURCHASED_STORAGE_KEY);
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });
  const hydratedRef = useRef<string>("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(PURCHASED_STORAGE_KEY, JSON.stringify([...purchased]));
    } catch {
      // Ignore storage errors.
    }
  }, [purchased]);

  useEffect(() => {
    const hydrationKey = `${queryKitId ?? ""}|${publicKitSlug ?? ""}|${presetSlug ?? ""}|${user?.id ?? "guest"}`;
    if (hydratedRef.current === hydrationKey) return;
    hydratedRef.current = hydrationKey;

    let cancelled = false;
    setIsHydrating(Boolean(queryKitId || presetSlug || publicKitSlug));

    async function hydrateFromQuery() {
      let loadedContext = false;

      if (queryKitId) {
        const savedKit = await loadKitById(user, queryKitId);
        if (cancelled) return;

        if (savedKit) {
          loadedContext = true;
          setAnswers(savedKit.raceDetails);
          setKit(savedKitToBuiltKit(savedKit));
          setSavedKitId(savedKit.kitId);
          setKitCreatedAt(savedKit.createdAt);
          setSourcePresetId(savedKit.presetId ?? null);
          setContextKind("saved");
          setPublicShare(savedKit.publicShare ?? null);
          setSaveState("idle");
          setShareState("idle");
          setContextBanner({
            title: "Editing saved kit",
            body: "This builder is hydrated with your saved answers, item list, and purchase state.",
          });
          setPurchasedRaw(new Set(savedKit.items.filter((item) => item.purchased).map((item) => itemKey(item))));
          setActiveTab("gear");
          setIsHydrating(false);
          return;
        }
      }

      if (publicKitSlug) {
        const publicKit = await loadPublicKitBySlug(publicKitSlug);
        if (cancelled) return;

        if (publicKit) {
          loadedContext = true;
          setAnswers(publicKit.raceDetails);
          setKit(publicKitToBuiltKit(publicKit));
          setSavedKitId(null);
          setKitCreatedAt(null);
          setSourcePresetId(publicKit.presetId ?? null);
          setContextKind("public");
          setPublicShare(null);
          setSaveState("idle");
          setShareState("idle");
          setContextBanner({
            title: `Loaded from ${publicKit.authorDisplayName}'s shared kit`,
            body: "Their race setup is now loaded into your builder. Save it to Race HQ to make it your own.",
          });
          setPurchasedRaw(new Set<string>());
          setActiveTab("gear");
          setIsHydrating(false);
          return;
        }
      }

      if (presetSlug) {
        const preset = getKitPreset(presetSlug);
        if (preset && !cancelled) {
          loadedContext = true;
          setAnswers(preset.answers);
          setKit(buildKit(preset.answers));
          setSavedKitId(null);
          setKitCreatedAt(null);
          setSourcePresetId(preset.slug);
          setContextKind("preset");
          setPublicShare(null);
          setSaveState("idle");
          setShareState("idle");
          setContextBanner({
            title: `Loaded preset: ${preset.name}`,
            body: preset.description,
          });
          setPurchasedRaw(new Set<string>());
          setActiveTab("gear");
        }
      } else if (!queryKitId && !publicKitSlug) {
        setContextBanner(null);
        setSourcePresetId(null);
        setContextKind(null);
        setPublicShare(null);
      }

      if (!loadedContext) {
        setStep(0);
        setAnswers({});
        setKit(null);
        setSavedKitId(null);
        setKitCreatedAt(null);
        setSourcePresetId(null);
        setContextKind(null);
        setPublicShare(null);
        setContextBanner(null);
        setPurchasedRaw(new Set<string>());
        setActiveTab("gear");
      }

      if (!cancelled) {
        setIsHydrating(false);
      }
    }

    hydrateFromQuery();
    return () => {
      cancelled = true;
    };
  }, [presetSlug, queryKitId, publicKitSlug, user]);

  function setPurchased(updater: (prev: Set<string>) => Set<string>) {
    setPurchasedRaw(updater);
  }

  function select(value: string) {
    const currentQ = QUESTIONS[step];
    const next = { ...answers, [currentQ.id]: value } as Answers;
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setKit(buildKit(next));
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setKit(null);
    setActiveTab("gear");
    setSaveState("idle");
    setShareState("idle");
    setSavedKitId(null);
    setKitCreatedAt(null);
    setPurchasedRaw(new Set());
    setContextBanner(null);
    setSourcePresetId(null);
    setContextKind(null);
    setPublicShare(null);
    try {
      localStorage.removeItem(PURCHASED_STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  }

  function togglePurchased(key: string) {
    setPurchased((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function handleSaveKit() {
    if (!kit) return;

    if (!user) {
      setSaveState("login-prompt");
      return;
    }

    setSaveState("saving");

    try {
      const kitId = savedKitId || generateKitId();
      const kitItems: SavedKitItem[] = kit.items.map((item) => ({
        ...item,
        purchased: purchased.has(itemKey(item)),
        tested: false,
        testingNotes: [],
        rating: 0,
      }));
      const purchasedItems = kitItems.filter((item) => item.purchased);
      const totalCost = kit.items.reduce((sum, item) => sum + item.price, 0);
      const savedKit: SavedKit = {
        kitId,
        createdAt: kitCreatedAt ?? new Date().toISOString(),
        lastModified: new Date().toISOString(),
        presetId: sourcePresetId ?? undefined,
        raceDetails: answers as SavedKit["raceDetails"],
        kitTitle: kit.title,
        kitSubtitle: kit.subtitle,
        totalCost,
        budgetCost: Math.round(totalCost * 0.75),
        premiumCost: Math.round(totalCost * 1.35),
        items: kitItems,
        packingChecklist: kit.packingChecklist,
        dropBagEssentials: kit.dropBagEssentials,
        testingTimeline: kit.testingTimeline,
        purchaseProgress: {
          totalItems: kitItems.length,
          purchased: purchasedItems.length,
          tested: 0,
          totalSpent: purchasedItems.reduce((sum, item) => sum + item.price, 0),
        },
        status: "active",
        notes: "",
        publicShare,
      };

      if (savedKitId) {
        await updateKit(savedKit, user);
      } else {
        await saveNewKit(savedKit, user);
        setSavedKitId(kitId);
        setKitCreatedAt(savedKit.createdAt);
      }

      if (publicShare) {
        const publishResult = await publishPublicKit(kitId);
        if (publishResult?.publicShare) {
          setPublicShare(publishResult.publicShare);
        } else {
          setShareState("error");
          window.setTimeout(() => setShareState("idle"), 3500);
        }
      }

      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 4000);
    } catch (error) {
      console.error("Failed to save kit:", error);
      setSaveState("error");
      window.setTimeout(() => setSaveState("idle"), 3000);
    }
  }

  async function handlePublishKit() {
    if (!savedKitId) return;

    setShareState("publishing");
    const publishResult = await publishPublicKit(savedKitId);

    if (!publishResult) {
      setShareState("error");
      window.setTimeout(() => setShareState("idle"), 3500);
      return;
    }

    setPublicShare(publishResult.publicShare);
    setShareState("idle");
  }

  async function handleUnpublishKit() {
    if (!savedKitId) return;

    setShareState("unpublishing");
    const success = await unpublishPublicKit(savedKitId);

    if (!success) {
      setShareState("error");
      window.setTimeout(() => setShareState("idle"), 3500);
      return;
    }

    setPublicShare(null);
    setShareState("idle");
  }

  const currentQ = QUESTIONS[step];
  const progress = Math.round((step / QUESTIONS.length) * 100);
  const totalCost = kit ? kit.items.reduce((sum, item) => sum + item.price, 0) : 0;
  const purchasedCost = kit
    ? kit.items.filter((item) => purchased.has(itemKey(item))).reduce((sum, item) => sum + item.price, 0)
    : 0;
  const purchasedCount = kit ? kit.items.filter((item) => purchased.has(itemKey(item))).length : 0;
  const progressPct = totalCost > 0 ? Math.round((purchasedCost / totalCost) * 100) : 0;
  const groupedItems = kit
    ? kit.items.reduce<Record<string, GearItem[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {})
    : {};
  const currentSection = currentQ?.section;
  const sectionSteps = ["Race Details", "Runner Profile", "Personal Factors"];

  if (isHydrating) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-dark to-gray-800 px-6 py-5 text-white">
          <h2 className="font-headline text-xl font-bold">Custom Kit Builder</h2>
          <p className="text-gray-300 text-sm mt-1">Loading your kit context…</p>
        </div>
        <div className="p-6 sm:p-8 animate-pulse">
          <div className="h-4 w-40 bg-gray-100 rounded mb-5" />
          <div className="h-2 w-full bg-gray-100 rounded mb-6" />
          <div className="h-7 w-3/4 bg-gray-100 rounded mb-6" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-16 bg-gray-100 rounded-xl" />
            <div className="h-16 bg-gray-100 rounded-xl" />
            <div className="h-16 bg-gray-100 rounded-xl" />
            <div className="h-16 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-dark to-gray-800 px-6 py-5 text-white">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-headline text-xl font-bold">Custom Kit Builder</h2>
          {savedKitId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
              Active saved kit
            </span>
          )}
          {!savedKitId && contextKind === "preset" && sourcePresetId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
              Preset loaded
            </span>
          )}
          {!savedKitId && contextKind === "public" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
              Shared kit loaded
            </span>
          )}
        </div>
        <p className="text-gray-300 text-sm mt-1">
          10 questions → a complete, personalized gear kit for your exact race.
        </p>
      </div>

      {contextBanner && (
        <div className="border-b border-primary/10 bg-primary/5 px-6 py-4">
          <p className="text-sm font-semibold text-dark">{contextBanner.title}</p>
          <p className="text-sm text-gray mt-1">{contextBanner.body}</p>
        </div>
      )}

      {!kit ? (
        <div className="p-6 sm:p-8">
          <div className="flex gap-2 mb-5">
            {sectionSteps.map((section) => (
              <div
                key={section}
                className={`flex-1 text-center text-xs font-medium py-1.5 rounded-lg transition-colors ${
                  section === currentSection
                    ? "bg-primary text-white"
                    : sectionSteps.indexOf(section) < sectionSteps.indexOf(currentSection)
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-100 text-gray"
                }`}
              >
                {section}
              </div>
            ))}
          </div>

          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
            <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <p className="text-sm text-gray font-medium mb-2">Question {step + 1} of {QUESTIONS.length}</p>
          <h3 className="font-headline text-2xl font-bold text-dark mb-6 flex items-center gap-2">
            {currentQ.icon}
            <span>{currentQ.question}</span>
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => select(option.value)}
                className="text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all font-medium text-dark"
              >
                {option.label}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button onClick={() => setStep((prev) => prev - 1)} className="mt-4 text-sm text-gray hover:text-primary transition-colors">
              ← Back
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-5 gap-4">
              <div>
                <h3 className="font-headline text-xl font-bold text-dark">{kit.title}</h3>
                <p className="text-sm text-gray mt-1">{kit.subtitle}</p>
              </div>
              <button onClick={restart} className="text-sm text-primary hover:underline font-medium shrink-0">
                Rebuild →
              </button>
            </div>

            {kit.impactBadges.length > 0 && (
              <div className="mb-5 rounded-xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Why this kit changed</p>
                <div className="flex flex-wrap gap-2">
                  {kit.impactBadges.map((badge) => (
                    <span key={badge} className="inline-flex items-center rounded-full border border-primary/10 bg-white px-3 py-1 text-xs font-medium text-dark">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-5">
              {saveState === "login-prompt" ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <p className="font-headline font-bold text-dark text-base mb-2">Create Account to Save Your Kit</p>
                  <div className="text-sm text-gray mb-3">
                    <p className="mb-2">Your custom kit includes:</p>
                    <ul className="space-y-1">
                      <li>- {kit.items.length} personalized items</li>
                      <li>- Total value: ${totalCost.toLocaleString()}</li>
                      <li>- Query-driven presets, purchase links, and Race HQ sync</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray mb-4">Create a free account to save this kit permanently, track purchases, and access it from Race HQ.</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="/auth/callback?next=/gear/kits"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors"
                    >
                      Create Free Account
                    </a>
                    <button
                      onClick={() => setSaveState("idle")}
                      className="px-5 py-2.5 border border-gray-300 text-dark text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </div>
              ) : saveState === "saved" ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">&#10003;</span>
                    <div>
                      <p className="font-semibold text-green-800 text-sm">Kit Saved Successfully!</p>
                      <p className="text-xs text-green-700 mt-0.5">
                        {publicShare
                          ? "Race HQ now points to this active saved kit, and your shared page was refreshed."
                          : "Race HQ now points to this active saved kit."}
                      </p>
                    </div>
                  </div>
                  <a href="/race-hq" className="text-sm font-medium text-primary hover:underline shrink-0">
                    View in Race HQ
                  </a>
                </div>
              ) : (
                <button
                  onClick={handleSaveKit}
                  disabled={saveState === "saving"}
                  className={`w-full px-5 py-3.5 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
                    saveState === "saving"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : saveState === "error"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-accent hover:bg-orange-600 text-white hover:shadow-md"
                  }`}
                >
                  {saveState === "saving" ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving Kit...
                    </>
                  ) : saveState === "error" ? (
                    "Failed to save — try again"
                  ) : savedKitId ? (
                    <>Update Active Kit</>
                  ) : (
                    <>Save This Kit to Race HQ</>
                  )}
                </button>
              )}
            </div>

            {user && (
              <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-1">Shared Kit</p>
                    {publicShare ? (
                      <>
                        <p className="text-sm font-semibold text-dark">This kit is public.</p>
                        <p className="text-sm text-gray mt-1">Other runners can browse it in Shared Kits, and every save here refreshes the public snapshot.</p>
                      </>
                    ) : savedKitId ? (
                      <>
                        <p className="text-sm font-semibold text-dark">Keep this private or publish it for other runners.</p>
                        <p className="text-sm text-gray mt-1">Publishing creates a public inspiration page without exposing your purchase history.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-dark">Save this kit before sharing it.</p>
                        <p className="text-sm text-gray mt-1">Once it is saved to Race HQ, you can publish a read-only public version.</p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {publicShare && (
                      <a
                        href={`/gear/race-day-kit/${publicShare.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                      >
                        View Public Page
                      </a>
                    )}
                    {savedKitId && !publicShare && (
                      <button
                        onClick={handlePublishKit}
                        disabled={shareState === "publishing"}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                          shareState === "publishing"
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-blue-700"
                        }`}
                      >
                        {shareState === "publishing" ? "Publishing..." : "Make Public"}
                      </button>
                    )}
                    {savedKitId && publicShare && (
                      <button
                        onClick={handleUnpublishKit}
                        disabled={shareState === "unpublishing"}
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                          shareState === "unpublishing"
                            ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "border-gray-300 bg-white text-dark hover:bg-gray-100"
                        }`}
                      >
                        {shareState === "unpublishing" ? "Making Private..." : "Make Private"}
                      </button>
                    )}
                  </div>
                </div>
                {shareState === "error" && (
                  <p className="mt-3 text-sm text-red-600">Couldn&apos;t update the public share state. Try again.</p>
                )}
              </div>
            )}

            <div className="mb-5 rounded-xl border border-gray-200 bg-light px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-1">Selected build</p>
                <p className="text-sm font-semibold text-dark capitalize">{kit.selectedTier} tier</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray">Estimated total</p>
                <p className="text-lg font-bold text-primary">${totalCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
              {(["gear", "packing", "dropbag", "timeline"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === tab ? "bg-white text-dark shadow-sm" : "text-gray hover:text-dark"
                  }`}
                >
                  {tab === "gear" ? "Gear List" : tab === "packing" ? "Pack Checklist" : tab === "dropbag" ? "Drop Bags" : "Testing Plan"}
                </button>
              ))}
            </div>

            {activeTab === "gear" && (
              <div className="space-y-5">
                <div className="bg-dark rounded-xl p-4 space-y-2">
                  <p className="text-white text-xs font-semibold uppercase tracking-wide mb-3">Quick Purchase Options</p>
                  <a
                    href="https://www.amazon.com/s?k=ultra+marathon+gear&tag=finishultra-20"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackEvent({ event: "bulk_purchase_click", retailer: "Amazon", total_price: totalCost, kit_type: kit.title })}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all hover:shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Shop Complete Kit on Amazon — ${totalCost.toLocaleString()}
                  </a>
                  </div>
                  <p className="text-gray-400 text-[11px] text-center pt-1">Or purchase items individually below ↓</p>
                </div>

                {purchasedCount > 0 && (
                  <div className="bg-light rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-dark">Kit Progress</p>
                      <p className="text-xs text-gray">{purchasedCount} of {kit.items.length} items purchased</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700 font-medium">Purchased: ${purchasedCost.toLocaleString()}</span>
                      <span className="text-gray">Remaining: ${(totalCost - purchasedCost).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {(() => {
                  let globalIndex = 0;
                  return Object.entries(groupedItems).map(([category, categoryItems]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <span>{CATEGORY_ICONS[category] ?? <Package className="w-5 h-5 text-primary" />}</span>
                        <span className="text-sm font-bold text-dark uppercase tracking-wide">{category}</span>
                      </div>
                      <div className="space-y-3">
                        {categoryItems.map((item) => {
                          const key = itemKey(item);
                          const position = ++globalIndex;
                          return (
                            <ProductCard
                              key={key}
                              item={item}
                              purchased={purchased.has(key)}
                              onToggle={() => togglePurchased(key)}
                              position={position}
                              kitType={kit.title}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}

                <div className="bg-dark rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-white font-semibold text-sm">Estimated Total</span>
                    {purchasedCount > 0 && (
                      <p className="text-gray-400 text-xs mt-0.5">${purchasedCost.toLocaleString()} purchased · ${(totalCost - purchasedCost).toLocaleString()} remaining</p>
                    )}
                  </div>
                  <span className="text-accent font-bold text-xl">~${totalCost.toLocaleString()}</span>
                </div>

                <p className="text-[11px] text-gray text-center leading-relaxed px-2">
                  <strong>Affiliate Disclosure:</strong> FinishUltra earns a small commission on purchases made through links on this page, at no additional cost to you. All recommendations are based on product performance — we never accept payment for placement.
                </p>
              </div>
            )}

            {activeTab === "packing" && (
              <div className="space-y-2">
                <p className="text-sm text-gray mb-4">Go through this list the morning before your race. Missing items have DNF&apos;d more runners than bad fitness.</p>
                {kit.packingChecklist.map((item) => (
                  <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-dark">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "dropbag" && (
              <div>
                <p className="text-sm text-gray mb-4">Pack these in a clearly labeled dry bag for each crew access point.</p>
                <div className="space-y-2">
                  {kit.dropBagEssentials.map((item) => (
                    <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                      <span className="text-primary mt-0.5">→</span>
                      <span className="text-sm text-dark">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm font-semibold text-dark mb-1">Pro Tip: The Two-Bag System</p>
                  <p className="text-sm text-gray">Pack a “quick access” small bag on top of everything — items you&apos;ll definitely use first. The main bag holds true emergency pieces. This is faster and more reliable when your brain stops being helpful late in the race.</p>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-3">
                <p className="text-sm text-gray mb-4">Nothing on race day should be new. This is how you test your kit so gear never becomes the reason you DNF.</p>
                {kit.testingTimeline.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm text-dark">{item}</span>
                  </div>
                ))}
                <div className="bg-accent/10 rounded-xl p-4 border border-accent/20 mt-2">
                  <p className="text-sm font-semibold text-dark mb-1">The Golden Rule</p>
                  <p className="text-sm text-gray">If you haven&apos;t worn it for at least 6 hours at race pace, it doesn&apos;t go in the bag. Hot spots, rubbing, bounce, and sweat-induced chafing show up on long efforts, not in the store.</p>
                </div>
              </div>
            )}
          </div>

          {purchasedCount > 0 && (
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-dark">Kit Progress — {purchasedCount}/{kit.items.length} purchased</span>
                <span className="text-xs font-bold text-green-700">{progressPct}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5">
                <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-gray">
                <span className="text-green-700 font-medium">${purchasedCost.toLocaleString()} purchased</span>
                <span>${(totalCost - purchasedCost).toLocaleString()} remaining</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
