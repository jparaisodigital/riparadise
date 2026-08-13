const CONFIG = {
    brand: {
        name: "R.I.PARADISE",
        shortName: "",
        tagline: "Rest in Paradise",
        logo: "assets/rip.jpg",
        year: 2026
    },
    
    logo: "assets/rip1.png",
    
    colors: {
        bg: "#ffffff",        
        text: "#111111",
        muted: "#555555",
        accent: "#111111",
        border: "#e5e4e0"
    },
    
    
    fonts: {
        display: "'Arial Black', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    },
    
    nav: [
        { label: "HOME", href: "index.html" },
        { label: "CHAPTERS", href: "chapters.html" },
        { label: "SHOP", href: "store.html" },
        { label: "HELP", href: "help.html" }
    ],
    
    // Mobile hamburger dropdown background
    navMobile: {
        image: "assets/ham.png",
        overlay: 0.45,       
        imageOpacity: 0.85  
    },
    
    // Landing page slideshow (4 images)
    slides: [
        "assets/slide (1).png",
        "assets/slide (2).png",
        "assets/slide (3).png",
        "assets/slide (4).png"
    ],
    
    // Shop Now button under the slides
    cta: {
        text: "SHOP NOW",
        href: "store.html"
    },
    
    // sa config.js
    chaptersMedia: {
        instagramEmbed: "https://www.instagram.com/reel/DC89_V_TNmc/", 
        image: "assets/igpic.png",
        imageAlt: "R.I.PARADISE"
    },
    
    chaptersManifesto: {
        enabled: true,
        title: "",
        text: "See you in paradise"
    },
    
    chaptersTimeline: {
        enabled: false,
        items: [
            { year: "2019", text: "Brand founded" },
            { year: "2021", text: "First drop" },
            { year: "2023", text: "First pop-up" },
            { year: "2025", text: "Expanded collection" },
            { year: "2026", text: "Current chapter" }
        ]
    },

    
    
    // Footer socials
    socials: [
        { 
            label: "Instagram", 
            href: "https://instagram.com/ri.paradise",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>`
        },
        { 
            label: "Facebook", 
            href: "https://www.facebook.com/p/RiParadise-100063752149428/", 
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
        },
        { 
            label: "YouTube", 
            href: "https://www.youtube.com/channel/UCZoTMDETUDjDSNIpZeRdv_A",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z"/></svg>`
        }
    ],
    
    // Currency
    currency: {
        symbol: "₱",
        code: "PHP"
    },
    
    // 4 Products only
    products: [
        
        {
            id: "p1",
            name: "Fitsmits Tee",
            price: 1000,
            image: "assets/2222.png",        
            imageHover: "assets/slide (1).png",  
            description: "Heavy Cotton. Oversized Fitting. In collaboration w/ 1210",
            sizes: ["S", "M", "L", "XL"]
        },
        
        {
            id: "p2",
            name: "Fitsmits Tee",
            price: 1000,
            image: "assets/3.png",       
            imageHover: "assets/slide (2).png",  
            description: "Heavy Cotton. Oversized Fitting. In collaboration w/ 1210",
            sizes: ["S", "M", "L", "XL"]
        },
        
        {
            id: "p3",
            name: "Riparadise x 1210 Logo Tee",
            price: 1000,
            image: "assets/222.png",        
            imageHover: "assets/slide (3).png",  
            description: "Heavy Cotton. Oversized Fitting. Reflective.",
            sizes: ["S", "M", "L", "XL"]
        },
        
        {
            id: "p4",
            name: "Fitsmits Hoodie",
            price: 2200,
            image: "assets/2.png",       
            imageHover: "assets/slide (6).png", 
            description: "Heavy Cotton. 300GSM. Backprint. In collaboration w/ 1210",
            sizes: ["L", "XL", "2XL"]
        },
    ],
    
    
    // Size chart data (for modal)
    sizeChart: {
        title: "SIZE CHART (Inches)",
        headers: ["SIZE", "CHEST WIDTH", "SHIRT LENGTH", "SLEEVE LENGTH"],
        rows: [
            ["SMALL", "23", "28", "10"],
            ["MEDIUM", "24", "29", "10.5"],
            ["LARGE", "25", "30", "11"],
            ["XL", "26", "31", "11.5"]
        ],
        image: "assets/ripchart.jpg"
    },
    
    
    // Simple terms (for later)
    terms: {
        shipping: "Worldwide shipping available. Processing 5-12 business days.",
        returns: "All sales final. No refunds or exchanges unless defective."
    },
    // Payment methods (checkout) — GCASH / COD
    payments: [
        { id: "gcash", label: "GCASH", iconImage: "assets/payment/gcash.png", qr: "assets/payment/QR.JPG" },
        { id: "cod", label: "CASH ON DELIVERY", iconImage: null, qr: null }
    ],
    
    deliveryInfo: {
        enabled: true,
        couriers: [
            { name: "J&T Express", iconImage: "assets/payment/j&t.png" }
        ],
        note: "Shipping fee is calculated automatically based on your region."
    },
    
    // Shipping fees per region
    shipping: {
        luzon: 100,
        visayasMindanao: 150
    },
    
    // Messenger for payment
    messenger: {
        url: "https://m.me/100063752149428"
    },
    
    // Cash on delivery / same-day delivery info
    codDelivery: {
        note: "Same-day delivery via Lalamove or Grab Express. Your order details will be copied and Messenger will open — just paste and send."
    },
    
    // Swap paths anytime; code auto-adjusts layout from size
    // Chapters gallery — mosaic grid (size: "large" | "medium" | "small")
    gallery: [
        { image: "assets/chapter (1).png",  size: "large" },
        { image: "assets/chapter (2).png",  size: "medium" },
        { image: "assets/chapter (3).png",  size: "small" },
        { image: "assets/chapter (4).png",  size: "medium" },
        { image: "assets/chapter (5).png",  size: "small" },
        { image: "assets/chapter (6).png",  size: "small" },
        { image: "assets/chapter (7).png",  size: "medium" },
        { image: "assets/chapter (8).png",  size: "small" },
        { image: "assets/chapter (9).png",  size: "medium" },
        { image: "assets/chapter (10).png", size: "small" },
        { image: "assets/chapter (11).png", size: "large" },
        { image: "assets/chapter (12).png", size: "small" },
        { image: "assets/chapter (13).png", size: "small" },
        { image: "assets/chapter (14).png", size: "medium" },
        { image: "assets/chapter (15).png", size: "small" },
        { image: "assets/chapter (16).png", size: "small" },
        { image: "assets/chapter (17).png", size: "medium" },
        { image: "assets/chapter (18).png", size: "small" },
        { image: "assets/chapter (19).png", size: "small" },
        { image: "assets/chapter (20).png", size: "small" }
    ],
    
    // Footer — tombstone rubbing
    footerThanks: {
        enabled: true,  
        backgroundImage: "assets/2 (15).png",
        coverImage: "assets/2 (15).png", 
        title: "RIP",
        message: "• THOSE WHO OWN PARADISE WILL LIVE IN PARADISE\n• IF YOU BELIEVE IN PARADISE YOU WILL EXPERIENCE PARADISE\n• YOU’RE NOT LIVING UNTIL YOU’RE LIVING FOR PARADISE\n• PARADISE IS INEVITABLE",
        signature: ""
    }
};
