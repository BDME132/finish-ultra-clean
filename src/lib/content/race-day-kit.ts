export interface RaceDayProduct {
  id: string;
  brand: string;
  name: string;
  description: string;
  price: string;
  affiliateLinks: { retailer: string; url: string }[];
}

export interface RaceDayCategory {
  id: string;
  title: string;
  icon: string;
  tip?: string;
  products: RaceDayProduct[];
}

export const raceDayCategories: RaceDayCategory[] = [
  {
    id: "on-body",
    title: "Essential On-Body Kit",
    icon: "on-body",
    tip: "Everything you're wearing from the gun. Train in all of it before race day — zero surprises.",
    products: [
      {
        id: "hoka-speedgoat-5-rd",
        brand: "Hoka",
        name: "Speedgoat 5",
        description:
          "Max-cushion trail shoe with aggressive grip. Protective on rocky terrain and forgiving on tired legs deep into a race.",
        price: "~$155",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4rvMtjk" },
        ],
      },
      {
        id: "garmin-forerunner-955",
        brand: "Garmin",
        name: "Forerunner 955 Solar",
        description:
          "GPS watch built for ultra distances. Tracks pace, elevation, heart rate, and navigation with 49-hour battery life in GPS mode.",
        price: "~$499",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4bumseh" },
        ],
      },
    ],
  },
  {
    id: "hydration-pack",
    title: "Hydration Pack Essentials",
    icon: "hydration-pack",
    tip: "Pack only what you need for each segment between aid stations. Overpacking is as dangerous as underpacking — extra weight costs miles.",
    products: [
      {
        id: "salomon-adv-skin-12",
        brand: "Salomon",
        name: "ADV Skin 12 Set",
        description:
          "12L running vest with front soft flasks, multiple pockets, and a snug body-conforming fit. Enough capacity for 100-mile mandatory gear.",
        price: "~$200",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/47apuDo" },
        ],
      },
      {
        id: "black-diamond-spot-400",
        brand: "Black Diamond",
        name: "Spot 400-R Headlamp",
        description:
          "400-lumen rechargeable headlamp with red night-vision mode. Most 50-milers and all 100s require you to run through the night.",
        price: "~$70",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4bg1Asv" },
        ],
      },
      {
        id: "black-diamond-distance-z-rd",
        brand: "Black Diamond",
        name: "Distance Z Trekking Poles",
        description:
          "Ultralight folding poles that collapse small enough to stash on your vest. On any race with significant climbing, poles save 20-30% of your leg muscle energy.",
        price: "~$110",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/47EKEtn" },
        ],
      },
      {
        id: "sol-escape-bivvy",
        brand: "SOL",
        name: "Escape Pro Bivvy",
        description:
          "Waterproof emergency bivvy that weighs 8.5oz. Required gear at nearly all mountain ultras and potentially life-saving if you get injured on course.",
        price: "~$40",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/40yVjC7" },
        ],
      },
    ],
  },
  {
    id: "nutrition",
    title: "Nutrition & Hydration",
    icon: "nutrition",
    tip: "Eat before you're hungry, drink before you're thirsty. Target 200-300 calories/hour and practice your exact race-day nutrition in training.",
    products: [
      {
        id: "tailwind-endurance-rd",
        brand: "Tailwind",
        name: "Endurance Fuel",
        description:
          "All-in-one calories, electrolytes, and hydration. Mix with water and sip steady — eliminates the complexity of juggling gels and tabs.",
        price: "~$35 (30 servings)",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/47QVr3H" },
        ],
      },
      {
        id: "gu-energy-gels",
        brand: "GU Energy",
        name: "Energy Gels (Box of 24)",
        description:
          "The most widely tested gel in ultra racing. 100 calories per gel with amino acids for muscle protection. Available at most aid stations so supply chain is easy.",
        price: "~$36 (24-pack)",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/473VbOB" },
        ],
      },
      {
        id: "spring-energy-rd",
        brand: "Spring Energy",
        name: "Awesome Sauce Gel",
        description:
          "Real-food gel made from rice, banana, and pumpkin. When your stomach rebels against chemicals at mile 60, real ingredients keep going down.",
        price: "~$48 (12-pack)",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/40z9siL" },
        ],
      },
      {
        id: "skratch-hydration",
        brand: "Skratch Labs",
        name: "Sport Hydration Mix",
        description:
          "Low-sugar electrolyte drink that doesn't cause GI distress. Developed by sports scientists for athletes who need real hydration, not just sweet drinks.",
        price: "~$25 (20 servings)",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4bE9pY6" },
        ],
      },
      {
        id: "clif-bloks",
        brand: "Clif",
        name: "Shot Bloks Energy Chews",
        description:
          "Chewable energy that's easier to manage than gels when your hands are cold or shaking. 3 bloks = 1 gel equivalent. Great texture variety.",
        price: "~$24 (18-pack)",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4rDbMAk" },
        ],
      },
      {
        id: "precision-hydration-1500",
        brand: "Precision Hydration",
        name: "PH 1500 Electrolyte Sachets",
        description:
          "High-sodium electrolyte tabs for heavy sweaters and hot conditions. Prevents the dangerous hyponatremia (low sodium) that hospitalizes ultra runners every year.",
        price: "~$30 (10-pack)",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4cNCz9g" },
        ],
      },
    ],
  },
  {
    id: "drop-bag",
    title: "Drop Bag Essentials",
    icon: "drop-bag",
    tip: "Label every drop bag clearly. Pre-pack bags at home the night before so you're not rushing at packet pickup. Include a laminated list of contents inside each bag.",
    products: [
      {
        id: "hoka-clifton-9-backup",
        brand: "Hoka",
        name: "Clifton 9 (Backup Shoes)",
        description:
          "Road backup shoes for races with mixed terrain or when your trail shoes get soaked. A dry pair of shoes at mile 50 can save your race.",
        price: "~$145",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4rtgFLZ" },
        ],
      },
      {
        id: "anker-powercore-10000",
        brand: "Anker",
        name: "PowerCore 10000 Power Bank",
        description:
          "Compact 10,000mAh power bank that fully charges a GPS watch twice. Essential for 100-milers and long 50-milers that exceed your watch battery life.",
        price: "~$22",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4buCp4p" },
        ],
      },
      {
        id: "neutrogena-sunscreen",
        brand: "Neutrogena",
        name: "Sport Face SPF 70 Sunscreen",
        description:
          "Sweat-proof sport sunscreen that won't run into your eyes. Reapply at every other drop bag — sun damage accumulates over a long race day and impairs performance.",
        price: "~$11",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/3NcPd7r" },
        ],
      },
    ],
  },
  {
    id: "crew-support",
    title: "Crew Support Kit",
    icon: "crew-support",
    tip: "Your crew is racing too. Set them up with the tools to run an efficient aid station. A well-equipped crew can get you in and out in under 2 minutes.",
    products: [
      {
        id: "helinox-chair-zero",
        brand: "Helinox",
        name: "Chair Zero",
        description:
          "Ultralight packable camp chair (1.1 lbs) for crew areas. Your crew will be waiting hours at each aid station — give them somewhere to sit and recharge.",
        price: "~$175",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/3NJTPC3" },
        ],
      },
      {
        id: "yeti-tundra-45",
        brand: "YETI",
        name: "Roadie 24 Hard Cooler",
        description:
          "Keep food cold and ice cream solid for 24 hours. Cold, real food at mile 70 is one of the most powerful recovery tools available to your crew.",
        price: "~$250",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4rBGLfS" },
        ],
      },
      {
        id: "adventure-medical-kits",
        brand: "Adventure Medical Kits",
        name: "Trail Series Medical Kit",
        description:
          "Comprehensive trail first aid kit with blister care, wound closure, and pain management. Your crew needs to handle anything from blisters to sprains.",
        price: "~$30",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4bOT6bZ" },
        ],
      },
      {
        id: "biolite-headlamp-330",
        brand: "BioLite",
        name: "HeadLamp 330 (Crew Headlamp)",
        description:
          "Rechargeable 330-lumen headlamp for crew members navigating dark aid stations and parking areas. Your crew needs their own light sources — don't share with the runner.",
        price: "~$55",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4dsBiEP" },
        ],
      },
      {
        id: "thermacell-repeller",
        brand: "Thermacell",
        name: "MR450 Mosquito Repeller",
        description:
          "Flame-free zone mosquito protection for crew areas. Aid stations near water or in the mountains can have brutal bug situations that grind down crew morale.",
        price: "~$35",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4dcGxbR" },
        ],
      },
      {
        id: "dude-wipes",
        brand: "DUDE",
        name: "Wipes (Flushable Wipes, 48-Pack)",
        description:
          "Biodegradable wipes for the runner and crew. A full-body wipe-down at mile 60 can mentally reset a deteriorating runner better than almost anything else.",
        price: "~$10",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4ly8BbL" },
        ],
      },
    ],
  },
  {
    id: "post-race",
    title: "Post-Race Recovery",
    icon: "post-race",
    tip: "Recovery starts the moment you cross the finish line. Change out of wet gear immediately, eat within 30 minutes, and elevate your legs. The first 2 hours post-race determine your recovery timeline.",
    products: [
      {
        id: "oofos-ooahh-sandals",
        brand: "Oofos",
        name: "OOahh Sport Flex Sandals",
        description:
          "Patented impact-absorbing foam that reduces stress on your feet and joints by 37%. Slip these on at the finish line — your feet will feel like they're floating.",
        price: "~$65",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4sM5TBB" },
        ],
      },
      {
        id: "triggerpoint-foam-roller",
        brand: "TriggerPoint",
        name: "GRID Foam Roller",
        description:
          "Multi-density foam roller that mimics the feel of a massage therapist's hands. Use starting 24 hours post-race to break up adhesions and speed tissue repair.",
        price: "~$35",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4bqqF2M" },
        ],
      },
      {
        id: "momentous-recovery-protein",
        brand: "Momentous",
        name: "Grass-Fed Whey Protein",
        description:
          "NSF Certified for Sport protein powder with leucine for muscle protein synthesis. Consume within 30 minutes of finishing to kick-start muscle repair immediately.",
        price: "~$50 (30 servings)",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4rz1PDN" },
        ],
      },
      {
        id: "theragun-mini",
        brand: "Theragun",
        name: "Mini Percussive Therapy Device",
        description:
          "Portable percussion massager that penetrates 12mm deep into muscle tissue. 2-3 minutes per muscle group on your quads and calves post-race dramatically reduces DOMS.",
        price: "~$199",
        affiliateLinks: [
          { retailer: "Amazon", url: "https://amzn.to/4lCJ4hu" },
        ],
      },
    ],
  },
];

export const proTips = [
  {
    category: "Shoes & Feet",
    tip: "Go up half a size for races over 50K. Feet swell significantly over long distances and tight shoes are the #1 cause of black toenails and blisters.",
  },
  {
    category: "Nutrition Strategy",
    tip: "Eat solid food in the first half, liquid calories in the second. Your gut slows down after mile 50, making liquid nutrition far easier to process.",
  },
  {
    category: "Drop Bag Strategy",
    tip: "Put your most important items on top. At mile 70, your cognitive function is impaired — you need to find things fast without thinking.",
  },
  {
    category: "Crew Communication",
    tip: "Give your crew a printed sheet with your bib number, estimated arrival times, and exactly what you need at each crew point. The more they can prepare in advance, the faster your stops.",
  },
  {
    category: "Gear Testing",
    tip: "Nothing new on race day — ever. Every piece of gear in this kit needs at least one long training run before the event. This includes socks, gels, and your hydration pack.",
  },
  {
    category: "Weather Prep",
    tip: "Check the forecast obsessively the week before. Have a wet-weather kit and a hot-weather kit mentally ready. Conditions change fast in the mountains.",
  },
];
