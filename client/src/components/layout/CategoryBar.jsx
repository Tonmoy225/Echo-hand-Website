import { useUIStore } from "../../store/uiStore";

const CATEGORIES = [
  "All",
  "Mobile Phones",
  "Laptops",
  "Cameras",
  "Audio",
  "Gaming",
  "TV & Monitors",
  "Accessories",
  "Wearables",
  "Home Appliances",
  "Other",
];

export default function CategoryBar() {
  const { activeCategory, setActiveCategory } = useUIStore();

  return (
    <div id="cat-bar">
      {CATEGORIES.map((cat) => (
        <div
          key={cat}
          className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
          onClick={() => setActiveCategory(cat)}
        >
          {cat}
        </div>
      ))}
    </div>
  );
}
