"use client";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Services() {
  type Service = {
    id: string;
    name: string;
  };

  type ServiceCategory = {
    id: number;
    category: string;
    services: Service[];
  };

  const autoServiceList: ServiceCategory[] = [
    {
      id: 0,
      category: "Ходова частина",
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
      services: [
        { id: "eng-01", name: "Заміна комплекту ГРМ" },
        { id: "eng-02", name: "Заміна прокладки ГБЦ" },
        { id: "eng-03", name: "Регулювання теплових зазорів клапанів" },
        { id: "eng-04", name: "Заміна мастила та фільтрів" },
      ],
    },
    {
      id: 2,
      category: "Гальмівна система",
      services: [
        { id: "brake-01", name: "Заміна гальмівних колодок" },
        { id: "brake-02", name: "Проточка гальмівних дисків" },
        { id: "brake-03", name: "Обслуговування супортів" },
        { id: "brake-04", name: "Заміна гальмівної рідини" },
      ],
    },
    {
      id: 3,
      category: "Клімат та електрика",
      services: [
        { id: "elec-01", name: "Діагностика автоелектрики" },
        { id: "elec-02", name: "Заправка кондиціонера" },
        { id: "elec-03", name: "Чистка випарника (озонування)" },
        { id: "elec-04", name: "Ремонт стартера/генератора" },
      ],
    },
  ];

  const [isVisible, setVisibility] = useState(0);

  return (
    <Fragment>
      <section id="services" className="flex w-full">
        <div className="w-1/3 p-10">
          {autoServiceList.map((item, index) => (
            <p
              className={`text-2xl cursor-pointer ${isVisible === item.id ? "text-red-800 hover:text-red-500" : "text-cyan-500 hover:text-cyan-300"} ${isVisible === item.id ? "font-bold" : ""} ${isVisible === item.id ? "font-bold" : ""}`}
              key={index}
              onClick={() => setVisibility(item.id)}
            >
              {item.category}
            </p>
          ))}
        </div>
        <div className="w-2/3 relative p-10">
          <AnimatePresence mode="wait">
            <motion.ul
              key={isVisible} 
              initial={{ opacity: 0, x: 20 }}    
              animate={{ opacity: 1, x: 0 }}     
              exit={{ opacity: 0, x: -20 }}      
              transition={{ duration: 0.3 }}     
              className="list-none"
            >
              {autoServiceList[isVisible].services.map((servicesItem) => (
                <li className="text-xl py-1" key={servicesItem.id}>
                  {servicesItem.name}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </section>
    </Fragment>
  );
}
