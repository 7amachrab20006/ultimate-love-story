import { Milestone, GalleryItem, MapPin, MemoryRule, QuizQuestion, WheelReward, SecretNote } from '../types';
import asmaMohamedPhoto from '../assets/images/asma_mohamed_gallery_1785422082529.jpg';
import asmaMohamedHat from '../assets/images/asma_mohamed_hat_1785422304480.jpg';
import asmaMohamedCall from '../assets/images/asma_mohamed_call_1785422317714.jpg';
import asmaMohamedTiles from '../assets/images/asma_mohamed_tiles_1785422331030.jpg';
import asmaMohamedHug from '../assets/images/asma_mohamed_hug_1785422349541.jpg';
import asmaMohamedSunset from '../assets/images/asma_mohamed_sunset_1785423993100.jpg';
import asmaMohamedCafe from '../assets/images/asma_mohamed_cafe_1785424009457.jpg';
import asmaMohamedPicnic from '../assets/images/asma_mohamed_picnic_1785424025714.jpg';
import asmaMohamedVideo from '../assets/images/regenerated_image_1785424419349.mp4';

export const DEFAULT_COUPLE = {
  partner1: "ASMA",
  partner2: "MOHAMED",
  anniversaryDate: "2022-06-18T18:30:00", // Default anniversary
  tagline: "Together is our favorite place to be."
};

export const MILESTONES: Milestone[] = [
  {
    id: "m1",
    date: "June 18, 2022",
    title: "The First Spark",
    category: "first",
    location: "Sunset Beach Cafe, California",
    shortDescription: "Our eyes met over iced lattes and an endless talk about old books and favorite songs.",
    fullStory: "It started as a simple coffee meetup that unexpectedly stretched into a 5-hour walk along the shoreline. We laughed until our stomachs hurt and realized right then that something truly magical was beginning.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    iconName: "Heart"
  },
  {
    id: "m2",
    date: "August 14, 2022",
    title: "Stargazing at Pine Ridge",
    category: "first",
    location: "Pine Ridge Lookout",
    shortDescription: "Wrapped in a wool blanket, watching shooting stars and sharing our deepest dreams.",
    fullStory: "We packed hot cocoa in a thermos and drove up the mountain. Under a canopy of ten thousand twinkling stars, we officially decided to be together forever.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    iconName: "Sparkles"
  },
  {
    id: "m3",
    date: "December 24, 2022",
    title: "First Christmas & 'I Love You'",
    category: "anniversary",
    location: "Cozy Fireside Living Room",
    shortDescription: "Under the warm glow of fairy lights, the three magical words were spoken aloud for the first time.",
    fullStory: "Snow was gently drifting outside the window while a vinyl jazz record played softly. Handing over a handwritten letter, the words whispered themselves naturally: 'I love you so much.'",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    iconName: "Flame"
  },
  {
    id: "m4",
    date: "Summer 2024",
    title: "Wandering the Medina",
    category: "travel",
    location: "Historic Medina Old Town",
    shortDescription: "Exploring historic alleyways, white stucco walls, and wooden doors hand in hand.",
    fullStory: "Strolling through the ancient Medina with traditional wooden doors and golden sunshine, making beautiful memories as Asma and Mohamed walked side by side.",
    image: asmaMohamedPhoto,
    iconName: "Plane"
  },
  {
    id: "m5",
    date: "October 05, 2023",
    title: "Moving In Together",
    category: "anniversary",
    location: "Our Dream Apartment",
    shortDescription: "Cardboard boxes, custom furniture building, and creating our cozy sanctuary.",
    fullStory: "Getting the keys to our very own place! We spent the first night eating takeout pizza on the living room floor surrounded by bubble wrap, so excited for everyday life together.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    iconName: "Home"
  },
  {
    id: "m6",
    date: "Spring 2026 & Beyond",
    title: "Our Next Chapter",
    category: "future",
    location: "Everywhere We Go",
    shortDescription: "More adventures, endless laughter, warm morning coffees, and a lifetime of shared dreams.",
    fullStory: "Every single day with you is a blessing. As we look towards the horizon, we know the best stories are the ones we haven't written yet.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    iconName: "Compass"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    type: "photo",
    title: "Wandering Medina Streets",
    date: "Summer 2024",
    location: "Historic Old Town",
    caption: "Asma & Mohamed exploring historic alleyways together.",
    url: asmaMohamedPhoto
  },
  {
    id: "g2",
    type: "photo",
    title: "Playful Moments & Smiles",
    date: "Autumn 2024",
    location: "Our Favorite Spot",
    caption: "Asma in her favorite cap posing with Mohamed.",
    url: asmaMohamedHat
  },
  {
    id: "g3",
    type: "photo",
    title: "Mosaic & Sunshine",
    date: "Spring 2024",
    location: "Heritage Courtyard",
    caption: "Asma's glowing smile framed by beautiful mosaic tiles.",
    url: asmaMohamedTiles
  },
  {
    id: "g4",
    type: "photo",
    title: "Late Night Video Calls",
    date: "Every Evening",
    location: "Distance Doesn't Matter",
    caption: "Counting down hours until we see each other again.",
    url: asmaMohamedCall
  },
  {
    id: "g5",
    type: "photo",
    title: "Snuggled Up Close",
    date: "Recent Memories",
    location: "Together Forever",
    caption: "The safest place in the world is right here in your arms.",
    url: asmaMohamedHug
  },
  {
    id: "g6",
    type: "photo",
    title: "Sunset By The Sea",
    date: "Golden Hour",
    location: "Ocean Horizon",
    caption: "Watching the sun dip below the horizon while holding you close.",
    url: asmaMohamedSunset
  },
  {
    id: "g7",
    type: "photo",
    title: "Cozy Bistro Coffee Date",
    date: "Rainy Afternoon",
    location: "Our Favorite Cafe",
    caption: "Warm lattes, soft music, and endless conversation.",
    url: asmaMohamedCafe
  },
  {
    id: "g8",
    type: "photo",
    title: "Sunny Afternoon Picnic",
    date: "Spring Afternoon",
    location: "Shaded Park Haven",
    caption: "Laughter under the tree canopy with fresh strawberries and sweet sunshine.",
    url: asmaMohamedPicnic
  },
  {
    id: "g9",
    type: "video",
    title: "Special Video Memory",
    date: "Shared Moment",
    location: "Together",
    caption: "A precious video recording of our favorite memory together.",
    url: asmaMohamedVideo,
    thumbnail: asmaMohamedTiles
  }
];

export const MAP_PINS: MapPin[] = [
  {
    id: "p1",
    locationName: "Sunset Beach Cafe",
    country: "California, USA",
    type: "met",
    coordinates: { x: 18, y: 38 },
    dateOrYear: "June 2022",
    note: "Where our love story officially began over iced coffees!",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    locationName: "Positano & Amalfi",
    country: "Italy",
    type: "visited",
    coordinates: { x: 52, y: 36 },
    dateOrYear: "May 2023",
    note: "Cliffside gelato, coastal boat rides, and Italian sunshine.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    locationName: "Kyoto & Cherry Blossoms",
    country: "Japan",
    type: "dream",
    coordinates: { x: 84, y: 40 },
    dateOrYear: "Bucket List #1",
    note: "Walking hand-in-hand under falling sakura petals in Arashiyama.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p4",
    locationName: "Santorini Sunset",
    country: "Greece",
    type: "dream",
    coordinates: { x: 56, y: 40 },
    dateOrYear: "Bucket List #2",
    note: "Watching the famous Oia sunset from a whitewashed terrace.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p5",
    locationName: "Northern Lights in Tromsø",
    country: "Norway",
    type: "dream",
    coordinates: { x: 53, y: 18 },
    dateOrYear: "Bucket List #3",
    note: "Cuddling in a glass igloo while the aurora borealis dances above.",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Where did we have our very first date?",
    options: ["Sunset Beach Cafe", "Downtown Italian Restaurant", "Botanical Gardens Park", "Concert in the Park"],
    correctAnswer: 0,
    explanation: "Sunset Beach Cafe! What was supposed to be a quick coffee turned into a 5-hour seaside stroll."
  },
  {
    id: 2,
    question: "What was the first dish we cooked together that turned into a hilarious disaster?",
    options: ["Homemade Pasta", "Chocolate Soufflé", "Sushi Rolls", "French Crepes"],
    correctAnswer: 1,
    explanation: "The famous Chocolate Soufflé! It collapsed into a chocolate volcano, but tasted divine anyway."
  },
  {
    id: 3,
    question: "Which magical place was our first international vacation together?",
    options: ["Paris, France", "Amalfi Coast, Italy", "Tokyo, Japan", "Bali, Indonesia"],
    correctAnswer: 1,
    explanation: "Amalfi Coast, Italy in May 2023! Positano cliffside walks and Capri boat tours."
  },
  {
    id: 4,
    question: "What is our official go-to Friday night routine?",
    options: ["Movie marathon & Popcorn", "Truffle Pizza & Gelato", "Board Games & Wine", "Late night drive"],
    correctAnswer: 1,
    explanation: "Wood-fired Truffle Pizza & Pistachio Gelato! Unbeatable combo."
  },
  {
    id: 5,
    question: "What is the passcode to unlock our Secret Romantic Vault?",
    options: ["143", "777", "2022", "LOVE"],
    correctAnswer: 0,
    explanation: "'143' stands for 'I Love You'! (Or typing L-O-V-E on your keyboard)."
  }
];

export const WHEEL_REWARDS: WheelReward[] = [
  {
    id: "r1",
    title: "Romantic Dinner",
    color: "#f43f5e",
    icon: "UtensilsCrossed",
    description: "Cooked to perfection with candlelight & favorite playlist.",
    couponCode: "LOVE-DINNER-2026"
  },
  {
    id: "r2",
    title: "15-Min Massage",
    color: "#eab308",
    icon: "Sparkles",
    description: "Relaxing shoulder and foot rub after a long day.",
    couponCode: "RELAX-MASSAGE-99"
  },
  {
    id: "r3",
    title: "Breakfast in Bed",
    color: "#ec4899",
    icon: "Coffee",
    description: "Fresh pancakes, berries, and hot coffee delivered right to bed.",
    couponCode: "PANCAKE-MORNING"
  },
  {
    id: "r4",
    title: "No Chores for 1 Day",
    color: "#8b5cf6",
    icon: "Smile",
    description: "Pass all household duties off for an entire 24 hours!",
    couponCode: "FREE-DAY-PASS"
  },
  {
    id: "r5",
    title: "Movie Night Choice",
    color: "#06b6d4",
    icon: "Film",
    description: "You choose the movie, snacks, and screen position with no objections!",
    couponCode: "CINEMA-MASTER"
  },
  {
    id: "r6",
    title: "Unlimited Hugs & Kisses",
    color: "#10b981",
    icon: "Heart",
    description: "Redeemable anytime, anywhere, with zero limit!",
    couponCode: "FOREVER-HUGS"
  }
];

export const SECRET_NOTES: SecretNote[] = [
  {
    id: "sn1",
    title: "To My Eternal Soulmate, Asma",
    content: "If I had a flower for every time I thought of you, I could walk in my garden forever. You are my home, my wildest desire, and my greatest adventure.",
    author: "Mohamed",
    date: "Forever & Always"
  },
  {
    id: "sn2",
    title: "My Passion & My Vow",
    content: "You set my soul on fire and make my heart race with just a single glance. I promise to choose you every single morning, to hold you close through life's storms, and to cherish you endlessly.",
    author: "Yours Eternally",
    date: "Always"
  },
  {
    id: "sn3",
    title: "Why You Are My Entire Universe",
    content: "Because you turn ordinary moments into pure magic, because your smile lights up my world, and because loving you is the deepest and most natural thing I have ever known.",
    author: "Your Forever Lover",
    date: "Today & Tomorrow"
  },
  {
    id: "sn4",
    title: "The Heart of My Soul (9albi)",
    content: "nhebek barcha ya rouhii nhebbbkkk akther meli tetsawer nhebekk tkoun marty nhar kherr and i wont give up on you ya 9albi khater enty li radit 7yetyyy feha ma3na",
    author: "Mohamed",
    date: "Eternity"
  }
];
