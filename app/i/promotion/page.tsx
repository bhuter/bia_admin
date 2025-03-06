"use client";
import { useState } from "react";
import Header, { PromotionList } from "@/app/comps/promotion/indexPage";
import SetupPromotion from "@/app/comps/toggles/Toggles";
import AddPromotion from "@/app/comps/toggles/addPromotion";

const Promotion = () => {
  const [showAddPromotion, setShowAddPromotion] = useState(false);
  const [setupPromotionId, setSetupPromotionId] = useState<number | null>(null);

  const toggleAddPromotion = () => {
    setShowAddPromotion(true);
  };

  const closeAddPromotion = () => {
    setShowAddPromotion(false);
  };

  const handleSetupPromotionClick = (promotionId: number) => {
    setSetupPromotionId(promotionId); // Set the ID for the setup form
  };

  const closeSetupPromotion = () => {
    setSetupPromotionId(null); // Close the setup promotion form
  };

  return (
    <>
      <header>
        <title>Promotions</title>
      </header>
      <div>
        <Header onAddPromotionClick={toggleAddPromotion}/>
      </div>
      {showAddPromotion && (
        <div className="block">
          <AddPromotion onClose={closeAddPromotion} />
        </div>
      )}
      
      <div className="bg-white h-[73vh] w-full rounded-lg border">
        <PromotionList />
      </div>
    </>
  );
};

export default Promotion;
