import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import {
  Plus,
  Trash2,
  X,
  UploadCloud,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Ingredient, Step, Recipe } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function NewRecipe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [proTip, setProTip] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [calories, setCalories] = useState("");
  const [spiceLevel, setSpiceLevel] = useState<
    "Mild" | "Medium" | "Hot" | "Extra Hot"
  >("Mild");
  const [categories, setCategories] = useState<string[]>(["Heritage Recipe"]);
  const [cuisine, setCuisine] = useState("Global Heritage");
  const [customCategory, setCustomCategory] = useState("");

  const PRESET_CATEGORIES = [
    "Heritage Recipe",
    "Family Secret",
    "Essential",
    "Advanced Technique",
    "Quick Meal",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Vegan",
    "Gluten-Free",
  ];

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };
  const [customCuisine, setCustomCuisine] = useState("");
  const [previewStory, setPreviewStory] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: 1,
      qty: "250",
      unit: "Grams",
      category: "Main",
      name: "Organic Flour",
    },
  ]);

  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: "Preparation", description: "" },
  ]);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        qty: "",
        unit: "Grams",
        category: "Main",
        name: "",
      },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => String(ing.id) !== id));
  };

  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string,
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        String(ing.id) === id ? { ...ing, [field]: value } : ing,
      ),
    );
  };

  const addStep = () => {
    setSteps([
      ...steps,
      { id: Date.now() + Math.floor(Math.random() * 1000), title: "", description: "" },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => String(step.id) !== id));
  };

  const updateStep = (id: string, field: keyof Step, value: string) => {
    setSteps(
      steps.map((step) =>
        String(step.id) === id ? { ...step, [field]: value } : step,
      ),
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const publishRecipe = async () => {
    console.log("LOG: Starting publishRecipe process...");

    if (!title) {
      console.warn("LOG: Validation failed - Title is missing");
      setNotification({
        type: "error",
        message: "Please provide a recipe title.",
      });
      return;
    }

    setIsPublishing(true);
    try {
      const formData = new FormData();

      console.log("LOG: Mapping basic fields to snake_case...");
      formData.append("title", title);
      formData.append("story", story);
      formData.append("prep_time", prepTime);
      formData.append("calories", calories.toString());
      formData.append("spice_level", spiceLevel);
      formData.append("cuisine", cuisine === "Other" ? customCuisine : cuisine);
      formData.append("pro_tip", proTip);
      formData.append("youtube_link", youtubeLink);
      formData.append("is_published", "true");

      console.log("LOG: Stringifying nested arrays...", {
        categories,
        ingredients,
        steps,
      });
      formData.append("categories", JSON.stringify(categories));
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("steps", JSON.stringify(steps));

      if (heroImageFile) {
        console.log(
          "LOG: Appending Image File:",
          heroImageFile.name,
          `${heroImageFile.size} bytes`,
        );
        formData.append("hero_image", heroImageFile);
      } else if (heroImage) {
        console.log("LOG: Appending default/URL Image path:", heroImage);
        formData.append("hero_image", heroImage);
      }

      console.log("LOG: --- FINAL FORM DATA ENTRIES ---");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`LOG: ${key}: [File Object] ${value.name}`);
        } else {
          console.log(`LOG: ${key}: ${value}`);
        }
      }
      console.log("LOG: -------------------------------");

      console.log("LOG: Sending request to api.createRecipe...");
      const result = await api.createRecipe(formData);
      console.log("LOG: Server Response Success:", result);

      setNotification({
        type: "success",
        message: "Recipe published successfully!",
      });
      setTimeout(() => {
        navigate(`/recipes/${result.id}`);
      }, 1500);
    } catch (error: any) {
      console.group("LOG: PUBLISH REQUEST FAILED");
      console.error("LOG: Full Error Object:", error);

      if (error.response) {
        console.error("LOG: Status Code:", error.response.status);
        console.error("LOG: Server Error Data:", error.response.data);
        console.error("LOG: Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error(
          "LOG: No response received. Possible network/CORS error.",
        );
      } else {
        console.error("LOG: Error Message:", error.message);
      }
      console.groupEnd();

      const errorMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message || "Failed to publish recipe.";
      setNotification({ type: "error", message: errorMsg });
    } finally {
      setIsPublishing(false);
      console.log("LOG: publishRecipe process finished.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-w-0"
    >
      {/* Internal Sub-Header */}
      <div className="h-16 md:h-20 flex justify-between items-center px-4 md:px-12 border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 md:top-20 z-20">
        <div className="flex flex-col min-w-0 mr-4">
          <h2 className="font-serif text-lg md:text-xl font-medium text-primary opacity-90 truncate">
            New Kitchen Creation
          </h2>
        </div>

        <div className="flex items-center gap-2 md:gap-8 shrink-0">
          <button
            onClick={publishRecipe}
            disabled={isPublishing}
            className="rounded-xl bg-primary px-5 md:px-10 py-2.5 text-xs md:text-sm font-bold text-white transition-all hover:bg-emerald-900 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-primary text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {notification.message}
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-4xl py-10 md:py-16 px-6 md:px-12 space-y-12 md:space-y-20 mb-20 md:mb-0">
        {/* Memory & Taste Section */}
        <section className="space-y-8 md:space-y-10">
          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
              Recipe Title
            </label>
            <input
              type="text"
              placeholder="What are we cooking today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-[#b58e3e]/40 bg-transparent py-4 font-serif text-4xl md:text-6xl font-bold text-on-background placeholder:text-stone-100 focus:border-[#b58e3e] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
              YouTube Tutorial Link (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full border-b border-stone-100 bg-transparent py-4 font-sans text-lg text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors"
              />
              {youtubeLink &&
                !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(
                  youtubeLink,
                ) && (
                  <p className="absolute -bottom-6 left-0 text-[10px] text-red-500 font-bold uppercase tracking-wider">
                    Please enter a valid YouTube URL
                  </p>
                )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
                Prep Time
              </label>
              <input
                type="text"
                placeholder="e.g. 45 MINS"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full border-b border-stone-100 bg-transparent py-3 font-sans text-base text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
                Calories
              </label>
              <input
                type="text"
                placeholder="e.g. 450 kcal"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full border-b border-stone-100 bg-transparent py-3 font-sans text-base text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
                Spice Level
              </label>
              <div className="relative">
                <select
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(e.target.value as any)}
                  className="w-full appearance-none border-b border-stone-100 bg-transparent py-3 pr-8 font-sans text-base text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors cursor-pointer"
                >
                  <option>Mild</option>
                  <option>Medium</option>
                  <option>Hot</option>
                  <option>Extra Hot</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 bottom-4 text-stone-300 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
                Flavors from
              </label>
              <div className="relative">
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full appearance-none border-b border-stone-100 bg-transparent py-3 pr-8 font-sans text-base text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors cursor-pointer"
                >
                  <option>Swahili Coast</option>
                  <option>East African Cuisine</option>
                  <option>Global Heritage</option>
                  <option>Artisan Baking</option>
                  <option>Mediterranean</option>
                  <option>Asian Fusion</option>
                  <option>Other</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 bottom-4 text-stone-300 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
              Recipe Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    categories.includes(cat)
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-stone-50 text-stone-500 border-stone-100 hover:bg-stone-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Custom Tag..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customCategory) {
                      toggleCategory(customCategory);
                      setCustomCategory("");
                      e.preventDefault();
                    }
                  }}
                  className="border-b border-stone-100 bg-transparent py-2 px-2 text-xs text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors"
                />
                <button
                  onClick={() => {
                    if (customCategory) {
                      toggleCategory(customCategory);
                      setCustomCategory("");
                    }
                  }}
                  className="p-2 text-primary hover:bg-stone-50 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
                The Story Behind the Recipe
              </label>
              <button
                type="button"
                onClick={() => setPreviewStory(!previewStory)}
                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-[#b58e3e] transition-colors"
              >
                {previewStory ? "Edit Story" : "Preview Story"}
              </button>
            </div>

            {!previewStory ? (
              <textarea
                rows={6}
                placeholder="Tell the story behind this culinary masterpiece... Use # for headings and * for lists."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full resize-none border-b border-stone-100 bg-transparent py-4 font-sans text-lg leading-relaxed text-stone-600 placeholder:text-stone-300 focus:border-[#b58e3e] focus:outline-none transition-colors"
              />
            ) : (
              <div className="min-h-37.5 py-4 prose prose-stone max-w-none">
                <div className="font-sans text-stone-600 leading-relaxed text-lg italic whitespace-pre-line">
                  <ReactMarkdown>
                    {story || "Your story will appear here..."}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Media Section */}
        <section className="space-y-12">
          <div className="space-y-6">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
              Hero Imagery
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex min-h-70 md:h-96 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#b58e3e]/30 bg-stone-50/50 hover:bg-emerald-50 transition-colors p-8"
            >
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-stone-300 group-hover:text-[#b58e3e] group-hover:scale-110 transition-all shadow-sm mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-on-background text-center">
                    Click to upload your hero image
                  </h3>
                  <p className="mt-2 text-center text-xs md:text-sm text-stone-400 font-medium md:max-w-xs">
                    High-resolution photography recommended for an editorial
                    feel (JPEG, PNG up to 10MB)
                  </p>
                </>
              )}

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-primary/2 to-transparent pointer-events-none" />

              {heroImage && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-primary px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest">
                    Change Photo
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
              Ingredients
            </label>
            <button
              onClick={addIngredient}
              className="flex items-center gap-2 text-xs font-bold text-primary hover:text-[#b58e3e] transition-colors py-2"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {ingredients.map((ing) => (
                <motion.div
                  key={ing.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-6 items-end pb-6 sm:pb-0 border-b border-stone-50 sm:border-none"
                >
                  <div className="w-full sm:col-span-1 space-y-1">
                    <label className="sm:hidden text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                      Qty
                    </label>
                    <input
                      type="text"
                      placeholder="Qty"
                      value={ing.qty}
                      onChange={(e) =>
                        updateIngredient(String(ing.id), "qty", e.target.value)
                      }
                      className="w-full border-b border-stone-100 bg-transparent py-2 text-sm focus:border-[#b58e3e] focus:outline-none transition-colors sm:text-center"
                    />
                  </div>
                  <div className="w-full sm:col-span-2 space-y-1 relative">
                    <label className="sm:hidden text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                      Unit
                    </label>
                    <div className="relative">
                      <select
                        value={ing.unit}
                        onChange={(e) =>
                          updateIngredient(String(ing.id), "unit", e.target.value)
                        }
                        className="w-full appearance-none border-b border-stone-100 bg-transparent py-2 pr-8 text-sm focus:border-[#b58e3e] focus:outline-none transition-colors cursor-pointer"
                      >
                        <option>Grams</option>
                        <option>Tbsp</option>
                        <option>Tsp</option>
                        <option>Cups</option>
                        <option>Piece</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 bottom-3 text-stone-300 pointer-events-none"
                      />
                    </div>
                    {ing.unit === "Other" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <input
                          type="text"
                          placeholder="Unit (e.g. Pinch)"
                          value={ing.custom_unit || ""}
                          onChange={(e) =>
                            updateIngredient(
                              String(ing.id),
                              "custom_unit",
                              e.target.value,
                            )
                          }
                          className="w-full border-b border-stone-50 bg-transparent py-1 text-xs text-stone-500 focus:border-[#b58e3e] focus:outline-none transition-colors"
                        />
                      </motion.div>
                    )}
                  </div>
                  <div className="w-full sm:col-span-3 space-y-1 relative">
                    <label className="sm:hidden text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                      Category
                    </label>
                    <select
                      value={ing.category}
                      onChange={(e) =>
                        updateIngredient(String(ing.id), "category", e.target.value)
                      }
                      className="w-full appearance-none border-b border-stone-100 bg-transparent py-2 pr-8 text-sm font-bold text-[#b58e3e] focus:border-[#b58e3e] focus:outline-none transition-colors cursor-pointer uppercase tracking-widest"
                    >
                      <option value="Main">Main</option>
                      <option value="Masala">Masala</option>
                      <option value="Batter">Batter</option>
                      <option value="Glaze">Glaze</option>
                      <option value="Topping">Topping</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2 bottom-3 text-[#b58e3e] opacity-40 pointer-events-none"
                    />
                  </div>
                  <div className="w-full sm:col-span-5 space-y-1">
                    <label className="sm:hidden text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                      Ingredient Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ingredient name (e.g. Maldon Sea Salt)"
                      value={ing.name}
                      onChange={(e) =>
                        updateIngredient(String(ing.id), "name", e.target.value)
                      }
                      className="w-full border-b border-stone-100 bg-transparent py-2 text-sm focus:border-[#b58e3e] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end w-full sm:w-auto">
                    <button
                      onClick={() => removeIngredient(String(ing.id))}
                      className="text-stone-300 hover:text-red-500 transition-colors p-3 bg-stone-50 rounded-lg sm:bg-transparent sm:rounded-none"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <hr className="border-stone-100 opacity-50" />

        {/* Instructions Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">
              Instructions
            </label>
            <button
              onClick={addStep}
              className="flex items-center gap-2 text-xs font-bold text-primary hover:text-[#b58e3e] transition-colors py-2"
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          <div className="space-y-16">
            <AnimatePresence mode="popLayout">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group flex flex-col md:flex-row gap-6 md:gap-8 items-start relative"
                >
                  <span className="font-serif text-4xl md:text-5xl font-bold text-stone-100 shrink-0 select-none pt-2">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="flex-1 w-full space-y-6">
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Step Title (e.g. Master the Spice Bloom)"
                        value={step.title}
                        onChange={(e) =>
                          updateStep(String(step.id), "title", e.target.value)
                        }
                        className="w-full border-b border-stone-100 bg-transparent py-2 font-serif text-xl md:text-2xl font-semibold text-primary focus:border-[#b58e3e] focus:outline-none transition-colors"
                      />
                      <textarea
                        rows={3}
                        placeholder={
                          idx === 0
                            ? "Describe the first step of the process in detail..."
                            : "Describe the next step..."
                        }
                        value={step.description}
                        onChange={(e) =>
                          updateStep(String(step.id), "description", e.target.value)
                        }
                        className="w-full resize-none border-b border-stone-50 bg-transparent py-2 font-sans text-base md:text-lg text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors leading-relaxed"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-primary py-2">
                        <ImageIcon size={12} /> Add Detail Photo
                      </button>
                      <button
                        onClick={() => removeStep(String(step.id))}
                        className="md:hidden text-red-300 px-4 py-2 text-xs font-bold uppercase tracking-widest"
                      >
                        Delete Step
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeStep(String(step.id))}
                    className="hidden md:block text-stone-100 hover:text-red-500 transition-colors p-px mt-4"
                  >
                    <X size={24} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Chef's Secret Section */}
        <section className="rounded-[2.5rem] bg-emerald-50/40 p-8 md:p-12 border-l-4 border-[#b58e3e]/40 italic shadow-sm">
          <label className="not-italic block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e] mb-6">
            Chef's Secret / Pro Tip
          </label>
          <textarea
            rows={3}
            placeholder="Add a catchy secret or a serving suggestion... (e.g. Enjoy!)"
            value={proTip}
            onChange={(e) => setProTip(e.target.value)}
            className="w-full resize-none bg-transparent font-serif text-xl md:text-2xl font-semibold text-primary/70 placeholder:text-stone-300 focus:outline-none leading-normal"
          />
        </section>
      </div>

      <footer className="mt-20 py-16 border-t border-stone-100 text-center bg-stone-50/30">
        <p className="font-serif italic text-stone-300 text-2xl">
          Nourish Kitchen
        </p>
        <p className="font-sans text-[10px] text-stone-200 mt-2 uppercase tracking-[0.3em]">
          Home Cooking for the Soul
        </p>
      </footer>
    </motion.div>
  );
}
