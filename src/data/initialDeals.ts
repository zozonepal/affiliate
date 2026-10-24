import { ProductDeal } from '../types';

export const INITIAL_DEALS: Omit<ProductDeal, 'id'>[] = [
  // 1. Tech & Accessories (Audio & Wearables)
  {
    title: 'Ultima Atom 192 True Wireless Earbuds (Environmental Noise Cancellation, 42H Playtime)',
    category: 'Tech & Accessories',
    price: 1899,
    originalPrice: 2999,
    badge: '🔥 65% OFF',
    promoCode: 'ULTIMA150',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Carbon Black',
        colorCode: '#18181b',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Arctic White',
        colorCode: '#f1f5f9',
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/m8bK',
    description: '13mm dynamic drivers with deep bass, low latency gaming mode (60ms), IPX4 water resistance, and fast Type-C charging.',
    rating: 4.6,
    reviewsCount: 420,
    upvotes: 38,
    upvotedBy: [],
    inStock: true,
    seller: 'Ultima Official Store'
  },
  {
    title: 'Amazfit Bip 3 Pro Smartwatch (Built-in 4 Satellite GPS, 1.69" Display, 14-Day Battery)',
    category: 'Tech & Accessories',
    price: 5499,
    originalPrice: 7999,
    badge: 'Trending Fitness Pick',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Obsidian Black',
        colorCode: '#1e293b',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Glacier Silver',
        colorCode: '#cbd5e1',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/v2eT',
    description: 'Accurate 4-satellite positioning systems, SpO2 & 24H heart rate tracking, 60+ sports modes, 5 ATM water-resistance.',
    rating: 4.7,
    reviewsCount: 185,
    upvotes: 64,
    upvotedBy: [],
    inStock: true,
    seller: 'Amazfit Nepal Official'
  },
  {
    title: 'boAt Rockerz 450 Bluetooth On-Ear Headphones (Adaptive Earcups, 15H Playback)',
    category: 'Tech & Accessories',
    price: 2799,
    originalPrice: 4499,
    badge: '38% OFF Special',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Lush Black',
        colorCode: '#0f172a',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/x4nT',
    description: '40mm drivers for punchy bass, plush earcups with matte finish, lightweight folding design.',
    rating: 4.5,
    reviewsCount: 512,
    upvotes: 41,
    upvotedBy: [],
    inStock: true,
    seller: 'boAt Lifestyle Nepal'
  },

  // 2. Tools & Hardware
  {
    title: 'Total Cordless Li-ion Drill Set 20V (2 Batteries + Fast Charger + 50pcs Accessories)',
    category: 'Tools & Hardware',
    price: 6890,
    originalPrice: 9500,
    badge: 'Trending Workshop Pick',
    promoCode: 'TOTAL10',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiia0vVGTchKG2bDSx5ntZstKAevxyHcpe0RYQ2bXEuG-2rOkblT4z2dHbGC8tL7efn3DdDzFfhhLJ-KGzTPG6JbrCRl66vn_yADZrSdWUPLyvfuCo9riTrCyIvjWl4xUTgBxOxyGPbBaOib9_ue8aP_IMnY2bdOKFF9DAGq1j50AdcfkHEINAOoT4yv3JI14QIWq_cM3z0cDvDbuKfePpNJbVqKtyjQ1pozJewGg',
    colorVariants: [
      {
        name: 'Industrial Turquoise',
        colorCode: '#0d9488',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiia0vVGTchKG2bDSx5ntZstKAevxyHcpe0RYQ2bXEuG-2rOkblT4z2dHbGC8tL7efn3DdDzFfhhLJ-KGzTPG6JbrCRl66vn_yADZrSdWUPLyvfuCo9riTrCyIvjWl4xUTgBxOxyGPbBaOib9_ue8aP_IMnY2bdOKFF9DAGq1j50AdcfkHEINAOoT4yv3JI14QIWq_cM3z0cDvDbuKfePpNJbVqKtyjQ1pozJewGg'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/m8bK',
    description: 'Heavy duty 20V brushless motor, 45Nm torque, 2-speed gearbox, integrated LED worklight with hard carrying case.',
    rating: 4.8,
    reviewsCount: 142,
    upvotes: 56,
    upvotedBy: [],
    inStock: true,
    seller: 'Total Tools Nepal Flagship'
  },
  {
    title: 'Xiaomi Wowstick 1F+ 64 In 1 Precision Electric Screwdriver Toolkit (Magnetic Mat + LED)',
    category: 'Tools & Hardware',
    price: 3650,
    originalPrice: 4999,
    badge: 'Top Rated for Electronics',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Space Grey Aluminum',
        colorCode: '#334155',
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/u9kL',
    description: 'Slim S2 aluminum alloy body with pen shape design, dual torque 0.15/3N.m, rechargeable lithium-ion battery with 3 LED shadowless lights.',
    rating: 4.9,
    reviewsCount: 98,
    upvotes: 47,
    upvotedBy: [],
    inStock: true,
    seller: 'Xiaomi Gadgets NP'
  },

  // 3. Home Appliances
  {
    title: 'Philips Digital Air Fryer XL 4.1L (Rapid Air Technology, 90% Less Fat, Touchscreen)',
    category: 'Home Appliances',
    price: 11499,
    originalPrice: 15999,
    badge: 'Deal of the Day',
    promoCode: 'PHILIPS500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Cwnmgv3N5Y9vIFk2fSQuRwoT3gJVbY3wUE6EnNGEsee-StDVV2cFNT-u8gXRmEtjixhHQ3ES_bZ6uhwaW7PyoE4IKq0QYfvDUc71R1h1LsFoNRnASPmjCH4cVOialHnfMksJCB78UithkoJrGWuI-GWWMuSAOU19RUFFCYq4fgbePUiBAU5PDpbNRC-4VKIEZOFcc5pf71QciKyBs27V_nv-xbFckzIJYuXZbw4',
    colorVariants: [
      {
        name: 'Matte Graphite',
        colorCode: '#0f172a',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Cwnmgv3N5Y9vIFk2fSQuRwoT3gJVbY3wUE6EnNGEsee-StDVV2cFNT-u8gXRmEtjixhHQ3ES_bZ6uhwaW7PyoE4IKq0QYfvDUc71R1h1LsFoNRnASPmjCH4cVOialHnfMksJCB78UithkoJrGWuI-GWWMuSAOU19RUFFCYq4fgbePUiBAU5PDpbNRC-4VKIEZOFcc5pf71QciKyBs27V_nv-xbFckzIJYuXZbw4'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/v2eT',
    description: 'Patented Rapid Air starfish design cooks food with little to no added oil, 7 preset touchscreen programs, easy clean dishwasher-safe parts.',
    rating: 4.8,
    reviewsCount: 310,
    upvotes: 82,
    upvotedBy: [],
    inStock: true,
    seller: 'Philips Domestic Appliances Nepal'
  },
  {
    title: 'Dreame D9 Max Robotic Vacuum Cleaner & Mop (4000Pa Suction, LiDAR Navigation)',
    category: 'Home Appliances',
    price: 28990,
    originalPrice: 38000,
    badge: 'Smart Clean Pro',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Midnight Black',
        colorCode: '#1e293b',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/w7qR',
    description: 'Smart laser mapping with app-controlled multi-floor maps, customized no-go zones, automatic carpet boost and 570ml large dustbin.',
    rating: 4.7,
    reviewsCount: 76,
    upvotes: 53,
    upvotedBy: [],
    inStock: true,
    seller: 'Smart Home Hub Nepal'
  },

  // 4. Mobile Gear
  {
    title: 'Baseus 20000mAh 65W Adaman Power Bank (Fast Charge for Laptops & Mobile Phones)',
    category: 'Mobile Gear',
    price: 4899,
    originalPrice: 6500,
    badge: 'Laptop 65W PD',
    promoCode: 'BASEUS200',
    image: 'https://images.unsplash.com/photo-1609592426507-7d5fa369527f?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Space Black',
        colorCode: '#09090b',
        image: 'https://images.unsplash.com/photo-1609592426507-7d5fa369527f?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Metallic Silver',
        colorCode: '#94a3b8',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/w7qR',
    description: 'Supports USB-C Power Delivery 65W, digital LED display showing voltage and current, fast charges MacBook Air, iPhones, Samsung.',
    rating: 4.9,
    reviewsCount: 240,
    upvotes: 45,
    upvotedBy: [],
    inStock: true,
    seller: 'Baseus Nepal Flagship'
  },
  {
    title: 'Ugreen 65W GaN Fast Wall Charger 3-Port (Dual Type-C + USB-A Foldable Plug)',
    category: 'Mobile Gear',
    price: 3499,
    originalPrice: 4800,
    badge: 'High Demand GaN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQyWd1FAe3Ekg4jATM3sU7ARoqx59mKgJ8mJFkV2Lx2470Ri3BmqqLwt6xEA3gZBT03MBUlhkzPVyO6lcHJ2mnYaNx0HvYYXBkk4ZeE5RiUdgNYsMSynDUXbG0MAjnIxaevkMUPZCFrvjx4tqyI9DKHadP6KKg8o0PnAJdVk-1Vvl5vqyMn45cbNApeVj7pbXwKOd6nd9khDb3R6f7SIzbS_HmijtPciMmaXTGCt8',
    colorVariants: [
      {
        name: 'Matte Graphite',
        colorCode: '#1e293b',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQyWd1FAe3Ekg4jATM3sU7ARoqx59mKgJ8mJFkV2Lx2470Ri3BmqqLwt6xEA3gZBT03MBUlhkzPVyO6lcHJ2mnYaNx0HvYYXBkk4ZeE5RiUdgNYsMSynDUXbG0MAjnIxaevkMUPZCFrvjx4tqyI9DKHadP6KKg8o0PnAJdVk-1Vvl5vqyMn45cbNApeVj7pbXwKOd6nd9khDb3R6f7SIzbS_HmijtPciMmaXTGCt8'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/u9kL',
    description: 'Next-gen GaN semiconductor technology, compact palm-sized design, charges laptops, tablets, and phones simultaneously with temperature protection.',
    rating: 4.8,
    reviewsCount: 164,
    upvotes: 58,
    upvotedBy: [],
    inStock: true,
    seller: 'Ugreen Nepal Store'
  },

  // 5. Gaming & PC
  {
    title: 'Fantech Fighter II K613L Tournament Edition Gaming Keyboard (Aluminium Alloy Body)',
    category: 'Gaming & PC',
    price: 2450,
    originalPrice: 3800,
    badge: '⚡ Flash Sales',
    promoCode: 'FANTECH10',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Stealth Black',
        colorCode: '#0f172a',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/u9kL',
    description: '19 Anti-ghosting keys, RGB chroma lighting with 3 spectrum modes, ergonomic floating keycaps, brushed aluminium top plate.',
    rating: 4.8,
    reviewsCount: 312,
    upvotes: 52,
    upvotedBy: [],
    inStock: true,
    seller: 'Fantech Nepal Flagship Store'
  },
  {
    title: 'Redragon M711 Cobra Chroma RGB Gaming Mouse (10,000 DPI, 7 Programmable Buttons)',
    category: 'Gaming & PC',
    price: 2199,
    originalPrice: 3200,
    badge: 'Popular for Gamers',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Matte Black RGB',
        colorCode: '#111827',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/k3pM',
    description: 'High precision optical sensor up to 10,000 DPI, 16.8 million RGB color options, Omron switches with 20 million click lifespan.',
    rating: 4.7,
    reviewsCount: 198,
    upvotes: 29,
    upvotedBy: [],
    inStock: true,
    seller: 'Redragon Store NP'
  },

  // 6. Smart Home & Audio
  {
    title: 'Mi Smart Speaker with Google Assistant (12W Front-firing, DTS Sound, Dual Mic)',
    category: 'Smart Home & Audio',
    price: 5999,
    originalPrice: 7999,
    badge: 'Top Rated Voice Hub',
    promoCode: 'MISPEAKER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo1hlbrsHOg49xbpKJPdOIJWbrIaHDsXYu7ODPNpocDX5H3AweO4VCHVKMMDfmOOu3yQe8gMctl8dFcpnivp99WIeonxORDECqdLPk4mNKeuyqoLoXdLlyRfaU_UTJJd2MpWmj3Mmo2HJNXQ_EMkcWdUs0aQ4JnZLmja8_ngux9IShkpNTU7F1Y7fJSUD13DTcH0L6wzlqDC_Tey8cvdz8UN4JIEE6_qeRRO8B4sQ',
    colorVariants: [
      {
        name: 'Graphite Metal',
        colorCode: '#334155',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo1hlbrsHOg49xbpKJPdOIJWbrIaHDsXYu7ODPNpocDX5H3AweO4VCHVKMMDfmOOu3yQe8gMctl8dFcpnivp99WIeonxORDECqdLPk4mNKeuyqoLoXdLlyRfaU_UTJJd2MpWmj3Mmo2HJNXQ_EMkcWdUs0aQ4JnZLmja8_ngux9IShkpNTU7F1Y7fJSUD13DTcH0L6wzlqDC_Tey8cvdz8UN4JIEE6_qeRRO8B4sQ'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/p5jH',
    description: 'Massive 12W audio driver with Texas Instruments professional sound chip, Google Assistant smart home controls, Wi-Fi and Bluetooth 4.2.',
    rating: 4.8,
    reviewsCount: 220,
    upvotes: 68,
    upvotedBy: [],
    inStock: true,
    seller: 'Mi Authorized Store Nepal'
  },
  {
    title: 'Sonoff S26 Smart WiFi Socket Plug (Voice Control, Timer Schedule, Energy Saving)',
    category: 'Smart Home & Audio',
    price: 1350,
    originalPrice: 1950,
    badge: 'Smart Upgrade',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Frost White',
        colorCode: '#f8fafc',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/z9mL',
    description: 'Turn your existing appliances smart instantly via eWeLink app, compatible with Alexa and Google Home, set automated timers for geysers and heaters.',
    rating: 4.6,
    reviewsCount: 110,
    upvotes: 35,
    upvotedBy: [],
    inStock: true,
    seller: 'IoT Nepal Store'
  },

  // 7. Outdoor & EDC
  {
    title: 'Nitecore TIKI USB Rechargeable Mini EDC Keychain Flashlight (300 Lumens + UV + High CRI)',
    category: 'Outdoor & EDC',
    price: 2650,
    originalPrice: 3800,
    badge: 'Clearance Drop',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3UsMF8QR5cZODFaQgNUWRASUSLtUX45Ppz19fG9YoN2kW40o9aX5K4aA1VCEFYNC87Wo0MIjlPtSYnm_caTz601ZlipL6pgdGpoWrpc-eLAYtWv7plBpsBhp4o8U9rznX6Cnw6NEdivq0xaI7n7zEyNvkE1ULSTieVVgoxVUx4mXUWuiwVyBMW0MryX2__685cOEYgMduAm2yHEqeLzlNzRzUtHz4tOaiavECo8',
    colorVariants: [
      {
        name: 'Frosted Translucent',
        colorCode: '#64748b',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3UsMF8QR5cZODFaQgNUWRASUSLtUX45Ppz19fG9YoN2kW40o9aX5K4aA1VCEFYNC87Wo0MIjlPtSYnm_caTz601ZlipL6pgdGpoWrpc-eLAYtWv7plBpsBhp4o8U9rznX6Cnw6NEdivq0xaI7n7zEyNvkE1ULSTieVVgoxVUx4mXUWuiwVyBMW0MryX2__685cOEYgMduAm2yHEqeLzlNzRzUtHz4tOaiavECo8'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/k3pM',
    description: 'Weighs only 12 grams, OSRAM P8 LED generating 300 lumens, auxiliary UV light for banknote verification, built-in rechargeable Li-ion battery.',
    rating: 4.8,
    reviewsCount: 84,
    upvotes: 49,
    upvotedBy: [],
    inStock: true,
    seller: 'Outdoor Gear Nepal'
  },
  {
    title: 'NexTool 16-in-1 Tactical Multi-Tool Pliers (Full Stainless Steel + Safety Lock)',
    category: 'Outdoor & EDC',
    price: 3890,
    originalPrice: 5200,
    badge: 'Best EDC Pick',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Stonewashed Steel',
        colorCode: '#475569',
        image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/u9kL',
    description: 'Heavy duty replaceable wire cutters, needle-nose pliers, wood saw, bottle opener, scissors, and compact travel pouch included.',
    rating: 4.9,
    reviewsCount: 130,
    upvotes: 62,
    upvotedBy: [],
    inStock: true,
    seller: 'Tactical Gear NP'
  },

  // 8. Automotive Tech
  {
    title: '70mai Dash Cam A500S Pro Plus+ (1944P Ultra HD, Built-in GPS & ADAS, Night Vision)',
    category: 'Automotive Tech',
    price: 12499,
    originalPrice: 16500,
    badge: 'New Drop 4K',
    promoCode: '70MAI500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD-TRNe39shErlCL9sa1FGvfekuimI9wLDU55hB3FGlaQy2WJkbzrx-W2sgGjcstKLsjDTNvJ33murMo_-4-uMCHwTCwIX3jMia5FMl0QwyupzKt7_n-pmrOd0gB-UNvow57IvNslvJIRWMChdno5et7ds3TpZVZohgxatDeeQIg-m_fwn-ghcowFVoIFz30LDCS5eIjVq7OutAxbZdDb04u22pSbqRHTrJRM3oWY',
    colorVariants: [
      {
        name: 'Obsidian Black',
        colorCode: '#09090b',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD-TRNe39shErlCL9sa1FGvfekuimI9wLDU55hB3FGlaQy2WJkbzrx-W2sgGjcstKLsjDTNvJ33murMo_-4-uMCHwTCwIX3jMia5FMl0QwyupzKt7_n-pmrOd0gB-UNvow57IvNslvJIRWMChdno5et7ds3TpZVZohgxatDeeQIg-m_fwn-ghcowFVoIFz30LDCS5eIjVq7OutAxbZdDb04u22pSbqRHTrJRM3oWY'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/x4nT',
    description: 'Sony IMX335 sensor with 2.7K resolution, built-in GPS tracking vehicle speed and coordinates, ADAS collision warning and 24H parking surveillance.',
    rating: 4.9,
    reviewsCount: 195,
    upvotes: 79,
    upvotedBy: [],
    inStock: true,
    seller: '70mai Official Nepal'
  },
  {
    title: 'Xiaomi Portable Electric Air Compressor 2 (Digital Tire Pressure Detection, 150 PSI)',
    category: 'Automotive Tech',
    price: 5299,
    originalPrice: 6999,
    badge: 'Essential Car Tool',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80',
    colorVariants: [
      {
        name: 'Matte Black',
        colorCode: '#18181b',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80'
      }
    ],
    affiliateUrl: 'https://s.daraz.com.np/s/p5jH',
    description: 'Inflates car tires from 0 to 35 PSI in minutes, preset pressure auto-shutoff, digital LED screen with high-brightness SOS flashlight.',
    rating: 4.8,
    reviewsCount: 280,
    upvotes: 91,
    upvotedBy: [],
    inStock: true,
    seller: 'Mi Authorized Store Nepal'
  }
];
