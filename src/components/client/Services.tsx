"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings2, 
  Zap, 
  CircleDot, 
  ThermometerSnowflake, 
  ChevronDown 
} from "lucide-react"; // Імпортуємо іконки

const listVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: { staggerChildren: 0.1, duration: 0.3 } 
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function Services() {
  const [activeTab, setActiveTab] = useState<number | null>(0);

  const autoServiceList = [
    {
      id: 0,
      category: "Ходова частина",
      icon: <Settings2 size={24} />,
      services: [
        { id: "susp-01", name: "Діагностика підвіски" },
        { id: "susp-02", name: "Заміна амортизаторів" },
        { id: "susp-03", name: "Заміна сайлентблоків" },
        { id: "susp-04", name: "Ремонт рульової рейки" },
      ],
    },
    {
      id: 1,
      category: "Двигун",
      icon: <Zap size={24} />,
      services: [
        { id: "eng-01", name: "Заміна комплекту ГРМ" },
        { id: "eng-02", name: "Заміна прокладки ГБЦ" },
        { id: "eng-03", name: "Регулювання зазорів клапанів" },
        { id: "eng-04", name: "Заміна мастила та фільтрів" },
      ],
    },
    {
      id: 2,
      category: "Гальмівна система",
      icon: <CircleDot size={24} />,
      services: [
        { id: "brake-01", name: "Заміна гальмівних колодок" },
        { id: "brake-02", name: "Проточка гальмівних дисків" },
        { id: "brake-03", name: "Обслуговування супортів" },
      ],
    },
    {
      id: 3,
      category: "Клімат та електрика",
      icon: <ThermometerSnowflake size={24} />,
      services: [
        { id: "elec-01", name: "Діагностика автоелектрики" },
        { id: "elec-02", name: "Заправка кондиціонера" },
        { id: "elec-04", name: "Ремонт стартера/генератора" },
      ],
    },
  ];

  return (
    <section id="services" className="w-full max-w-8xl mx-auto p-4 md:p-10 font-sans">
      <div className="flex flex-col md:flex-row w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-500">
        
        {/* ЛІВА ЧАСТИНА (Категорії) */}
        <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col border-r border-slate-500 bg-black bg-blend-color-burn">
          {autoServiceList.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="flex flex-col border-b border-slate-500 last:border-none">
                <div
                  className={`relative p-5 md:p-6 cursor-pointer flex items-center justify-between transition-all duration-300 ${
                    isActive ? "bg-white" : "hover:bg-slate-100/10"
                  }`}
                  onClick={() => setActiveTab(isActive ? null : item.id)}
                >
                  {/* Десктопний акцент */}
                  {isActive && (
                    <motion.div
                      layoutId="activeAccent"
                      className="hidden md:block absolute left-0 top-0 bottom-0 w-1.5 bg-red-700"
                    />
                  )}
                  
                  <div className="flex items-center gap-4">
                    <span className={`${isActive ? "text-red-700" : "text-slate-400"}`}>
                      {item.icon}
                    </span>
                    <p className={`text-lg md:text-xl font-medium transition-colors ${
                      isActive ? "text-slate-900" : "text-slate-600"
                    }`}>
                      {item.category}
                    </p>
                  </div>

                  <ChevronDown 
                    size={20} 
                    className={`md:hidden transition-transform duration-300 ${isActive ? "rotate-180 text-red-700" : "text-slate-400"}`} 
                  />
                </div>

                {/* МОБІЛЬНИЙ СПИСОК (Accordion) */}
                <div className="md:hidden">
                  <AnimatePresence>
                    {isActive && (
                      <motion.ul
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-white px-12 pb-4 overflow-hidden"
                      >
                        {item.services.map((s) => (
                          <motion.li key={s.id} variants={itemVariants} className="py-3 text-slate-600 border-b-2 border-slate-50 last:border-none text-base">
                            • {s.name}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* ПРАВА ЧАСТИНА (Десктопний контент) */}
        <div className="hidden md:block w-3/5 lg:w-2/3 p-12 bg-white relative min-h-125">
          <AnimatePresence mode="wait">
            {activeTab !== null ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <span className="text-red-700">{autoServiceList[activeTab].icon}</span>
                  {autoServiceList[activeTab].category}
                </h3>
                <motion.ul
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  {autoServiceList[activeTab].services.map((service) => (
                    <motion.li
                      key={service.id}
                      variants={itemVariants}
                      className="group flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-red-100 hover:bg-red-50/30 transition-all duration-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-700 mr-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-lg text-slate-700 group-hover:text-slate-900 font-medium">
                        {service.name}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                Оберіть категорію послуг
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
