"use client";
import Header, { AgentsList } from "@/app/comps/agents/indexPage";
import AddAgent from "@/app/comps/toggles/add";
import { useState } from "react";

const Agents = () => {
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [setupAgentId, setSetupAgentId] = useState<number | null>(null);

  const toggleAddAgent = () => {
    setShowAddAgent(true);
  };

  const closeAddAgent = () => {
    setShowAddAgent(false);
  };

  const handleSetupAgentClick = (AgentId: number) => {
    setSetupAgentId(AgentId); // Set the ID for the setup form
  };

  const closeSetupAgent = () => {
    setSetupAgentId(null); // Close the setup Agent form
  };

  return (
    <>
      <header>
        <title>Agents</title>
      </header>
      <div>
        <Header onAddAgentClick={toggleAddAgent} onSetupAgentClick={handleSetupAgentClick} />
      </div>
      {showAddAgent && (
        <div className="block">
          <AddAgent onClose={closeAddAgent} />
        </div>
      )}
      <div className="bg-white h-[73vh] w-full rounded-lg bAgent">
        <AgentsList />
      </div>
    </>
  );
}
export default Agents;