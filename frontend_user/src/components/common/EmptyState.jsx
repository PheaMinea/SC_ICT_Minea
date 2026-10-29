import React from "react";
import { FiInbox, FiRefreshCw } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

const EmptyState = ({
  icon: Icon = FiInbox,
  title_km = "មិនទាន់មានទិន្នន័យនៅឡើយទេ",
  title_en = "No Data Available Yet",
  description_km = "សូមអធ្យាស្រ័យ ព័ត៌មាននៅក្នុងផ្នែកនេះកំពុងត្រូវបានរៀបចំ ឬមិនទាន់មានការបញ្ចូលនៅឡើយ។",
  description_en = "Sorry, information in this section is currently being prepared or has not been added yet.",
  onReset = null,
  resetLabel_km = "សម្អាតការស្វែងរក",
  resetLabel_en = "Clear Search",
}) => {
  const { language } = useLanguage();
  const isKhmer = language === "km";

  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-6 text-center bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm my-6 transition-all duration-300">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shadow-inner">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" />
      </div>

      <h3 className={`text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 ${isKhmer ? "font-khmer" : ""}`}>
        {isKhmer ? title_km : title_en}
      </h3>

      <p className={`text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-6 ${isKhmer ? "font-khmer" : ""}`}>
        {isKhmer ? description_km : description_en}
      </p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <FiRefreshCw className="w-3.5 h-3.5" />
          <span>{isKhmer ? resetLabel_km : resetLabel_en}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
